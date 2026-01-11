"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
export default function Page() {
  const [name, setName] = useState("")
  const router = useRouter()
  const start = (type) => {
    if (!name.trim()) return
    router.push(`/quiz/${type}?name=${encodeURIComponent(name.trim())}`)
  }
  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="panel col">
        <h1>Landing Page</h1>
        <span className="muted">Bitte einen fiktiven Namen eingeben</span>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
        />
        <div className="row">
          <button className="btn primary" onClick={() => start("A")}>Test A starten</button>
        </div>
      </div>
    </div>
  )
}
