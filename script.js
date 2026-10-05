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