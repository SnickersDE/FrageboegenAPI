"use client"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
export default function OpenAnswersPanel({ testType, question }) {
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let canceled = false
    const load = async () => {
      setLoading(true)
      const supabase = getSupabaseClient()
      if (!supabase) {
        setRows([])
        setCount(0)
        setLoading(false)
        return
      }
      const [{ data }, { count }] = await Promise.all([
        supabase
          .from("quiz_responses")
          .select("user_name, answer, created_at")
          .eq("test_type", testType)
          .eq("question_number", question.number)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("quiz_responses")
          .select("*", { count: "exact", head: true })
          .eq("test_type", testType)
          .eq("question_number", question.number)
      ])
      if (canceled) return
      setRows(data || [])
      setCount(count || 0)
      setLoading(false)
    }
    load()
    const supabase = getSupabaseClient()
    if (!supabase) return
    const sub = supabase
      .channel(`quiz_open_${testType}_${question.number}`)
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
  }, [question, testType])
  return (
    <div className="panel col">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          {question.code} – {question.title}
        </div>
        <div className="muted">{count} Antworten</div>
      </div>
      <div className="muted">{question.prompt}</div>
      {loading ? (
        <div className="muted">Lade Antworten…</div>
      ) : rows.length === 0 ? (
        <div className="muted">Noch keine Antworten oder Supabase nicht konfiguriert.</div>
      ) : (
        <div className="col" style={{ gap: 10 }}>
          {rows.map((r, idx) => (
            <div key={idx} className="panel col" style={{ padding: 12, background: "#0f1526", borderColor: "#2a3658" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="muted">{r.user_name}</div>
                <div className="muted">{new Date(r.created_at).toLocaleString("de-DE")}</div>
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{r.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
