const metrics = [
  ["Replies", "34"],
  ["Hot Leads", "7"],
  ["Booked Calls", "3"],
  ["Opt-outs", "2"]
];

const leads = [
  ["HOT", "Miami contractor", "Epoxy supply coupon", "XPS Xpress"],
  ["HOT", "Campus facility manager", "Digital bid request", "National Epoxy Pros"],
  ["WARM", "PCU attendee", "Advanced training", "Polished Concrete University"]
];

export default function DashboardPage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: 32, maxWidth: 1120, margin: "0 auto" }}>
      <h1>AUTO COMM Command Center</h1>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {metrics.map(([label, value]) => (
          <div key={label} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, color: "#555" }}>{label}</div>
            <strong style={{ fontSize: 28 }}>{value}</strong>
          </div>
        ))}
      </section>
      <section style={{ marginTop: 28 }}>
        <h2>Hot Lead Queue</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Status</th>
              <th align="left">Lead</th>
              <th align="left">Intent</th>
              <th align="left">Route</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(([status, lead, intent, route]) => (
              <tr key={lead}>
                <td>{status}</td>
                <td>{lead}</td>
                <td>{intent}</td>
                <td>{route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
