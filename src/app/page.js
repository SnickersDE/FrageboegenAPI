"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
export default function Page() {
  const [name, setName] = useState("")
  const router = useRouter()
  const [showConsent, setShowConsent] = useState(false)
  const [showStudyDetails, setShowStudyDetails] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState("")

  const start = (type) => {
    if (!name.trim()) return
    router.push(`/quiz/${type}?name=${encodeURIComponent(name.trim())}`)
  }

  return (
    <div className="col" style={{ gap: 48 }}>
      <div className="panel col">
        <h1>Beginne die Umfrage</h1>
        <span className="muted">Wähle einen Namen, du musst nicht deinen echten Namen angeben.</span>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
        />
        <div className="row">
          <button className="btn primary" onClick={() => setShowConsent(true)}>Test A starten</button>
        </div>
        {showConsent && (
          <div className="panel col" style={{ marginTop: 16 }}>
            <p>
              Bestätige diesen Hinweis, wenn du mit der Verarbeitung deiner Daten einverstanden bist.
              Deine personenbezogenen Daten werden nicht gespeichert und dienen dem angegebenen Forschungszweck.
            </p>
            <button className="btn success" onClick={() => start("A")}>
              Jetzt bestätigen
            </button>
          </div>
        )}
      </div>

      <div
        className="col"
        style={{ gap: 24, padding: "12px 0" }}
      >
        <div className="panel col info-panel" style={{ width: "100%" }}>
          <h2 className="info-panel-title">Informationen für Probandinnen und Probanden</h2>
          <ol className="info-panel-list">
            <li>
              <strong> Titel der Studie</strong><br />
              Zusammenhänge zwischen Geschlecht und sozialer Schichtzugehörigkeit.
            </li>
            <li>
              <strong> Ziel und Zweck der Studie</strong><br />
              Ziel dieser Untersuchung ist es, einen Zusammenhang zwischen dem eigenen Geschlecht und der Zugehörigkeit einer spezifischen sozialen Schicht nachzuweisen.
              Die Studie dient ausschließlich wissenschaftlichen Zwecken im Rahmen der Erarbeitung von Schwerpunkten in dem didaktischen Vorgang der PISA Studie im Fach Forschungsmethoden.
            </li>
            <li>
              <strong> Ablauf der Teilnahme</strong><br />
              Die Teilnahme umfasst das Ausfüllen eines Fragebogens und dauert nicht länger als 10 Minuten.
              Es werden Fragen zu Ihren persönlichen Daten wie Geschlecht, Alter und beruflicher Situation gestellt. Es sind keine Leistungsüberprüfungen vorgesehen.
            </li>
            <li>
              <strong> Freiwilligkeit der Teilnahme</strong><br />
              Die Teilnahme an der Studie ist freiwillig.
              Sie können Ihre Teilnahme jederzeit ohne Angabe von Gründen abbrechen, ohne dass Ihnen daraus Nachteile entstehen.
            </li>
            <li>
              <strong> Risiken und Belastungen</strong><br />
              Mit der Teilnahme an dieser Studie sind keine bekannten Risiken verbunden.
              Sollten einzelne Fragen als unangenehm empfunden werden, können diese übersprungen oder die Teilnahme beendet werden.
            </li>
            <li>
              <strong> Nutzen der Studie</strong><br />
              Ein direkter persönlicher Nutzen entsteht Ihnen durch die Teilnahme nicht.
              Die Ergebnisse leisten jedoch einen Beitrag zur wissenschaftlichen Erkenntnis im Bereich Bildung, Sozialisation, berufliche Entwicklung.
            </li>
            <li>
              <strong> Datenschutz und Vertraulichkeit</strong><br />
              Die Erhebung und Verarbeitung der Daten erfolgt anonym beziehungsweise pseudonymisiert gemäß der Datenschutz-Grundverordnung.
              Es werden keine personenbezogenen Daten erhoben, die eine Identifikation ermöglichen.
              Die Daten werden ausschließlich für wissenschaftliche Zwecke verwendet.
              Eine Weitergabe an Dritte erfolgt nicht.
              Die Daten werden nach Abschluss der Auswertung gelöscht.
            </li>
            <li>
              <strong> Einwilligung</strong><br />
              Mit Ihrer Teilnahme erklären Sie sich damit einverstanden, dass Ihre Angaben im beschriebenen Umfang für wissenschaftliche Zwecke verwendet werden.
            </li>
            <li>
              <strong> Kontakt und Rückfragen</strong><br />
              Bei Fragen zur Studie oder zu Ihren Rechten als Teilnehmende wenden Sie sich bitte an: Florian Troegel, Universität Stuttgart, Student, E-Mail: Florian_97@live.de.
            </li>
            <li>
              <strong> Hinweis auf Ethik</strong><br />
              Diese Studie wird unter Beachtung der ethischen Standards sozialwissenschaftlicher Forschung durchgeführt.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
