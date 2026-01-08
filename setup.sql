-- 1. Tabelle für Quiz-Antworten erstellen
CREATE TABLE
  quiz_responses (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    test_type TEXT CHECK (test_type IN ('A', 'B')) NOT NULL,
    user_name TEXT NOT NULL,
    question_number INT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

-- 2. Row Level Security (RLS) für die Tabelle aktivieren
-- Standardmäßig blockiert RLS alle Anfragen. Policies definieren Ausnahmen.
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anonymen Nutzern das Einfügen von Antworten erlauben
-- Jeder (anon key) kann neue Antworten in die Tabelle einfügen.
CREATE POLICY "Allow anonymous inserts" ON quiz_responses FOR INSERT
WITH
  CHECK (TRUE);

-- 4. Policy: Anonymen Nutzern das Lesen von Antworten erlauben
-- Jeder (anon key) kann alle Antworten aus der Tabelle lesen.
-- Dies ist für die Admin-Auswertung notwendig.
CREATE POLICY "Allow anonymous reads" ON quiz_responses FOR
SELECT
  USING (TRUE);

-- 5. Policy: Anonymen Nutzern das Löschen von Antworten erlauben
-- Jeder (anon key) kann Antworten löschen. Dies wird für die "Reset"-Funktion im Admin-Bereich benötigt.
-- ACHTUNG: Dies erlaubt theoretisch jedem, alle Daten zu löschen.
-- Für eine Produktions-App sollte dies durch eine gesicherte Funktion (z.B. Edge Function)
-- mit Authentifizierung ersetzt werden. Für den MVP ist es ausreichend.
CREATE POLICY "Allow anonymous deletes" ON quiz_responses FOR DELETE USING (TRUE);
