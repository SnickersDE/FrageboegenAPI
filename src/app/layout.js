export const metadata = {
  title: "Fragebögen App",
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
            <div className="title app-title">Quiz / Fragebögen</div>
          </div>
          <div className="row" style={{ alignItems: "center", gap: 16 }}>
            <nav className="lang-nav">
              <span className="flag">🇷🇺</span>
              <span className="flag">🇺🇦</span>
              <span className="flag">🇬🇧</span>
              <span className="flag">🇹🇷</span>
              <span className="flag">🇸🇦</span>
              <span className="flag">🇩🇪</span>
            </nav>
            <AdminLink />
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
