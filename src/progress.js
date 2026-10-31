export const emptyProgress = () => ({ xp: 0, sessions: [], topic: "festival" });
export function loadProgress(raw) {
  try {
    const p = JSON.parse(raw);
    if (!p || !Number.isFinite(p.xp) || p.xp < 0 || !Array.isArray(p.sessions))
      return emptyProgress();
    return {
      ...emptyProgress(),
      ...p,
      sessions: p.sessions.filter(
        (s) =>
          s &&
          typeof s.id === "string" &&
          typeof s.date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
          Number.isFinite(s.xp) &&
          s.xp >= 0,
      ),
    };
  } catch {
    return emptyProgress();
  }
}
export function complete(p, session) {
  if (p.sessions.some((s) => s.id === session.id && s.date === session.date))
    return p;
  return { ...p, xp: p.xp + session.xp, sessions: [...p.sessions, session] };
}
export const level = (xp) => Math.floor(xp / 100) + 1;
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
