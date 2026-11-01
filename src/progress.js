export const STORAGE_KEY = "english-quest";
export const emptyProgress = () => ({ xp: 0, sessions: [], topic: "festival" });
export function loadProgress(raw) {
  if (raw === null) return emptyProgress();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      "Os dados salvos não puderam ser lidos. Eles foram mantidos intactos.",
    );
  }
  if (
    !data ||
    !Number.isFinite(data.xp) ||
    data.xp < 0 ||
    !Array.isArray(data.sessions)
  ) {
    throw new Error(
      "Os dados salvos não puderam ser lidos. Eles foram mantidos intactos.",
    );
  }
  // Preserve the original records, unknown fields and totals: never reconstruct XP
  // from history or discard a legacy session during an upgrade.
  return { ...emptyProgress(), ...data };
}
export function complete(progress, session) {
  const duplicate = progress.sessions.some(
    (s) =>
      s?.id === session.id &&
      (session.activityId ? true : s.date === session.date),
  );
  if (duplicate) return progress;
  return {
    ...progress,
    xp: progress.xp + session.xp,
    sessions: [...progress.sessions, session],
  };
}
export function readProgress(storage) {
  try {
    return { progress: loadProgress(storage.getItem(STORAGE_KEY)), error: "" };
  } catch (error) {
    return {
      progress: emptyProgress(),
      error: storage
        ? "Não foi possível ler os dados salvos. Eles foram mantidos intactos."
        : "Armazenamento indisponível neste navegador.",
    };
  }
}
export function writeProgress(storage, transform) {
  // Read immediately before writing, so a stale tab cannot replace newer XP or
  // history. Refuse to overwrite unreadable existing data or failed storage.
  const latest = loadProgress(storage.getItem(STORAGE_KEY));
  const next = transform(latest);
  if (next !== latest) storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export const level = (xp) => Math.floor(xp / 100) + 1;
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
