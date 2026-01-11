"use client"
import { useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import { getQuestionnaire } from "@/lib/questionBank"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

export default function AnalysisPanel() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    if (!supabase) return

    // Fetch all responses for Test A
    const { data: responses, error } = await supabase
      .from("quiz_responses")
      .select("*")
      .eq("test_type", "A")

    if (error) {
      console.error("Error loading data:", error)
      setLoading(false)
      return
    }

    // Group by user_id (since responses are individual rows per question)
    // Actually, the table structure is: id, test_type, user_name, question_number, answer
    // We need to group by user_name (assuming unique per session/user, but strictly we might need a session ID. 
    // For this MVP, we group by user_name + created_at roughly, or just assume user_name is unique enough for the demo context 
    // or we just process everything. The prompt implies "Teilnehmer-ID", but we only have user_name.
    // Let's group by user_name for now.
    
    const users = {}
    responses.forEach(r => {
      // Create a unique key for the user attempt if needed, but user_name is the best we have
      const key = r.user_name
      if (!users[key]) users[key] = { id: key, answers: {} }
      // Map question code based on number. A1 is number 1, etc.
      // We can look up code from questionBank but simplistic mapping works:
      users[key].answers[`A${r.question_number}`] = r.answer
    })

    const processedData = Object.values(users).map(user => {
      const coding = calculateCoding(user.answers)
      const index = calculateIndex(coding)
      return { ...user, coding, index }
    }).filter(u => u.index !== null) // Filter out incomplete data if necessary

    setData(processedData)
    calculateStatistics(processedData)
    setLoading(false)
  }

  const calculateCoding = (answers) => {
    // Coding logic based on prompt
    const c = {}

    // Bildung (A3)
    const eduMap = {
      "Kein Abschluss": 1,
      "Hauptschule": 2,
      "Realschule": 3,
      "Abitur": 4,
      "Hochschulabschluss": 5
    }
    c.education = eduMap[answers["A3"]] || 0

    // Einkommen (A5)
    // Options: "Unter 1.500 €", "1.500–2.500 €", "2.501–3.500 €", "Über 3.500 €"
    const incMap = {
      "Unter 1.500 €": 1,
      "1.500–2.500 €": 2,
      "2.501–3.500 €": 3,
      "Über 3.500 €": 4
    }
    c.income = incMap[answers["A5"]] || 0

    // Beruf (A6)
    // Options: "Ungelernte Tätigkeit", "Fachkraft / Facharbeiter:in", "Angestellte:r ohne Führungsverantwortung", "Angestellte:r mit Führungsverantwortung", "Leitende Position / Management (z. B. Abteilungsleiter:in, Geschäftsführer:in)"
    const jobMap = {
      "Ungelernte Tätigkeit": 1,
      "Fachkraft / Facharbeiter:in": 2,
      "Angestellte:r ohne Führungsverantwortung": 3,
      "Angestellte:r mit Führungsverantwortung": 4,
      "Leitende Position / Management (z. B. Abteilungsleiter:in, Geschäftsführer:in)": 5
    }
    c.job = jobMap[answers["A6"]] || 0

    // Subjektive Schicht (A7)
    const classMap = {
      "Unterschicht": 1,
      "Untere Mittelschicht": 2,
      "Mittelschicht": 3,
      "Obere Mittelschicht": 4,
      "Oberschicht": 5
    }
    c.subjective = classMap[answers["A7"]] || 0

    // Gender (A1)
    c.gender = answers["A1"] || "Unknown"

    return c
  }

  const calculateIndex = (coding) => {
    if (!coding.education || !coding.income || !coding.job) return null
    // Formula: 0.3 * Bildung + 0.4 * Einkommen + 0.3 * Berufliche Position
    return (0.3 * coding.education) + (0.4 * coding.income) + (0.3 * coding.job)
  }

  const calculateStatistics = (dataset) => {
    if (dataset.length === 0) return

    // Overall stats
    const indices = dataset.map(d => d.index)
    const mean = indices.reduce((a, b) => a + b, 0) / indices.length
    
    // Median
    const sorted = [...indices].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

    // Std Dev
    const variance = indices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / indices.length
    const stdDev = Math.sqrt(variance)

    // Group by Gender
    const byGender = {}
    dataset.forEach(d => {
      const g = d.coding.gender
      if (!byGender[g]) byGender[g] = []
      byGender[g].push(d.index)
    })

    const genderStats = Object.entries(byGender).map(([g, vals]) => {
      const gMean = vals.reduce((a, b) => a + b, 0) / vals.length
      return { gender: g, mean: gMean, count: vals.length }
    })

    setStats({
      mean,
      median,
      stdDev,
      genderStats
    })
  }

  // Simple Boxplot visualization (Simulated with Bar chart range for MVP or just Scatter/Distribution)
  // Recharts BoxPlot is beta/complex. We will use a composed chart or just plot points.
  // Let's stick to a simple distribution chart: Index vs Gender (Scatter) or Bar chart of Averages.

  if (loading) return <div>Lade Daten...</div>

  return (
    <div className="col" style={{ gap: 32 }}>
      <div className="panel">
        <h2>Schichtindex Analyse</h2>
        <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
          <div className="card">
            <h3>Gesamtstatistiken</h3>
            <div><strong>Mittelwert:</strong> {stats?.mean.toFixed(2)}</div>
            <div><strong>Median:</strong> {stats?.median.toFixed(2)}</div>
            <div><strong>Standardabweichung:</strong> {stats?.stdDev.toFixed(2)}</div>
          </div>
          <div className="card">
             <h3>Nach Geschlecht (Mittelwert)</h3>
             {stats?.genderStats.map(g => (
               <div key={g.gender}>{g.gender}: {g.mean.toFixed(2)} (n={g.count})</div>
             ))}
             {stats?.chiSquare !== null && (
               <div style={{ marginTop: 8 }}>
                 <strong>Chi-Quadrat (Geschlecht vs. Subj. Schicht):</strong> {stats?.chiSquare?.toFixed(2)}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="row" style={{ flexWrap: "wrap", gap: 24 }}>
        <div className="panel" style={{ flex: 1, minWidth: 300 }}>
          <h3>Verteilung Schichtindex (Histogramm)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" hide /> 
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="index" fill="#8884d8" name="Schichtindex" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="panel" style={{ flex: 1, minWidth: 300 }}>
          <h3>Subjektive Schicht vs. Objektiver Index</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" hide />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="coding.subjective" fill="#82ca9d" name="Subjektiv" />
              <Bar dataKey="index" fill="#8884d8" name="Objektiv" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>Detaillierte Datentabelle</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: 8 }}>User</th>
                <th style={{ padding: 8 }}>Geschlecht</th>
                <th style={{ padding: 8 }}>Bildung (Code)</th>
                <th style={{ padding: 8 }}>Einkommen (Code)</th>
                <th style={{ padding: 8 }}>Beruf (Code)</th>
                <th style={{ padding: 8 }}>Subjektiv</th>
                <th style={{ padding: 8 }}>Index</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{row.id}</td>
                  <td style={{ padding: 8 }}>{row.coding.gender}</td>
                  <td style={{ padding: 8 }}>{row.coding.education}</td>
                  <td style={{ padding: 8 }}>{row.coding.income}</td>
                  <td style={{ padding: 8 }}>{row.coding.job}</td>
                  <td style={{ padding: 8 }}>{row.coding.subjective}</td>
                  <td style={{ padding: 8 }}><strong>{row.index?.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
