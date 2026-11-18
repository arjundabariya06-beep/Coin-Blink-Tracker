
//API //


const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";


//Get Crypto Data


async function getCryptoData() {
      
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("API request failed");
        }

        const coins = await response.json();

        renderCoins(coins);

        showWatchlist(coins);

    }

    catch (error) {

        console.error( "Error fetching crypto data:",
            error
        );

    }

}



//    Render Coins


function renderCoins(coins) {

    const coinContainer = document.getElementById("coinContainer");
    coinContainer.innerHTML = coins.map(coin => {

        const change =  coin.price_change_percentage_24h;

        const changeColor =
            change >= 0
                ? "green"
                : "red";
         return `

            <div class="coin-card">

                <img
                    src="${coin.image}"
                    alt="${coin.name}">

                <h3>
                    ${coin.name}
                </h3>

                <p>
                    Price:
                    $${coin.current_price.toLocaleString()}
                </p>

                <p
                    style="
                        color: ${changeColor};
                        font-weight: bold;" >

                    24h Change:
                    ${change?.toFixed(2)}%
                </p>

                <p>
                    Market Cap:
                    $${coin.market_cap.toLocaleString()}
                </p>


                <!-- Watchlist Button -->

                <button
                    class="watchlist-btn"
                    data-id="${coin.id}"
                >
                    ☆ Add to Watchlist
                </button>


                <!-- View Details Button -->

                <button
                    class="details-btn"
                    onclick="showCoinDetails('${coin.id}')"
                >
                    View Details
                </button>

            </div>

        `;

    }).join("");


    setupWatchlistButtons(coins);

}



//    Watchlist Buttons


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
         const coinId = button.dataset.id;


         //  Already Added 

         if (
            watchlist.includes(coinId)
         ) {

            button.textContent =
                "★ Added to Watchlist";

         }


        //  Click 

        button.addEventListener(
            "click",
            function () {

                let currentWatchlist =
                    JSON.parse(
                        localStorage.getItem(
                            "watchlist"
                        )
                    ) || [];


                //  Remove 

                if (
                    currentWatchlist.includes(  coinId )
                ) {

                    currentWatchlist =
                        currentWatchlist.filter(
                            id =>
                                id !== coinId
                        );

                    this.textContent =
                        "☆ Add to Watchlist";

                }


                // Add 

                else {

                    currentWatchlist.push(
                        coinId
                    );

                    this.textContent =
                        "★ Added to Watchlist";

                }


                // Save 

                localStorage.setItem(
                    "watchlist",
                    JSON.stringify(
                        currentWatchlist
                    )
                );


                //  Update Watchlist 

                showWatchlist(coins);

            }
        );

    });

}



//    Show Watchlist


