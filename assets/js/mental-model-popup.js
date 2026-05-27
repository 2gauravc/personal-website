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

    .popup-footer-divider {
      stroke: #e2e8f0;
      stroke-width: 1;
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

    .popup-like,
    .popup-why-link {
      cursor: pointer;
    }

    .popup-like rect,
    .popup-why-link rect {
      fill: #f8fafc;
      stroke: #cbd5e1;
      transition: fill 160ms ease, stroke 160ms ease;
    }

    .popup-like path {
      fill: none;
      stroke: #64748b;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
      transition: fill 160ms ease, stroke 160ms ease;
    }

    .popup-like:hover rect,
    .popup-like:focus rect,
    .popup-like.is-liked rect,
    .popup-why-link:hover rect,
    .popup-why-link:focus rect {
      fill: #f0fdfa;
      stroke: #0f766e;
    }

    .popup-like:hover path,
    .popup-like:focus path,
    .popup-like.is-liked path {
      fill: #14b8a6;
      stroke: #0f766e;
    }

    .popup-like:focus,
    .popup-why-link:focus {
      outline: none;
    }

    .popup-like-label,
    .popup-why-label {
      fill: #334155;
      font-size: 13px;
      font-weight: 700;
    }

    .popup-why-arrow {
      fill: none;
      stroke: #0f766e;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
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
  const cardX = Number(svg.dataset.popupCardX);
  const cardY = Number(svg.dataset.popupCardY);
  const cardWidth = Number(svg.dataset.popupCardWidth);
  const minCardHeight = Number(svg.dataset.popupCardHeight);
  const copyY = Number(svg.dataset.popupCopyY);
  const footerGap = Number(svg.dataset.popupFooterGap || 34);
  const footerHeight = Number(svg.dataset.popupFooterHeight || 58);
  const buttonHeight = 36;
  const buttonInset = 40;
  const like = createElement("g", {
    class: "popup-like",
    role: "button",
    tabindex: "0",
    "aria-label": "Like this insight",
    "aria-pressed": "false"
  });
  const likeRect = createElement("rect", {
    x: cardX + 40,
    y: 0,
    width: 96,
    height: buttonHeight,
    rx: 10
  });
  const likeIcon = createElement("path", {
    d: "M0,-4 C0,-10 9,-10 9,-3 C9,4 0,9 0,9 C0,9 -9,4 -9,-3 C-9,-10 0,-10 0,-4 Z",
    transform: `translate(${cardX + 60} 0)`
  });
  const likeLabel = createElement("text", {
    class: "popup-like-label",
    x: cardX + 78,
    y: 0
  }, "Like");
  const whyLink = createElement("a", {
    class: "popup-why-link",
    href: svg.dataset.popupWhyHref || "find-out-why.html",
    target: "_top",
    tabindex: "0",
    "aria-label": "Find out more"
  });
  const whyRect = createElement("rect", {
    x: cardX + cardWidth - 188,
    y: 0,
    width: 148,
    height: buttonHeight,
    rx: 18
  });
  const whyLabel = createElement("text", {
    class: "popup-why-label",
    x: cardX + cardWidth - 164,
    y: 0
  }, "Find out more");
  const whyArrow = createElement("path", {
    class: "popup-why-arrow",
    d: "M0,0 L16,0 M10,-6 L16,0 L10,6",
    transform: `translate(${cardX + cardWidth - 78} 0)`
  });
  const footerDivider = createElement("line", {
    class: "popup-footer-divider",
    x1: cardX + buttonInset,
    y1: 0,
    x2: cardX + cardWidth - buttonInset,
    y2: 0
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
  like.append(likeRect, likeIcon, likeLabel);
  whyLink.append(whyRect, whyLabel, whyArrow);
  popup.append(backdrop, card, kicker, title, copy, footerDivider, like, whyLink, close);
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

    const lines = wrapText(text);

    lines.forEach((line, index) => {
      const tspan = createElement("tspan", {
        x: svg.dataset.popupCopyX,
        dy: index === 0 ? 0 : lineHeight
      }, index < lines.length - 1 ? `${line} ` : line);

      copy.appendChild(tspan);
    });

    return lines.length;
  };

  const setElementAttributes = (element, attributes) => {
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
  };

  const layoutFooter = (lineCount) => {
    const copyLastBaseline = copyY + Math.max(lineCount - 1, 0) * lineHeight;
    const footerY = Math.max(
      cardY + minCardHeight - footerHeight,
      copyLastBaseline + footerGap
    );
    const cardHeight = Math.max(minCardHeight, footerY + footerHeight - cardY);
    const buttonY = footerY + 14;
    const buttonCenterY = buttonY + buttonHeight / 2;

    card.setAttribute("height", String(cardHeight));
    setElementAttributes(footerDivider, {
      y1: footerY,
      y2: footerY
    });
    setElementAttributes(likeRect, { y: buttonY });
    likeIcon.setAttribute("transform", `translate(${cardX + 60} ${buttonCenterY})`);
    likeLabel.setAttribute("y", String(buttonY + 23));
    setElementAttributes(whyRect, { y: buttonY });
    whyLabel.setAttribute("y", String(buttonY + 23));
    whyArrow.setAttribute("transform", `translate(${cardX + cardWidth - 78} ${buttonCenterY})`);
  };

  const openPopup = (node) => {
    activeNode = node;
    kicker.textContent = node.dataset.popupKicker || svg.dataset.popupKicker || "";
    title.textContent = node.dataset.popupTitle || "";
    layoutFooter(setCopy(node.dataset.popupText || ""));
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

  const toggleLike = () => {
    const isLiked = like.classList.toggle("is-liked");
    like.setAttribute("aria-pressed", String(isLiked));
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

  like.addEventListener("click", toggleLike);

  like.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLike();
    }
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
