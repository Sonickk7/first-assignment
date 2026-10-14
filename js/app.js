/* Jamaica Eats - js/app.js
JavaScript for each page and one jQuery feature (the table search).
   Each section only runs if the elements it needs are on the page currently*/

// ---------- DATA ----------
//Each object holds the details for one restaurant.
const restaurants = [
    { rank: 1, name: "KFC", category: "Chicken", yearOpened: 1975, hasJerk: false, detailsId: "kfc-details",
      knownFor: "Jamaica's first KFC opened on Old Hope Road in Kingston." },
    { rank: 2, name: "Pizza Hut", category: "Pizza", yearOpened: null, hasJerk: true, detailsId: "pizza-hut-details",
      knownFor: "Dine-in, carry-out and delivery, with a Jerk Chicken Pizza." },
    { rank: 3, name: "Burger King", category: "Burgers", yearOpened: 1984, hasJerk: false, detailsId: "burger-king-details",
      knownFor: "Flame-grilled Whoppers, starting in Ocho Rios." },
    { rank: 4, name: "Tastee Patties", category: "Patties", yearOpened: 1966, hasJerk: true, detailsId: "tastee-details",
      knownFor: "Jamaican patties since 1966, including a Jerk Chicken Patty." },
    { rank: 5, name: "Domino's", category: "Pizza", yearOpened: null, hasJerk: true, detailsId: "dominos-details",
      knownFor: "Online ordering and jerk chicken toppings." }
];

// Tracks which category button is selected.
let selectedCategory = "All";

// ---------- FUNCTIONS ----------

// Describes how long a restaurant has been open for.
function describeAge(restaurant) {
    if (restaurant.yearOpened === null) {
        return "Opening year not listed";
    } else {
        const years = new Date().getFullYear() - restaurant.yearOpened;
        return "Opened " + restaurant.yearOpened + " (" + years + " years ago)";
    }
}

