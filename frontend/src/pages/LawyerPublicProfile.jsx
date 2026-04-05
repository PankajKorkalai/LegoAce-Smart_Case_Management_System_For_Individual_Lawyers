import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Scale,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Link2,
  Briefcase,
  Award,
  GraduationCap,
  ShieldCheck,
  Star,
  Clock,
} from "lucide-react";

const BRAND = "#006837";
const BRAND_SOFT = "#e8f5e9";

/** Demo profile — बाद में slug से API से लोड किया जा सकता है */
const DEMO_PROFILE = {
  name: "Sarah Johnson",
  title: "Senior Partner, LegoAce Associates",
  category: "Family Law",
  headline: "Compassionate Legal Representation for Families",
  bio: "With over a decade dedicated exclusively to family law, I help clients navigate divorce, custody, and support with clarity and respect. My approach combines thorough preparation with practical solutions—whether in mediation or in court. Former court-appointed mediator; I prioritize outcomes that protect children and preserve dignity for every family I represent.",
  rating: 4.9,
  reviewCount: 87,
  location: "Los Angeles, CA",
  phone: "+1 (555) 123-4567",
  email: "sarah.johnson@legoace.com",
  website: "www.legoace.com",
  linkedin: "linkedin.com/in/sarahjohnson",
  initials: "SJ",
  stats: [
    { value: "10+", label: "Years Exp." },
    { value: "112", label: "Cases Won" },
    { value: "92%", label: "Success Rate" },
    { value: "$350", label: "Per Hour" },
  ],
  consultation: {
    title: "Free Initial Consultation",
    nextAvailable: "Tomorrow",
  },
  practiceAreas: [
    "Family Law",
    "Divorce",
    "Child Custody",
    "Domestic Relations",
    "Mediation",
    "Prenuptial Agreements",
  ],
  languages: ["English", "Spanish"],
  awards: [
    { name: "Super Lawyers Rising Star", year: "2020" },
    { name: "Top 40 Under 40 Attorneys", year: "2019" },
    { name: "Client Choice Award - Family Law", year: "2021" },
  ],
  education: [
    { degree: "Juris Doctor (J.D.)", school: "UCLA School of Law - 2014" },
    { degree: "Bachelor of Arts in Political Science", school: "UC Berkeley - 2011" },
  ],
  barNumber: "CA-123456",
  barAdmissions: [
    { name: "California State Bar", since: "2015" },
    { name: "Federal Court Admission", since: "2016" },
    { name: "Certified Family Law Specialist", since: "2018" },
    { name: "Mediation Certificate", since: "2020" },
  ],
  reviews: [
    {
      initial: "M",
      name: "Michael R.",
      rating: 5,
      text: "Sarah handled my divorce with professionalism and empathy. She made a difficult process manageable and always responded quickly.",
      date: "March 2024",
    },
    {
      initial: "J",
      name: "Jennifer L.",
      rating: 5,
      text: "Outstanding counsel on custody matters. Clear communication and strong in court when we needed it.",
      date: "January 2024",
    },
    {
      initial: "D",
      name: "David K.",
      rating: 5,
      text: "I felt heard and well represented. Highly recommend for anyone needing a family law attorney in LA.",
      date: "November 2023",
    },
  ],
};

