// Headless regression test — loads index.html's own game script into a
// sandboxed Node vm (no browser needed) and plays it out with a simple
// "always attack the best-advantage move" AI standing in for the human,
// exactly the way the AI already plays for itself. Two things it checks:
//
//   1. Smoke test — every combination of map size × difficulty actually
//      finishes (or runs the full turn budget) without throwing, stalling,
//      or handing the human's own seat over to the AI unexpectedly.
//   2. Determinism — the same seed played twice produces byte-identical
//      final territory state (owner + force everywhere). This is the
//      property the whole replay/share-a-match feature depends on: if two
//      runs of the same seed can ever diverge, replays and shared-match
//      links silently lie about what actually happened.
//
// Run locally: node simulate.js
// Wired into CI via .github/workflows/simulate.yml — every push/PR.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scriptMatch = html.match(/<script>\n"use strict";([\s\S]*)<\/script>/);
if (!scriptMatch) {
  console.error("Could not find the game's inline <script> block in index.html — has its structure changed?");
  process.exit(1);
}
let src = scriptMatch[1];
// Boot-time code (registers the real service worker, wires up
// window.onload, restores an autosaved game, etc.) — none of it applies
// in this headless sandbox and some of it would throw immediately (no real
// DOM/network). Stripped the same way quicksmoke.js/winrate.js already do.
const bootBlockRe = /\nconst pendingSharedReplay[\s\S]*\n\}\s*$/;
src = src.replace(bootBlockRe, "\n");
src += `
globalThis.__sim = {
  get territories() { return territories; }, get currentPlayer() { return currentPlayer; },
  get gameOver() { return gameOver; }, get humanRoyId() { return humanRoyId; },
  ROYAUMES: ROYAUMES, attack: attack, endTurn: endTurn, startGame: startGame,
  applyDifficulty: applyDifficulty, pickFaction: pickFaction, applyMapSize: applyMapSize,
};
`;

function makeStubEl() {
  return {
    style: {}, textContent: "", disabled: false, dataset: {},
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    addEventListener() {}, appendChild() {}, remove() {}, querySelectorAll() { return []; }, querySelector() { return makeStubEl(); },
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    getContext() { return new Proxy({}, { get: (t, p) => (p === "createLinearGradient" || p === "createRadialGradient") ? () => ({ addColorStop() {} }) : () => {} }); },
    getBoundingClientRect() { return { left: 0, top: 0 }; }, clientWidth: 800, clientHeight: 600, offsetHeight: 40,
  };
}
function buildSandbox() {
  const elements = {};
  const documentStub = {
    getElementById(id) { if (!elements[id]) elements[id] = makeStubEl(); return elements[id]; },
    querySelectorAll() { return []; }, createElement() { return makeStubEl(); }, addEventListener() {}, hidden: false,
    body: makeStubEl(), // resize() toggles document.body.classList (landscapeHud) — needs a stub too
  };
  const taskQueue = [];
  const sandbox = {
    document: documentStub, window: { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, addEventListener() {} },
    Image: class { set src(v) {} }, console, Math, performance: { now: () => Date.now() },
    // requestAnimationFrame is deliberately a no-op, not queued: several
    // in-game animation loops (pulses, combat FX) recurse on rAF and only
    // stop once a real-wall-clock duration has elapsed — draining it
    // synchronously here (no real time passing between iterations) would
    // spin those loops indefinitely instead of the single harmless no-op
    // frame a browser's own throttled rAF naturally resolves in.
    setTimeout: (fn) => { taskQueue.push(fn); }, clearTimeout: () => {}, requestAnimationFrame: () => {}, Proxy,
    location: { search: "", pathname: "/", href: "http://localhost/" },
    history: { replaceState() {} }, URL, URLSearchParams, atob, btoa, navigator: {},
  };
  sandbox.window.document = documentStub;
  sandbox.__taskQueue = taskQueue;
  vm.createContext(sandbox);
  return sandbox;
}
function drainTaskQueue(sandbox, maxTasks) {
  const queue = sandbox.__taskQueue;
  let n = 0;
  while (queue.length) { if (++n > maxTasks) return false; queue.shift()(); }
  return true;
}
// Same heuristic the AI itself already uses as its own baseline: always
// take the single best-advantage attack available, never a bad trade.
function pickMove(sandbox, royId) {
  const territories = sandbox.__sim.territories;
  let best = null, bestAdv = -Infinity;
  for (const t of territories) {
    if (t.owner !== royId || t.force <= 1) continue;
    for (const nId of t.neighbors) {
      const n = territories[nId]; if (n.owner === royId) continue;
      const adv = t.force - n.force; if (adv > bestAdv) { bestAdv = adv; best = { from: t.id, to: nId }; }
    }
  }
  return best;
}
// Plays one full deterministic game to completion (or the turn budget) and
// returns a plain snapshot of the final territory state, for either a
// pass/fail smoke check or a byte-for-byte determinism comparison.
function runOne(mapSize, diff, seed) {
  const sandbox = buildSandbox();
  vm.runInContext(src, sandbox);
  sandbox.__sim.applyMapSize(mapSize);
  sandbox.__sim.applyDifficulty(diff);
  sandbox.__sim.startGame(seed);
  sandbox.__sim.pickFaction(0);
  if (!drainTaskQueue(sandbox, 8000)) throw new Error("stalled at game start");
  let turns = 0;
  while (!sandbox.__sim.gameOver && turns < 150) {
    if (sandbox.__sim.currentPlayer !== 0) throw new Error("unexpected AI turn on the human's own seat");
    const mv = pickMove(sandbox, 0);
    if (mv) sandbox.__sim.attack(mv.from, mv.to);
    else sandbox.__sim.endTurn();
    if (!drainTaskQueue(sandbox, 8000)) throw new Error("stalled mid-turn");
    turns++;
  }
  return sandbox.__sim.territories.map((t) => ({ owner: t.owner, force: t.force }));
}

let ok = 0, fail = 0;
for (const mapSize of ["small", "medium", "large"]) {
  for (const diff of [0, 0.5, 1]) {
    for (let g = 0; g < 3; g++) {
      try {
        runOne(mapSize, diff, undefined);
        ok++;
      } catch (e) {
        fail++;
        console.log(`FAIL mapSize=${mapSize} diff=${diff} game=${g}: ${e.message}`);
      }
    }
  }
}
console.log(`smoke: ok=${ok} fail=${fail}`);

// Determinism: the exact same seed, played twice, independently — the
// resulting board must match exactly, territory by territory. A fixed seed
// (rather than the default clock-based one) so this is itself reproducible
// across CI runs.
const DETERMINISM_SEED = 424242;
let determinismOk = true;
try {
  const runA = runOne("medium", 0.5, DETERMINISM_SEED);
  const runB = runOne("medium", 0.5, DETERMINISM_SEED);
  const a = JSON.stringify(runA), b = JSON.stringify(runB);
  if (a !== b) {
    determinismOk = false;
    console.log("FAIL determinism: same seed produced two different final boards");
  } else {
    console.log("determinism: ok");
  }
} catch (e) {
  determinismOk = false;
  console.log(`FAIL determinism: ${e.message}`);
}

if (fail > 0 || !determinismOk) process.exit(1);
