import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

import january from "@/assets/months/january.jpg";
import february from "@/assets/months/february.jpg";
import march from "@/assets/months/march.jpg";
import april from "@/assets/months/april.jpg";
import may from "@/assets/months/may.jpg";
import june from "@/assets/months/june.jpg";
import july from "@/assets/months/july.jpg";
import august from "@/assets/months/august.jpg";
import september from "@/assets/months/september.jpg";
import october from "@/assets/months/october.jpg";
import november from "@/assets/months/november.jpg";
import december from "@/assets/months/december.jpg";

export const SEASONAL_MONTH_IMAGES: Record<number, string> = {
  0: january,
  1: february,
  2: march,
  3: april,
  4: may,
  5: june,
  6: july,
  7: august,
  8: september,
  9: october,
  10: november,
  11: december,
};

export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "07-04": "Independence Day",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export function getHoliday(date: Date): string | undefined {
  const key = format(date, "MM-dd");
  return HOLIDAYS[key];
}

export function getCalendarDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd });
}

export function isInRange(
  day: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
  const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
  return isWithinInterval(day, { start, end });
}

export function isRangeStart(
  day: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
  return isSameDay(day, start);
}

export function isRangeEnd(
  day: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
  return isSameDay(day, end);
}

export { isSameMonth, isSameDay, isToday, format, addMonths, subMonths };
