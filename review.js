const storageKey = "valorizeai-title-review-v1";

function getState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function setState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function collectCards() {
  return [...document.querySelectorAll(".idea-card")];
}

function currentRows() {
  return collectCards().map((card) => {
    const decision = card.querySelector('[data-field="decision"]').value;
    const comment = card.querySelector('[data-field="comment"]').value;
    return {
      id: card.dataset.rowId,
      title: card.dataset.title,
      decision,
      comment,
      exportedAt: new Date().toISOString(),
    };
  });
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function mdEscape(value) {
  return String(value || "")
    .replaceAll("|", "&#124;")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\n", "<br>");
}

function markdownLine(label, value) {
  return `- ${label}: ${String(value || "").replaceAll("\\n", " ")}`;
}

function exportMarkdown() {
  const lines = ["# 会議判断", ""];
  for (const row of currentRows()) {
    lines.push(`## ${row.id}. ${row.title}`);
    lines.push(markdownLine("id", row.id));
    lines.push(markdownLine("title", row.title));
    lines.push(markdownLine("decision", row.decision));
    lines.push(markdownLine("comment", row.comment));
    lines.push(markdownLine("exportedAt", row.exportedAt));
    lines.push("");
  }
  download("meeting-decisions.md", lines.join("\\n"), "text/markdown;charset=utf-8");
}

function init() {
  const state = getState();
  for (const card of collectCards()) {
    const id = card.dataset.rowId;
    const saved = state[id] || {};
    const select = card.querySelector('[data-field="decision"]');
    const textarea = card.querySelector('[data-field="comment"]');
    if (saved.decision) select.value = saved.decision;
    if (saved.comment) textarea.value = saved.comment;
    const update = () => {
      const next = getState();
      next[id] = {
        title: card.dataset.title,
        decision: select.value,
        comment: textarea.value,
        updatedAt: new Date().toISOString(),
      };
      setState(next);
    };
    select.addEventListener("change", update);
    textarea.addEventListener("input", update);
  }

  document.getElementById("exportMarkdown")?.addEventListener("click", exportMarkdown);
  document.getElementById("clearLocal")?.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    location.reload();
  });
}

init();