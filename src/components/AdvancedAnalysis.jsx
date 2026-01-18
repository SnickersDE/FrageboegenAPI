"use client"
import { useMemo, useState } from "react"
import { pearson, spearman, partial, mean, median, stdDev } from "@/lib/statistics"
import { Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function AdvancedAnalysis({ data, onClose }) {
  // 1. Prepare Data Vectors
  const vectors = useMemo(() => {
    const validData = data.filter(d => 
      d.index !== null && 
      d.coding.subjective > 0 && 
      d.coding.financialSecurity > 0 &&
      d.coding.chances > 0 &&
      d.coding.genderCode !== null
    )

    return {
      index: validData.map(d => d.index),
      subjective: validData.map(d => d.coding.subjective),
      financial: validData.map(d => d.coding.financialSecurity),
      chances: validData.map(d => d.coding.chances),
      gender: validData.map(d => d.coding.genderCode), // 0=Male, 1=Female
      age: validData.map(d => d.coding.age),
      income: validData.map(d => d.coding.income),
      count: validData.length
    }
  }, [data])

  // Calculate descriptive statistics by Gender and T-Tests
  const genderAnalysis = useMemo(() => {
    const validWithGender = data.filter(d => 
      d.index !== null && 
      d.coding.subjective > 0 &&
      d.coding.genderCode !== null
    )

    const males = validWithGender.filter(d => d.coding.genderCode === 0)
    const females = validWithGender.filter(d => d.coding.genderCode === 1)

    // Vectors for T-Test
    const mObj = males.map(d => d.index)
    const fObj = females.map(d => d.index)
    const mSubj = males.map(d => d.coding.subjective)
    const fSubj = females.map(d => d.coding.subjective)

    // Stats
    const stats = {
      males: {
        count: males.length,
        obj: {
          mean: mean(mObj),
          median: median(mObj),
          stdDev: stdDev(mObj)
        },
        subj: {
          mean: mean(mSubj),
          median: median(mSubj),
          stdDev: stdDev(mSubj)
        }
      },
      females: {
        count: females.length,
        obj: {
          mean: mean(fObj),
          median: median(fObj),
          stdDev: stdDev(fObj)
        },
        subj: {
          mean: mean(fSubj),
          median: median(fSubj),
          stdDev: stdDev(fSubj)
        }
      }
    }

    // T-Tests
    const tTests = {
      objective: tTest(mObj, fObj),
      subjective: tTest(mSubj, fSubj)
    }

    return { stats, tTests }
  }, [data])

  // Calculate descriptive statistics for indices
  const stats = useMemo(() => {
    if (vectors.count === 0) return null
    return {
      objective: {
        mean: mean(vectors.index),
        median: median(vectors.index),
        stdDev: stdDev(vectors.index)
      },
      subjective: {
        mean: mean(vectors.subjective),
        median: median(vectors.subjective),
        stdDev: stdDev(vectors.subjective)
      }
    }
  }, [vectors])

  if (vectors.count < 3) {
    return <div className="panel">Nicht genügend Daten für erweiterte Analyse (n={vectors.count}). Benötigt mindestens 3 vollständige Datensätze. <button onClick={onClose} className="btn">Zurück</button></div>
  }

  // 2. Bivariate Correlations
  const bivariate = [
    { 
      pair: "Schichtindex ↔ Subj. Schicht", 
      val: pearson(vectors.index, vectors.subjective),
      type: "Pearson (metrisch ↔ ordinal/metrisch)",
      desc: "Zusammenhang zwischen objektivem Index und Selbstwahrnehmung"
    },
    { 
      pair: "Schichtindex ↔ Fin. Sicherheit", 
      val: spearman(vectors.index, vectors.financial),
      type: "Spearman (metrisch ↔ ordinal)",
      desc: "Zusammenhang zwischen Index und gefühlter Sicherheit"
    },
    { 
      pair: "Schichtindex ↔ Aufstiegschancen", 
      val: spearman(vectors.index, vectors.chances),
      type: "Spearman (metrisch ↔ ordinal)",
      desc: "Zusammenhang zwischen Index und Zukunftsaussicht"
    },
    { 
      pair: "Geschlecht ↔ Schichtindex", 
      val: pearson(vectors.gender, vectors.index), // Point-Biserial matches Pearson for 0/1
      type: "Punkt-Biserial (dichotom ↔ metrisch)",
      desc: "Zusammenhang zwischen Geschlecht (0=M, 1=W) und Index"
    }
  ]

  // 3. Partial Correlations
  const partials = [
    {
      pair: "Schichtindex ↔ Geschlecht (Kontrolle: Alter)",
      val: partial(vectors.index, vectors.gender, vectors.age),
      desc: "Bereinigter Zusammenhang, Alterseffekte herausgerechnet"
    },
    {
      pair: "Subj. Schicht ↔ Geschlecht (Kontrolle: Einkommen)",
      val: partial(vectors.subjective, vectors.gender, vectors.income),
      desc: "Bereinigter Zusammenhang, Einkommenseffekte herausgerechnet"
    }
  ]

  // 4. Canonical / Cross-Set Correlations (Simplified)
  // Set 1: Demographics (Gender, Age)
  // Set 2: Socioeconomic (Index, Subjective, Financial, Chances)
  const set1 = [
    { key: "gender", label: "Geschlecht" },
    { key: "age", label: "Alter" }
  ]
  const set2 = [
    { key: "index", label: "Schichtindex" },
    { key: "subjective", label: "Subj. Schicht" },
    { key: "financial", label: "Fin. Sicherheit" },
    { key: "chances", label: "Aufstiegschancen" }
  ]

  const crossCorrelations = []
  set1.forEach(v1 => {
    set2.forEach(v2 => {
      crossCorrelations.push({
        pair: `${v1.label} ↔ ${v2.label}`,
        val: pearson(vectors[v1.key], vectors[v2.key]),
        group: v1.label
      })
    })
  })

  // Helper for Interpretation
  const interpret = (r) => {
    const abs = Math.abs(r)
    const dir = r > 0 ? "positiver" : "negativer"
    let strength = "kein"
    if (abs > 0.1) strength = "schwacher"
    if (abs > 0.3) strength = "mittlerer"
    if (abs > 0.5) strength = "starker"
    if (abs > 0.8) strength = "sehr starker"
    return `r = ${r.toFixed(2)} zeigt einen ${strength} ${dir} linearen Zusammenhang.`
  }

  const getColor = (val) => {
    if (val > 0) return `rgba(255, 99, 71, ${Math.abs(val)})` // Red/Warm for positive
    return `rgba(70, 130, 180, ${Math.abs(val)})` // Blue/Cold for negative
  }

  return (
    <div className="col" style={{ gap: 32, paddingBottom: 60 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>Erweiterte Analyse</h2>
        <button onClick={onClose} className="btn">Zurück zum Dashboard</button>
      </div>

      {/* Descriptive Statistics */}
      {stats && (
        <div className="panel">
          <h3>Deskriptive Statistik (Gesamt)</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: 8, textAlign: "left" }}>Index</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Mittelwert (M)</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Median (Md)</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Standardabweichung (SD)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }}>Objektiver Schichtindex (0-5)</td>
                  <td style={{ padding: 8 }}>{stats.objective.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{stats.objective.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{stats.objective.stdDev.toFixed(2)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }}>Subjektiver Index (1-5)</td>
                  <td style={{ padding: 8 }}>{stats.subjective.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{stats.subjective.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{stats.subjective.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gender Analysis & T-Test */}
      {genderAnalysis && (
        <div className="panel">
          <h3>Statistik nach Geschlecht & T-Tests</h3>
          
          <h4 style={{ marginTop: 16, marginBottom: 8, color: "#aaa" }}>Deskriptive Werte nach Geschlecht</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: 8, textAlign: "left" }}>Variable</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Geschlecht</th>
                  <th style={{ padding: 8, textAlign: "left" }}>N</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Mittelwert (M)</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Median (Md)</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Standardabweichung (SD)</th>
                </tr>
              </thead>
              <tbody>
                {/* Objective Index Rows */}
                <tr style={{ borderBottom: "1px solid #222", background: "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }} rowSpan={2}>Objektiver Schichtindex</td>
                  <td style={{ padding: 8 }}>Männlich</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.count}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.obj.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.obj.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.obj.stdDev.toFixed(2)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #222", background: "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: 8 }}>Weiblich</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.count}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.obj.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.obj.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.obj.stdDev.toFixed(2)}</td>
                </tr>
                {/* Subjective Index Rows */}
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }} rowSpan={2}>Subjektiver Index</td>
                  <td style={{ padding: 8 }}>Männlich</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.count}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.subj.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.subj.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.males.subj.stdDev.toFixed(2)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8 }}>Weiblich</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.count}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.subj.mean.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.subj.median.toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.stats.females.subj.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 8, color: "#aaa" }}>T-Test (Gruppenvergleich Männlich vs. Weiblich)</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  <th style={{ padding: 8, textAlign: "left" }}>Vergleichsvariable</th>
                  <th style={{ padding: 8, textAlign: "left" }}>t-Wert</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Freiheitsgrade (df)</th>
                  <th style={{ padding: 8, textAlign: "left" }}>p-Wert</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }}>Objektiver Schichtindex</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.objective ? genderAnalysis.tTests.objective.t.toFixed(3) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.objective ? genderAnalysis.tTests.objective.df.toFixed(2) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.objective ? genderAnalysis.tTests.objective.p.toFixed(4) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.objective ? genderAnalysis.tTests.objective.interpretation : "-"}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }}>Subjektiver Index</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.subjective ? genderAnalysis.tTests.subjective.t.toFixed(3) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.subjective ? genderAnalysis.tTests.subjective.df.toFixed(2) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.subjective ? genderAnalysis.tTests.subjective.p.toFixed(4) : "-"}</td>
                  <td style={{ padding: 8 }}>{genderAnalysis.tTests.subjective ? genderAnalysis.tTests.subjective.interpretation : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bivariate Correlations */}
      <div className="panel">
        <h3>Bivariate Korrelationen</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Paar</th>
                <th style={{ padding: 8, textAlign: "left" }}>Methode</th>
                <th style={{ padding: 8, textAlign: "left" }}>Korrelation (r)</th>
                <th style={{ padding: 8, textAlign: "left" }}>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {bivariate.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: "bold" }}>{item.pair}</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>{item.desc}</div>
                  </td>
                  <td style={{ padding: 8 }}>{item.type}</td>
                  <td style={{ padding: 8 }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 4, 
                      background: getColor(item.val),
                      color: "#fff",
                      fontWeight: "bold"
                    }}>
                      {item.val.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>{interpret(item.val, item.symbol)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partial Correlations */}
      <div className="panel">
        <h3>Partielle Korrelationen</h3>
        <p className="muted">Bereinigte Zusammenhänge unter Kontrolle von Drittvariablen.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Paar (Kontrolle)</th>
                <th style={{ padding: 8, textAlign: "left" }}>Partielle Korrelation (r_part)</th>
                <th style={{ padding: 8, textAlign: "left" }}>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {partials.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: "bold" }}>{item.pair}</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>{item.desc}</div>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: 4, 
                      background: getColor(item.val),
                      color: "#fff",
                      fontWeight: "bold"
                    }}>
                      {item.val.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>{interpret(item.val, item.symbol)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canonical / Cross-Set Overview */}
      <div className="panel">
        <h3>Kanonische Zusammenhänge (Demografie vs. Sozioökonomie)</h3>
        <p className="muted">Übersicht der Zusammenhänge zwischen demografischen Variablen (Set 1) und sozioökonomischen Variablen (Set 2).</p>
        
        <div style={{ height: 300, marginTop: 24 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crossCorrelations} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[-1, 1]} />
              <YAxis dataKey="pair" type="category" width={150} style={{ fontSize: "0.8rem" }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload
                    return (
                      <div style={{ background: "#141a2a", padding: 8, border: "1px solid #333" }}>
                        <div>{d.pair}</div>
                        <div>r = {d.val.toFixed(2)}</div>
                        <div style={{ fontSize: "0.8rem", color: "#ccc" }}>{interpret(d.val)}</div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="val" name="Korrelation">
                {crossCorrelations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.val)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
