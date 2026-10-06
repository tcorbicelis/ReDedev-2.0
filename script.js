const menu = document.querySelector("#menu");
const nav = document.querySelector("header nav");

if (menu && nav) {
  function setMenuOpen(open) {
    nav.classList.toggle("open", open);

    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Fechar menu" : "Abrir menu"
    );
  }

  // Abre ou fecha o menu.
  menu.addEventListener("click", () => {
    const isOpen = menu.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  // Fecha o menu ao selecionar uma seção.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  // Fecha o menu com Escape e devolve o foco ao botão.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      menu.focus();
    }
  });

  // Fecha o menu ao clicar fora dele.
  document.addEventListener("click", (event) => {
    if (
      !nav.contains(event.target) &&
      !menu.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  // Limpa o estado do menu ao mudar para o layout desktop.
  const desktop = window.matchMedia("(min-width: 721px)");

  desktop.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}

// Animações de entrada ao rolar a página.
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (
  "IntersectionObserver" in window &&
  !reducedMotion.matches
) {
  const elements = document.querySelectorAll(`
    .section-head,
    .services article,
    .about > div,
    .steps article,
    .stack,
    .contact > .eyebrow,
    .contact > h2,
    .contact-bottom
  `);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  elements.forEach((element) => {
    // Mantém visível o conteúdo que já está na tela.
    const bounds = element.getBoundingClientRect();

    if (
      bounds.top < window.innerHeight &&
      bounds.bottom > 0
    ) {
      return;
    }

    element.classList.add("reveal");
    observer.observe(element);
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      observer.disconnect();
    }
  });
}

// Cursor: ponto azul e círculo com acompanhamento suave.
(() => {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!dot || !ring) return;

  const desktopPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let frameId = null;
  let visible = false;

  const interactiveSelector = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "summary",
    '[role="button"]'
  ].join(", ");

  function drawRing() {
    if (!visible) return;

    const ease = reducedMotion.matches ? 1 : 0.16;

    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    frameId = requestAnimationFrame(drawRing);
  }

  function hideCursor() {
    visible = false;
    cancelAnimationFrame(frameId);
    frameId = null;

    document.body.classList.remove(
      "cursor-visible",
      "cursor-hover"
    );
  }

  function updateCursorMode() {
    hideCursor();

    document.body.classList.toggle(
      "custom-cursor",
      desktopPointer.matches
    );
  }

  document.addEventListener("pointermove", (event) => {
    if (
      !desktopPointer.matches ||
      event.pointerType !== "mouse"
    ) {
      hideCursor();
      return;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    document.body.classList.toggle(
      "cursor-hover",
      event.target instanceof Element &&
        Boolean(event.target.closest(interactiveSelector))
    );

    if (!visible) {
      visible = true;
      ringX = mouseX;
      ringY = mouseY;

      document.body.classList.add("cursor-visible");
      drawRing();
    }
  });

  document.documentElement.addEventListener(
    "pointerleave",
    hideCursor
  );

  window.addEventListener("blur", hideCursor);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideCursor();
  });

  desktopPointer.addEventListener("change", updateCursorMode);

  updateCursorMode();
})();

// Halo e iluminação dos cartões.
(() => {
  const glow = document.querySelector(".mouse-glow");
  const cards = document.querySelectorAll(".services article");

  if (!glow) return;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let frameId = null;
  let mouseX = 0;
  let mouseY = 0;

  function hideGlow() {
    glow.classList.remove("is-active");
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  document.addEventListener("pointermove", (event) => {
    if (
      !finePointer.matches ||
      reducedMotion.matches ||
      event.pointerType !== "mouse"
    ) {
      hideGlow();
      return;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (frameId !== null) return;

    frameId = requestAnimationFrame(() => {
      glow.style.left = `${mouseX}px`;
      glow.style.top = `${mouseY}px`;
      glow.classList.add("is-active");
      frameId = null;
    });
  });

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (
        !finePointer.matches ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      const bounds = card.getBoundingClientRect();

      card.style.setProperty(
        "--glow-x",
        `${event.clientX - bounds.left}px`
      );

      card.style.setProperty(
        "--glow-y",
        `${event.clientY - bounds.top}px`
      );
    });
  });

  document.documentElement.addEventListener(
    "pointerleave",
    hideGlow
  );

  window.addEventListener("blur", hideGlow);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideGlow();
  });

  finePointer.addEventListener("change", hideGlow);
  reducedMotion.addEventListener("change", hideGlow);
})();

// Inclinação suave dos cartões de serviços.
(() => {
  const cards = document.querySelectorAll(
  ".services article, .contact-bottom .button"
);

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const states = [];

  cards.forEach((card) => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = null;

    function animate() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const distance = Math.hypot(currentX, currentY);

      if (distance > 0.001) {
        card.style.setProperty(
          "--tilt-axis",
          `${-currentY / distance} ${currentX / distance} 0`
        );

        card.style.setProperty(
          "--tilt-angle",
          `${Math.min(distance, 1) * 4}deg`
        );
      } else {
        card.style.setProperty("--tilt-angle", "0deg");
      }

      if (
        Math.abs(targetX - currentX) +
        Math.abs(targetY - currentY) > 0.001
      ) {
        frameId = requestAnimationFrame(animate);
      } else {
        frameId = null;
      }
    }

    function startAnimation() {
      if (frameId === null) {
        frameId = requestAnimationFrame(animate);
      }
    }

    function returnToCenter() {
      targetX = 0;
      targetY = 0;
      startAnimation();
    }

    function reset() {
      cancelAnimationFrame(frameId);
      frameId = null;

      targetX = targetY = currentX = currentY = 0;

      card.style.removeProperty("--tilt-axis");
      card.style.removeProperty("--tilt-angle");
    }

    card.addEventListener("pointermove", (event) => {
      if (
        !finePointer.matches ||
        reducedMotion.matches ||
        event.pointerType !== "mouse"
      ) {
        return;
      }

      const bounds = card.getBoundingClientRect();

      targetX = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
        )
      );

      targetY = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
        )
      );

      startAnimation();
    });

    card.addEventListener("pointerleave", returnToCenter);

    states.push({ reset, returnToCenter });
  });

  function resetAll() {
    states.forEach((state) => state.reset());
  }

  finePointer.addEventListener("change", resetAll);
  reducedMotion.addEventListener("change", resetAll);

  window.addEventListener("blur", resetAll);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetAll();
  });
})();