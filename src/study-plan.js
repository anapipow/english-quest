import { activities } from "./activities.js";
import { localDate } from "./progress.js";
const modeOrder = ["conversation", "listening", "reading", "challenge"];
const dayNumber = (date) =>
  Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
// Recognize MVP voice records without changing any legacy history.
function activityId(session) {
  return (
    session?.activityId ||
    (/^(.*)-(full|quick)$/.test(session?.id || "")
      ? session.id.replace(
          /-(full|quick)$/,
          (_, kind) => `-conversation-${kind === "full" ? 1 : 2}`,
        )
      : null)
  );
}
function latestDay(p, id) {
  return Math.max(
    -Infinity,
    ...p.sessions
      .filter((s) => activityId(s) === id)
      .map((s) => dayNumber(s.date))
      .filter(Number.isFinite),
  );
}
export function chooseActivity(
  p,
  { date = localDate(), exclude = [], modes = modeOrder, previous = [] } = {},
) {
  const pool = activities.filter(
    (a) => !exclude.includes(a.id) && modes.includes(a.mode),
  );
  const day = dayNumber(date);
  const rank = (a) => {
    const last = latestDay(p, a.id);
    return [
      Number(last !== -Infinity),
      Number(day - last < 3),
      Number(previous.includes(a.id)),
      last === -Infinity ? 0 : last,
      Number(a.topic !== p.topic),
      (activities.indexOf(a) + day) % activities.length,
    ];
  };
  return pool.sort((a, b) => {
    const x = rank(a),
      y = rank(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
    return a.id.localeCompare(b.id);
  })[0];
}
export function ensureDailyPlan(p, date = localDate()) {
  const old = p.dailyPlan;
  const sameDay =
    old?.date === date && Array.isArray(old.slots) && old.slots.length === 3;
  const slots = sameDay
    ? old.slots.map((slot) => ({ ...slot }))
    : Array(3).fill(null);
  const previous = Array.isArray(old?.slots)
    ? old.slots.map((s) => s?.activityId)
    : [];
  const expired = slots.map(
    (slot) =>
      !slot ||
      !activities.some((a) => a.id === slot.activityId) ||
      !Number.isInteger(slot.assignedAfter) ||
      slot.assignedAfter < 0 ||
      slot.assignedAfter > p.sessions.length ||
      p.sessions
        .slice(slot.assignedAfter)
        .some((s) => activityId(s) === slot.activityId),
  );
  if (sameDay && !expired.some(Boolean)) return p;
  const reserved = slots.filter((_, i) => !expired[i]).map((s) => s.activityId);
  for (let i = 0; i < slots.length; i++) {
    if (!expired[i]) continue;
    const usedModes = reserved.map(
      (id) => activities.find((a) => a.id === id).mode,
    );
    const availableModes = modeOrder.filter((m) => !usedModes.includes(m));
    const preferredMode = !sameDay
      ? modeOrder[(dayNumber(date) + i) % 4]
      : null;
    const candidate = chooseActivity(p, {
      date,
      exclude: [
        ...reserved,
        ...(sameDay && slots[i] ? [slots[i].activityId] : []),
      ],
      modes: preferredMode ? [preferredMode] : availableModes,
      previous,
    });
    slots[i] = { activityId: candidate.id, assignedAfter: p.sessions.length };
    reserved.push(candidate.id);
  }
  return { ...p, dailyPlan: { date, slots } };
}
export function nextActivity(p, previousId, date = localDate()) {
  const previous = activities.find((a) => a.id === previousId);
  return chooseActivity(p, {
    date,
    exclude: previousId ? [previousId] : [],
    modes: previous ? modeOrder.filter((m) => m !== previous.mode) : modeOrder,
  });
}
export function trailActivities(p, date = localDate()) {
  return ensureDailyPlan(p, date).dailyPlan.slots.map((s) =>
    activities.find((a) => a.id === s.activityId),
  );
}
