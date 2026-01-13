"use client"
import { useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import { getQuestionnaire } from "@/lib/questionBank"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { calculateCoding, calculateIndex } from "@/lib/analysisUtils"
import AdvancedAnalysis from "@/components/AdvancedAnalysis"

export default function AnalysisPanel() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setLoading(false)
      return
    }
    
    const users = {}
    responses.forEach(r => {
      const key = r.user_name
      if (!users[key]) users[key] = { id: key, answers: {} }
      users[key].answers[`A${r.question_number}`] = r.answer
    })

    const processedData = Object.values(users).map(user => {
      const coding = calculateCoding(user.answers)
      const index = calculateIndex(coding)
      return { ...user, coding, index }
    }).filter(u => u.index !== null)

    setData(processedData)
    calculateStatistics(processedData)
    setLoading(false)
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

  if (loading) return <div>Lade Daten...</div>

  if (showAdvanced) {
    return <AdvancedAnalysis data={data} onClose={() => setShowAdvanced(false)} />
  }

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
                  <td style={{ padding: 8 }}>{row.coding.education.toFixed(2)}</td>
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

      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <button className="btn primary" onClick={() => setShowAdvanced(true)} style={{ fontSize: "1.2rem", padding: "12px 24px" }}>
          Erweiterte Analyse anzeigen
        </button>
      </div>
    </div>
  )
}
