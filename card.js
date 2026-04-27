// API endpoints
const CARD_API_BASE = 'https://api.pokemontcg.io/v2/cards';
const EXCHANGE_RATE_API_URL = 'https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP';

// Currency state
let selectedCurrency = 'GBP';
let usdToGbpRate = 0.79;
let currentCard = null;

// DOM elements
const cardLoading = document.getElementById('card-loading');
const cardError = document.getElementById('card-error');
const cardDetail = document.getElementById('card-detail');

// Fetch live exchange rate
async function fetchExchangeRate() {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const result = await response.json();

    if (result.rates && typeof result.rates.GBP === 'number') {
      usdToGbpRate = result.rates.GBP;
    }
  } catch (error) {
    console.error('Using fallback exchange rate:', error);
  }
}

// Get card ID from URL
function getCardIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Fetch one card from API
async function fetchCard() {
  const cardId = getCardIdFromUrl();

  if (!cardId) {
    showError('No card ID was provided.');
    return;
  }

  try {
    cardLoading.classList.remove('d-none');
    cardError.classList.add('d-none');
    cardDetail.classList.add('d-none');

    const response = await fetch(`${CARD_API_BASE}/${encodeURIComponent(cardId)}`);

    if (!response.ok) {
      throw new Error('Card request failed');
    }

    const result = await response.json();

    currentCard = result.data;
    renderCard(currentCard);
  } catch (error) {
    console.error(error);
    showError('Could not load this card right now.');
  } finally {
    cardLoading.classList.add('d-none');
  }
}

// Render card details
function renderCard(card) {
  const marketPrice = getPrice(card.tcgplayer, 'market');
  const lowPrice = getPrice(card.tcgplayer, 'low');
  const midPrice = getPrice(card.tcgplayer, 'mid');
  const highPrice = getPrice(card.tcgplayer, 'high');

  document.title = `PokéMarket | ${card.name}`;

  cardDetail.innerHTML = `
    <div class="row g-5 align-items-start">
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <img src="${card.images?.large || card.images?.small || ''}" alt="${card.name}" class="single-card-image">
        </div>
      </div>

      <div class="col-lg-7">
        <p class="text-secondary mb-2">${card.set?.series || 'Pokémon TCG'}</p>
        <h1 class="display-6 fw-bold mb-2">${card.name}</h1>

        <p class="lead text-secondary mb-4">
          ${card.set?.name || 'Unknown set'} • Card #${card.number || 'N/A'}
        </p>

        <div class="row g-3 mb-4">
          <div class="col-sm-6">
            <div class="info-panel h-100">
              <p class="small text-secondary mb-1">Rarity</p>
              <p class="fw-semibold mb-0">${card.rarity || 'Unavailable'}</p>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="info-panel h-100">
              <p class="small text-secondary mb-1">Supertype</p>
              <p class="fw-semibold mb-0">${card.supertype || 'Unavailable'}</p>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="info-panel h-100">
              <p class="small text-secondary mb-1">HP</p>
              <p class="fw-semibold mb-0">${card.hp || 'N/A'}</p>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="info-panel h-100">
              <p class="small text-secondary mb-1">Types</p>
              <p class="fw-semibold mb-0">${card.types ? card.types.join(', ') : 'N/A'}</p>
            </div>
          </div>
        </div>

       <div class="price-panel mb-4">
  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
    <h2 class="h4 mb-0">Market Pricing</h2>

    <div class="d-flex align-items-center flex-wrap gap-2">
      <span class="text-secondary small">Currency:</span>

      <div class="btn-group" role="group">
        <button id="currency-gbp" class="btn ${selectedCurrency === 'GBP' ? 'btn-dark' : 'btn-outline-dark'} btn-sm">
          £ GBP
        </button>

        <button id="currency-usd" class="btn ${selectedCurrency === 'USD' ? 'btn-dark' : 'btn-outline-dark'} btn-sm">
          $ USD
        </button>
      </div>
    </div>
  </div>

  <!-- ⭐ MAIN PRICE -->
  <div class="mb-4">
    <p class="text-secondary mb-1">Market Price</p>
    <p class="fw-bold display-5 mb-0">${marketPrice}</p>
  </div>

  <!-- Secondary prices -->
  <div class="row g-3">
    <div class="col-4">
      <div class="info-panel text-center">
        <p class="small text-secondary mb-1">Lowest</p>
        <p class="fw-semibold mb-0">${lowPrice}</p>
      </div>
    </div>

    <div class="col-4">
      <div class="info-panel text-center">
        <p class="small text-secondary mb-1">Average</p>
        <p class="fw-semibold mb-0">${midPrice}</p>
      </div>
    </div>

    <div class="col-4">
      <div class="info-panel text-center">
        <p class="small text-secondary mb-1">Highest</p>
        <p class="fw-semibold mb-0">${highPrice}</p>
      </div>
    </div>
  </div>
</div>

        <div class="d-flex flex-wrap gap-2">
          <a href="cards.html" class="btn btn-dark">Browse More Cards</a>
          <button class="btn btn-outline-dark" type="button" disabled>
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  `;

  cardDetail.classList.remove('d-none');

  setupCurrencyToggle();
}

// Get selected price type
function getPrice(tcgplayerData, priceType) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'N/A';
  }

  for (const group of Object.values(tcgplayerData.prices)) {
    if (group && typeof group[priceType] === 'number') {
      return selectedCurrency === 'GBP'
        ? formatCurrency(group[priceType] * usdToGbpRate, 'GBP')
        : formatCurrency(group[priceType], 'USD');
    }
  }

  return 'N/A';
}

// Format currency
function formatCurrency(value, currency) {
  return new Intl.NumberFormat(
    currency === 'GBP' ? 'en-GB' : 'en-US',
    { style: 'currency', currency }
  ).format(value);
}

// Show page error
function showError(message) {
  cardError.textContent = message;
  cardError.classList.remove('d-none');
  cardLoading.classList.add('d-none');
  cardDetail.classList.add('d-none');
}

// Set up currency toggle buttons
function setupCurrencyToggle() {
  const gbpButton = document.getElementById('currency-gbp');
  const usdButton = document.getElementById('currency-usd');

  if (!gbpButton || !usdButton) return;

  gbpButton.addEventListener('click', () => {
    selectedCurrency = 'GBP';

    if (currentCard) {
      renderCard(currentCard);
    }
  });

  usdButton.addEventListener('click', () => {
    selectedCurrency = 'USD';

    if (currentCard) {
      renderCard(currentCard);
    }
  });
}

// Navbar search redirects to cards page
function setupNavbarSearch() {
  const form = document.querySelector('.nav-search-form');
  const input = document.getElementById('card-search');

  if (!form || !input) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const value = input.value.trim();

    window.location.href = value
      ? `cards.html?search=${encodeURIComponent(value)}`
      : 'cards.html';
  });
}

// Initialise card page
async function initCardPage() {
  setupNavbarSearch();

  await fetchExchangeRate();
  await fetchCard();
}

initCardPage();