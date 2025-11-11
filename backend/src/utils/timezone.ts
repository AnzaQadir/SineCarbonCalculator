/**
 * Timezone utilities for Asia/Karachi (PKT = UTC+5)
 */

/**
 * Get start of today in Asia/Karachi timezone
 */
export function startOfTodayInKarachi(): Date {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  // PKT is UTC+5, so subtract 5 hours to get to PKT midnight
  todayStart.setUTCHours(todayStart.getUTCHours() - 5);
  return todayStart;
}

/**
 * Get end of today in Asia/Karachi timezone
 */
export function endOfTodayInKarachi(): Date {
  const todayStart = startOfTodayInKarachi();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);
  return todayEnd;
}

/**
 * Check if it's a sprint week (example: last week of month)
 */
export function isSprintWeek(userId: string): boolean {
  // Simple implementation - can be enhanced
  const now = new Date();
  const dayOfMonth = now.getDate();
  return dayOfMonth >= 25; // Last week of month
}

/**
 * Check if it's month end
 */
export function isMonthEnd(): boolean {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return dayOfMonth >= daysInMonth - 2; // Last 2 days of month
}




