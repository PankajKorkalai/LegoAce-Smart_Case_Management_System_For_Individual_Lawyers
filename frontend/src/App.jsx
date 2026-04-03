import './App.css'

function App() {
  const stats = [
    { label: 'Active Cases', value: '24', sub: '+3 from last month', tone: 'green' },
    { label: 'Total Clients', value: '156', sub: '+12 new clients', tone: 'teal' },
    { label: 'Documents', value: '1247', sub: '89 pending review', tone: 'gold' },
    { label: 'Upcoming Hearings', value: '8', sub: '2 this week', tone: 'rose' },
  ]

  const recentCases = [
    {
      name: 'Smith vs. Johnson Corp',
      code: 'CASE-2024-001',
      category: 'Civil Litigation',
      priority: 'high',
      nextHearing: 'Feb 15, 2026',
      status: 'active',
    },
    {
      name: 'Davis Property Dispute',
      code: 'CASE-2024-002',
      category: 'Real Estate',
      priority: 'medium',
      nextHearing: 'Feb 20, 2026',
      status: 'pending',
    },
    {
      name: 'Rodriguez Employment Claim',
      code: 'CASE-2024-003',
      category: 'Employment Law',
      priority: 'high',
      nextHearing: 'Feb 12, 2026',
      status: 'active',
    },
    {
      name: 'Wilson Divorce Settlement',
      code: 'CASE-2024-004',
      category: 'Family Law',
      priority: 'low',
      nextHearing: 'Feb 25, 2026',
      status: 'active',
    },
  ]

  const upcomingEvents = [
    {
      title: 'Court Hearing - Smith vs. Johnson',
      type: 'hearing',
      details: 'Feb 6, 2026 at 9:00 AM - Court Room 4',
    },
    {
      title: 'Client Meeting - Maria Rodriguez',
      type: 'meeting',
      details: 'Feb 5, 2026 at 2:00 PM - Video Call',
    },
    {
      title: 'Deposition - Davis Case',
      type: 'deposition',
      details: 'Feb 6, 2026 at 10:30 AM - Conference Room A',
    },
    {
      title: 'Contract Review Deadline',
      type: 'deadline',
      details: 'Feb 7, 2026 at 5:00 PM',
    },
  ]

  const reminderPresets = [
    {
      title: 'Court Hearing Reminder',
      description: 'Send 24h and 2h before hearing',
      channels: 'Email, SMS, Call',
    },
    {
      title: 'Case Status Update',
      description: 'Notify client on any major update',
      channels: 'Email, SMS',
    },
    {
      title: 'Document Deadline Alert',
      description: 'Remind lawyer and paralegal team',
      channels: 'Email, SMS',
    },
  ]

  const pricingTiers = [
    {
      plan: 'Starter',
      price: '$29',
      note: '/user/month',
      features: ['Case tracking', 'Email reminders', 'Basic dashboard'],
    },
    {
      plan: 'Professional',
      price: '$79',
      note: '/user/month',
      features: ['Feedback system', 'SMS reminders', 'AI summaries'],
      featured: true,
    },
    {
      plan: 'Enterprise',
      price: '$149',
      note: '/user/month',
      features: ['Twilio voice calls', 'Advanced analytics', 'Priority support'],
    },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">LegalFlow</div>
        <nav>
          <a className="nav-item active" href="#dashboard">Dashboard</a>
          <a className="nav-item" href="#cases">Cases</a>
          <a className="nav-item" href="#feedback">Feedback</a>
          <a className="nav-item" href="#reminders">Reminders</a>
          <a className="nav-item" href="#pricing">Pricing</a>
          <a className="nav-item" href="#lawyer-card">Lawyer Card</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <input
            className="search-box"
            placeholder="Search cases, clients, documents..."
            aria-label="Search"
          />
          <div className="profile">
            <span className="avatar">S</span>
            <div>
              <strong>Sarah Mitchell</strong>
              <p>Senior Partner</p>
            </div>
          </div>
        </header>

        <section id="dashboard" className="panel">
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, Sarah. Here is your practice overview.</p>
          <div className="stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="stat-card">
                <p>{item.label}</p>
                <h2>{item.value}</h2>
                <small className={`tone-${item.tone}`}>{item.sub}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="grid-two">
          <article className="panel">
            <div className="section-title">
              <h3>Recent Cases</h3>
              <a href="#cases">View all</a>
            </div>
            <div className="list">
              {recentCases.map((entry) => (
                <div className="row" key={entry.code}>
                  <div>
                    <strong>{entry.name}</strong>
                    <p>{entry.code} · {entry.category}</p>
                  </div>
                  <div className="right-meta">
                    <span className={`pill ${entry.priority}`}>{entry.priority}</span>
                    <span>{entry.nextHearing}</span>
                    <span className={`pill ${entry.status}`}>{entry.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <h3>Upcoming Events</h3>
            <div className="list">
              {upcomingEvents.map((event) => (
                <div className="event-card" key={event.title}>
                  <strong>{event.title}</strong>
                  <p>{event.details}</p>
                  <span className={`pill ${event.type}`}>{event.type}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="feedback" className="panel">
          <h3>Feedback System (Post Case Closure)</h3>
          <p className="muted">
            Once a case is closed, a feedback link is sent automatically to the client by email.
          </p>
          <div className="feedback-grid">
            <div className="feedback-card">
              <h4>Email Template Preview</h4>
              <p>Subject: Share your experience for CASE-2024-001</p>
              <p>Body: Thank you for trusting our firm. Please rate us on 1 to 5 stars.</p>
            </div>
            <div className="feedback-card">
              <h4>Questions</h4>
              <ul>
                <li>Communication quality: ★★★★★</li>
                <li>Legal guidance: ★★★★★</li>
                <li>Timeliness and updates: ★★★★★</li>
                <li>Overall experience: ★★★★★</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="reminders" className="panel">
          <h3>Reminder Center</h3>
          <p className="muted">
            User-friendly reminder presets with custom themes and multi-channel delivery.
          </p>
          <div className="preset-grid">
            {reminderPresets.map((preset) => (
              <article className="preset-card" key={preset.title}>
                <h4>{preset.title}</h4>
                <p>{preset.description}</p>
                <small>Channels: {preset.channels}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="panel">
          <h3>SaaS Pricing Tiers</h3>
          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <article
                className={`pricing-card ${tier.featured ? 'featured' : ''}`}
                key={tier.plan}
              >
                <h4>{tier.plan}</h4>
                <p className="price">{tier.price}<span>{tier.note}</span></p>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="lawyer-card" className="panel">
          <h3>Public Lawyer Business Card</h3>
          <p className="muted">A shareable public page for clients to discover lawyers.</p>
          <article className="business-card">
            <h4>Adv. Sarah Mitchell</h4>
            <p>Corporate and Civil Litigation Specialist</p>
            <p>10+ years experience · High Court & District Courts</p>
            <p>Contact: sarah@legalflow.com · +1 (555) 123-0041</p>
            <button type="button">View Public Profile</button>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
