export const metadata = {
  title: "Willkommen bei Fragebogen API",
  description: "Quiz- und Auswertungs-App"
}
import "./globals.css"
import Link from "next/link"
import AdminLink from "@/components/AdminLink"

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <header className="header">
          <div className="row" style={{ alignItems: "center", gap: 12 }}>
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="logo-img" />
            </Link>
            <div className="title app-title">Willkommen bei Fragebogen API</div>
          </div>
          <div className="row" style={{ alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "10px", color: "#9aa4b2", marginBottom: "4px" }}>
                Wähle deine Sprache
              </span>
              <nav className="lang-nav">
                <img src="https://flagcdn.com/w40/ru.png" alt="RU" className="flag" />
                <img src="https://flagcdn.com/w40/ua.png" alt="UA" className="flag" />
                <img src="https://flagcdn.com/w40/gb.png" alt="GB" className="flag" />
                <img src="https://flagcdn.com/w40/tr.png" alt="TR" className="flag" />
                <img src="https://flagcdn.com/w40/sa.png" alt="SA" className="flag" />
                <img src="https://flagcdn.com/w40/de.png" alt="DE" className="flag" />
              </nav>
            </div>
            <AdminLink />
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
