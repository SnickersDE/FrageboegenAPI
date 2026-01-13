export function getQuestionnaire(testType) {
  const t = String(testType).toUpperCase() === "B" ? "B" : "A"
  if (t === "A") {
    return [
      {
        number: 1,
        code: "A1",
        title: "Geschlecht",
        prompt: "Welchem Geschlecht ordnen Sie sich zu?",
        type: "single",
        options: ["Weiblich", "Männlich", "Divers", "Keine Angabe"]
      },
      {
        number: 2,
        code: "A2",
        title: "Alter",
        prompt: "Wie alt sind Sie?",
        type: "single",
        options: ["0–18", "18–29", "30–44", "45–59", "60+"]
      },
      {
        number: 3,
        code: "A3",
        title: "Höchster Bildungsabschluss",
        prompt: "Welchen höchsten Bildungsabschluss haben Sie?",
        type: "single",
        options: ["Kein Abschluss", "Hauptschule", "Realschule", "Abitur", "Universitäts-Abschluss (Bachelor, Master)"]
      },
      {
        number: 4,
        code: "A4",
        title: "Aktuelle Erwerbstätigkeit",
        prompt: "Welche Erwerbssituation trifft aktuell auf Sie zu?",
        type: "single",
        options: ["Arbeitslos", "Teilzeit", "Vollzeit", "Selbstständig", "Rente"]
      },
      {
        number: 5,
        code: "A5",
        title: "Monatliches Netto-Einkommen",
        prompt: "Wie viel Geld haben Sie im Monat (Netto) wirklich zur Verfügung?\n(Netto = das Geld, das nach Steuern und Abzügen auf Ihrem Konto ankommt)",
        type: "single",
        options: ["Unter 1.500 €", "1.500–2.500 €", "2.501–3.500 €", "Über 3.500 €"]
      },
      {
        number: 6,
        code: "A6",
        title: "Berufliche Position",
        prompt: "Welche berufliche Position nehmen Sie aktuell ein?",
        hint: "Hinweis für Befragte: Wenn Sie unsicher sind, wählen Sie bitte die Antwort, die am besten zu Ihrer aktuellen Tätigkeit passt.",
        type: "single",
        options: [
          "Ich habe keine Berufsausbildung und arbeite zur Zeit nicht",
          "Ich habe keine Berufsausbildung, arbeite aber in einem Unternehmen",
          "Ich habe eine Ausbildung gemacht und arbeite in einem gelernten Beruf",
          "Ich habe eine feste Anstellung und treffe eigene Entscheidungen",
          "Ich habe eine feste Anstellung, treffe eigene Entscheidung und leite ein Team",
          "Ich arbeite in einer beruflichen Position im Management und trage die gesamte Verantwortung über eine Abteilung oder Personal"
        ]
      },
      {
        number: 7,
        code: "A7",
        title: "Subjektive soziale Lage",
        prompt: "Welcher sozialen Lage würden Sie sich selbst am ehesten zuordnen?\n(Es gibt keine richtige oder falsche Antwort. Gemeint ist ausschließlich Ihre aktuelle Lebens- und Einkommenssituation im Vergleich zur Gesamtbevölkerung.)",
        type: "single",
        options: [
          "Unterschicht\nMenschen in dieser Gruppe verfügen über eher geringe finanzielle Mittel.\nDie Kosten von Miete und Lebensmittel beanspruchen meist das gesamte verfügbare Einkommen",
          "Untere Mittelschicht\nMenschen in dieser Gruppe können ihre alltägichen Ausgaben selber bezahlen, haben aber wenig Möglichkeiten zu Sparen, oder größere Anschaffungen zu machen.\nUnerwartete Ausgaben (z. B. Reparaturen) sind oft besondere Belastung.",
          "Mittelschicht\nMenschen in dieser Gruppe verfügen über ein stabiles Einkommen, mit dem sie ihren Lebensstandard gut sichern können.\nNeben den laufenden Kosten sind Rücklagen, Urlaub oder größere Anschaffungen meist möglich.",
          "Obere Mittelschicht\nMenschen in dieser Gruppe haben ein überdurchschnittliches Einkommen und einen hohen Lebensstandard.\nSie können regelmäßig sparen, investieren oder Vermögen aufbauen.",
          "Oberschicht\nMenschen in dieser Gruppe verfügen über sehr hohe Einkommen oder erhebliches Vermögen.\nEinkommen stammt oft nicht nur aus der Arbeit, sondern auch aus Vermögen, Unternehmen oder Kapitalerträgen."
        ]
      },
      {
        number: 8,
        code: "A8",
        title: "Finanzielle Sicherheit",
        prompt: "Wie sicher schätzen Sie Ihre aktuelle finanzielle Situation ein?",
        type: "single",
        options: ["Sehr unsicher", "Eher unsicher", "keine Angabe", "Eher sicher", "Sehr sicher"]
      },
      {
        number: 9,
        code: "A9",
        title: "Aufstiegschancen",
        prompt: "Wie schätzen Sie Ihre Chancen ein, dass sich Ihre Lebens- und Arbeitssituation in Zukunft verbessert?",
        type: "single",
        options: [
          "Sehr gering\nIch glaube nicht, dass sich meine Situation deutlich verbessern wird.",
          "Eher gering\nIch glaube, dass kleine Verbesserungen möglich sind, aber kein großer Schritt.",
          "Mittel\nIch bin unsicher. Es kann besser werden, muss aber nicht.",
          "Eher hoch\nIch glaube, dass sich meine Situation wahrscheinlich verbessern wird.",
          "Sehr hoch\nIch bin sehr sicher, dass sich meine Situation deutlich verbessern wird."
        ]
      },
      {
        number: 10,
        code: "A10",
        title: "Beruflicher Abschluss",
        prompt: "Welchen beruflichen Abschluss haben Sie?",
        type: "single",
        options: [
          "Kein Berufsabschluss",
          "Berufsausbildung (z. B. Lehre, duale Ausbildung) - Ich habe eine abgeschlossene Berufsausbildung.",
          "Noch in Ausbildung / Studium - Ich mache aktuell eine Ausbildung oder ein Studium.",
          "Meister:in / Techniker:in / Fachwirt:in - Ich habe eine berufliche Weiterbildung über die Ausbildung hinaus.",
          "Hochschulabschluss (Bachelor, Master, Diplom, Staatsexamen) - Ich habe einen Studienabschluss.",
          "Promotion - Ich habe einen Doktortitel."
        ]
      }
    ]
  }
  // Test B entfernt
  return []
}
