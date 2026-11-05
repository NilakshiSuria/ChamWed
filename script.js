
// =========================================
// GOOGLE APPS SCRIPT API
// =========================================
const RSVP_API =
    "https://script.google.com/macros/s/AKfycby5pcj98kNEDIcKYat8AGWjenMK23W0o3nRuKmAg5BAig4n8VXc1XXzpytexRdUAL4C/exec";
// Get the guest name and code from the URL
// =========================================
// INVITATION DETAILS
// =========================================

// =========================================
// LOAD GUEST NAME FROM INVITATION CODE
// =========================================

const urlParams =
    new URLSearchParams(window.location.search);

const invitationCode =
    urlParams.get("code");

const guestNameElement =
    document.getElementById("guestName");

// =========================================
// RSVP FORM
// =========================================

const rsvpGuestName = document.getElementById("rsvpGuestName");
const attendanceButtons =
    document.querySelectorAll(".attendance-button");

/* const minusGuest =
    document.getElementById("minusGuest");

const plusGuest =
    document.getElementById("plusGuest");
*/
/*const guestCount =
    document.getElementById("guestCount"); */

const submitRsvp =
    document.getElementById("submitRsvp");

const rsvpMessage =
    document.getElementById("rsvpMessage");

// RSVP LOCK STATUS
let rsvpAlreadySubmitted = false;

// FIXED NUMBER OF GUESTS FOR THIS INVITATION
let allowedGuests = 0;


// =========================================
// SHARED INVITATION DATA
// =========================================

let invitationData = null;
let invitationPromise = null;


// =========================================
// LOAD INVITATION DATA
// =========================================

function getInvitationData() {

    // No invitation code
    if (!invitationCode) {
        return Promise.resolve(null);
    }


    // -----------------------------------------
    // CHECK LOCAL CACHE FIRST
    // -----------------------------------------

    const cacheKey =
        "wedding_invitation_" + invitationCode;

    const cached =
        localStorage.getItem(cacheKey);


    if (cached) {

        try {

            const data =
                JSON.parse(cached);

            console.log(
                "Using cached invitation:",
                data
            );

            invitationData = data;

        } catch (error) {

            localStorage.removeItem(cacheKey);

        }
    }


    // -----------------------------------------
    // IF ALREADY LOADING, USE SAME REQUEST
    // -----------------------------------------

    if (invitationPromise) {

        return invitationPromise;

    }


    // -----------------------------------------
    // REQUEST FROM GOOGLE APPS SCRIPT
    // -----------------------------------------

    invitationPromise =
        fetch(
            RSVP_API +
            "?action=checkRSVP&code=" +
            encodeURIComponent(invitationCode)
        )
            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );

                }

                return response.json();

            })
            .then(function (result) {

                console.log(
                    "Invitation data:",
                    result
                );


                if (result.found) {

                    invitationData =
                        result;


                    // Save for immediate loading
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify(result)
                    );

                }

                return result;

            })
            .catch(function (error) {

                console.error(
                    "Invitation request failed:",
                    error
                );

                // If server fails but cache exists,
                // still use cached information.
                return invitationData;

            });


    return invitationPromise;
}

// =========================================
// DISPLAY INVITATION DATA
// =========================================

function displayInvitationData(data) {

    if (
        !data ||
        !data.found
    ) {

        return;

    }


    // -----------------------------------------
    // FIRST PAGE GUEST NAME
    // -----------------------------------------

    if (guestNameElement) {

        guestNameElement.textContent =
            data.guest;

    }


    // -----------------------------------------
    // RSVP NAME
    // -----------------------------------------

    if (rsvpGuestName) {

        rsvpGuestName.value =
            data.guest;

    }


    // -----------------------------------------
    // RSVP GUEST COUNT
    // -----------------------------------------

    allowedGuests = Number(data.guests) || 0;


    // -----------------------------------------
    // RSVP STATUS
    // -----------------------------------------

    if (data.submitted) {

        rsvpAlreadySubmitted =
            true;

        lockRSVPForm();

    }
}

const scrollButton = document.getElementById("scrollButton");

if (scrollButton) {
    scrollButton.addEventListener("click", function () {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    });
}

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

    weddingMusic.play().catch(function (error) {
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



// Get guest name from URL

const rsvpCode =
    invitationCode;


// Attendance

let selectedAttendance = "";

attendanceButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        attendanceButtons.forEach(function (btn) {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedAttendance =
            button.dataset.attendance;

    });

});


