"use client"
import { useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import ChartPanel from "@/components/ChartPanel"
import OpenAnswersPanel from "@/components/OpenAnswersPanel"
import { getQuestionnaire } from "@/lib/questionBank"
export default function Page() {
  const [ok, setOk] = useState(false)
  const [pwd, setPwd] = useState("")
  useEffect(() => {
    const v = localStorage.getItem("admin_ok") === "true"
    setOk(v)
  }, [])
  const tests = useMemo(() => ["A", "B"], [])
  const login = () => {
    if (pwd === "admin123") {
      localStorage.setItem("admin_ok", "true")
      setOk(true)
    } else {
      alert("Falsches Passwort")
    }
  }
  const resetAll = async () => {
    if (!confirm("Bist du sicher?")) return
    const supabase = getSupabaseClient()
    if (!supabase) return alert("Supabase ist nicht konfiguriert")
    const { error } = await supabase.from("quiz_responses").delete().gt("created_at", "1900-01-01")
    if (error) alert("Löschen fehlgeschlagen")
  }
  if (!ok) {
    return (
      <div className="panel col" style={{ maxWidth: 420 }}>
        <h2>Admin Login</h2>
        <input className="input" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Passwort" type="password" />
        <button className="btn primary" onClick={login}>Login</button>
      </div>
    )
  }
  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Quiz Auswertung</h2>
        <button className="btn" onClick={resetAll}>Alle Ergebnisse zurücksetzen</button>
      </div>
      {tests.map((t) => (
        <div key={t} className="col" style={{ gap: 16 }}>
          <h3>Auswertung Test {t}</h3>
          <div className="row" style={{ flexWrap: "wrap" }}>
            {getQuestionnaire(t).map((q) => (
              <div key={q.number} style={{ flex: "1 1 420px", minWidth: 320 }}>
                {t === "A" ? (
                  <ChartPanel testType={t} question={q} />
                ) : (
                  <OpenAnswersPanel testType={t} question={q} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
