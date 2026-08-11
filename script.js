// Get the guest name from the URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get("guest");

const guestNameElement = document.getElementById("guestName");

if (guestName && guestNameElement) {
    guestNameElement.textContent = guestName;
}

document
    .getElementById("scrollButton")
    .addEventListener("click", function () {

        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });

    });

    // =========================
// WEDDING COUNTDOWN
// =========================

const weddingDate = new Date("March 04, 2027 01:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;

    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);

// =========================
// WEDDING MUSIC
// =========================

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

musicButton.addEventListener("click", function () {

    if (music.paused) {

        music.play();

        musicIcon.textContent = "❚❚";
        musicText.textContent = "PAUSE MUSIC";

    } else {

        music.pause();

        musicIcon.textContent = "▶";
        musicText.textContent = "PLAY MUSIC";

    }

});

// =========================
// SCROLL REVEAL ANIMATION
// =========================

const animatedElements = document.querySelectorAll(
    ".story-content, .gallery-content, .countdown-content, .wedding-day-content, .venue-content, .rsvp-content, .music-content, .final-content"
);

// First hide all sections
animatedElements.forEach(function (element) {
    element.classList.add("fade-in");
});

// Watch when sections enter the screen
const revealObserver = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                // Stop watching after it appears
                revealObserver.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);

// Start watching
animatedElements.forEach(function (element) {
    revealObserver.observe(element);
});

// =========================
// BACK TO TOP
// =========================

const topButton = document.getElementById("topButton");

window.addEventListener("scroll", function () {

    if (window.scrollY > 600) {
        topButton.classList.add("show");
    } else {
        topButton.classList.remove("show");
    }

});

topButton.addEventListener("click", function () {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// =========================================
// OPEN WEDDING INVITATION
// =========================================

const welcomeScreen =
    document.getElementById("welcomeScreen");

const openInvitation =
    document.getElementById("openInvitation");


openInvitation.addEventListener("click", function () {

    // Start the wedding music
    const weddingMusic = document.getElementById("weddingMusic");

    weddingMusic.volume = 0.5;

    weddingMusic.play().catch(function(error) {
        console.log("Music could not autoplay:", error);
    });

    // Open the invitation
    welcomeScreen.classList.add("opening");

    document.body.classList.remove("invitation-locked");
    document.body.classList.add("invitation-open");

});

// For each Invitee
const params = new URLSearchParams(window.location.search);
const guest = params.get("guest");

if (guest) {
    document.getElementById("guestName").textContent = guest;
}