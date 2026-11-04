// Run with: node doses-demo/logic.test.js
// These mirror the unit tests of the iPhone app's DoseCore package.
const assert = require("node:assert/strict");
const L = require("./logic.js");

const d = (day, h, m) => new Date(2026, 10, day, h, m || 0).getTime(); // Nov <day>, 2026, local time
const state = (log, occ, now) => L.status(log, occ, now).state;
let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log("ok  " + name);
}

test("defaults are two doses a day, twelve hours apart", () => {
  const occ = L.occurrencesOn(L.defaultSchedule(), d(2, 12));
  assert.deepEqual(occ.map((o) => o.title), ["Morning", "Evening"]);
  assert.equal(occ[1].dueAt - occ[0].dueAt, 12 * 3600000);
});

test("status goes upcoming, due, missed, then taken", () => {
  const log = L.newLog(d(2, 0));
  const morning = L.today(log, d(2, 7))[0];
  assert.equal(state(log, morning, d(2, 7)), "upcoming");
  assert.equal(state(log, morning, d(2, 8, 30)), "due");
  assert.equal(state(log, morning, d(2, 10, 1)), "missed");
  L.markTaken(log, morning, d(2, 8, 4));
  assert.deepEqual(L.status(log, morning, d(2, 12)), { state: "taken", at: d(2, 8, 4) });
});

test("a dose taken after the grace window is late, not missed", () => {
  const log = L.newLog(d(2, 0));
  const morning = L.today(log, d(2, 7))[0];
  L.markTaken(log, morning, d(2, 11));
  assert.deepEqual(L.status(log, morning, d(2, 12)), { state: "takenLate", at: d(2, 11) });
});

test("the taken button opens an hour early and closes once recorded", () => {
  const log = L.newLog(d(2, 0));
  const morning = L.today(log, d(2, 7))[0];
  assert.equal(L.canMarkTaken(log, morning, d(2, 6, 59)), false);
  assert.equal(L.canMarkTaken(log, morning, d(2, 7)), true);
  L.markTaken(log, morning, d(2, 7));
  assert.equal(L.canMarkTaken(log, morning, d(2, 7, 5)), false);
});

test("undo restores the previous state", () => {
  const log = L.newLog(d(2, 0));
  const morning = L.today(log, d(2, 9))[0];
  L.markTaken(log, morning, d(2, 9));
  L.undoTaken(log, morning);
  assert.equal(state(log, morning, d(2, 9)), "due");
});

test("starting mid-day does not invent missed doses", () => {
  const log = L.newLog(d(2, 15));
  assert.equal(L.history(log, d(2, 16)).length, 0);
  assert.equal(L.lastMissedOrLate(log, d(2, 16)), null);
});

test("last missed finds the most recent missed or late dose", () => {
  const log = L.newLog(d(1, 0));
  const now = d(3, 12);
  // Day 1 evening: missed. Day 2 morning: late. Everything else on time.
  for (const occ of L.history(log, now).slice().reverse()) {
    if (occ.dueAt === d(1, 20)) continue;
    L.markTaken(log, occ, occ.dueAt === d(2, 8) ? d(2, 11) : occ.dueAt);
  }
  assert.equal(L.lastMissedOrLate(log, now).dueAt, d(2, 8));
  L.markTaken(log, { reminderId: "morning", title: "Morning", dueAt: d(2, 8) }, d(2, 8));
  assert.equal(L.lastMissedOrLate(log, now).dueAt, d(1, 20));
});

test("changing a time keeps recorded doses but restarts tracking", () => {
  const log = L.newLog(d(1, 0));
  L.markTaken(log, L.today(log, d(1, 9))[0], d(1, 8));
  const s = JSON.parse(JSON.stringify(log.schedule));
  s.reminders[0].hour = 9;
  L.changeSchedule(log, s, d(2, 12));
  const h = L.history(log, d(2, 13));
  assert.ok(h.some((o) => o.dueAt === d(1, 8)));
  assert.ok(!h.some((o) => o.dueAt === d(1, 20)));
});

test("a person can add, rename and remove reminders", () => {
  const s = L.defaultSchedule();
  s.reminders.push({ id: "x", title: "Lunch", hour: 12, minute: 30, isEnabled: true });
  assert.deepEqual(L.occurrencesOn(s, d(2, 6)).map((o) => o.title), ["Morning", "Lunch", "Evening"]);
  s.reminders[2].title = "Midday";
  s.reminders = s.reminders.filter((r) => r.title !== "Evening");
  assert.deepEqual(L.occurrencesOn(s, d(2, 6)).map((o) => o.title), ["Morning", "Midday"]);
});

test("a switched-off reminder has no doses", () => {
  const log = L.newLog(d(2, 0));
  const s = JSON.parse(JSON.stringify(log.schedule));
  s.reminders[1].isEnabled = false;
  L.changeSchedule(log, s, d(2, 0));
  assert.deepEqual(L.today(log, d(2, 7)).map((o) => o.title), ["Morning"]);
});

test("two reminders at the same time are tracked separately", () => {
  const log = L.newLog(d(2, 0));
  const s = JSON.parse(JSON.stringify(log.schedule));
  s.reminders.push({ id: "extra", title: "Extra", hour: 8, minute: 0, isEnabled: true });
  L.changeSchedule(log, s, d(2, 0));
  const both = L.today(log, d(2, 8)).filter((o) => o.dueAt === d(2, 8));
  assert.equal(both.length, 2);
  L.markTaken(log, both[0], d(2, 8, 1));
  assert.equal(state(log, both[0], d(2, 8, 5)), "taken");
  assert.equal(state(log, both[1], d(2, 8, 5)), "due");
});

test("renaming keeps tracking and does not split history", () => {
  const log = L.newLog(d(1, 0));
  L.markTaken(log, L.today(log, d(1, 9))[0], d(1, 8));
  const s = JSON.parse(JSON.stringify(log.schedule));
  s.reminders[0].title = "Breakfast";
  L.changeSchedule(log, s, d(2, 12));
  const h = L.history(log, d(2, 13));
  assert.ok(h.some((o) => o.dueAt === d(1, 20))); // tracking was not restarted
  assert.equal(h.filter((o) => o.dueAt === d(1, 8)).length, 1); // not split into two rows
});

test("a deleted reminder keeps its recorded history under the old label", () => {
  const log = L.newLog(d(1, 0));
  const first = L.today(log, d(1, 9))[0];
  L.markTaken(log, first, d(1, 8));
  const s = JSON.parse(JSON.stringify(log.schedule));
  s.reminders = s.reminders.filter((r) => r.id !== first.reminderId);
  L.changeSchedule(log, s, d(2, 12));
  const row = L.history(log, d(2, 13)).find((o) => o.dueAt === d(1, 8));
  assert.equal(row.title, "Morning");
});

test("the report lists labels, times and notes", () => {
  const log = L.newLog(d(1, 0));
  const now = d(2, 12);
  const first = L.history(log, now).slice(-1)[0];
  L.markTaken(log, first, first.dueAt);
  L.addNote(log, d(1, 15), "felt dizzy after");
  const text = L.report(log, now);
  assert.ok(text.includes("On time: 1"));
  assert.ok(text.includes("Morning: taken"));
  assert.ok(text.includes("MISSED"));
  assert.ok(text.includes("felt dizzy after"));
});

console.log("\n" + passed + " tests passed");
