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
    <div className="col" style={{ gap: 48 }}>
      <div className="panel col">
        <h1>Beginne die Umfrage</h1>
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

      <div
        className="row"
        style={{ alignItems: "flex-start", gap: 24, flexWrap: "wrap", padding: "12px 0" }}
      >
        <div className="col" style={{ flex: 2, gap: 24 }}>
          <h2>Über die Umfrage</h2>
          <div className="panel col">
            <h2>Theoretische Überlegungen zum Fragebogendesign</h2>
            <p>
              Die Untersuchung des Zusammenhangs zwischen Geschlecht und sozialer Schichtzugehörigkeit stellt hohe Anforderungen an das Erhebungsdesign, da soziale Schicht kein eindimensionales, direkt beobachtbares Merkmal darstellt, sondern das Ergebnis komplexer sozialer Positionierungsprozesse ist. Vor diesem Hintergrund wurde ein Fragebogendesign entwickelt, das zentrale objektive Statusindikatoren mit subjektiven Einschätzungen sozialer Lage kombiniert und diese in einem standardisierten Schichtindex zusammenführt.
            </p>
            <p>
              Die Erhebung von Beruf, Einkommen und Bildung orientiert sich an etablierten Ansätzen der Sozialstrukturanalyse. Insbesondere der Beruf fungiert in der Ungleichheitsforschung als zentrale Vermittlungsgröße zwischen Bildung und Einkommen und bildet die Grundlage für international vergleichbare Indizes wie den International Socio-Economic Index (ISEI). Der ISEI ordnet Berufe entlang einer kontinuierlichen Skala so an, dass der indirekte Einfluss von Bildung auf Einkommen maximiert und der direkte Einfluss minimiert wird. Durch die Integration berufsbezogener Informationen in den Index wird die objektive soziale Position der Befragten in einer Weise erfasst, die sowohl theoretisch begründet als auch empirisch erprobt ist.
            </p>
            <p>
              Gleichzeitig greift das Design zentrale Überlegungen Pierre Bourdieus zur sozialen Ungleichheit auf. In Bourdieus Perspektive ergibt sich soziale Schichtzugehörigkeit aus der ungleichen Verteilung verschiedener Kapitalformen, insbesondere des ökonomischen, kulturellen und sozialen Kapitals. Einkommen und Vermögen repräsentieren dabei ökonomisches Kapital, Bildungsabschlüsse und Qualifikationen institutionalisierte Formen kulturellen Kapitals. Die Kombination dieser Merkmale erlaubt es, die strukturelle Position von Individuen im sozialen Raum abzubilden und geschlechtsspezifische Ungleichheitsmuster sichtbar zu machen, die sich aus unterschiedlichen Kapitalausstattungen ergeben.
            </p>
            <p>
              Die zusätzliche Erhebung der subjektiven Einschätzung der eigenen sozialen Schicht trägt der bourdieuschen Annahme Rechnung, dass soziale Praxis nicht allein durch objektive Positionen bestimmt wird, sondern durch den Habitus, also durch verinnerlichte Wahrnehmungs-, Denk- und Bewertungsschemata. Subjektive Statuszuordnungen beeinflussen Bildungs- und Berufsaspirationen sowie Handlungserwartungen und sind damit insbesondere für Analysen geschlechtsspezifischer Ungleichheit von zentraler Bedeutung. Der entwickelte Index im Wertebereich von 0 bis 5 ermöglicht es, objektive und subjektive Dimensionen sozialer Lage systematisch zu vergleichen und Wahrnehmungsdiskrepanzen zwischen sozialer Position und Selbsteinordnung empirisch zu erfassen.
            </p>
            <p>
              Durch die Indexbildung wird soziale Schicht als kontinuierliches, mehrdimensionales Merkmal operationalisiert, was differenzierte Vergleiche zwischen Geschlechtern erlaubt und zugleich die statistische Analyse vereinfacht. Das Design ist damit besonders geeignet, Geschlecht als strukturierende soziale Kategorie in Beziehung zur sozialen Schichtzugehörigkeit zu setzen und sowohl strukturelle Ungleichheiten als auch wahrnehmungsbezogene Unterschiede sichtbar zu machen.
            </p>
          </div>

          <div className="panel col">
            <h2>Kritik</h2>
            <p>
              Trotz seiner theoretischen Fundierung und analytischen Leistungsfähigkeit ist das gewählte Fragebogendesign nicht frei von Einschränkungen. Ein zentrales Problem besteht in den kognitiven Anforderungen, die der Fragebogen an die Befragten stellt. Das Verständnis von Fragen zu Bildung, Beruf und insbesondere zur subjektiven sozialen Schicht setzt ein gewisses Maß an Bildungs- und Reflexionskompetenz voraus. Personen mit geringerer formaler Bildung oder begrenzter sprachlicher Kompetenz könnten Schwierigkeiten haben, die Fragen korrekt zu interpretieren, was die Validität der Angaben beeinträchtigen kann.
            </p>
            <p>
              Eng damit verbunden ist die sprachliche Dimension der Erhebung. Auch bei Übersetzungen in andere Sprachen besteht die Gefahr, dass Begriffe wie „soziale Schicht“, „Status“ oder „Bildung“ kulturell unterschiedlich konnotiert sind. Dies kann zu systematischen Verzerrungen führen, insbesondere in heterogenen oder migrationsgeprägten Stichproben, und die Vergleichbarkeit der Daten einschränken.
            </p>
            <p>
              Ein weiterer kritischer Punkt betrifft die subjektive Selbsteinschätzung der sozialen Schicht. Diese ist anfällig für soziale Erwünschtheit, Vergleichseffekte und Referenzgruppenverzerrungen. Befragte orientieren sich bei ihrer Einschätzung häufig an ihrem unmittelbaren sozialen Umfeld, was dazu führen kann, dass objektiv vergleichbare Positionen subjektiv sehr unterschiedlich bewertet werden. Solche Kreuzwirkungen sind zwar analytisch interessant, erschweren jedoch die eindeutige Interpretation der Ergebnisse.
            </p>
            <p>
              Schließlich verweist das Design implizit auf eine psychologische Leerstelle: Subjektive Statusurteile sind nicht nur sozial, sondern auch persönlichkeitsabhängig. Faktoren wie Selbstwert, Kontrollüberzeugungen oder soziale Vergleichsorientierung beeinflussen die Wahrnehmung der eigenen sozialen Lage erheblich. Vor diesem Hintergrund wäre die Ergänzung des Fragebogens um Elemente eines psychologischen Persönlichkeitstests sinnvoll, um zwischen strukturell bedingten Wahrnehmungsdiskrepanzen und persönlichkeitsbedingten Verzerrungen differenzieren zu können.
            </p>
          </div>

          <div className="panel col">
            <h2>Hypothesenlogik</h2>
            <ul style={{ listStyleType: "disc", paddingLeft: 20, lineHeight: 1.6 }}>
              <li><strong>Zusammenfassende Logik</strong></li>
              <li>Geschlecht wirkt als strukturelle Kategorie.</li>
              <li>Es beeinflusst Kapitalausstattung (Bourdieu) und Berufsstatus (ISEI).</li>
              <li>Daraus resultieren Unterschiede in objektiver Schichtzugehörigkeit.</li>
              <li>Diese werden durch eigene Denkweisen subjektiv verzerrt.</li>
            </ul>
          </div>

          <div className="panel col">
            <h2>Berechnung des Schichtindexes</h2>
            <p>
              Schichtindex = 0,3 * Bildung + 0,4 * Einkommen + 0,3 * Berufliche Position.
            </p>
            <p>
              Die Gewichtung folgt theoretischen Annahmen nach Bourdieu und arbeitsmarktsoziologischen Klassifikationen (ISEI), erhebt jedoch keinen Anspruch auf universelle Gültigkeit.
            </p>
            <p>
              Der Chi-Quadrat-Test vergleicht die beobachteten Häufigkeiten in den Zellen unserer Kreuztabelle mit den erwarteten Häufigkeiten, die unter der Annahme vollständiger Unabhängigkeiten der Variablen resultieren würden. Ein signifikanter Testwert (Chi-Quadrat) weist darauf hin, dass die subjektive Wahrnehmung der sozialen Schicht systematisch mit dem Geschlecht variiert und nicht allein durch Zufall erklärt werden kann. Damit erlaubt der Test eine empirische Prüfung der theoretisch begründeten Annahme, dass geschlechtsspezifische Sozialisations- und Habitusstrukturen (Bourdieu) Einfluss auf subjektive Statusurteile haben.
            </p>
            <p>
              Um eine Einordnung und Berechnung des Chi Quadrats vorzunehmen, mussten wir den Schichtindex in einem ordinal bewerteten Kategoriesystem umrechnen. Dies senkt die wissenschaftliche Verwertbarkeit, da der Index als kontinuierlicher Schichtindex ursprünglich zu betrachten ist. Die verwendeten Ordinalskalen resultieren aus der Gewichtung und Berechnung des Schichtindexes. Zur Berechnung haben wir immer zum nächst möglichen Skalenschritt auf bzw. abgerundet.
            </p>
          </div>
        </div>

        <div className="panel col info-panel" style={{ flex: 1, minWidth: 260 }}>
          <h2 className="info-panel-title">Informationen für Probandinnen und Probanden</h2>
          <ol className="info-panel-list">
            <li>
              <strong>1. Titel der Studie</strong><br />
              Zusammenhänge zwischen Geschlecht und sozialer Schichtzugehörigkeit.
            </li>
            <li>
              <strong>2. Ziel und Zweck der Studie</strong><br />
              Ziel dieser Untersuchung ist es, einen Zusammenhang zwischen dem eigenen Geschlecht und der Zugehörigkeit einer spezifischen sozialen Schicht nachzuweisen.
              Die Studie dient ausschließlich wissenschaftlichen Zwecken im Rahmen der Erarbeitung von Schwerpunkten in dem didaktischen Vorgang der PISA Studie im Fach Forschungsmethoden.
            </li>
            <li>
              <strong>3. Ablauf der Teilnahme</strong><br />
              Die Teilnahme umfasst das Ausfüllen eines Fragebogens und dauert nicht länger als 10 Minuten.
              Es werden Fragen zu Ihren persönlichen Daten wie Geschlecht, Alter und beruflicher Situation gestellt. Es sind keine Leistungsüberprüfungen vorgesehen.
            </li>
            <li>
              <strong>4. Freiwilligkeit der Teilnahme</strong><br />
              Die Teilnahme an der Studie ist freiwillig.
              Sie können Ihre Teilnahme jederzeit ohne Angabe von Gründen abbrechen, ohne dass Ihnen daraus Nachteile entstehen.
            </li>
            <li>
              <strong>5. Risiken und Belastungen</strong><br />
              Mit der Teilnahme an dieser Studie sind keine bekannten Risiken verbunden.
              Sollten einzelne Fragen als unangenehm empfunden werden, können diese übersprungen oder die Teilnahme beendet werden.
            </li>
            <li>
              <strong>6. Nutzen der Studie</strong><br />
              Ein direkter persönlicher Nutzen entsteht Ihnen durch die Teilnahme nicht.
              Die Ergebnisse leisten jedoch einen Beitrag zur wissenschaftlichen Erkenntnis im Bereich Bildung, Sozialisation, berufliche Entwicklung.
            </li>
            <li>
              <strong>7. Datenschutz und Vertraulichkeit</strong><br />
              Die Erhebung und Verarbeitung der Daten erfolgt anonym beziehungsweise pseudonymisiert gemäß der Datenschutz-Grundverordnung.
              Es werden keine personenbezogenen Daten erhoben, die eine Identifikation ermöglichen.
              Die Daten werden ausschließlich für wissenschaftliche Zwecke verwendet.
              Eine Weitergabe an Dritte erfolgt nicht.
              Die Daten werden nach Abschluss der Auswertung gelöscht.
            </li>
            <li>
              <strong>8. Einwilligung</strong><br />
              Mit Ihrer Teilnahme erklären Sie sich damit einverstanden, dass Ihre Angaben im beschriebenen Umfang für wissenschaftliche Zwecke verwendet werden.
            </li>
            <li>
              <strong>9. Kontakt und Rückfragen</strong><br />
              Bei Fragen zur Studie oder zu Ihren Rechten als Teilnehmende wenden Sie sich bitte an: Florian Troegel, Universität Stuttgart, Student, E-Mail: Florian_97@live.de.
            </li>
            <li>
              <strong>10. Hinweis auf Ethik</strong><br />
              Diese Studie wird unter Beachtung der ethischen Standards sozialwissenschaftlicher Forschung durchgeführt.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
