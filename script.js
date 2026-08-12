// Get the guest name and code from the URL
// =========================================
// INVITATION DETAILS
// =========================================

const urlParams = new URLSearchParams(window.location.search);

const guestName = urlParams.get("guest");
const invitationCode = urlParams.get("code");

const guestNameElement =
    document.getElementById("guestName");

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
/*const params = new URLSearchParams(window.location.search);
const guest = params.get("guest");

if (guest) {
    document.getElementById("guestName").textContent = guest;
}*/

// =========================================
// RSVP FORM
// =========================================

const rsvpGuestName = document.getElementById("rsvpGuestName");
const attendanceButtons =
    document.querySelectorAll(".attendance-button");

const minusGuest =
    document.getElementById("minusGuest");

const plusGuest =
    document.getElementById("plusGuest");

const guestCount =
    document.getElementById("guestCount");

const submitRsvp =
    document.getElementById("submitRsvp");

const rsvpMessage =
    document.getElementById("rsvpMessage");
    
// RSVP LOCK STATUS
let rsvpAlreadySubmitted = false;


// Get guest name from URL

const rsvpParams =
    new URLSearchParams(window.location.search);

const rsvpGuest =
    rsvpParams.get("guest");

const rsvpCode =
    rsvpParams.get("code");

if (rsvpGuest) {

    rsvpGuestName.value =
        decodeURIComponent(rsvpGuest);

}


// Attendance

let selectedAttendance = "";

attendanceButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        attendanceButtons.forEach(function(btn) {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedAttendance =
            button.dataset.attendance;

    });

});


// Guest counter

let numberOfGuests = 1;


minusGuest.addEventListener("click", function() {

    if (numberOfGuests > 1) {

        numberOfGuests--;

        guestCount.textContent =
            numberOfGuests;

    }

});


plusGuest.addEventListener("click", function() {

    if (numberOfGuests < 10) {

        numberOfGuests++;

        guestCount.textContent =
            numberOfGuests;

    }

});

// =========================================
// CHECK WHETHER THIS INVITATION ALREADY
// SUBMITTED AN RSVP
// =========================================

async function checkRSVPStatus() {

    if (!rsvpCode) {

        console.error("Invitation code is missing.");

        return;
    }

    try {

        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzsxoFCUH3kBUilZrvRhEL7ox7N1i-bAb9tNMw05Uy3LmHOej5DFMTTNGctNziHnDa_/exec" +
            "?action=checkRSVP&code=" +
            encodeURIComponent(rsvpCode)
        );

        const result =
            await response.json();

        if (result.submitted) {

            rsvpAlreadySubmitted = true;

            lockRSVPForm();

            rsvpMessage.textContent =
                "Your RSVP has already been received. Thank you!";

        }

    } catch (error) {

        console.error(
            "Could not check RSVP status:",
            error
        );

    }
}

// =========================================
// LOCK RSVP FORM
// =========================================

function lockRSVPForm() {

    attendanceButtons.forEach(function(button) {

        button.disabled = true;

        button.style.pointerEvents = "none";

    });


    minusGuest.disabled = true;

    plusGuest.disabled = true;

    submitRsvp.disabled = true;


    submitRsvp.textContent =
        "RSVP ALREADY SENT ♥";


    rsvpMessage.textContent =
        "Your RSVP has already been received. Thank you!";
}
checkRSVPStatus();

// Submit RSVP

submitRsvp.addEventListener("click", async function() {

    // Prevent changing/submitting an RSVP
    // that has already been submitted
    if (rsvpAlreadySubmitted) {

        rsvpMessage.textContent =
            "Your RSVP has already been received.";

        return;
    }


    if (!selectedAttendance) {

        rsvpMessage.textContent =
            "Please select whether you will attend.";

        return;

    }


    const guestName =
        rsvpGuestName.value.trim();


    if (!guestName) {

        rsvpMessage.textContent =
            "Guest name is missing.";

        return;

    }


    submitRsvp.disabled = true;

    submitRsvp.textContent =
        "SENDING...";


    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzsxoFCUH3kBUilZrvRhEL7ox7N1i-bAb9tNMw05Uy3LmHOej5DFMTTNGctNziHnDa_/exec",
        {
            method: "POST",

            body: JSON.stringify({

            guest: guestName,

            code: rsvpCode,

            attendance:
            selectedAttendance,

            numberOfGuests:
            numberOfGuests

})
        }
    );


    const result =
        await response.json();


    if (result.success) {
        
         rsvpAlreadySubmitted = true;

    lockRSVPForm();

        rsvpMessage.textContent =
            "Thank you! Your RSVP has been received.";

        submitRsvp.textContent =
            "RSVP SENT ♥";

    } else {

        rsvpMessage.textContent =
            "Something went wrong. Please try again.";

        submitRsvp.disabled = false;

        submitRsvp.textContent =
            "RSVP NOW ♥";

    }

});

// =========================================
// CHECK IF RSVP ALREADY SUBMITTED
// =========================================

async function checkRSVPStatus() {

    if (!rsvpCode) {

        console.error(
            "Invitation code is missing."
        );

        return;
    }


    try {

        const response = await fetch(

            "https://script.google.com/macros/s/AKfycbzsxoFCUH3kBUilZrvRhEL7ox7N1i-bAb9tNMw05Uy3LmHOej5DFMTTNGctNziHnDa_/exec" +

            "?action=checkRSVP&code=" +

            encodeURIComponent(rsvpCode)

        );


        const result =
            await response.json();


        if (result.submitted) {

            rsvpAlreadySubmitted = true;

            lockRSVPForm();

        }

    } catch (error) {

        console.error(
            "RSVP status check failed:",
            error
        );

    }
}