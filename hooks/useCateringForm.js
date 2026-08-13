import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Replace this with your real API endpoint
// ─────────────────────────────────────────────────────────────────────────────
const API_ENDPOINT = "https://your-api.com/catering-request";

const INITIAL_STATE = {
  // Contact
  fullName: "",
  email: "",
  phone: "",
  // Event
  eventType: "",
  eventDate: "",
  eventLocation: "",
  guestCount: "",
  // Service
  serviceStyle: "",
  // Extra
  notes: "",
};

const REQUIRED_FIELDS = [
  "fullName",
  "email",
  "phone",
  "eventType",
  "eventDate",
  "eventLocation",
  "guestCount",
  "serviceStyle",
];

function validate(form) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!form[field] || String(form[field]).trim() === "") {
      errors[field] = "This field is required.";
    }
  });

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (form.phone && !/^[\d\s\-+().]{7,20}$/.test(form.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (form.guestCount && (isNaN(form.guestCount) || Number(form.guestCount) < 1)) {
    errors.guestCount = "Please enter a valid number of guests.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (form.eventDate && new Date(form.eventDate) < today) {
    errors.eventDate = "Event date must be today or in the future.";
  }

  return errors;
}

export function useCateringForm() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector("[data-error='true']");
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guestCount: Number(form.guestCount),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setStatus("success");
      setForm(INITIAL_STATE);
      setErrors({});
    } catch (err) {
      setStatus("error");
      setServerError(
        "Something went wrong submitting your request. Please try again or contact us directly."
      );
    }
  }

  function resetForm() {
    setForm(INITIAL_STATE);
    setErrors({});
    setStatus("idle");
    setServerError("");
  }

  return { form, errors, status, serverError, handleChange, handleSubmit, resetForm };
}
