#!/usr/bin/env node
/* validate_story.js —— 《星野灯線》Story Schema Validator v0（獨立、唯讀，CLI）
 *
 * 目的：把 runDay() 的資料契約轉成可檢查規則，驗證 play/data 的故事資料是否合法。
 * 規則本體在 story_schema.js（與瀏覽器 inspector 共用，避免規則分裂）；本檔只負責
 * 「以 Node vm/fs 載入瀏覽器端 data 檔 → 呼叫 validateGame → 印報告 → 設 exit code」。
 *
 * 嚴格限制（本工具遵守）：
 *   - 只讀不寫：絕不修改 engine.js / runtime / meta / chapters / day / assets / endings / art。
 *   - 不接 Comfy、不做 UI、不做 multi-game、不做 payment。
 *
 * 執行：
 *   node projects/hoshino-akari/tools/validate_story.js            # 驗證本專案 play/
 *   node projects/hoshino-akari/tools/validate_story.js <play目錄>  # 驗證其他候選輸出（仍唯讀）
 * 結束碼：有 error → 1；只有 warning（或全通過）→ 0。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const StorySchema = require("./story_schema.js");

// 預設驗證本專案 play/；可選傳入其他 play 目錄（供未來 editor 驗證候選輸出，仍唯讀）
const PLAY = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, "..", "play");
const DATA = path.join(PLAY, "data");

// data 檔載入順序（與 index.html 一致；meta 先建立 window.HOSHINO 容器）
const LOAD_ORDER = [
  path.join(DATA, "meta.js"),
  path.join(DATA, "assets.js"),
  path.join(DATA, "chapters.js"),
  path.join(DATA, "day1.js"),
  path.join(DATA, "day2.js"),
  path.join(DATA, "day3.js"),
  path.join(DATA, "day4.js"),
  path.join(DATA, "day5.js"),
  path.join(DATA, "day6.js"),
  path.join(DATA, "day7.js"),
  path.join(DATA, "endings.js"),
  path.join(PLAY, "art.js"),
];

const rel = (p) => path.relative(path.join(__dirname, ".."), p).replace(/\\/g, "/");

// 以 vm sandbox 載入 data 檔（它們只做 window.HOSHINO.* / window.ART 賦值）
function loadGame() {
  const loadIssues = [];
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  for (const file of LOAD_ORDER) {
    if (!fs.existsSync(file)) { loadIssues.push({ level: "ERROR", file: rel(file), loc: "-", msg: "找不到檔案，無法載入" }); continue; }
    try {
      vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
    } catch (e) {
      loadIssues.push({ level: "ERROR", file: rel(file), loc: "-", msg: "載入時拋例外：" + e.message });
    }
  }
  return { window: sandbox.window, loadIssues };
}

// 素材檔磁碟存在性檢查（CLI 專屬；story_schema 為純函式不讀檔）。
// 空字串值＝刻意靜音/未接（如多數 se），跳過；只查有填路徑卻找不到檔的。
function checkAssetFiles(assets, playDir) {
  const out = [];
  const seen = new Set();
  const check = (val, where) => {
    if (typeof val !== "string" || val === "" || val === "clear") return;
    if (seen.has(val)) return; seen.add(val);
    if (!fs.existsSync(path.join(playDir, val)))
      out.push({ level: "WARN", file: "data/assets.js", loc: where, msg: `素材檔不存在於磁碟：${val}`, rule: "asset-file-missing" });
  };
  const a = assets || {};
  for (const who of Object.keys(a.characters || {})) {
    const tbl = a.characters[who] || {};
    for (const k of Object.keys(tbl)) {
      if (k === "@masks") { const m = tbl[k] || {}; for (const mk of Object.keys(m)) check(m[mk], `characters.${who}.@masks.${mk}`); }
      else check(tbl[k], `characters.${who}.${k}`);
    }
  }
  for (const grp of ["cg", "background", "bgm", "se"]) {
    const g = a[grp] || {};
    for (const k of Object.keys(g)) check(g[k], `${grp}.${k}`);
  }
  return out;
}

function main() {
  const { window: W, loadIssues } = loadGame();
  const result = StorySchema.validateGame(W.HOSHINO, W.ART);

  // flag set↔read 對稱 + gate 可達性（接 analyzeRelations，原本只算給 inspector、CLI 從未用）。
  // 全部 WARN：揭露死 flag/不可達分支但不擋 build；修乾淨後可在此升 ERROR 防回歸（見 spec/32 P0-4）。
  // 注意：undefined-read 不在此重報——已由 validateGame 的 gate-cond-flag-undefined 覆蓋，避免重複。
  const rel = StorySchema.analyzeRelations(W.HOSHINO);
  const relIssues = [];
  for (const f of rel.flags) {
    if (f.status === "unused") {
      const where = f.setBy.map((s) => `${s.file} ${s.loc}`).join("；");
      const at = f.setBy[0] || { file: "data", loc: "-" };
      relIssues.push({ level: "WARN", file: at.file, loc: at.loc,
        msg: `flag "${f.name}" 被 set 卻無任何 gate.cond 讀取、也不在 judge() 使用（死 flag＝選了沒差）。set 於：${where}`,
        rule: "flag-set-never-read" });
    }
  }
  for (const g of rel.gates) {
    if (g.neverTrue) relIssues.push({ level: "WARN", file: g.file, loc: g.loc,
      msg: `gate.cond "${g.cond}" 的 flag 從未被 set → 恆假，then 分支不可達`, rule: "gate-never-true" });
    if (g.alwaysTrue) relIssues.push({ level: "WARN", file: g.file, loc: g.loc,
      msg: `gate.cond "${g.cond}" 為 !flag:未定義 → 恆真，else 分支不可達`, rule: "gate-always-true" });
  }
  const fileIssues = checkAssetFiles(W.HOSHINO && W.HOSHINO.assets, PLAY);
  const issues = loadIssues.concat(result.issues).concat(relIssues).concat(fileIssues);

  const errors = issues.filter((i) => i.level === "ERROR");
  const warns = issues.filter((i) => i.level === "WARN");
  const out = [];
  out.push("Story Schema Validation Report");
  out.push("==============================");
  out.push(`- Errors:   ${errors.length}`);
  out.push(`- Warnings: ${warns.length}`);
  out.push("- Note: flag set↔read 對稱檢查 + gate 恆真/恆假可達性：已啟用（WARN 級；接 analyzeRelations，見 spec/32 P0-4）。");
  for (const info of result.infos) out.push(`- INFO: ${info}`);
  out.push("");
  if (issues.length === 0) {
    out.push("PASS: story schema is valid.");
  } else {
    const order = (lvl) => (lvl === "ERROR" ? 0 : 1);
    issues.sort((a, b) => a.file.localeCompare(b.file) || order(a.level) - order(b.level));
    for (const it of issues) out.push(`[${it.level}] ${it.file} ${it.loc} : ${it.msg}`);
    out.push("");
    out.push(errors.length ? `FAIL: ${errors.length} error(s), ${warns.length} warning(s).` : `PASS (with warnings): 0 error(s), ${warns.length} warning(s).`);
  }
  process.stdout.write(out.join("\n") + "\n");
  process.exit(errors.length ? 1 : 0);
}

main();
