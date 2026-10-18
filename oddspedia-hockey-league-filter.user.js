// ==UserScript==
// @name         Oddspedia ice hockey league filter
// @namespace    hftkalshi
// @description  Hide ice-hockey competitions that are not in hockey.leagues
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

  const ROUND = String.raw`(?:\s*-\s*Round\s+\d+)?`;
  const ALLOWED_HEADER_PATTERNS = [
    new RegExp(`^USA\\s+NHL${ROUND}$`, "i"),
    new RegExp(`^USA\\s+AHL${ROUND}$`, "i"),
    new RegExp(`^Russia\\s+KHL${ROUND}$`, "i"),
    new RegExp(`^Sweden\\s+SHL${ROUND}$`, "i"),
    new RegExp(`^Finland\\s+Liiga${ROUND}$`, "i"),
    new RegExp(`^Germany\\s+DEL${ROUND}$`, "i"),
    new RegExp(`^Czech(?:ia| Republic)\\s+Extraliga${ROUND}$`, "i"),
    new RegExp(`^Czech(?:ia| Republic)\\s+(?:Chance Liga|1\\.?\\s*Liga)${ROUND}$`, "i"),
    new RegExp(`^Switzerland\\s+(?:NLA|National League)${ROUND}$`, "i"),
    new RegExp(`^Europe\\s+(?:Champions Hockey League|Champions League|CHL)${ROUND}$`, "i"),
    new RegExp(`^World\\s+(?:IIHF\\s+)?World Championship${ROUND}$`, "i"),
    new RegExp(`^Norway\\s+(?:1st|1\\.)\\s*Division${ROUND}$`, "i"),
  ];

  const HIDDEN = "data-hft-league-hidden";

  const style = document.createElement("style");
  style.textContent = `[${HIDDEN}]{display:none !important;}`;
  document.documentElement.appendChild(style);

  function headerIsAllowed(header) {
    const text = (header.innerText || "").replace(/\s+/g, " ").trim();
    return ALLOWED_HEADER_PATTERNS.some((pattern) => pattern.test(text));
  }

  function hide(el) {
    if (el && el.nodeType === 1 && !el.hasAttribute(HIDDEN)) el.setAttribute(HIDDEN, "");
  }

  function hideCompetition(header) {
    if (headerIsAllowed(header)) return;

    hide(header);
    let row = header.nextElementSibling;
    while (row && !row.classList.contains("game-list-headline")) {
      hide(row);
      row = row.nextElementSibling;
    }
  }

  function expandFullList() {
    for (const label of document.querySelectorAll(
      "button.btn-pagination > .btn-pagination__label"
    )) {
      const text = (label.textContent || "").replace(/\s+/g, " ").trim();
      if (!/^show more$/i.test(text)) continue;
      const control = label.closest("button.btn-pagination");
      if (control.disabled) continue;
      control.click();
    }
  }

  function apply() {
    expandFullList();
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
      apply();
    });
  }

  apply();
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  setInterval(expandFullList, 750);
})();
