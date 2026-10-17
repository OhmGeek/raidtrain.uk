export const POLL_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes

/**
 * Back-to-back slots for the same channel (e.g. a 4-hour stream booked as two
 * 2-hour slots) are shown as one longer slot.
 */
function mergeConsecutiveSlots(entries) {
  const merged = []
  for (const entry of entries) {
    const prev = merged[merged.length - 1]
    const sameChannel = prev?.twitch_channel.toLowerCase() === entry.twitch_channel.toLowerCase()
    if (sameChannel && new Date(prev.end_time_utc).getTime() === new Date(entry.start_time_utc).getTime()) {
      merged[merged.length - 1] = { ...prev, end_time_utc: entry.end_time_utc }
    } else {
      merged.push(entry)
    }
  }
  return merged
}

export async function fetchSchedule() {
  // Cache-bust so we always get the latest version during an event
  const res = await fetch(`/schedule.json?_=${Date.now()}`)
  if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`)
  const data = await res.json()
  // Schedule is a bare array
  return Array.isArray(data) ? mergeConsecutiveSlots(data) : []
}

/**
 * Given a schedule array and the current UTC timestamp, return the index of
 * the active slot (startTimeUtc <= now < endTimeUtc).  Returns -1 if the
 * event hasn't started yet, and schedule.length when it has ended.
 */
export function getActiveIndex(schedule, now) {
  for (let i = 0; i < schedule.length; i++) {
    const start = new Date(schedule[i].start_time_utc).getTime()
    const end = new Date(schedule[i].end_time_utc).getTime()
    if (now >= start && now < end) return i
  }
  // Before event starts
  if (schedule.length > 0 && now < new Date(schedule[0].start_time_utc).getTime()) return -1
  // After event ends (or past the last slot)
  return schedule.length > 0 ? schedule.length : -1
}