// Builds the HTML for ONE restaurant's card.
function buildCard(restaurant) {
    let jerkBadge = "";
    if (restaurant.hasJerk) {
        jerkBadge = '<span class="badge text-bg-success">Jerk option</span>';
    }
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card restaurant-card h-100 shadow-sm">
                <div class="card-body">
                    <h3 class="card-title h5">#${restaurant.rank} ${restaurant.name}</h3>
                    <p class="text-muted mb-2">${restaurant.category} &bull; ${describeAge(restaurant)}</p>
                    <p class="card-text">${restaurant.knownFor}</p>
                    ${jerkBadge}
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <button type="button" class="btn btn-sm btn-dark view-details" data-details="${restaurant.detailsId}">View details</button>
                </div>
            </div>
        </div>`;
}

// Shows cards that match the selected category
function showRestaurants() {
    const cardBox = document.getElementById("restaurant-cards");
    const resultCount = document.getElementById("result-count");
    let html = "";
    let count = 0;

    // LOOP through every restaurant in the array
    for (const restaurant of restaurants) {
        if (selectedCategory === "All" || restaurant.category === selectedCategory) {
            html += buildCard(restaurant);
            count++;
        }
    }

    // DOM modification: change what is on the page
    cardBox.innerHTML = html;
    resultCount.textContent = "Showing " + count + " of " + restaurants.length + " restaurants";
}

// Highlights the button that was clicked
function setActiveButton(clickedButton) {
    const allButtons = document.querySelectorAll("#filter-buttons button");
    allButtons.forEach(function (button) {
        button.classList.remove("active");
    });
    clickedButton.classList.add("active");
}

// Creates one filter button for each category
function createFilterButtons() {
    const filterBox = document.getElementById("filter-buttons");
    const categories = ["All"];
    for (const restaurant of restaurants) {
        if (!categories.includes(restaurant.category)) {
            categories.push(restaurant.category);
        }
    }

    categories.forEach(function (category) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = category;
        button.className = "btn btn-filter me-2 mb-2";
        if (category === "All") {
            button.classList.add("active");
        }

        // EVENT LISTENER: runs when a filter button is clicked
        button.addEventListener("click", function () {
            selectedCategory = category;
            setActiveButton(button);
            showRestaurants();
        });

        filterBox.appendChild(button);
    });
}

// Fills the Quick Facts table from the same array
function buildTable() {
    const tableBody = document.querySelector("#factsTable tbody");
    let rows = "";
    for (const restaurant of restaurants) {
        let opened = "Not listed";
        if (restaurant.yearOpened !== null) {
            opened = restaurant.yearOpened;
        }
        rows += `<tr>
            <th scope="row">${restaurant.rank}</th>
            <td>${restaurant.name}</td>
            <td>${restaurant.category}</td>
            <td>${opened}</td>
            <td>${restaurant.knownFor}</td>
        </tr>`;
    }
    tableBody.innerHTML = rows;
}

// Opens one accordion item with Bootstrap's JavaScript, then scrolls to it
function openDetails(detailsId) {
    const panel = document.getElementById(detailsId);
    bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).show();
    panel.parentElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Adds the "active" class to the nav link for the page you are on.
function trackActivePage() {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") {
        currentPage = "index.html";
    }
    // confirmation.html belongs to the Contact Us section
    if (currentPage === "confirmation.html") {
        currentPage = "contact_us.html";
    }

    const links = document.querySelectorAll(".navbar .nav-link");
    links.forEach(function (link) {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

// Marks one form field as valid or invalid and returns true/false.
function setValidity(input, isValid) {
    input.classList.toggle("is-invalid", !isValid);
    input.classList.toggle("is-valid", isValid);
    return isValid;
}

// Validates the contact form and returns true only if everything is OK.
function validateContactForm() {
    const name = document.getElementById("fullname");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let allValid = true;
    // Reading the values with .value, then checking them with conditions
    if (!setValidity(name, name.value.trim().length >= 2)) { allValid = false; }
    if (!setValidity(email, emailPattern.test(email.value.trim()))) { allValid = false; }
    if (!setValidity(message, message.value.trim().length >= 10)) { allValid = false; }
    return allValid;
}

// ---------- PAGE SETUP ----------
document.addEventListener("DOMContentLoaded", function () {

    // Every page
    trackActivePage();
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Home page: cards, filter buttons and table
    if (document.getElementById("restaurant-cards")) {
        createFilterButtons();
        showRestaurants();
        buildTable();

        // One listener on the card area handles every "View details" button
        document.getElementById("restaurant-cards").addEventListener("click", function (event) {
            const button = event.target.closest(".view-details");
            if (button) {
                openDetails(button.dataset.details);
            }
        });

        // jQuery: that searches and hides table rows that don't match the search
        $("#tableSearch").on("keyup", function () {
            const searchText = $(this).val().toLowerCase();
            $("#factsTable tbody tr").each(function () {
                const matches = $(this).text().toLowerCase().indexOf(searchText) > -1;
                $(this).toggle(matches);
            });
        });
    }

    // Contact page form
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const formAlert = document.getElementById("formAlert");

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // stop the normal page reload

            if (validateContactForm()) {
                formAlert.classList.add("d-none");
                const name = document.getElementById("fullname").value.trim();
                // Go to the confirmation page and pass the name along
                window.location.href = "confirmation.html?name=" + encodeURIComponent(name);
            } else {
                formAlert.textContent = "Please fix the highlighted fields and try again.";
                formAlert.classList.remove("d-none");
            }
        });

        contactForm.addEventListener("reset", function () {
            formAlert.classList.add("d-none");
            contactForm.querySelectorAll(".is-valid, .is-invalid").forEach(function (field) {
                field.classList.remove("is-valid", "is-invalid");
            });
        });
    }

    // Confirmation page: greet the person by name
    const thanksName = document.getElementById("thanksName");
    if (thanksName) {
        const name = new URLSearchParams(window.location.search).get("name");
        if (name) {
            thanksName.textContent = "Thank you, " + name + ",";
        }
    }
});
