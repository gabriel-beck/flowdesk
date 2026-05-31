"use client";

import { useState } from "react";
import { Building2, Bell, CreditCard, Save } from "lucide-react";

// ─── Field components ─────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "var(--fd-accent-muted)" }}
      >
        <Icon size={16} style={{ color: "var(--fd-accent)" }} />
      </div>
      <div>
        <h2 className="text-sm font-semibold" style={{ color: "var(--fd-text-primary)" }}>
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
      style={{
        background: "var(--fd-bg-page)",
        border: "1px solid var(--fd-border)",
        color: "var(--fd-text-primary)",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--fd-border)"; }}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6 mb-4"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}
    >
      {children}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: "var(--fd-border)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--fd-text-primary)" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-4"
        style={{ background: checked ? "var(--fd-accent)" : "var(--fd-border-strong)" }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full transition-all"
          style={{
            background: "#fff",
            left: checked ? "calc(100% - 20px)" : "4px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────

function PlanCard() {
  return (
    <div
      className="rounded-xl p-5 flex items-center justify-between"
      style={{ background: "var(--fd-accent-muted)", border: "1px solid var(--fd-accent)" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold" style={{ color: "var(--fd-accent-text)" }}>
            Pro Plan
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "var(--fd-accent)", color: "#fff" }}
          >
            Active
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--fd-accent-text)" }}>
          Unlimited appointments · Up to 10 staff · Analytics
        </p>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-lg font-semibold" style={{ color: "var(--fd-accent-text)", fontFamily: "var(--font-mono)" }}>
          $49<span className="text-xs font-normal">/mo</span>
        </p>
        <button
          className="text-xs underline mt-0.5"
          style={{ color: "var(--fd-accent)" }}
        >
          Manage plan
        </button>
      </div>
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    businessName: "Studio Bella",
    email:        "hello@studiobella.com",
    phone:        "+1 (555) 234-5678",
    address:      "123 Main St, New York, NY",
    timezone:     "America/New_York",
  });

  const [notifications, setNotifications] = useState({
    emailNewAppointment:    true,
    emailCancellation:      true,
    emailReminder:          false,
    smsNewAppointment:      false,
    smsReminder:            true,
  });

  function setNotif(key: keyof typeof notifications) {
    return (v: boolean) => setNotifications((n) => ({ ...n, [key]: v }));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--fd-text-primary)" }}>
            Settings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
            Manage your business profile and preferences
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--fd-accent)", color: "#fff" }}
          onClick={() => console.log("Saved:", profile, notifications)}
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>

      {/* Business Profile */}
      <Card>
        <SectionHeader
          icon={Building2}
          title="Business Profile"
          description="Your business information visible to clients"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Business Name">
              <Input
                value={profile.businessName}
                onChange={(e) => setProfile((p) => ({ ...p, businessName: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Email">
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <Input
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Timezone">
              <select
                value={profile.timezone}
                onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                style={{
                  background: "var(--fd-bg-page)",
                  border: "1px solid var(--fd-border)",
                  color: "var(--fd-text-primary)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--fd-border)"; }}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Sao_Paulo">Brasília Time (BRT)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Choose when and how you receive notifications"
        />
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "var(--fd-text-muted)" }}>Email</p>
          <Toggle checked={notifications.emailNewAppointment} onChange={setNotif("emailNewAppointment")}
            label="New appointment" description="Get notified when a new appointment is created" />
          <Toggle checked={notifications.emailCancellation} onChange={setNotif("emailCancellation")}
            label="Cancellations" description="Get notified when an appointment is cancelled" />
          <Toggle checked={notifications.emailReminder} onChange={setNotif("emailReminder")}
            label="Daily reminder" description="Receive a daily summary of upcoming appointments" />
        </div>
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "var(--fd-text-muted)" }}>SMS</p>
          <Toggle checked={notifications.smsNewAppointment} onChange={setNotif("smsNewAppointment")}
            label="New appointment" description="Receive an SMS for each new booking" />
          <Toggle checked={notifications.smsReminder} onChange={setNotif("smsReminder")}
            label="Appointment reminder" description="SMS reminder 1 hour before each appointment" />
        </div>
      </Card>

      {/* Plan */}
      <Card>
        <SectionHeader
          icon={CreditCard}
          title="Current Plan"
          description="Your subscription and billing information"
        />
        <PlanCard />
      </Card>
    </div>
  );
}
