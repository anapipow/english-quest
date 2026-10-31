import test from "node:test";
import assert from "node:assert/strict";
import {
  complete,
  loadProgress,
  emptyProgress,
  level,
  localDate,
} from "../src/progress.js";
test("damaged storage recovers safely", () => {
  for (const v of [null, "bad", "{}", '{"xp":-1,"sessions":[]}'])
    assert.deepEqual(loadProgress(v), emptyProgress());
});
test("same mission awards XP once per local day and retains progress across gaps", () => {
  const s = { id: "travel-full", date: "2026-10-31", xp: 40, topic: "travel" };
  const p = complete(emptyProgress(), s);
  assert.equal(p.xp, 40);
  assert.equal(complete(p, s).xp, 40);
  const next = complete(p, { ...s, date: "2026-11-05" });
  assert.equal(next.xp, 80);
  assert.equal(next.sessions.length, 2);
  assert.equal(loadProgress(JSON.stringify(next)).xp, 80);
});
test("quick and full sessions are separate; levels advance at 100 XP", () => {
  let p = complete(emptyProgress(), {
    id: "travel-quick",
    date: "2026-10-31",
    xp: 20,
  });
  p = complete(p, { id: "travel-full", date: "2026-10-31", xp: 40 });
  assert.equal(p.xp, 60);
  assert.equal(level(99), 1);
  assert.equal(level(100), 2);
  assert.equal(localDate(new Date(2026, 0, 2, 23)), "2026-01-02");
});
