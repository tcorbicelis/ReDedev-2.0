        const menuToggle =
            document.getElementById(
                "menuToggle"
            );

        const navMenu =
            document.getElementById(
                "navMenu"
            );


        menuToggle.addEventListener(
            "click",
            () => {

                menuToggle.classList.toggle(
                    "active"
                );

                navMenu.classList.toggle(
                    "active"
                );

            }
        );


        /* Fecha o menu ao clicar em um link */

        const menuLinks =
            navMenu.querySelectorAll("a");


        menuLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        menuToggle.classList.remove(
                            "active"
                        );

                        navMenu.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

window.addEventListener("load", function () {

    const preloader =
        document.getElementById("preloader");

    setTimeout(() => {

        preloader.classList.add("hidden");

    }, 800);

});
