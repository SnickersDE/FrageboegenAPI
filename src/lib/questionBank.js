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
        options: ["18–29", "30–44", "45–59", "60+"]
      },
      {
        number: 3,
        code: "A3",
        title: "Höchster Bildungsabschluss",
        prompt: "Welchen höchsten Bildungsabschluss haben Sie?",
        type: "single",
        options: ["Kein Abschluss", "Hauptschule", "Realschule", "Abitur", "Hochschulabschluss"]
      },
      {
        number: 4,
        code: "A4",
        title: "Aktuelle Erwerbstätigkeit",
        prompt: "Welche Erwerbssituation trifft aktuell auf Sie zu?",
        type: "single",
        options: ["Vollzeit", "Teilzeit", "Selbstständig", "Nicht erwerbstätig", "Arbeitslos", "Rente"]
      },
      {
        number: 5,
        code: "A5",
        title: "Monatliches Netto-Einkommen",
        prompt: "Wie hoch ist Ihr persönliches monatliches Netto-Einkommen?",
        type: "single",
        options: ["Unter 1.500 €", "1.500–2.500 €", "2.501–3.500 €", "Über 3.500 €"]
      },
      {
        number: 6,
        code: "A6",
        title: "Berufliche Position",
        prompt: "Welche berufliche Position nehmen Sie aktuell ein?",
        type: "single",
        options: [
          "Ungelernte Tätigkeit",
          "Fachkraft / Facharbeiter:in",
          "Angestellte:r ohne Führungsverantwortung",
          "Angestellte:r mit Führungsverantwortung",
          "Leitende Position / Management (z. B. Abteilungsleiter:in, Geschäftsführer:in)"
        ]
      },
      {
        number: 7,
        code: "A7",
        title: "Subjektive soziale Schicht",
        prompt: "Welcher sozialen Schicht würden Sie sich selbst zuordnen?",
        type: "single",
        options: ["Unterschicht", "Untere Mittelschicht", "Mittelschicht", "Obere Mittelschicht", "Oberschicht"]
      },
      {
        number: 8,
        code: "A8",
        title: "Finanzielle Sicherheit",
        prompt: "Wie sicher schätzen Sie Ihre aktuelle finanzielle Situation ein?",
        type: "single",
        options: ["Sehr unsicher", "Eher unsicher", "Teils / teils", "Eher sicher", "Sehr sicher"]
      },
      {
        number: 9,
        code: "A9",
        title: "Aufstiegschancen",
        prompt: "Wie schätzen Sie Ihre Chancen ein, sozial aufzusteigen?",
        type: "single",
        options: ["Sehr gering", "Eher gering", "Mittel", "Eher hoch", "Sehr hoch"]
      }
    ]
  }
  // Test B entfernt
  return []
}
