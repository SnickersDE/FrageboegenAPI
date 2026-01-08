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
        options: ["Unter 1.500 €", "1.500–2.500 €", "2.501–3.500 €", "Über 3.500 €", "Keine Angabe"]
      },
      {
        number: 6,
        code: "A6",
        title: "Berufliche Position",
        prompt: "Welche berufliche Position nehmen Sie aktuell ein?",
        type: "single",
        options: [
          "Ungelernte Tätigkeit",
          "Facharbeiter:in",
          "Angestellte:r ohne Führungsverantwortung",
          "Angestellte:r mit Führungsverantwortung",
          "Leitende Position / Management"
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
  return [
    {
      number: 1,
      code: "B1",
      title: "Geschlechtliche Selbstverortung",
      prompt: "Wie beschreiben Sie Ihr Geschlecht, und welche Bedeutung hat es in Ihrem Alltag?",
      type: "text"
    },
    {
      number: 2,
      code: "B2",
      title: "Soziale Einordnung",
      prompt:
        "Wie würden Sie Ihre aktuelle soziale Lage beschreiben? Was bedeutet „soziale Schicht“ für Sie persönlich?",
      type: "text"
    },
    {
      number: 3,
      code: "B3",
      title: "Bildungsweg",
      prompt: "Beschreiben Sie Ihren Bildungsweg. Welche Rolle spielte Ihr Geschlecht dabei?",
      type: "text"
    },
    {
      number: 4,
      code: "B4",
      title: "Berufliche Erfahrungen",
      prompt: "Welche Erfahrungen haben Sie im Berufsleben gemacht, die Sie mit Ihrem Geschlecht in Verbindung bringen?",
      type: "text"
    },
    {
      number: 5,
      code: "B5",
      title: "Einkommen & Anerkennung",
      prompt:
        "Haben Sie das Gefühl, dass Ihr Einkommen oder Ihre berufliche Anerkennung mit Ihrem Geschlecht zusammenhängt? Warum oder warum nicht?",
      type: "text"
    },
    {
      number: 6,
      code: "B6",
      title: "Familie & Care-Arbeit",
      prompt:
        "Welche Rolle spielen familiäre Verpflichtungen (z. B. Kinderbetreuung, Pflege) in Ihrer beruflichen und sozialen Situation?",
      type: "text"
    },
    {
      number: 7,
      code: "B7",
      title: "Soziale Auf- oder Abstiege",
      prompt:
        "Gab es in Ihrem Leben Momente des sozialen Auf- oder Abstiegs? Inwiefern war Ihr Geschlecht dabei relevant?",
      type: "text"
    },
    {
      number: 8,
      code: "B8",
      title: "Gesellschaftliche Wahrnehmung",
      prompt: "Wie nehmen Sie die gesellschaftlichen Erwartungen an Ihr Geschlecht in Bezug auf Beruf und Status wahr?",
      type: "text"
    },
    {
      number: 9,
      code: "B9",
      title: "Reflexion",
      prompt:
        "Glauben Sie, dass das Geschlecht in Deutschland heute noch einen Einfluss auf die Zugehörigkeit zu sozialen Schichten hat? Bitte begründen Sie Ihre Antwort.",
      type: "text"
    }
  ]
}
