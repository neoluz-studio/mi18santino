(() => {

    "use strict";


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const config = window.INVITATION_CONFIG;

    if (!config) {

        console.error(
            "No se encontró INVITATION_CONFIG."
        );

        return;
    }


    /* =====================================================
       UTILIDADES
    ===================================================== */

    const $ = (
        selector,
        context = document
    ) => context.querySelector(selector);


    const $$ = (
        selector,
        context = document
    ) => [
        ...context.querySelectorAll(selector)
    ];


    const setText = (
        selector,
        value = ""
    ) => {

        const element = $(selector);

        if (element) {

            element.textContent =
                value ?? "";

        }

    };


    const imagePath = (
        filename
    ) => {

        if (!filename) {
            return "";
        }

        return `assets/images/${filename}`;

    };


    const sanitizePhone = (
        phone
    ) => {

        return String(
            phone || ""
        ).replace(/\D/g, "");

    };


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const welcome =
        $("#welcome");

    const enterButton =
        $("#enterBtn");

    const invitation =
        $("#invitation");

    const music =
        $("#music");

    const musicButton =
        $("#musicBtn");

    const giftDialog =
        $("#giftDialog");

    const giftOpenButton =
        $("#giftOpen");

    const giftCloseButton =
        $("#giftClose");

    const copyAliasButton =
        $("#copyAlias");

    const whatsappButton =
        $("#whatsappConfirm");


    /* =====================================================
       TEXTOS
    ===================================================== */

    setText(
        "#welcomeTitle",
        config.welcome?.title
    );


    setText(
        "#welcomeSubtitle",
        config.welcome?.subtitle
    );


    setText(
        "#enterBtn",
        config.welcome?.button ||
        "INGRESAR"
    );


    setText(
        "#heroEyebrow",
        config.event?.eyebrow
    );


    setText(
        "#heroName",
        config.event?.name
    );


    setText(
        "#firstPhrase",
        config.texts?.firstPhrase
    );


    setText(
        "#middlePhrase",
        config.texts?.middlePhrase
    );


    setText(
        "#closingText",
        config.texts?.closing
    );


    setText(
        "#dateLabel",
        config.venue?.dateLabel
    );


    setText(
        "#timeLabel",
        config.venue?.timeLabel
    );


    setText(
        "#venueName",
        config.venue?.name
    );


    setText(
        "#dressCode",
        config.dressCode
    );


    setText(
        "#giftIntro",
        config.gifts?.intro
    );


    setText(
        "#giftAlias",
        config.gifts?.alias
    );


    setText(
        "#giftHolder",
        config.gifts?.holder
    );


    setText(
        "#deadline",
        config.event?.deadline
    );


    /* =====================================================
       TÍTULO DEL DOCUMENTO
    ===================================================== */

    if (config.event?.name) {

        document.title =
            `Mis 18 ${config.event.name}`;

        const description =
            $('meta[name="description"]');

        if (description) {

            description.content =
                `Invitación digital para los 18 años de ${config.event.name}.`;

        }

    }


    /* =====================================================
       IMÁGENES
    ===================================================== */

    const heroImage =
        $("#heroImage");

    const closingImage =
        $("#closingImage");


    if (
        heroImage &&
        config.images?.hero
    ) {

        heroImage.src =
            imagePath(
                config.images.hero
            );

        heroImage.alt =
            `Fotografía de ${config.event?.name || "Santino"}`;

    }


    if (
        closingImage &&
        config.images?.hero
    ) {

        closingImage.src =
            imagePath(
                config.images.hero
            );

        closingImage.alt =
            `Fotografía de ${config.event?.name || "Santino"}`;

    }


    /* =====================================================
       GOOGLE MAPS
    ===================================================== */

    const mapsLink =
        $("#mapsLink");


    if (mapsLink) {

        const url =
            config.venue?.mapsUrl || "#";

        mapsLink.href = url;


        if (url === "#") {

            mapsLink.setAttribute(
                "aria-disabled",
                "true"
            );

        }

    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const setupWhatsApp =
        () => {

            if (!whatsappButton) {
                return;
            }


            const phone =
                sanitizePhone(
                    config.rsvp?.phone
                );


            const message =
                config.rsvp?.message ||
                "Hola Santino, confirmo mi asistencia a tus 18 años.";


            if (!phone) {

                whatsappButton.href =
                    "#";

                whatsappButton.setAttribute(
                    "aria-disabled",
                    "true"
                );

                whatsappButton.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        const status =
                            $("#whatsappStatus");

                        if (status) {

                            status.textContent =
                                "Todavía no se configuró el número de WhatsApp.";

                        }

                    }
                );

                return;
            }


            const whatsappUrl =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


            whatsappButton.href =
                whatsappUrl;


            whatsappButton.removeAttribute(
                "aria-disabled"
            );

        };


    setupWhatsApp();


    /* =====================================================
       MÚSICA
    ===================================================== */

    if (music) {

        music.src =
            config.music?.src || "";

        music.volume =
            Math.min(
                1,
                Math.max(
                    0,
                    Number(
                        config.music?.volume ??
                        0.55
                    )
                )
            );

    }


    const updateMusicButton =
        () => {

            if (
                !musicButton ||
                !music
            ) {

                return;

            }


            const isPlaying =
                !music.paused;


            musicButton.classList.toggle(
                "is-playing",
                isPlaying
            );


            musicButton.setAttribute(
                "aria-pressed",
                String(isPlaying)
            );


            musicButton.setAttribute(
                "aria-label",
                isPlaying
                    ? "Pausar música"
                    : "Reproducir música"
            );


            const icon =
                $("span", musicButton);


            if (icon) {

                icon.textContent =
                    isPlaying
                        ? "Ⅱ"
                        : "♪";

            }

        };


    const playMusic =
        async () => {

            if (
                !music ||
                !config.music?.src
            ) {

                return;

            }


            try {

                await music.play();

            } catch (error) {

                console.info(
                    "El navegador no permitió reproducir automáticamente la música.",
                    error
                );

            }


            updateMusicButton();

        };


    const pauseMusic =
        () => {

            if (!music) {
                return;
            }

            music.pause();

            updateMusicButton();

        };


    if (
        musicButton &&
        music
    ) {

        musicButton.addEventListener(
            "click",
            async () => {

                if (music.paused) {

                    await playMusic();

                } else {

                    pauseMusic();

                }

            }
        );


        music.addEventListener(
            "play",
            updateMusicButton
        );


        music.addEventListener(
            "pause",
            updateMusicButton
        );


        music.addEventListener(
            "ended",
            updateMusicButton
        );

    }


    /* =====================================================
       INGRESO
    ===================================================== */

    const enterInvitation =
        async () => {

            if (welcome) {

                welcome.classList.add(
                    "is-hidden"
                );

                welcome.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            document.body.classList.remove(
                "no-scroll"
            );


            if (invitation) {

                invitation.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            if (musicButton) {

                musicButton.hidden =
                    false;

            }


            await playMusic();


            window.setTimeout(
                () => {

                    welcome?.remove();

                },
                1100
            );

        };


    if (enterButton) {

        enterButton.addEventListener(
            "click",
            enterInvitation
        );

    }


    /* =====================================================
       CUENTA REGRESIVA
    ===================================================== */

    let countdownInterval =
        null;


    const renderCountdownFinished =
        () => {

            const countdown =
                $("#countdown");

            if (!countdown) {
                return;
            }


            countdown.innerHTML = `
                <p class="countdown__finished">
                    ¡LLEGÓ EL GRAN DÍA!
                </p>
            `;

        };


    const updateCountdown =
        () => {

            const eventDate =
                new Date(
                    config.event?.date
                );


            const distance =
                eventDate.getTime() -
                Date.now();


            if (
                Number.isNaN(
                    eventDate.getTime()
                ) ||
                distance <= 0
            ) {

                renderCountdownFinished();


                if (countdownInterval) {

                    window.clearInterval(
                        countdownInterval
                    );

                }


                return;

            }


            const days =
                Math.floor(
                    distance /
                    86_400_000
                );


            const hours =
                Math.floor(
                    (
                        distance %
                        86_400_000
                    ) /
                    3_600_000
                );


            const minutes =
                Math.floor(
                    (
                        distance %
                        3_600_000
                    ) /
                    60_000
                );


            const seconds =
                Math.floor(
                    (
                        distance %
                        60_000
                    ) /
                    1_000
                );


            setText(
                "#days",
                String(days)
                    .padStart(2, "0")
            );


            setText(
                "#hours",
                String(hours)
                    .padStart(2, "0")
            );


            setText(
                "#minutes",
                String(minutes)
                    .padStart(2, "0")
            );


            setText(
                "#seconds",
                String(seconds)
                    .padStart(2, "0")
            );

        };


    updateCountdown();


    countdownInterval =
        window.setInterval(
            updateCountdown,
            1000
        );


    /* =====================================================
       GALERÍA
    ===================================================== */

    const createGallery =
        (
            filenames,
            targetSelector,
            startIndex = 0
        ) => {

            const gallery =
                $(targetSelector);


            if (
                !gallery ||
                !Array.isArray(
                    filenames
                )
            ) {

                return;

            }


            gallery.innerHTML =
                "";


            filenames.forEach(
                (
                    filename,
                    index
                ) => {

                    if (!filename) {
                        return;
                    }


                    const figure =
                        document.createElement(
                            "figure"
                        );


                    figure.className =
                        "reveal";


                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        imagePath(
                            filename
                        );


                    image.alt =
                        `Fotografía ${
                            startIndex +
                            index +
                            1
                        } de ${
                            config.event?.name ||
                            "Santino"
                        }`;


                    image.loading =
                        "lazy";


                    image.decoding =
                        "async";


                    figure.appendChild(
                        image
                    );


                    gallery.appendChild(
                        figure
                    );

                }
            );

        };


    const galleryImages =
        Array.isArray(
            config.images?.gallery
        )
            ? config.images.gallery
            : [];


    createGallery(
        galleryImages.slice(
            0,
            5
        ),
        "#galleryOne",
        0
    );


    createGallery(
        galleryImages.slice(
            5
        ),
        "#galleryTwo",
        5
    );


    /* =====================================================
       ANIMACIONES SCROLL
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        $$(".reveal").forEach(
            (element) => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    } else {

        const revealObserver =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        $$(".reveal").forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       MODAL DE REGALOS
    ===================================================== */

    const closeGiftDialog =
        () => {

            if (!giftDialog) {
                return;
            }


            if (
                typeof giftDialog.close ===
                    "function" &&
                giftDialog.open
            ) {

                giftDialog.close();

            } else {

                giftDialog.removeAttribute(
                    "open"
                );

            }

        };


    if (
        giftDialog &&
        giftOpenButton &&
        giftCloseButton
    ) {

        giftOpenButton.addEventListener(
            "click",
            () => {

                if (
                    typeof giftDialog.showModal ===
                    "function"
                ) {

                    giftDialog.showModal();

                } else {

                    giftDialog.setAttribute(
                        "open",
                        ""
                    );

                }

            }
        );


        giftCloseButton.addEventListener(
            "click",
            closeGiftDialog
        );


        giftDialog.addEventListener(
            "click",
            (event) => {

                const rect =
                    giftDialog.getBoundingClientRect();


                const clickedOutside =
                    event.clientX <
                        rect.left ||
                    event.clientX >
                        rect.right ||
                    event.clientY <
                        rect.top ||
                    event.clientY >
                        rect.bottom;


                if (clickedOutside) {

                    closeGiftDialog();

                }

            }
        );


        giftDialog.addEventListener(
            "close",
            () => {

                setText(
                    "#copyStatus",
                    ""
                );

            }
        );

    }


    /* =====================================================
       COPIAR ALIAS
    ===================================================== */

    const copyAliasFallback =
        (text) => {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            textarea.setAttribute(
                "readonly",
                ""
            );


            textarea.style.position =
                "fixed";


            textarea.style.opacity =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            textarea.setSelectionRange(
                0,
                textarea.value.length
            );


            const successful =
                document.execCommand(
                    "copy"
                );


            textarea.remove();


            return successful;

        };


    if (copyAliasButton) {

        copyAliasButton.addEventListener(
            "click",
            async () => {

                const alias =
                    config.gifts?.alias ||
                    "";


                if (
                    !alias ||
                    alias === "PONER_ALIAS"
                ) {

                    setText(
                        "#copyStatus",
                        "Todavía no configuraste el alias."
                    );

                    return;

                }


                try {

                    if (
                        navigator.clipboard &&
                        window.isSecureContext
                    ) {

                        await navigator.clipboard.writeText(
                            alias
                        );

                    } else {

                        const copied =
                            copyAliasFallback(
                                alias
                            );


                        if (!copied) {

                            throw new Error(
                                "No se pudo copiar."
                            );

                        }

                    }


                    setText(
                        "#copyStatus",
                        "ALIAS COPIADO"
                    );

                } catch (error) {

                    console.error(
                        error
                    );


                    setText(
                        "#copyStatus",
                        "COPIÁ EL ALIAS MANUALMENTE"
                    );

                }

            }
        );

    }


    /* =====================================================
       ENLACES DESHABILITADOS
    ===================================================== */

    $$(
        '[aria-disabled="true"]'
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                }
            );

        }
    );


})();