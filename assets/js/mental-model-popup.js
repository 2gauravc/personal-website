(() => {
  const svg = document.querySelector("svg[data-model-popup]");

  if (!svg) {
    return;
  }

  const svgNamespace = "http://www.w3.org/2000/svg";
  const nodes = Array.from(svg.querySelectorAll(".model-node-clickable"));
  const viewBox = svg.viewBox.baseVal;
  const lineHeight = Number(svg.dataset.popupLineHeight || 24);
  const copyMaxChars = Number(svg.dataset.popupCopyMaxChars || 56);
  let activeNode = null;

  const createElement = (tagName, attributes = {}, text = "") => {
    const element = document.createElementNS(svgNamespace, tagName);

    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });

    if (text) {
      element.textContent = text;
    }

    return element;
  };

  const popupStyle = createElement("style");
  popupStyle.textContent = `
    .popup-backdrop {
      fill: rgba(15, 23, 42, 0.42);
    }

    .popup-card {
      fill: #ffffff;
      stroke: #cbd5e1;
      filter: drop-shadow(0 24px 45px rgba(15, 23, 42, 0.22));
    }

    .popup-kicker {
      fill: #0f766e;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .popup-title {
      fill: #0f172a;
      font-size: 20px;
      font-weight: 700;
    }

    .popup-copy {
      fill: #475569;
      font-size: 15px;
      line-height: 1.5;
    }

    .popup-close {
      cursor: pointer;
    }

    .popup-close rect {
      fill: #f8fafc;
      stroke: #cbd5e1;
      transition: fill 160ms ease, stroke 160ms ease;
    }

    .popup-close:hover rect,
    .popup-close:focus rect {
      fill: #f0fdfa;
      stroke: #0f766e;
    }

    .popup-close:focus {
      outline: none;
    }

    .model-popup[hidden] {
      display: none;
    }
  `;
  svg.prepend(popupStyle);

  const popup = createElement("g", {
    class: "model-popup",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "popup-title",
    hidden: ""
  });
  const backdrop = createElement("rect", {
    class: "popup-backdrop",
    x: 0,
    y: 0,
    width: viewBox.width,
    height: viewBox.height
  });
  const card = createElement("rect", {
    class: "popup-card",
    x: svg.dataset.popupCardX,
    y: svg.dataset.popupCardY,
    width: svg.dataset.popupCardWidth,
    height: svg.dataset.popupCardHeight,
    rx: svg.dataset.popupCardRadius || 16
  });
  const kicker = createElement("text", {
    class: "popup-kicker",
    x: svg.dataset.popupKickerX,
    y: svg.dataset.popupKickerY
  }, svg.dataset.popupKicker || "");
  const title = createElement("text", {
    class: "popup-title",
    id: "popup-title",
    x: svg.dataset.popupTitleX,
    y: svg.dataset.popupTitleY
  });
  const copy = createElement("text", {
    class: "popup-copy",
    x: svg.dataset.popupCopyX,
    y: svg.dataset.popupCopyY
  });
  const close = createElement("g", {
    class: "popup-close",
    role: "button",
    tabindex: "0",
    "aria-label": "Close pop-up"
  });
  const closeRect = createElement("rect", {
    x: svg.dataset.popupCloseX,
    y: svg.dataset.popupCloseY,
    width: 32,
    height: 32,
    rx: 8
  });
  const closeText = createElement("text", {
    x: Number(svg.dataset.popupCloseX) + 16,
    y: Number(svg.dataset.popupCloseY) + 22,
    "text-anchor": "middle",
    "font-size": 20,
    fill: "#334155"
  }, "x");

  close.append(closeRect, closeText);
  popup.append(backdrop, card, kicker, title, copy, close);
  svg.append(popup);

  const wrapText = (text) => {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;

      if (nextLine.length > copyMaxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = nextLine;
      }
    });

    if (line) {
      lines.push(line);
    }

    return lines;
  };

  const setCopy = (text) => {
    copy.textContent = "";

    wrapText(text).forEach((line, index, lines) => {
      const tspan = createElement("tspan", {
        x: svg.dataset.popupCopyX,
        dy: index === 0 ? 0 : lineHeight
      }, index < lines.length - 1 ? `${line} ` : line);

      copy.appendChild(tspan);
    });
  };

  const openPopup = (node) => {
    activeNode = node;
    kicker.textContent = node.dataset.popupKicker || svg.dataset.popupKicker || "";
    title.textContent = node.dataset.popupTitle || "";
    setCopy(node.dataset.popupText || "");
    popup.removeAttribute("hidden");
    close.focus();
  };

  const closePopup = () => {
    popup.setAttribute("hidden", "");

    if (activeNode) {
      activeNode.focus();
      activeNode = null;
    }
  };

  nodes.forEach((node) => {
    node.addEventListener("click", () => openPopup(node));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPopup(node);
      }
    });
  });

  [close, backdrop].forEach((element) => {
    element.addEventListener("click", closePopup);
  });

  close.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hasAttribute("hidden")) {
      closePopup();
    }
  });
})();
