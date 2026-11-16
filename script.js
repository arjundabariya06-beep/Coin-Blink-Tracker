const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

async function getCryptoData() {
  try {
    const response = await fetch(API_URL);
    const coins = await response.json();

    console.log("Crypto data:", coins);

    const overview = document.querySelector(".overview");

    overview.innerHTML = `
      <h2>Market Overview</h2>
      <div class="coin-container">
        ${coins.map(coin => `
          <div class="coin-card">
            <img src="${coin.image}" alt="${coin.name}">
            <h3>${coin.name}</h3>
            <p>Price: $${coin.current_price}</p>
            <p>24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%</p>
            <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

getCryptoData();
