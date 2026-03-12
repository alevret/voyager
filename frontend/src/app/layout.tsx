import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voyager — AI Travel Planning Agent",
  description: "Plan your next adventure with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <header className="border-b border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <a href="/" className="flex items-center gap-2 font-bold text-lg">
              <span>🧭</span>
              <span>Voyager</span>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/dashboard" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                Dashboard
              </a>
              <a href="/trips/new" className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">
                + New Trip
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
