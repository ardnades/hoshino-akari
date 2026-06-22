/* reach_proof.js — 結局可達性回歸測試（reform 後守住的最脆弱不變量）。
   走真實 landed 節點、過真 gate、跑真 meta.judge()，證明 7 命運結局全部可達。
   用法：node projects/hoshino-akari/tools/reach_proof.js          → 跑 7 條 canonical 路徑
         node projects/hoshino-akari/tools/reach_proof.js dump     → 列出所有 choice 與 option 計分
   路徑表在 tools/reach_paths.json（choiceId -> optionIndex；依 spec/26 §2）。 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DATA = path.join(__dirname, "..", "play", "data");
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ["meta.js", "day1.js", "day2.js", "day3.js", "day4.js", "day5.js", "day6.js", "day7.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DATA, f), "utf8"), sandbox, { filename: f });
}
const H = sandbox.window.HOSHINO, M = H.meta;

// 鏡像 engine.evalCond（合法變數：affection distance awareness regret warmth stance heat + flag:）
function evalCond(cond, s, flags) {
  cond = String(cond).trim();
  if (/^!?flag:/.test(cond)) {
    const neg = cond.startsWith("!");
    const name = cond.replace(/^!?flag:/, "").trim();
    return neg ? !flags[name] : !!flags[name];
  }
  const scope = {
    affection: s.affection, distance: s.distance, awareness: s.awareness, regret: s.regret,
    warmth: s.affection - s.distance, stance: s.stance, heat: s.heat,
  };
  try {
    return Function(...Object.keys(scope), "return (" + cond + ");")(...Object.values(scope));
  } catch (e) { return false; }
}

function walk(nodes, state, picks, log) {
  if (!Array.isArray(nodes)) return;
  for (const n of nodes) {
    if (!n || typeof n !== "object") continue;
    if (n.add) for (const k in n.add) state.scores[k] = (state.scores[k] || 0) + n.add[k];
    if (n.set) for (const k in n.set) state.flags[k] = true;
    if (n.type === "choice") {
      const idx = picks[n.id] != null ? picks[n.id] : 0;
      const op = n.options[idx];
      if (!op) { log.push(`!! choice ${n.id} has no option ${idx}`); continue; }
      if (op.add) for (const k in op.add) state.scores[k] = (state.scores[k] || 0) + op.add[k];
      if (op.flag) for (const k in op.flag) state.flags[k] = true;
      log.push(`  ${n.id}=[${idx}] ${(op.label || "").slice(0, 14)}`);
      walk(op.reaction, state, picks, log);
    } else if (n.type === "gate") {
      walk(evalCond(n.cond, state.scores, state.flags) ? n.then : n.else, state, picks, log);
    }
  }
}

function simulate(picks) {
  const state = { scores: { ...M.initScores }, flags: {} };
  const log = [];
  for (let d = 1; d <= 7; d++) walk(H.days[d], state, picks, log);
  return { state, log };
}

if (process.argv[2] === "dump") {
  const seen = [];
  (function scan(nodes, day) {
    if (!Array.isArray(nodes)) return;
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;
      if (n.type === "choice") {
        seen.push(`D${day} ${n.id}\n    ` + n.options.map((o, i) =>
          `[${i}] add=${JSON.stringify(o.add || {})} flag=${JSON.stringify(o.flag || {})} ${(o.label || "").slice(0, 16)}`).join("\n    "));
        n.options.forEach((o) => scan(o.reaction, day));
      } else if (n.type === "gate") { scan(n.then, day); scan(n.else, day); }
    }
  })(undefined, 0);
  for (let d = 1; d <= 7; d++) (function s(nodes, day) {
    if (!Array.isArray(nodes)) return;
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;
      if (n.type === "choice") { seen.push(`D${day} ${n.id}\n    ` + n.options.map((o, i) => `[${i}] add=${JSON.stringify(o.add || {})} flag=${JSON.stringify(o.flag || {})} ${(o.label || "").slice(0, 16)}`).join("\n    ")); n.options.forEach((o) => s(o.reaction, day)); }
      else if (n.type === "gate") { s(n.then, day); s(n.else, day); }
    }
  })(H.days[d], d);
  console.log([...new Set(seen)].join("\n"));
  process.exit(0);
}

const PATHS = JSON.parse(fs.readFileSync(path.join(__dirname, "reach_paths.json"), "utf8"));
let allPass = true;
for (const [tone, picks] of Object.entries(PATHS)) {
  const { state } = simulate(picks);
  const got = M.judge(state.scores, state.flags);
  const ok = got === tone;
  allPass = allPass && ok;
  const s = state.scores;
  console.log(`${ok ? "PASS" : "*** FAIL (got " + got + ") ***"}  ${tone.padEnd(13)} bond=${s.affection} seen=${s.awareness} regret=${s.regret} warmth=${s.affection - s.distance} stance=${s.stance} heat=${s.heat}  [${Object.keys(state.flags).join(",")}]`);
}
console.log(allPass ? "\nALL 7 ENDINGS REACHABLE ✓" : "\n*** SOME ENDINGS UNREACHABLE ***");
process.exit(allPass ? 0 : 1);
