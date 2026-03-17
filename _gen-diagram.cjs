// Temporary script to regenerate button-token-architecture.excalidraw (dark-mode friendly)
const fs = require('fs');
const path = require('path');

let counter = 0;
const id = () => `e${++counter}`;
const seed = () => Math.floor(Math.random() * 2e9);
const els = [];

function addRect(x, y, w, h, opts = {}) {
  const rectId = id();
  const textId = opts.text ? id() : null;
  els.push({
    id: rectId, type: "rectangle", x, y, width: w, height: h, angle: 0,
    strokeColor: opts.stroke || "#1e1e1e",
    backgroundColor: opts.bg || "transparent",
    fillStyle: "solid", strokeWidth: opts.sw || 1, strokeStyle: "solid",
    roughness: 0, opacity: 100, groupIds: [], roundness: { type: 3 },
    seed: seed(), version: 1, versionNonce: seed(), isDeleted: false,
    boundElements: textId ? [{ id: textId, type: "text" }] : [],
    updated: Date.now(), link: null, locked: false,
  });
  if (opts.text) {
    const fontSize = opts.fontSize || 14;
    els.push({
      id: textId, type: "text", x: x + 10, y: y + h / 2 - fontSize * 0.6,
      width: w - 20, height: fontSize * 1.2, angle: 0,
      strokeColor: opts.textColor || "#ffffff",
      backgroundColor: "transparent",
      fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid",
      roughness: 0, opacity: 100, groupIds: [], roundness: null,
      seed: seed(), version: 1, versionNonce: seed(), isDeleted: false,
      boundElements: null, updated: Date.now(), link: null, locked: false,
      text: opts.text, fontSize, fontFamily: 3,
      textAlign: "center", verticalAlign: "middle",
      containerId: rectId, originalText: opts.text, autoResize: true, lineHeight: 1.2,
    });
  }
  return rectId;
}

function addText(x, y, content, opts = {}) {
  const fontSize = opts.fontSize || 14;
  els.push({
    id: id(), type: "text", x, y,
    width: content.length * fontSize * 0.55, height: fontSize * 1.25, angle: 0,
    strokeColor: opts.color || "#e2e8f0",
    backgroundColor: "transparent",
    fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid",
    roughness: 0, opacity: 100, groupIds: [], roundness: null,
    seed: seed(), version: 1, versionNonce: seed(), isDeleted: false,
    boundElements: null, updated: Date.now(), link: null, locked: false,
    text: content, fontSize, fontFamily: 3,
    textAlign: "left", verticalAlign: "top",
    containerId: null, originalText: content, autoResize: true, lineHeight: 1.2,
  });
}

function addArrow(x1, y1, x2, y2, startId, endId, opts = {}) {
  const arrowId = id();
  if (startId) {
    const el = els.find(e => e.id === startId);
    if (el) el.boundElements.push({ id: arrowId, type: "arrow" });
  }
  if (endId) {
    const el = els.find(e => e.id === endId);
    if (el) el.boundElements.push({ id: arrowId, type: "arrow" });
  }
  els.push({
    id: arrowId, type: "arrow", x: x1, y: y1,
    width: Math.abs(x2 - x1), height: Math.abs(y2 - y1), angle: 0,
    strokeColor: opts.color || "#64748b",
    backgroundColor: "transparent",
    fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid",
    roughness: 0, opacity: 100, groupIds: [], roundness: { type: 2 },
    seed: seed(), version: 1, versionNonce: seed(), isDeleted: false,
    boundElements: null, updated: Date.now(), link: null, locked: false,
    points: [[0, 0], [x2 - x1, y2 - y1]], lastCommittedPoint: null,
    startBinding: startId ? { elementId: startId, focus: 0, gap: 5 } : null,
    endBinding: endId ? { elementId: endId, focus: 0, gap: 5 } : null,
    startArrowhead: null, endArrowhead: "arrow",
  });
}

// Layout
const C1 = 50, C2 = 500, C3 = 870;
const W1 = 360, W2 = 280, W3 = 310;
const BH = 38, RS = 54;

// Dark-mode color palette
const COMP   = { bg: "#1e3a5f", stroke: "#3b82f6", textColor: "#93c5fd" };
const SEM_C  = { bg: "#312e81", stroke: "#818cf8", textColor: "#c7d2fe" };
const SEM_S  = { bg: "#14532d", stroke: "#22c55e", textColor: "#86efac" };
const SEM_ST = { bg: "#581c87", stroke: "#a855f7", textColor: "#d8b4fe" };
const SEM_D  = { bg: "#78350f", stroke: "#f59e0b", textColor: "#fde68a" };
const PRIM   = { bg: "#1f2937", stroke: "#6b7280", textColor: "#d1d5db" };

