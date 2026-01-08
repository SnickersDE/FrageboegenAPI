"use client"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
export default function ChartPanel({ testType, question }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let canceled = false
    const load = async () => {
      setLoading(true)
      const supabase = getSupabaseClient()
      if (!supabase) {
        setData([])
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from("quiz_responses")
        .select("answer")
        .eq("test_type", testType)
        .eq("question_number", question.number)
      if (canceled) return
      const counts = {}
      for (const row of data || []) counts[row.answer] = (counts[row.answer] || 0) + 1
      const options = Array.isArray(question.options) ? question.options : []
      const ordered = options.length > 0 ? options : Object.keys(counts)
      const chart = ordered.map((answer) => ({ answer, count: counts[answer] || 0 }))
      setData(chart)
      setLoading(false)
    }
    load()
    const supabase = getSupabaseClient()
    if (!supabase) return
    const sub = supabase
      .channel(`quiz_${testType}_${question.number}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quiz_responses", filter: `test_type=eq.${testType}` },
        load
      )
      .subscribe()
    return () => {
      canceled = true
      supabase.removeChannel(sub)
    }
  }, [testType, question])
  return (
    <div className="panel col">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          {question.code} – {question.title}
        </div>
        <div className="muted">Test {testType}</div>
      </div>
      {loading ? (
        <div className="muted">Lade Daten…</div>
      ) : data.length === 0 ? (
        <div className="muted">Keine Daten oder Supabase nicht konfiguriert.</div>
      ) : (
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="answer" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f7cff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