function showWatchlist(coins) {

    const container = document.getElementById(
            "watchlistContainer"
        );


    const watchlist =
        JSON.parse(
            localStorage.getItem(
                "watchlist"
            )
        ) || [];


    //  Empty 

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


    //  Saved Coins 

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
                        $${coin.current_price.toLocaleString()}
                    </p>

                </div>

            </div>

        `).join("");

}



//    Search


const searchInput = document.getElementById(
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



//    Sidebar Navigation


const menuLinks = document.querySelectorAll(
        ".sidebar nav a"
    );


const sections = document.querySelectorAll(
        ".page-section"
    );


menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const sectionId =
                this.dataset.section;


            //  Hide all sections 

            sections.forEach(section => {

                section.classList.remove(
                    "active-section"
                );

            });


            //  Show selected section

            const selectedSection =
                document.getElementById(
                    sectionId
                );


            if (selectedSection) {

                selectedSection.classList.add(
                    "active-section"
                );

            }


            //  Active Menu 

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



//    Theme


const lightThemeBtn =
    document.getElementById(
        "lightThemeBtn"
    );


const darkThemeBtn =
    document.getElementById(
        "darkThemeBtn"
    );


//  Light Theme 

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


//  Dark Theme 

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



//    Load Saved Theme


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



//    Default Menu


const overviewMenu = document.querySelector(
        '[data-section="overview"]'
    );


if (overviewMenu) {

    overviewMenu.classList.add(
        "active"
    );

}



//    COIN DETAILS


async function showCoinDetails(coinId) {

    const modal =
        document.getElementById(
            "coinDetailsModal"
        );


    const content =
        document.getElementById(
            "coinDetailsContent"
        );


    //  Open Modal 

    modal.classList.remove(
        "hidden"
    );


    //  Loading 

    content.innerHTML = `

        <div class="details-loading">

            <p>
                Loading coin details...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch coin details"
            );

        }

         const coin =  await response.json();


        const marketData = coin.market_data;


        const price = marketData.current_price.usd;


        const change = marketData.price_change_percentage_24h;


        const changeColor =
            change >= 0
                ? "green"
                : "red";


        content.innerHTML = `

            <!-- Details Header -->

            <div class="details-header">

                <img
                    src="${coin.image.large}"
                    alt="${coin.name}"
                >

                <div>

                    <h2>
                        ${coin.name}
                    </h2>

                    <p>
                        ${coin.symbol}
                    </p>

                </div>

            </div>


            <!-- Current Price -->

            <div class="details-price">

                <p>
                    Current Price
                </p>

                <h3>
                    $${price.toLocaleString()}
                </h3>

                <p
                    style="
                        color: ${changeColor};
                        font-weight: bold;
                        margin-top: 8px;
                    "
                >
                    24H Change:
                    ${change?.toFixed(2)}%
                </p>

            </div>


            <!-- Details Grid -->

            <div class="details-grid">


                <div class="detail-box">

                    <p>
                        Market Rank
                    </p>

                    <strong>
                        #${coin.market_cap_rank}
                    </strong>

                </div>


                <div class="detail-box">

                    <p>
                        Market Cap
                    </p>

                    <strong>
                        $${marketData.market_cap.usd.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-box">

                    <p>
                        24H High
                    </p>

                    <strong>
                        $${marketData.high_24h.usd.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-box">

                    <p>
                        24H Low
                    </p>

                    <strong>
                        $${marketData.low_24h.usd.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-box">

                    <p>
                        Total Volume
                    </p>

                    <strong>
                        $${marketData.total_volume.usd.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-box">

                    <p>
                        Circulating Supply
                    </p>

                    <strong>
                        ${marketData.circulating_supply
                            ? marketData.circulating_supply.toLocaleString()
                            : "N/A"}
                    </strong>

                </div>


            </div>


            <!-- Watchlist Button -->

            <button
                class="details-watchlist-btn"
                id="detailsWatchlistBtn"
                onclick="toggleDetailsWatchlist('${coin.id}')"
            >
                ${isCoinInWatchlist(coin.id)
                    ? "★ Added to Watchlist"
                    : "☆ Add to Watchlist"}
            </button>

        `;

    }


    catch (error) { console.error(
            "Coin details error:",
            error
        );


        content.innerHTML = `
                    <div class="details-loading">

                <h3>
                    Unable to load coin details
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


//    Check Watchlist


function isCoinInWatchlist(coinId) {
     const watchlist =
        JSON.parse(
            localStorage.getItem(
                "watchlist"
            )
        ) || [];
     return watchlist.includes(
        coinId
    );

}



//    Toggle Details Watchlist


function toggleDetailsWatchlist(coinId) {

    let watchlist =
        JSON.parse( localStorage.getItem(
                "watchlist"
            )
        ) || [];


    const button =
        document.getElementById(
            "detailsWatchlistBtn"
        );


    if (  watchlist.includes(
            coinId
        )
    ) {

        //  Remove 

        watchlist =  watchlist.filter(
                id =>
                    id !== coinId
            );


        if (button) {
         button.textContent =
                "☆ Add to Watchlist";

        }

    }


    else {

        //  Add 

        watchlist.push(
            coinId
        );


        if (button) {

            button.textContent =
                "★ Added to Watchlist";

        }

    }


    //  Save 

    localStorage.setItem(
        "watchlist",
        JSON.stringify(
            watchlist
        )
    );


    //  Refresh market cards 

    getCryptoData();

}



//    CLOSE DETAILS MODAL


const closeCoinDetails =
    document.getElementById(
        "closeCoinDetails"
    );


closeCoinDetails.addEventListener(
    "click",
    function () {

        const modal =
            document.getElementById(
                "coinDetailsModal"
            );


        modal.classList.add(
            "hidden"
        );

    }
);



//    Close Modal on Background


const coinDetailsModal =
    document.getElementById(
        "coinDetailsModal"
    );


coinDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            coinDetailsModal
        ) {

            coinDetailsModal.classList.add(
                "hidden"
            );

        }

    }
);



//    Start App


getCryptoData();


//    Refresh Data


const refreshDataBtn =
    document.getElementById(
        "refreshDataBtn"
    );


refreshDataBtn.addEventListener(
    "click",
    async function () {

        this.disabled = true;
        this.textContent = "↻ Refreshing...";

        try {

            await getCryptoData();

            this.textContent = "✓ Data Updated";

            setTimeout(() => {

                this.textContent = "↻ Refresh Data";
                this.disabled = false;

            }, 1500);

        }

        catch (error) {

            console.error(
                "Refresh error:",
                error
            );

            this.textContent = "✕ Refresh Failed";
            this.disabled = false;

            setTimeout(() => {

                this.textContent = "↻ Refresh Data";

            }, 1500);

        }

    }
);


//    Dashboard Statistics


function updateDashboardStats(coins) {

    //  Total Coins 

    const totalCoins =
        document.getElementById("totalCoins");

    if (totalCoins) {
        totalCoins.textContent = coins.length;
    }


    //  Total Market Cap 

    const totalMarketCap =
        coins.reduce(
            (total, coin) =>
                total + (coin.market_cap || 0),
            0
        );

    const marketCapElement =
        document.getElementById("totalMarketCap");

    if (marketCapElement) {

        marketCapElement.textContent =
            "$" + totalMarketCap.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 0
                }
            );

    }


    //  Top Gainer 

    const topGainer =
        coins.reduce(
            (highest, coin) => {

                const change =
                    coin.price_change_percentage_24h || 0;

                const highestChange =
                    highest.price_change_percentage_24h || 0;

                return change > highestChange
                    ? coin
                    : highest;

            },
            coins[0]
        );

    const topGainerElement =
        document.getElementById("topGainer");

    if (topGainerElement && topGainer) {

        topGainerElement.textContent =
            `${topGainer.name} +${topGainer.price_change_percentage_24h?.toFixed(2)}%`;

    }


    //  Top Loser 

    const topLoser =
        coins.reduce(
            (lowest, coin) => {

                const change =
                    coin.price_change_percentage_24h || 0;

                const lowestChange =
                    lowest.price_change_percentage_24h || 0;

                return change < lowestChange
                    ? coin
                    : lowest;

            },
            coins[0]
        );

    const topLoserElement =
        document.getElementById("topLoser");

    if (topLoserElement && topLoser) {

        topLoserElement.textContent =
            `${topLoser.name} ${topLoser.price_change_percentage_24h?.toFixed(2)}%`;

    }


    //  Highest Price 

    const highestPriceCoin =
        coins.reduce(
            (highest, coin) => {

                return coin.current_price >
                    highest.current_price
                    ? coin
                    : highest;

            },
            coins[0]
        );

    const highestPriceElement =
        document.getElementById("highestPrice");

    if (
        highestPriceElement &&
        highestPriceCoin
    ) {

        highestPriceElement.textContent =
            "$" +
            highestPriceCoin.current_price.toLocaleString();

    }


    //  Last Updated 

    const lastUpdated =
        document.getElementById("lastUpdated");

    if (lastUpdated) {

        const now =
            new Date();

        lastUpdated.textContent =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }

}