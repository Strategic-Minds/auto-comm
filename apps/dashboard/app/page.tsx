import { PwaInstallButtons } from "./components/PwaInstallButtons";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding: 32,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at 20% 10%, rgba(57, 255, 20, 0.18), transparent 28%), linear-gradient(135deg, #ffffff, #f7faf5)",
        color: "#050706",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          borderRadius: 28,
          padding: 32,
          background: "#050706",
          color: "#fff",
          boxShadow: "0 28px 70px rgba(5, 7, 6, 0.24)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 15,
              display: "grid",
              placeItems: "center",
              background: "#39ff14",
              color: "#050706",
              fontWeight: 950,
              boxShadow: "0 0 28px rgba(57,255,20,.72)"
            }}
          >
            A
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>Auto Chat</h1>
            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,.68)", fontWeight: 700 }}>
              Governed WhatsApp and social conversation command center.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <a
            href="/dashboard"
            style={{
              minHeight: 46,
              borderRadius: 999,
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#39ff14",
              color: "#050706",
              fontWeight: 900,
              textDecoration: "none"
            }}
          >
            Open conversation wall
          </a>
        </div>
        <div style={{ marginTop: 18 }}>
          <PwaInstallButtons tone="dark" />
        </div>
      </section>
    </main>
  );
}
