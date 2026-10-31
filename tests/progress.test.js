import test from "node:test";
import assert from "node:assert/strict";
import {
  complete,
  loadProgress,
  emptyProgress,
  level,
  localDate,
  writeProgress,
  readProgress,
  STORAGE_KEY,
} from "../src/progress.js";
import {
  activities,
  filterActivities,
  dailyTrail,
  suggestNext,
  activityPrompt,
} from "../src/activities.js";
const legacy = {
  xp: 40,
  topic: "festival",
  sessions: [
    {
      id: "festival-full",
      date: "2026-10-31",
      topic: "festival",
      quick: false,
      xp: 40,
      reflection: "I spoke today!",
    },
  ],
  achievements: ["first-conversation"],
  settings: { audio: "en-GB" },
  futureField: "keep me",
};
function memory(initial) {
  let raw = initial;
  return {
    getItem: (key) => {
      assert.equal(key, STORAGE_KEY);
      return raw;
    },
    setItem: (key, value) => {
      assert.equal(key, STORAGE_KEY);
      raw = value;
    },
    raw: () => raw,
  };
}
test("legacy 40 XP, history, reflections and unknown fields survive read and first v2 completion", () => {
  const storage = memory(JSON.stringify(legacy));
  assert.deepEqual(loadProgress(storage.raw()), legacy);
  const session = {
    id: "attempt-1",
    activityId: "festival-reading-1",
    mode: "reading",
    topic: "festival",
    date: "2026-10-31",
    xp: 15,
  };
  const next = writeProgress(storage, (p) => complete(p, session));
  assert.equal(next.xp, 55);
  assert.deepEqual(next.sessions[0], legacy.sessions[0]);
  assert.deepEqual(next.settings, legacy.settings);
  assert.deepEqual(next.achievements, legacy.achievements);
  assert.equal(next.futureField, "keep me");
  assert.equal(loadProgress(storage.raw()).sessions.length, 2);
  assert.equal(legacy.xp, 40);
});
test("repeat same activity in same day awards XP for each distinct attempt, but never twice for the same attempt", () => {
  const session = {
    id: "one",
    activityId: "travel-reading-1",
    mode: "reading",
    date: "2026-10-31",
    xp: 15,
  };
  let p = complete(emptyProgress(), session);
  assert.equal(complete(p, session), p);
  assert.equal(complete(p, { ...session, date: "2026-11-01" }), p);
  p = complete(p, { ...session, id: "two" });
  assert.equal(p.xp, 30);
  assert.equal(p.sessions.length, 2);
});
test("legacy duplicate semantics and levels remain compatible", () => {
  let p = loadProgress(JSON.stringify(legacy));
  assert.equal(complete(p, legacy.sessions[0]), p);
  p = complete(p, { ...legacy.sessions[0], date: "2026-11-03" });
  assert.equal(p.xp, 80);
  assert.equal(level(99), 1);
  assert.equal(level(100), 2);
  assert.equal(localDate(new Date(2026, 0, 2, 23)), "2026-01-02");
});
test("unreadable storage is never reset or overwritten", () => {
  for (const raw of ["broken", "{}", '{"xp":-1,"sessions":[]}']) {
    const storage = memory(raw);
    assert.ok(readProgress(storage).error);
    assert.throws(() =>
      writeProgress(storage, (p) => ({ ...p, topic: "travel" })),
    );
    assert.equal(storage.raw(), raw);
  }
  assert.deepEqual(loadProgress(null), emptyProgress());
});
test("storage write failure keeps original data", () => {
  const raw = JSON.stringify(legacy);
  const storage = {
    getItem: () => raw,
    setItem: () => {
      throw new Error("Quota exceeded");
    },
  };
  assert.throws(() =>
    writeProgress(storage, (p) =>
      complete(p, { id: "new", activityId: "x", xp: 10 }),
    ),
  );
  assert.equal(storage.getItem(), raw);
});
test("updates read the latest record instead of replacing history from a stale tab", () => {
  const storage = memory(JSON.stringify(legacy));
  const first = { id: "one", activityId: "a", date: "2026-10-31", xp: 10 };
  const second = { id: "two", activityId: "b", date: "2026-10-31", xp: 20 };
  writeProgress(storage, (p) => complete(p, first));
  writeProgress(storage, (p) => complete(p, second));
  const p = writeProgress(storage, (p) => complete(p, first));
  assert.equal(p.xp, 70);
  assert.equal(p.sessions.length, 3);
});
test("35 unique activities have valid A2-B1 content, answers, durations and original voice scenarios", () => {
  assert.equal(activities.length, 35);
  assert.equal(new Set(activities.map((a) => a.id)).size, 35);
  for (const a of activities) {
    assert.ok(a.minutes >= 2 && a.minutes <= 15);
    assert.ok(a.xp > 0);
    if (a.questions) {
      assert.ok(a.questions.length >= 1);
      for (const q of a.questions) {
        assert.ok(q.options[q.answer]);
        assert.ok(q.explanation);
      }
    } else assert.match(activityPrompt(a), /A2–B1/);
  }
  assert.equal(
    new Set(
      activities.filter((a) => a.mode === "conversation").map(activityPrompt),
    ).size,
    10,
  );
});
test("filters compose, empty combinations exist, trail contains three short activities and next suggestions progress", () => {
  const filtered = filterActivities({
    topic: "festival",
    mode: "reading",
    duration: "short",
  });
  assert.equal(filtered.length, 2);
  assert.ok(
    filtered.every(
      (a) => a.topic === "festival" && a.mode === "reading" && a.minutes <= 5,
    ),
  );
  assert.equal(
    filterActivities({ mode: "reading", duration: "long" }).length,
    0,
  );
  const trail = dailyTrail("festival", "2026-10-31");
  assert.equal(trail.length, 3);
  assert.ok(trail.every((a) => a.minutes <= 5));
  assert.equal(new Set(trail.map((a) => a.mode)).size, 3);
  const p = {
    ...emptyProgress(),
    sessions: [{ id: "x", activityId: activities[0].id }],
  };
  assert.notEqual(suggestNext(p).id, activities[0].id);
});