function addRow(y, comp, sem, prim, semStyle) {
  const ss = semStyle || SEM_C;
  const r1 = addRect(C1, y, W1, BH, { bg: COMP.bg, stroke: COMP.stroke, text: comp, fontSize: 12, textColor: COMP.textColor });
  const r2 = addRect(C2, y, W2, BH, { bg: ss.bg, stroke: ss.stroke, text: sem, fontSize: 12, textColor: ss.textColor });
  const r3 = addRect(C3, y, W3, BH, { bg: PRIM.bg, stroke: PRIM.stroke, text: prim, fontSize: 12, textColor: PRIM.textColor });
  addArrow(C1 + W1, y + BH / 2, C2, y + BH / 2, r1, r2);
  addArrow(C2 + W2, y + BH / 2, C3, y + BH / 2, r2, r3);
}

// ===== TITLE =====
addText(C1, 15, "Button Token Architecture", { fontSize: 28, color: "#f1f5f9" });
addText(C1, 52, "Component Token  →  Semantic Token  →  Primitive Token", { fontSize: 14, color: "#94a3b8" });

// ===== COLUMN HEADERS =====
const HY = 95;
addRect(C1, HY, W1, 44, { bg: "#2563eb", stroke: "#3b82f6", sw: 2, text: "Component Token", fontSize: 16, textColor: "#ffffff" });
addRect(C2, HY, W2, 44, { bg: "#7c3aed", stroke: "#8b5cf6", sw: 2, text: "Semantic Token", fontSize: 16, textColor: "#ffffff" });
addRect(C3, HY, W3, 44, { bg: "#4b5563", stroke: "#6b7280", sw: 2, text: "Primitive Token", fontSize: 16, textColor: "#ffffff" });

// ===== COLOR TOKENS =====
let sy = 170;
addText(C1, sy, "Color Tokens", { fontSize: 16, color: "#60a5fa" });
sy += 26;

const colorData = [
  ["--comp-button-bg-primary", "neutral-solid-950", "Gray[950]  #1d1e22"],
  ["--comp-button-content-primary", "neutral-solid-0", "Gray[0]  #fdfefe"],
  ["--comp-button-bg-primary-brand", "primary-500", "Purple[500]  #a37af3"],
  ["--comp-button-bg-primary-destructive", "error-500", "RedBright[500]  #f6493e"],
  ["--comp-button-bg-secondary", "neutral-solid-100", "Gray[100]  #e4e4e5"],
  ["--comp-button-border-outlined", "neutral-solid-300", "Gray[300]  #b8b9b9"],
];
colorData.forEach(([c, s, p], i) => addRow(sy + i * RS, c, s, p, SEM_C));

// ===== DISABLED TOKENS =====
sy = sy + colorData.length * RS + 24;
addText(C1, sy, "Disabled State", { fontSize: 16, color: "#fbbf24" });
sy += 26;

const disabledData = [
  ["--comp-button-bg-*-disabled", "neutral-solid-100", "Gray[100]  #e4e4e5"],
  ["--comp-button-content-*-disabled", "neutral-solid-400", "Gray[400]  #9b9e9e"],
  ["--comp-button-border-outlined-disabled", "neutral-solid-200", "Gray[200]  #d4d4d5"],
];
disabledData.forEach(([c, s, p], i) => addRow(sy + i * RS, c, s, p, SEM_D));

// ===== SIZE TOKENS =====
sy = sy + disabledData.length * RS + 24;
addText(C1, sy, "Size Tokens (Medium example)", { fontSize: 16, color: "#34d399" });
sy += 26;

const sizeData = [
  ["--comp-button-height-md", "spacing-10", "40px"],
  ["--comp-button-px-md", "spacing-3", "12px"],
  ["--comp-button-gap-md", "spacing-1", "4px"],
  ["--comp-button-radius-md", "radius-2", "8px"],
  ["--comp-button-icon-md", "(direct value)", "18px"],
];
sizeData.forEach(([c, s, p], i) => addRow(sy + i * RS, c, s, p, SEM_S));

// ===== STATE TOKENS =====
sy = sy + sizeData.length * RS + 24;
addText(C1, sy, "State Overlay & Focus", { fontSize: 16, color: "#c084fc" });
sy += 26;

const stateData = [
  ["--comp-button-hover-on-dim", "state-on-dim-50", "WhiteAlpha[70]  rgba(…0.08)"],
  ["--comp-button-active-on-dim", "state-on-dim-70", "WhiteAlpha[100]  rgba(…0.14)"],
  ["--comp-button-hover-on-bright", "state-on-bright-50", "BlackAlpha[50]  rgba(…0.04)"],
  ["--comp-button-active-on-bright", "state-on-bright-70", "BlackAlpha[100]  rgba(…0.12)"],
  ["--comp-button-focus-ring", "primary-300", "Purple[300]  #c9b1f8"],
];
stateData.forEach(([c, s, p], i) => addRow(sy + i * RS, c, s, p, SEM_ST));

// ===== OUTPUT =====
const doc = {
  type: "excalidraw",
  version: 2,
  source: "https://excalidraw.com",
  elements: els,
  appState: { gridSize: null, viewBackgroundColor: "#121212" },
  files: {},
};

const out = path.join(__dirname, 'docs/diagrams/button-token-architecture.excalidraw');
fs.writeFileSync(out, JSON.stringify(doc, null, 2));
console.log(`Done: ${els.length} elements → ${out}`);
