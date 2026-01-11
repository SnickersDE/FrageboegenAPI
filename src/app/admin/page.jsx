"use client"
import { useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import AnalysisPanel from "@/components/AnalysisPanel"

export default function Page() {
  const [ok, setOk] = useState(false)
  const [pwd, setPwd] = useState("")

  useEffect(() => {
    const v = localStorage.getItem("admin_ok") === "true"
    setOk(v)
  }, [])

  const login = () => {
    if (pwd === "admin123") {
      localStorage.setItem("admin_ok", "true")
      setOk(true)
    } else {
      alert("Falsches Passwort")
    }
  }

  const resetAll = async () => {
    if (!confirm("Bist du sicher? Alle Daten werden gelöscht.")) return
    const supabase = getSupabaseClient()
    if (!supabase) return alert("Supabase ist nicht konfiguriert")
    const { error } = await supabase.from("quiz_responses").delete().gt("created_at", "1900-01-01")
    if (error) alert("Löschen fehlgeschlagen")
    else alert("Alle Daten gelöscht.")
    window.location.reload()
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
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Analyse Dashboard</h1>
        <button className="btn" onClick={resetAll} style={{ backgroundColor: "#ffdddd", color: "#d00" }}>
          Alle Daten zurücksetzen
        </button>
      </div>

      <AnalysisPanel />
    </div>
  )
}
