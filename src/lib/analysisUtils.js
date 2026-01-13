export const calculateCoding = (answers) => {
  const c = {}

  // Bildung (A3 & A10)
  // A3 Scores
  const eduMapA3 = {
    "Kein Abschluss": 1,
    "Hauptschule": 2,
    "Realschule": 3,
    "Abitur": 4,
    "Universitäts-Abschluss (Bachelor, Master)": 5
  }
  const scoreA3 = eduMapA3[answers["A3"]] || 1

  // A10 Scores
  const eduMapA10 = {
    "Kein Berufsabschluss": 1,
    "Berufsausbildung (z. B. Lehre, duale Ausbildung) - Ich habe eine abgeschlossene Berufsausbildung.": 2,
    "Noch in Ausbildung / Studium - Ich mache aktuell eine Ausbildung oder ein Studium.": 2,
    "Meister:in / Techniker:in / Fachwirt:in - Ich habe eine berufliche Weiterbildung über die Ausbildung hinaus.": 3,
    "Hochschulabschluss (Bachelor, Master, Diplom, Staatsexamen) - Ich habe einen Studienabschluss.": 4,
    "Promotion - Ich habe einen Doktortitel.": 5
  }
  const scoreA10 = eduMapA10[answers["A10"]] || 1
  
  // Weighted Education: 40% A3, 60% A10
  c.education = (0.4 * scoreA3) + (0.6 * scoreA10)

  // Einkommen (A5)
  const incMap = {
    "Unter 1.500 €": 1,
    "1.500–2.500 €": 2,
    "2.501–3.500 €": 3,
    "Über 3.500 €": 4
  }
  c.income = incMap[answers["A5"]] || 0

  // Beruf (A6)
  const jobMap = {
    "Ich habe keine Berufsausbildung und arbeite zur Zeit nicht": 0,
    "Ich habe keine Berufsausbildung, arbeite aber in einem Unternehmen": 1,
    "Ich habe eine Ausbildung gemacht und arbeite in einem gelernten Beruf": 2,
    "Ich habe eine feste Anstellung und treffe eigene Entscheidungen": 3,
    "Ich habe eine feste Anstellung, treffe eigene Entscheidung und leite ein Team": 4,
    "Ich arbeite in einer beruflichen Position im Management und trage die gesamte Verantwortung über eine Abteilung oder Personal": 5
  }
  c.job = jobMap[answers["A6"]] || 0

  // Subjektive Schicht (A7)
  const ansA7 = answers["A7"] || ""
  let subjScore = 0
  if (ansA7.startsWith("Unterschicht")) subjScore = 1
  else if (ansA7.startsWith("Untere Mittelschicht")) subjScore = 2
  else if (ansA7.startsWith("Mittelschicht")) subjScore = 3
  else if (ansA7.startsWith("Obere Mittelschicht")) subjScore = 4
  else if (ansA7.startsWith("Oberschicht")) subjScore = 5
  c.subjective = subjScore

  // Finanzielle Sicherheit (A8)
  const finMap = {
    "Sehr unsicher": 1,
    "Eher unsicher": 2,
    "keine Angabe": 3, // Neutral
    "Eher sicher": 4,
    "Sehr sicher": 5
  }
  c.financialSecurity = finMap[answers["A8"]] || 0

  // Aufstiegschancen (A9)
  // Options start with "Sehr gering", "Eher gering", etc.
  const ansA9 = answers["A9"] || ""
  let chanceScore = 0
  if (ansA9.startsWith("Sehr gering")) chanceScore = 1
  else if (ansA9.startsWith("Eher gering")) chanceScore = 2
  else if (ansA9.startsWith("Mittel")) chanceScore = 3
  else if (ansA9.startsWith("Eher hoch")) chanceScore = 4
  else if (ansA9.startsWith("Sehr hoch")) chanceScore = 5
  c.chances = chanceScore

  // A10 is already used in Education, but maybe we need it separately as "Berufliche Bildung"?
  // User asked for "Berufliche Bildung (A10)" as a variable.
  c.vocationalEdu = scoreA10

  // Demographics
  c.gender = answers["A1"] || "Unknown"
  // Encode Gender: M=1, F=2, D=3 (Arbitrary for correlation, usually dummy coded)
  // User asked: "Geschlecht (kodiert) ↔ Schichtindex"
  // Point-Biserial usually implies Binary. Let's map Male=0, Female=1, others exclude or map.
  // For simplicity: M=1, F=2, D=3. Pearson on this is questionable but user asked for "metrisch <-> metrisch" or "dichotom <-> metrisch".
  // If we treat it as dichotomous (M/F), we filter others.
  let gCode = null
  if (c.gender === "Männlich") gCode = 0
  else if (c.gender === "Weiblich") gCode = 1
  c.genderCode = gCode

  // Alter (A2)
  // Ranges: "0–18", "18–29", "30–44", "45–59", "60+"
  // Map to center of range approx? or ordinal 1-5
  const ageMap = {
    "0–18": 1,
    "18–29": 2,
    "30–44": 3,
    "45–59": 4,
    "60+": 5
  }
  c.age = ageMap[answers["A2"]] || 0

  return c
}

export const calculateIndex = (coding) => {
  if (!coding.education || !coding.income || !coding.job) return null
  return (0.3 * coding.education) + (0.4 * coding.income) + (0.3 * coding.job)
}
