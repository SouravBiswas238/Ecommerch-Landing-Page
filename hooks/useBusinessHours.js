import { useCallback, useMemo } from "react";

const parseTimeToMinutes = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    return null;
  }

  const normalizedTime = timeString.trim().toLowerCase();

  // Supports: "7:30am", "7:30 am", "5:00pm"
  const twelveHourMatch = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3];

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
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

  // Supports: "07:30", "17:00", "17:00:00"
  const twentyFourHourMatch = normalizedTime.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?$/,
  );

  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
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

const getCurrentDateTimeInTimeZone = (timeZone) => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const weekdayPart = parts.find((part) => part.type === "weekday");

    const hourPart = parts.find((part) => part.type === "hour");

    const minutePart = parts.find((part) => part.type === "minute");

    const hours = Number(hourPart?.value);
    const minutes = Number(minutePart?.value);

    if (!weekdayPart?.value || Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return {
      currentDay: weekdayPart.value.toLowerCase(),
      currentMinutes: hours * 60 + minutes,
    };
  } catch (error) {
    console.error("Invalid timezone:", timeZone, error);
    return null;
  }
};

const checkScheduleIsOpen = (schedule, currentMinutes) => {
  if (schedule?.full_day_close === true) {
    return false;
  }

  const openingMinutes = parseTimeToMinutes(schedule?.start_time);

  const closingMinutes = parseTimeToMinutes(schedule?.end_time);

  if (openingMinutes === null || closingMinutes === null) {
    return null;
  }

  // Same start and end time means open 24 hours.
  if (openingMinutes === closingMinutes) {
    return true;
  }

  // Normal schedule: 7:30 AM to 5:00 PM
  if (openingMinutes < closingMinutes) {
    return currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
  }

  // Overnight schedule: 6:00 PM to 2:00 AM
  return currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
};

const createBusinessHoursLabel = (settings) => {
  const labels = settings
    .filter((setting) => setting?.full_day_close !== true)
    .map((setting) => {
      const openingLabel = formatTimeLabel(setting?.start_time);

      const closingLabel = formatTimeLabel(setting?.end_time);

      if (!openingLabel || !closingLabel) {
        return null;
      }

      return `${openingLabel} to ${closingLabel}`;
    })
    .filter(Boolean);

  // Remove duplicate time labels.
  return [...new Set(labels)].join(" or ");
};

const getLatestCloseMessage = (settings) => {
  const sortedSettings = [...settings].sort((first, second) => {
    const firstDate = new Date(
      first?.updated_at || first?.created_at || 0,
    ).getTime();

    const secondDate = new Date(
      second?.updated_at || second?.created_at || 0,
    ).getTime();

    return secondDate - firstDate;
  });

  return (
    sortedSettings.find((setting) => setting?.close_hour_bot_message)
      ?.close_hour_bot_message || ""
  );
};

export const useBusinessHours = (companyData, openSettings = []) => {
  // Use the company timezone when available.
  // Otherwise default to Jamaica.
  const companyTimeZone = companyData?.timezone || "America/Jamaica";

  const getTodayBusinessHours = useCallback(() => {
    const currentDateTime = getCurrentDateTimeInTimeZone(companyTimeZone);

    if (!currentDateTime) {
      return {
        currentDay: "",
        currentMinutes: null,
        settings: [],
      };
    }

    const todaySettings = openSettings.filter(
      (setting) =>
        setting?.is_active !== false &&
        String(setting?.open_day || "").toLowerCase() ===
          currentDateTime.currentDay,
    );

    return {
      currentDay: currentDateTime.currentDay,
      currentMinutes: currentDateTime.currentMinutes,
      settings: todaySettings,
    };
  }, [companyTimeZone, openSettings]);

  const currentBusinessHours = useMemo(
    () => getTodayBusinessHours(),
    [getTodayBusinessHours],
  );

  const businessHoursLabel = useMemo(
    () => createBusinessHoursLabel(currentBusinessHours.settings),
    [currentBusinessHours.settings],
  );

  const checkIsOpenNow = useCallback(() => {
    const { currentMinutes, settings: todaySettings } = getTodayBusinessHours();

    /*
     * Preserve your previous fail-open behavior:
     * do not block checkout when API data is missing.
     */
    if (currentMinutes === null || todaySettings.length === 0) {
      return true;
    }

    const scheduleResults = todaySettings
      .map((setting) => checkScheduleIsOpen(setting, currentMinutes))
      .filter((result) => result !== null);

    /*
     * Do not block checkout when every schedule has
     * invalid start or end time.
     */
    if (scheduleResults.length === 0) {
      return true;
    }

    /*
     * Branch is ignored.
     * Checkout is allowed when any schedule for the
     * current day is open.
     */
    return scheduleResults.some((isOpen) => isOpen === true);
  }, [getTodayBusinessHours]);

  const validateBusinessHours = useCallback(() => {
    const { settings: todaySettings } = getTodayBusinessHours();

    const allowed = checkIsOpenNow();

    if (allowed) {
      return {
        allowed: true,
        message: "",
      };
    }

    const closeMessage = getLatestCloseMessage(todaySettings);

    const todayBusinessHoursLabel = createBusinessHoursLabel(todaySettings);

    return {
      allowed: false,
      message:
        closeMessage ||
        (todayBusinessHoursLabel
          ? `Please order between ${todayBusinessHoursLabel}.`
          : "Please order during our business hours."),
    };
  }, [checkIsOpenNow, getTodayBusinessHours]);

  return {
    businessHoursLabel,
    checkIsOpenNow,
    validateBusinessHours,
  };
};
