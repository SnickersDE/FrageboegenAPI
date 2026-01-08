"use client"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabaseClient"
import QuestionForm from "@/components/QuestionForm"
import { getQuestionnaire } from "@/lib/questionBank"
export default function Page() {
  const params = useParams()
  const router = useRouter()
  const sp = useSearchParams()
  const testType = String(params.testType).toUpperCase() === "B" ? "B" : "A"
  const userName = sp.get("name") || ""
  const submit = async (answers) => {
    const questions = getQuestionnaire(testType)
    const rows = Object.entries(answers).map(([n, a]) => ({
      test_type: testType,
      user_name: userName,
      question_number: Number(n),
      answer: a
    }))
    if (questions.length === 0) return alert("Keine Fragen gefunden")
    if (!userName.trim()) return alert("Bitte Name eingeben")
    const supabase = getSupabaseClient()
    if (!supabase) return alert("Supabase ist nicht konfiguriert")
    const { error } = await supabase.from("quiz_responses").insert(rows)
    if (error) return alert("Speichern fehlgeschlagen")
    router.push("/thanks")
  }
  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="panel col">
        <h2>Quiz</h2>
        <span className="muted">Name: {userName || "Unbekannt"}</span>
        <span className="muted">Test: {testType}</span>
      </div>
      <QuestionForm testType={testType} userName={userName} onSubmit={submit} />
    </div>
  )
}
