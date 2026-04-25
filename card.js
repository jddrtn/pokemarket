const CARD_API_BASE = 'https://api.pokemontcg.io/v2/cards';

const cardLoading = document.getElementById('card-loading');
const cardError = document.getElementById('card-error');
const cardDetail = document.getElementById('card-detail');

// Get the card ID from the URL.
function getCardIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Fetch one card from the API.
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
    const card = result.data;

    renderCard(card);
  } catch (error) {
    showError('Could not load this card right now.');
  } finally {
    cardLoading.classList.add('d-none');
  }
}

// Display the card on the page.
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
          <img
            src="${card.images?.large || card.images?.small || ''}"
            alt="${card.name}"
            class="single-card-image"
          >
        </div>
      </div>

      <div class="col-lg-7">
        <p class="text-secondary mb-2">${card.set?.series || 'Pokémon TCG'}</p>

        <h1 class="display-6 fw-bold mb-2">
          ${card.name}
        </h1>

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
          <h2 class="h4 mb-3">Market Pricing</h2>

          <div class="row g-3">
            <div class="col-sm-6 col-lg-3">
              <div class="info-panel h-100">
                <p class="small text-secondary mb-1">Market</p>
                <p class="fw-bold fs-5 mb-0">${marketPrice}</p>
              </div>
            </div>

            <div class="col-sm-6 col-lg-3">
              <div class="info-panel h-100">
                <p class="small text-secondary mb-1">Low</p>
                <p class="fw-semibold mb-0">${lowPrice}</p>
              </div>
            </div>

            <div class="col-sm-6 col-lg-3">
              <div class="info-panel h-100">
                <p class="small text-secondary mb-1">Mid</p>
                <p class="fw-semibold mb-0">${midPrice}</p>
              </div>
            </div>

            <div class="col-sm-6 col-lg-3">
              <div class="info-panel h-100">
                <p class="small text-secondary mb-1">High</p>
                <p class="fw-semibold mb-0">${highPrice}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="info-panel mb-4">
          <h2 class="h5 mb-3">Set Details</h2>

          <div class="d-flex align-items-center gap-3">
            <img
              src="${card.set?.images?.symbol || ''}"
              alt="${card.set?.name || 'Set'} symbol"
              class="set-symbol"
            >

            <div>
              <p class="fw-semibold mb-1">${card.set?.name || 'Unknown set'}</p>
              <p class="text-secondary mb-0">${formatDate(card.set?.releaseDate)}</p>
            </div>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <a href="cards.html" class="btn btn-dark">Browse More Cards</a>
          <button class="btn btn-dark" type="button">
            Add to Watchlist
          </button>
        </div>
      </div>

    </div>
  `;

  cardDetail.classList.remove('d-none');
}

// Get a price from the TCGPlayer price data.
function getPrice(tcgplayerData, priceType) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'N/A';
  }

  const priceGroups = Object.values(tcgplayerData.prices);

  for (const group of priceGroups) {
    if (group && typeof group[priceType] === 'number') {
      return `$${group[priceType].toFixed(2)}`;
    }
  }

  return 'N/A';
}

// Format dates from YYYY/MM/DD to readable UK format.
function formatDate(dateString) {
  if (!dateString) {
    return 'Unknown release date';
  }

  const parts = dateString.split('/');

  if (parts.length !== 3) {
    return dateString;
  }

  const [year, month, day] = parts;
  const date = new Date(`${year}-${month}-${day}`);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Show an error message.
function showError(message) {
  cardError.textContent = message;
  cardError.classList.remove('d-none');
  cardLoading.classList.add('d-none');
  cardDetail.classList.add('d-none');
}

// Start page.
fetchCard();