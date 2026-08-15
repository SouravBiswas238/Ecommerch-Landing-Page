import { useState } from "react";
import { createPublicAppointment } from "@/lib/api";

const INITIAL_STATE = {
  fullName: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  preferredTime: "15:30",
  eventLocation: "",
  guestCount: "",
  serviceStyle: "",
  notes: "",
};

const REQUIRED_FIELDS = [
  "fullName",
  "email",
  "phone",
  "eventType",
  "eventDate",
  "preferredTime",
  "eventLocation",
  "guestCount",
  "serviceStyle",
];

const EVENT_TYPE_LABELS = {
  wedding: "Wedding",
  birthday: "Birthday Party",
  corporate: "Corporate Event",
  repast: "Repast",
  baby_shower: "Baby Shower",
  bridal_shower: "Bridal Shower",
  graduation: "Graduation Party",
  anniversary: "Anniversary",
  holiday: "Holiday Gathering",
  other: "Other",
};

const SERVICE_STYLE_LABELS = {
  buffet: "Buffet",
  packaged: "Packaged Catering",
};

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

  if (
    form.guestCount &&
    (isNaN(form.guestCount) || Number(form.guestCount) < 1)
  ) {
    errors.guestCount = "Please enter a valid number of guests.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (form.eventDate && new Date(form.eventDate) < today) {
    errors.eventDate = "Event date must be today or in the future.";
  }

  if (form.preferredTime && !/^\d{2}:\d{2}$/.test(form.preferredTime)) {
    errors.preferredTime = "Please choose a valid time.";
  }

  return errors;
}

export function useCateringForm(companyId, showToast = () => {}) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast(
        "Please complete all required fields before submitting.",
        "warning",
      );
      const firstErrorField = document.querySelector("[data-error='true']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!companyId) {
      setStatus("error");
      setServerError(
        "Company information is unavailable right now. Please refresh the page and try again.",
      );
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const appointmentDatetime = new Date(
        `${form.eventDate}T${form.preferredTime}:00`,
      ).toISOString();

      const payload = {
        company: Number(companyId),
        name: form.fullName,
        email: form.email,
        phone_number: form.phone,
        appointment_datetime: appointmentDatetime,
        customer_appointment_notes: form.notes || "",
        event: {
          company: Number(companyId),
          event_type: EVENT_TYPE_LABELS[form.eventType] || form.eventType,
          number_of_attendees: Number(form.guestCount),
          event_address: form.eventLocation,
          service_style:
            SERVICE_STYLE_LABELS[form.serviceStyle] || form.serviceStyle,
        },
      };

      await createPublicAppointment(payload);

      setStatus("success");
      setForm(INITIAL_STATE);
      setErrors({});
    } catch (err) {
      console.error("Public appointment submission failed:", err);
      setStatus("error");
      setServerError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Something went wrong submitting your request. Please try again or contact us directly.",
      );
    }
  }

  function resetForm() {
    setForm(INITIAL_STATE);
    setErrors({});
    setStatus("idle");
    setServerError("");
  }

  return {
    form,
    errors,
    status,
    serverError,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
