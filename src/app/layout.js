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
              <img src="/logo.png" alt="Logo" style={{ height: 40, cursor: "pointer" }} />
            </Link>
            <div className="title">Quiz / Fragebögen</div>
          </div>
          <AdminLink />
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
