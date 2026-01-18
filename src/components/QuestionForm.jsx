"use client"
import { useMemo, useState } from "react"
import { getQuestionnaire } from "@/lib/questionBank"
export default function QuestionForm({ testType, userName, onSubmit }) {
  const questions = useMemo(() => {
    return getQuestionnaire(testType)
  }, [testType])
  const [answers, setAnswers] = useState({})
  const setAnswer = (n, a) => setAnswers((prev) => ({ ...prev, [n]: a }))
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => {
      const v = answers[q.number]
      if (q.type === "text") return Boolean(String(v || "").trim())
      return Boolean(v)
    })
  return (
    <div className="col" style={{ gap: 24 }}>
      {questions.map((q) => (
        <div key={q.number} className="panel col">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              {q.code} – {q.title}
            </div>
            <div className="muted">Test {testType}</div>
          </div>
          <div className="muted">{q.prompt}</div>
          {q.type === "text" ? (
            <textarea
              className="input"
              value={answers[q.number] || ""}
              onChange={(e) => setAnswer(q.number, e.target.value)}
              rows={5}
              placeholder="Antwort eingeben…"
              style={{ resize: "vertical" }}
            />
          ) : (
            <div className="row options-container" style={{ flexWrap: "wrap" }}>
              {q.options.map((opt) => {
                const checked = answers[q.number] === opt
                return (
                  <label 
                    key={opt} 
                    className="btn" 
                    style={{ 
                      background: checked ? "#123b2a" : undefined,
                      borderColor: checked ? "#1a5e43" : undefined,
                      borderWidth: checked ? "2px" : "1px"
                    }}
                  >
                    <input
                      type="radio"
                      name={`q${q.number}`}
                      value={opt}
                      checked={checked}
                      onChange={() => setAnswer(q.number, opt)}
                      style={{ display: "none" }}
                    />
                    <div style={{ textAlign: "left" }}>
                      {opt.split("\n").map((line, i) => (
                        <div 
                          key={i} 
                          style={{
                            fontWeight: i === 0 && opt.split("\n").length > 1 ? "bold" : "normal",
                            opacity: i > 0 ? 0.7 : 1,
                            fontSize: i > 0 ? "0.9em" : "1em",
                            marginTop: i > 0 ? 4 : 0
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          {q.hint && (
            <div className="muted" style={{ 
              marginTop: 8, 
              background: "rgba(255,255,255,0.05)", 
              padding: 8, 
              borderRadius: 4 
            }}>
              {q.hint}
            </div>
          )}
        </div>
      ))}
      <button
        className="btn success"
        disabled={!allAnswered}
        onClick={() => onSubmit(answers)}
      >
        Abschluss speichern
      </button>
    </div>
  )
}