// Guest counter

/* plusGuest.addEventListener("click", function() {

    if (numberOfGuests < 10) {

        numberOfGuests++;

        guestCount.textContent =
            numberOfGuests;

    }

});
*/

// =========================================
// CHECK RSVP STATUS
// =========================================

async function checkRSVPStatus() {

    console.log(
        "Checking invitation..."
    );


    if (!rsvpCode) {

        rsvpMessage.textContent =
            "Invitation code is missing.";

        return;

    }


    try {

        const result =
            await getInvitationData();


        if (
            !result ||
            !result.found
        ) {

            rsvpMessage.textContent =
                "Invalid invitation.";

            return;

        }


        displayInvitationData(result);


        console.log(
            "Guest:",
            result.guest
        );

        console.log(
            "Guests:",
            result.guests
        );

        console.log(
            "Submitted:",
            result.submitted
        );


    } catch (error) {

        console.error(
            "RSVP status check failed:",
            error
        );

        rsvpMessage.textContent =
            "Unable to check RSVP status.";

    }
}

// =========================================
// LOCK RSVP FORM
// =========================================

function lockRSVPForm() {

    attendanceButtons.forEach(function (button) {

        button.disabled = true;

        button.style.pointerEvents =
            "none";

    });

    submitRsvp.disabled = true;

    submitRsvp.textContent =
        "RSVP ALREADY SENT ♥";

    rsvpMessage.textContent =
        "Your RSVP has already been received. Thank you!";
}
// =========================================
// CHECK RSVP WHEN PAGE OPENS
// =========================================

checkRSVPStatus();

// =========================================
// SUBMIT RSVP
// =========================================

submitRsvp.addEventListener("click", async function () {

    // Already submitted
    if (rsvpAlreadySubmitted) {

        rsvpMessage.textContent =
            "Your RSVP has already been received.";

        return;
    }


    // Check attendance
    if (!selectedAttendance) {

        rsvpMessage.textContent =
            "Please select whether you will attend.";

        return;
    }


    // Check code
    if (!rsvpCode) {

        rsvpMessage.textContent =
            "Invitation code is missing.";

        return;
    }


    // Prevent double click
    submitRsvp.disabled = true;

    submitRsvp.textContent =
        "SENDING...";


    try {

        const response = await fetch(
    RSVP_API,
    {
        method: "POST",

        body: JSON.stringify({
            code: rsvpCode,
            attendance: selectedAttendance
        })
    }
);


        const result =
            await response.json();


        console.log(
            "RSVP submission:",
            result
        );


        // =====================================
        // SUCCESS
        // =====================================

        if (result.success) {

            rsvpAlreadySubmitted =
                true;


            // Update local invitation data
            const updatedInvitation = {

                found: true,

                guest:
                    rsvpGuestName.value,

                guests:
                    allowedGuests,

                submitted: true,

                attendance:
                    selectedAttendance

            };


            invitationData =
                updatedInvitation;


            localStorage.setItem(
                "wedding_invitation_" + rsvpCode,
                JSON.stringify(
                    updatedInvitation
                )
            );


            lockRSVPForm();


            rsvpMessage.textContent =
                "Thank you! Your RSVP has been received.";


            submitRsvp.textContent =
                "RSVP SENT ♥";


            return;
        }

        // =====================================
        // ALREADY SUBMITTED
        // =====================================

        if (result.alreadySubmitted) {

            rsvpAlreadySubmitted =
                true;

            lockRSVPForm();

            return;
        }


        // =====================================
        // ERROR
        // =====================================

        rsvpMessage.textContent =
            result.error ||
            "Something went wrong. Please try again.";

        submitRsvp.disabled =
            false;

        submitRsvp.textContent =
            "RSVP NOW ♥";


    } catch (error) {

        console.error(
            "RSVP submission failed:",
            error
        );

        rsvpMessage.textContent =
            "Unable to submit RSVP. Please try again.";

        submitRsvp.disabled =
            false;

        submitRsvp.textContent =
            "RSVP NOW ♥";
    }

});

// =========================================
// LOAD INVITATION IMMEDIATELY
// =========================================

getInvitationData()
    .then(function (result) {

        if (result) {

            displayInvitationData(result);

        }

    });

