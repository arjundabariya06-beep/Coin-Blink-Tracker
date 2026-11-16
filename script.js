/* =========================
   API
========================= */

const API_URL =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";


/* =========================
   Get Crypto Data
========================= */

async function getCryptoData() {

    try {

        const response = await fetch(API_URL);

        const coins = await response.json();

        console.log("Crypto data:", coins);


        renderCoins(coins);

        showWatchlist(coins);

    }

    catch (error) {

        console.error(
            "Error fetching crypto data:",
            error
        );

    }

}


/* =========================
   Render Coins
========================= */

function renderCoins(coins) {

    const coinContainer =
        document.getElementById("coinContainer");


    coinContainer.innerHTML = coins.map(coin => {

        const change =
            coin.price_change_percentage_24h;


        const changeColor =
            change >= 0
                ? "green"
                : "red";


        return `

            <div class="coin-card">

                <img
                    src="${coin.image}"
                    alt="${coin.name}"
                >


                <h3>
                    ${coin.name}
                </h3>


                <p>
                    Price:
                    $${coin.current_price}
                </p>


                <p
                    style="
                        color: ${changeColor};
                        font-weight: bold;
                    "
                >

                    24h Change:
                    ${change?.toFixed(2)}%

                </p>


                <p>

                    Market Cap:
                    $${coin.market_cap.toLocaleString()}

                </p>


                <button
                    class="watchlist-btn"
                    data-id="${coin.id}"
                >

                    ☆ Add to Watchlist

                </button>

            </div>

        `;

    }).join("");


    setupWatchlistButtons(coins);

}


/* =========================
   Watchlist Buttons
========================= */

function setupWatchlistButtons(coins) {

    let watchlist =
        JSON.parse(
            localStorage.getItem("watchlist")
        ) || [];


    const buttons =
        document.querySelectorAll(
            ".watchlist-btn"
        );


    buttons.forEach(button => {

        const coinId =
            button.dataset.id;


        /* Already Added */

        if (
            watchlist.includes(coinId)
        ) {

            button.textContent =
                "★ Added to Watchlist";

        }


        /* Click */

        button.addEventListener(
            "click",
            function () {

                let currentWatchlist =
                    JSON.parse(
                        localStorage.getItem(
                            "watchlist"
                        )
                    ) || [];


                if (
                    currentWatchlist.includes(
                        coinId
                    )
                ) {

                    /* Remove */

                    currentWatchlist =
                        currentWatchlist.filter(
                            id =>
                                id !== coinId
                        );


                    this.textContent =
                        "☆ Add to Watchlist";

                }

                else {

                    /* Add */

                    currentWatchlist.push(
                        coinId
                    );


                    this.textContent =
                        "★ Added to Watchlist";

                }


                localStorage.setItem(
                    "watchlist",
                    JSON.stringify(
                        currentWatchlist
                    )
                );


                showWatchlist(coins);

            }
        );

    });

}


/* =========================
   Show Watchlist
========================= */

function showWatchlist(coins) {

    const container =
        document.getElementById(
            "watchlistContainer"
        );


    const watchlist =
        JSON.parse(
            localStorage.getItem(
                "watchlist"
            )
        ) || [];


    /* Empty */

    if (
        watchlist.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-watchlist">

                <h3>
                    No coins added
                </h3>

                <p>
                    Add coins from the Markets section.
                </p>

            </div>

        `;

        return;

    }


    /* Saved Coins */

    const savedCoins =
        coins.filter(
            coin =>
                watchlist.includes(
                    coin.id
                )
        );


    container.innerHTML =
        savedCoins.map(coin => `

            <div class="watchlist-coin">

                <img
                    src="${coin.image}"
                    alt="${coin.name}"
                >


                <div>

                    <strong>
                        ${coin.name}
                    </strong>


                    <p>
                        $${coin.current_price}
                    </p>

                </div>

            </div>

        `).join("");

}


/* =========================
   Search
========================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            this.value.toLowerCase();


        const cards =
            document.querySelectorAll(
                ".coin-card"
            );


        cards.forEach(card => {

            const coinName =
                card
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();


            if (
                coinName.includes(
                    searchText
                )
            ) {

                card.style.display =
                    "block";

            }

            else {

                card.style.display =
                    "none";

            }

        });

    }
);


/* =========================
   Sidebar Navigation
========================= */

const menuLinks =
    document.querySelectorAll(
        ".sidebar nav a"
    );


const sections =
    document.querySelectorAll(
        ".page-section"
    );


menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const sectionId =
                this.dataset.section;


            /* Hide all sections */

            sections.forEach(section => {

                section.classList.remove(
                    "active-section"
                );

            });


            /* Show selected section */

            document
                .getElementById(
                    sectionId
                )
                .classList.add(
                    "active-section"
                );


            /* Active menu */

            menuLinks.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );

        }
    );

});


/* =========================
   Theme
========================= */

const lightThemeBtn =
    document.getElementById(
        "lightThemeBtn"
    );


const darkThemeBtn =
    document.getElementById(
        "darkThemeBtn"
    );


/* Light Theme */

lightThemeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.remove(
            "dark-theme"
        );


        localStorage.setItem(
            "theme",
            "light"
        );

    }
);


/* Dark Theme */

darkThemeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.add(
            "dark-theme"
        );


        localStorage.setItem(
            "theme",
            "dark"
        );

    }
);


/* =========================
   Load Saved Theme
========================= */

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark-theme"
    );

}


/* =========================
   Default Menu
========================= */

document
    .querySelector(
        '[data-section="overview"]'
    )
    .classList.add("active");


/* =========================
   Start App
========================= */

getCryptoData();