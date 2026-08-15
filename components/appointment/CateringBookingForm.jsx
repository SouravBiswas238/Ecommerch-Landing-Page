// ─── Data ──────────────────────────────────────────────────────────────────

import { useToast } from "@/hooks/useToast";
import { useCateringForm } from "@/hooks/useCateringForm";
import ToastHub from "@/components/ui/ToastHub";

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "repast", label: "Repast" },
  { value: "baby_shower", label: "Baby Shower" },
  { value: "bridal_shower", label: "Bridal Shower" },
  { value: "graduation", label: "Graduation Party" },
  { value: "anniversary", label: "Anniversary" },
  { value: "holiday", label: "Holiday Gathering" },
  { value: "other", label: "Other" },
];

const SERVICE_OPTIONS = [
  {
    value: "buffet",
    label: "Buffet Style Catering",
    description:
      "Full-service buffet setup with chafing dishes, serving equipment, and optional on-site staff.",
    icon: "🍽️",
  },
  {
    value: "packaged",
    label: "Packaged Catering",
    description:
      "Pre-portioned, individually packaged meals delivered ready to serve — perfect for grab-and-go events.",
    icon: "📦",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeading({ step, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5"
        style={{ backgroundColor: "#5C9895" }}
      >
        {step}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div data-error={!!error} className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 bg-white
   placeholder-gray-400 outline-none transition
   focus:ring-2 focus:ring-offset-1
   ${
     hasError
       ? "border-red-400 focus:ring-red-300"
       : "border-gray-300 focus:border-[#5C9895] focus:ring-[#5C9895]/30"
   }`;

// ─── Main Component ────────────────────────────────────────────────────────

export default function CateringBookingForm({
  companyId,
  isModal = false,
  onClose,
}) {
  const { toasts, showToast } = useToast();
  const {
    form,
    errors,
    status,
    serverError,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCateringForm(companyId, showToast);

  // ── Success screen ──────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className={
          isModal
            ? "flex items-center justify-center px-4 py-10"
            : "min-h-screen flex items-center justify-center px-4 py-16"
        }
        style={{ backgroundColor: "#F5FAF9" }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div
            className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: "#5C9895" + "1A" }}
          >
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Request Received!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you,{" "}
            <span className="font-semibold text-gray-700">
              {form.fullName || "valued guest"}
            </span>
            ! We've received your catering inquiry and will be in touch within{" "}
            <span className="font-semibold">1–2 business days</span> to confirm
            the details.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#94C15B" }}
            >
              Submit Another Request
            </button>
            <button
              type="button"
              onClick={() => {
                if (isModal && onClose) {
                  onClose();
                  return;
                }
                window.location.href = "/";
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold transition hover:bg-gray-50"
            >
              {isModal ? "Close" : "Back to Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <>
      <ToastHub toasts={toasts} />
      <div
        className={isModal ? "py-8 px-4 sm:px-6" : "min-h-screen py-12 px-4"}
        style={{ backgroundColor: "#F5FAF9" }}
      >
        {/* Header Banner */}
        <div
          className="max-w-2xl mx-auto rounded-2xl px-8 py-10 mb-8 text-white text-center shadow-md"
          style={{ backgroundColor: "#5C9895" }}
        >
          <h1 className="text-xl md:text-2xl font-bold mb-3">
            Book Our Catering Services
          </h1>
          <p className="text-sm opacity-90 max-w-md mx-auto leading-relaxed">
            Fill out the form below and our team will reach out to craft the
            perfect menu for your special occasion.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10"
        >
          {/* ── Section 1: Contact Information ── */}
          <section>
            <SectionHeading
              step="1"
              title="Contact Information"
              subtitle="How should we reach you?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Full Name" required error={errors.fullName}>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className={inputClass(!!errors.fullName)}
                  />
                </Field>
              </div>

              <Field label="Email Address" required error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field label="Phone Number" required error={errors.phone}>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={inputClass(!!errors.phone)}
                />
              </Field>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* ── Section 2: Event Details ── */}
          <section>
            <SectionHeading
              step="2"
              title="Event Details"
              subtitle="Tell us about your event so we can prepare accordingly."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event Type */}
              <div className="sm:col-span-2">
                <Field label="Type of Event" required error={errors.eventType}>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className={inputClass(!!errors.eventType)}
                  >
                    <option value="">Select event type…</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Event Date */}
              <Field label="Event Date" required error={errors.eventDate}>
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  min={today()}
                  className={inputClass(!!errors.eventDate)}
                />
              </Field>

              {/* Preferred Time */}
              <Field
                label="Preferred Time"
                required
                error={errors.preferredTime}
              >
                <input
                  type="time"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className={inputClass(!!errors.preferredTime)}
                />
              </Field>

              {/* Number of Guests */}
              <Field
                label="Number of Guests"
                required
                error={errors.guestCount}
              >
                <input
                  type="number"
                  name="guestCount"
                  value={form.guestCount}
                  onChange={handleChange}
                  placeholder="e.g. 75"
                  min="1"
                  className={inputClass(!!errors.guestCount)}
                />
              </Field>

              {/* Event Location */}
              <div className="sm:col-span-2">
                <Field
                  label="Event Location / Venue Address"
                  required
                  error={errors.eventLocation}
                >
                  <input
                    type="text"
                    name="eventLocation"
                    value={form.eventLocation}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State 00000  — or  Venue Name"
                    className={inputClass(!!errors.eventLocation)}
                  />
                </Field>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* ── Section 3: Service Style ── */}
          <section>
            <SectionHeading
              step="3"
              title="Service Style"
              subtitle="Choose the catering format that fits your event."
            />

            {errors.serviceStyle && (
              <p className="text-xs text-red-500 mb-3">{errors.serviceStyle}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_OPTIONS.map((opt) => {
                const selected = form.serviceStyle === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`relative flex flex-col gap-2 rounded-xl border-2 p-5 cursor-pointer transition select-none
                    ${
                      selected
                        ? "border-[#5C9895] bg-[#5C9895]/5"
                        : "border-gray-200 bg-white hover:border-[#5C9895]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceStyle"
                      value={opt.value}
                      checked={selected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {/* Check indicator */}
                    <span
                      className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                      ${selected ? "border-[#5C9895] bg-[#5C9895]" : "border-gray-300"}`}
                    >
                      {selected && (
                        <svg
                          className="w-3 h-3 text-white"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <path
                            d="M10 3L5 8.5 2 5.5"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500 leading-relaxed">
                      {opt.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* ── Section 4: Additional Notes ── */}
          <section>
            <SectionHeading
              step="4"
              title="Additional Notes"
              subtitle="Dietary restrictions, special requests, or anything else we should know."
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="e.g. Nut allergy for 10 guests, need vegetarian options, outdoor setup..."
              className={`${inputClass(false)} resize-none`}
            />
          </section>

          {/* ── Server Error ── */}
          {status === "error" && serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition
            hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#94C15B" }}
          >
            {status === "submitting" ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Submitting…
              </span>
            ) : (
              "Submit Catering Request"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            We typically respond within 1–2 business days. For urgent inquiries,
            please call us directly.
          </p>
        </form>
      </div>
    </>
  );
}
