// ==UserScript==
// @name         Oddspedia ice hockey league filter
// @namespace    https://github.com/Agentchow/oddspedia-hockey-league-filter
// @description  Show only selected competitions on Oddspedia's ice-hockey page
// @match        https://oddspedia.com/ice-hockey*
// @match        https://oddspedia.com/*/ice-hockey*
// @match        https://oddspedia.com/*/eishockey*
// @match        https://www.oddspedia.com/ice-hockey*
// @match        https://www.oddspedia.com/*/ice-hockey*
// @match        https://www.oddspedia.com/*/eishockey*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const ALLOWED_HEADERS = new Set([
    "usa nhl",
    "usa ahl",
    "russia khl",
    "sweden shl",
    "finland liiga",
    "germany del",
    "czech republic extraliga",
    "czechia extraliga",
    "switzerland nla",
    "switzerland national league",
    "europe champions hockey league",
    "europe champions league",
    "europe chl",
    "world world championship",
    "world iihf world championship",
    "poland ekstraliga",
    "usa ncaa",
  ]);

  const HIDDEN = "data-oddspedia-league-filter-hidden";
  const EXPAND_INTERVAL_MS = 750;

  const style = document.createElement("style");
  style.textContent = `[${HIDDEN}]{display:none !important;}`;
  document.documentElement.appendChild(style);

  function normalizedHeader(header) {
    return (header.textContent || "")
      .replace(/\s*-\s*Round\s+\d+\s*$/i, "")
      .replace(/\s*-\s*play[\s-]?offs\s*$/i, "")
      .replace(/\s+play[\s-]?offs\s*$/i, "")
      .replace(/\s*\/\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function hideCompetition(header) {
    if (ALLOWED_HEADERS.has(normalizedHeader(header))) return;

    let element = header;
    do {
      element.setAttribute(HIDDEN, "");
      element = element.nextElementSibling;
    } while (element && !element.classList.contains("game-list-headline"));
  }

  function expandFullList() {
    for (const label of document.querySelectorAll(
      "button.btn-pagination > .btn-pagination__label"
    )) {
      const text = (label.textContent || "").replace(/\s+/g, " ").trim();
      if (!/^show more$/i.test(text)) continue;
      const button = label.parentElement;
      if (!button.disabled) button.click();
    }
  }

  function filterCompetitions() {
    for (const header of document.querySelectorAll(".game-list-headline")) {
      hideCompetition(header);
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      filterCompetitions();
    });
  }

  filterCompetitions();
  expandFullList();
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  setInterval(expandFullList, EXPAND_INTERVAL_MS);
})();
