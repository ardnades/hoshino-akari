#!/usr/bin/env python3
# build_fonts.py —— 從 play/ 實際用到的字，子集化 Noto Serif/Sans TC → play/fonts/*.woff2
#
# 來源：tools/_fontsrc/{serif,sans}.woff2（Fontsource 的 Noto Serif/Sans TC 繁中子集，SIL OFL，可商用可嵌入）。
# 產物：play/fonts/akari-{serif,sans}.woff2（只含遊戲實際出現的字 → 數百 KB；@font-face 命名為
#       "Noto Serif TC"/"Noto Sans TC"，故 style.css 既有字型堆疊自動命中，無需改堆疊）。
#
# ★ 重跑時機：任何 play/ 內「會顯示的文字」新增或改動後（劇本、UI、art.js baked 字）都要重跑，
#   否則新字不在子集 → 顯示豆腐 □。指令：python projects/hoshino-akari/tools/build_fonts.py
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # projects/hoshino-akari
PLAY = os.path.join(ROOT, "play")
SRC  = os.path.join(ROOT, "tools", "_fontsrc")
OUT  = os.path.join(PLAY, "fonts")

# 安全集：可列印 ASCII ＋ 常見中日標點/全形符號（即使某次掃描漏了也不缺基本標點）
SAFE = "".join(chr(c) for c in range(0x20, 0x7f)) + \
       "　、。，．！？：；…‥—–「」『』（）〔〕《》〈〉【】～·・‧／＼％＆＊＃＠＋－＝＜＞｜｛｝°※←→↑↓▼▶»≡"

def collect_chars():
    chars = set(SAFE)
    for dirpath, _, files in os.walk(PLAY):
        if os.path.basename(dirpath) == "fonts":
            continue
        for fn in files:
            if not fn.lower().endswith((".js", ".html", ".css")):
                continue
            try:
                with open(os.path.join(dirpath, fn), encoding="utf-8") as f:
                    chars.update(f.read())
            except Exception as e:
                print("  skip", fn, e)
    for ws in "\n\r\t　﻿":
        chars.discard(ws)
    return "".join(sorted(chars))

def subset(src, out, charset_file):
    # 不帶 --layout-features=*：用 pyftsubset 預設精選特性（保留 kern/liga/標記等，丟掉 vert/ruby 等橫排用不到的）→ 檔更小
    subprocess.run([sys.executable, "-m", "fontTools.subset", src,
                    "--text-file=" + charset_file, "--flavor=woff2", "--no-hinting",
                    "--output-file=" + out], check=True)

def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(SRC, exist_ok=True)
    text = collect_chars()
    charset_file = os.path.join(SRC, "_charset.txt")   # 寫在 build 目錄，不混進 play/fonts 出貨
    with open(charset_file, "w", encoding="utf-8") as f:
        f.write(text)
    print("charset: %d unique chars" % len(text))
    from fontTools.ttLib import TTFont
    # 每族 Regular 必出；若 _fontsrc 有 {name}-bold.* 則一併子集出 akari-{name}-bold.woff2（真 Bold，避免 CJK 假粗體）
    for name in ("serif", "sans"):
        for variant in ("", "-bold"):
            stem = name + variant
            # 來源優先用完整 OTF（含 灯/・/符號、正確繁中字形）；否則退回 Fontsource woff2 子集
            src = next((os.path.join(SRC, stem + ext) for ext in (".otf", ".ttf", ".woff2")
                        if os.path.exists(os.path.join(SRC, stem + ext))), None)
            if not src:
                if variant == "":
                    print("  MISSING source for", name)
                continue  # bold 為選配，缺就略過
            out = os.path.join(OUT, "akari-" + stem + ".woff2")
            subset(src, out, charset_file)
            cmap = TTFont(out).getBestCmap()
            missing = [c for c in text if c.strip() and ord(c) not in cmap]
            print("%s: %d KB  覆蓋 %d/%d  %s" % (
                stem, os.path.getsize(out) // 1024, len(text) - len(missing), len(text),
                ("缺字: " + "".join(missing[:80])) if missing else "（全覆蓋）"))

if __name__ == "__main__":
    main()
