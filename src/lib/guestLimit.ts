// guestLimit.ts
type GuestUsage = {
  count: number;
  date: string; // YYYY-MM-DD
};

const guestUsageMap = new Map<string, GuestUsage>();
const GUEST_MESSAGE_LIMIT = 1;

export function checkGuestLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-24"

  const usage = guestUsageMap.get(ip);

  if (!usage || usage.date !== today) {
    // reset for new day
    guestUsageMap.set(ip, { count: 1, date: today });
    return { allowed: true, remaining: GUEST_MESSAGE_LIMIT - 1 };
  }

  if (usage.count >= GUEST_MESSAGE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  usage.count += 1;
  guestUsageMap.set(ip, usage);
  return { allowed: true, remaining: GUEST_MESSAGE_LIMIT - usage.count };
}