function StarRow({ value, size = 18, className = "" }) {
  const capped = Math.min(value, 5);
  const full = Math.floor(capped);
  const frac = capped - full;
  const half = frac >= 0.25 && frac < 0.99;
  const empty = Math.max(0, 5 - full - (half ? 1 : 0));
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={size} className="fill-amber-400 text-amber-400" strokeWidth={0}
        />
      ))}
      {half ? (
        <span className="relative inline-flex" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-200" strokeWidth={1.5} />
          <Star
            size={size}
            className="absolute left-0 top-0 fill-amber-400 text-amber-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
            strokeWidth={0}
          />
        </span>
      ) : null}
      {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
        <Star key={`e-${i}`} size={size} className="text-gray-200" strokeWidth={1.5} />
      ))}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function LawyerPublicProfile() {
  const { slug } = useParams();
  const [tab, setTab] = useState("about");
  const profile = DEMO_PROFILE;

  useEffect(() => {
    document.title = `${profile.name} | LegoAce`;
  }, [profile.name, slug]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ backgroundColor: BRAND }}
              >
                <Scale size={22} />
              </div>
              <span className="truncate text-xl font-bold tracking-tight">LegoAce</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 sm:px-4"
            >
              <MessageCircle size={18} className="text-gray-500" />
              <span className="hidden sm:inline">Contact</span>
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:px-4"
              style={{ backgroundColor: BRAND }}
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Book Consultation</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
          {/* Sidebar card */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div
                className="relative h-28"
                style={{ background: `linear-gradient(135deg, ${BRAND_SOFT} 0%, #c8e6c9 100%)` }}
              >
                <div className="absolute -bottom-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl font-bold text-gray-600 shadow-md">
                  {profile.initials}
                </div>
              </div>
              <div className="px-5 pb-6 pt-14 text-center">
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <p className="mt-1 text-sm text-gray-600">{profile.title}</p>
                <span
                  className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ color: BRAND, backgroundColor: BRAND_SOFT }}
                >
                  {profile.category}
                </span>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <StarRow value={profile.rating} />
                  <p className="text-sm text-gray-500">
                    {profile.rating} ({profile.reviewCount} reviews)
                  </p>
                </div>
              </div>
              <div className="space-y-3 border-t border-gray-100 px-5 py-5 text-left text-sm">
                <div className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="text-gray-700">{profile.location}</span>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-gray-700 hover:underline">
                    {profile.phone}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <a href={`mailto:${profile.email}`} className="break-all text-gray-700 hover:underline">
                    {profile.email}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Globe size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="text-gray-700">{profile.website}</span>
                </div>
                <div className="flex gap-3">
                  <Link2 size={18} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="break-all text-gray-700">{profile.linkedin}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 px-5 py-5">
                {profile.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-[#f3f4f6] px-3 py-3 text-center"
                  >
                    <div className="text-lg font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-5 pb-5">
                <div
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: BRAND_SOFT }}
                >
                  <Clock size={22} className="shrink-0" style={{ color: BRAND }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: BRAND }}>
                      {profile.consultation.title}
                    </p>
                    <p className="text-xs text-gray-600">Next available: {profile.consultation.nextAvailable}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 space-y-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                {profile.headline}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">{profile.bio}</p>
            </div>

            <div className="inline-flex rounded-xl bg-gray-200/80 p-1">
              <TabButton active={tab === "about"} onClick={() => setTab("about")}>
                About
              </TabButton>
              <TabButton active={tab === "credentials"} onClick={() => setTab("credentials")}>
                Credentials
              </TabButton>
              <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
                Reviews
              </TabButton>
            </div>

            {tab === "about" && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase size={22} style={{ color: BRAND }} />
                    <h3 className="text-lg font-semibold text-gray-900">Practice Areas</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.practiceAreas.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium"
                        style={{ color: BRAND, backgroundColor: BRAND_SOFT }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe size={22} style={{ color: BRAND }} />
                    <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-[#f3f4f6] px-3 py-1.5 text-sm font-medium text-gray-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Award size={22} style={{ color: BRAND }} />
                    <h3 className="text-lg font-semibold text-gray-900">Awards & Recognition</h3>
                  </div>
                  <ul className="space-y-2">
                    {profile.awards.map((a) => (
                      <li
                        key={a.name}
                        className="flex items-center justify-between gap-4 rounded-xl bg-[#f3f4f6] px-4 py-3 text-sm"
                      >
                        <span className="font-medium text-gray-900">{a.name}</span>
                        <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                          {a.year}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {tab === "credentials" && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <GraduationCap size={22} style={{ color: BRAND }} />
                    <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  </div>
                  <ul className="space-y-3">
                    {profile.education.map((e) => (
                      <li key={e.degree} className="rounded-xl bg-[#f3f4f6] px-4 py-3">
                        <p className="font-semibold text-gray-900">{e.degree}</p>
                        <p className="text-sm text-gray-500">{e.school}</p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <ShieldCheck size={22} style={{ color: BRAND }} />
                    <h3 className="text-lg font-semibold text-gray-900">Bar Admissions & Certifications</h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-500">Bar Number: {profile.barNumber}</p>
                  <ul className="space-y-3">
                    {profile.barAdmissions.map((b) => (
                      <li
                        key={b.name}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f3f4f6] px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{b.name}</p>
                          <p className="text-sm text-gray-500">Since {b.since}</p>
                        </div>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ color: BRAND, backgroundColor: BRAND_SOFT }}
                        >
                          Active
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {tab === "reviews" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Star size={22} style={{ color: BRAND }} strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-gray-900">Client Reviews</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRow value={profile.rating} size={16} />
                    <span className="text-sm font-medium text-gray-700">
                      {profile.rating} ({profile.reviewCount})
                    </span>
                  </div>
                </div>
                <ul className="space-y-4">
                  {profile.reviews.map((r) => (
                    <li
                      key={r.name + r.date}
                      className="rounded-xl border border-gray-100 bg-[#f8f9fa] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ backgroundColor: BRAND_SOFT, color: BRAND }}
                          >
                            {r.initial}
                          </div>
                          <span className="font-semibold text-gray-900">{r.name}</span>
                        </div>
                        <StarRow value={r.rating} size={14} className="shrink-0" />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        &ldquo;{r.text}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-gray-400">{r.date}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-stretch justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold text-gray-900">Ready to discuss your case?</p>
              <p className="mt-1 text-sm text-gray-600">
                Schedule a free consultation with {profile.name} today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:shrink-0">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 sm:flex-initial"
              >
                <MessageCircle size={18} />
                Send Message
              </a>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:flex-initial"
                style={{ backgroundColor: BRAND }}
              >
                <Calendar size={18} />
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LegoAce. All rights reserved.
        </p>
      </main>
    </div>
  );
}
