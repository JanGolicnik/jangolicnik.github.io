#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const SRC_DIR = "src";
const COMPONENTS_DIR = "src/components";
const OUT_DIR = "docs";
const TAG_RE = /<c-([a-z0-9_-]+)([^>]*?)(?:\s*\/>|>([\s\S]*?)<\/c-\1>)/g;

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

function replace_components(html, components, depth = 0) {
  if (depth > 16) throw new Error("component recursion too deep");
  return html.replace(TAG_RE, (_, name, attrStr, children = "") => {
    const tpl = components[name];
    if (tpl == null) {
      console.error(`  unknown component <c-${name}>`);
      return "";
    }
    return replace_components(tpl, components, depth + 1);
  });
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

function load_components() {
  const out = {};
  if (!fs.existsSync(COMPONENTS_DIR)) return out;
  for (const f of walk_dir(COMPONENTS_DIR)) {
    if (!f.endsWith(".html")) continue;
    const name = path.basename(f, ".html");
    out[name] = fs.readFileSync(f, "utf8");
  }
  return out;
}

function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ctx = load_ctx();
  const components = load_components();
  for (const f of walk_dir(SRC_DIR)) {
    if (f.startsWith(COMPONENTS_DIR)) continue;
    const dst = path.join(OUT_DIR, path.relative(SRC_DIR, f));

    fs.mkdirSync(path.dirname(dst), { recursive: true });

    if (f.endsWith(".html")) {
      ctx.page = path.parse(f).name;
      fs.writeFileSync(
        dst,
        render(replace_components(fs.readFileSync(f, "utf8"), components), ctx),
      );
      continue;
    }

    fs.copyFileSync(f, dst);
  }
}

build();
