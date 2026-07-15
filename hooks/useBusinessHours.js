import { useCallback, useMemo } from "react";

const parseTimeToMinutes = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    return null;
  }

  const normalizedTime = timeString.trim().toLowerCase();

  // Supports: "7:30am", "7:30 am", "5:00pm"
  const twelveHourMatch = normalizedTime.match(
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/,
  );

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3];

    if (
      hours < 1 ||
      hours > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    if (period === "am" && hours === 12) {
      hours = 0;
    }

    if (period === "pm" && hours !== 12) {
      hours += 12;
    }

    return hours * 60 + minutes;
  }

  // Also supports: "07:30", "17:00", "17:00:00"
  const twentyFourHourMatch = normalizedTime.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?$/,
  );

  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);

    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    return hours * 60 + minutes;
  }

  return null;
};

const formatTimeLabel = (timeString) => {
  const totalMinutes = parseTimeToMinutes(timeString);

  if (totalMinutes === null) {
    return "";
  }

  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getCurrentMinutesInTimeZone = (timeZone) => {
  if (!timeZone) {
    return null;
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    

    const hourPart = parts.find((part) => part.type === "hour");
    const minutePart = parts.find((part) => part.type === "minute");

    const hours = Number(hourPart?.value);
    const minutes = Number(minutePart?.value);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return hours * 60 + minutes;
  } catch (error) {
    console.error("Invalid company timezone:", timeZone, error);
    return null;
  }
};

export const useBusinessHours = (companyData) => {
  /*
   * Expected structure:
   *
   * companyData.timezone = "America/Jamaica"
   *
   * companyData.attributes.business_hours = {
   *   opening: "7:30am",
   *   closing: "5:00pm"
   * }
   */

  const businessHours =
    companyData?.attributes?.business_hours;

  const openingTime = businessHours?.opening;
  const closingTime = businessHours?.closing;
  const companyTimeZone = companyData?.timezone;

  const openingMinutes = useMemo(
    () => parseTimeToMinutes(openingTime),
    [openingTime],
  );

  const closingMinutes = useMemo(
    () => parseTimeToMinutes(closingTime),
    [closingTime],
  );

  const businessHoursLabel = useMemo(() => {
    const openingLabel = formatTimeLabel(openingTime);
    const closingLabel = formatTimeLabel(closingTime);

    if (!openingLabel || !closingLabel) {
      return "";
    }

    return `${openingLabel} to ${closingLabel}`;
  }, [openingTime, closingTime]);

  const checkIsOpenNow = useCallback(() => {
    /*
     * Do not block ordering when business-hour
     * configuration is missing or invalid.
     */
    if (
      openingMinutes === null ||
      closingMinutes === null ||
      !companyTimeZone
    ) {
      return true;
    }

    const currentMinutes =
      getCurrentMinutesInTimeZone(companyTimeZone);

    if (currentMinutes === null) {
      return true;
    }

    // Same opening and closing time means open 24 hours.
    if (openingMinutes === closingMinutes) {
      return true;
    }

    /*
     * Normal schedule:
     * 7:30 AM to 5:00 PM
     */
    if (openingMinutes < closingMinutes) {
      return (
        currentMinutes >= openingMinutes &&
        currentMinutes < closingMinutes
      );
    }

    /*
     * Overnight schedule:
     * 6:00 PM to 2:00 AM
     */
    return (
      currentMinutes >= openingMinutes ||
      currentMinutes < closingMinutes
    );
  }, [
    openingMinutes,
    closingMinutes,
    companyTimeZone,
  ]);

  const validateBusinessHours = useCallback(() => {
    const allowed = checkIsOpenNow();

    if (allowed) {
      return {
        allowed: true,
        message: "",
      };
    }

    return {
      allowed: false,
      message: businessHoursLabel
        ? `Please order between ${businessHoursLabel}.`
        : "Please order during our business hours.",
    };
  }, [businessHoursLabel, checkIsOpenNow]);

  return {
    businessHoursLabel,
    checkIsOpenNow,
    validateBusinessHours,
  };
};