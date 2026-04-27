#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const SRC_DIR = "src";
const OUT_DIR = "build";

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function compile(keys, expr) {
  try {
    return new Function(...keys, `"use strict"; return (${expr});`);
  } catch (e) {
    return new Function(...keys, `"use strict"; ${expr}`);
  }
}

function render(tpl, ctx) {
  const keys = Object.keys(ctx);
  const vals = Object.values(ctx);
  return tpl.replace(/\{\{(=?)([\s\S]+?)\}\}/g, (_, raw, expr) => {
    try {
      const out = compile(keys, expr)(...vals);
      return raw ? String(out) : escapeHtml(out);
    } catch (e) {
      console.error(`${e.message}`);
    }
  });
}

function* walk_dir(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk_dir(p);
    else yield p;
  }
}

function load_ctx() {
  const ctx = { now: new Date() };
  for (const f of walk_dir(SRC_DIR)) {
    if (!f.endsWith(".json")) continue;
    ctx[path.basename(f, ".json")] = JSON.parse(fs.readFileSync(f, "utf8"));
  }
  return ctx;
}

function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ctx = load_ctx();
  for (const f of walk_dir(SRC_DIR)) {
    const dst = path.join(OUT_DIR, path.relative(SRC_DIR, f));

    fs.mkdirSync(path.dirname(dst), { recursive: true });

    if (f.endsWith(".html")) {
      fs.writeFileSync(dst, render(fs.readFileSync(f, "utf8"), ctx));
      continue;
    }

    fs.copyFileSync(f, dst);
  }
}

build();
