export const metadata = {
  title: "Fragebögen App",
  description: "Quiz- und Auswertungs-App"
}
import "./globals.css"
import AdminLink from "@/components/AdminLink"
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <header className="header">
          <div className="title">Quiz / Fragebögen</div>
          <AdminLink />
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
