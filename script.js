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