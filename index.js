// index.js

const FEATURED_CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';
const EXCHANGE_RATE_API_URL = 'https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP';

const featuredLoading = document.getElementById('trending-loading');
const featuredError = document.getElementById('trending-error');
const featuredCarousel = document.getElementById('trendingCardsCarousel');
const featuredTrack = document.getElementById('trending-cards-carousel-inner');
const featuredPrevButton = document.getElementById('featured-prev');
const featuredNextButton = document.getElementById('featured-next');

const gbpButton = document.getElementById('currency-gbp');
const usdButton = document.getElementById('currency-usd');

let featuredCards = [];
let currentFeaturedIndex = 0;
let selectedCurrency = 'GBP';
let usdToGbpRate = 0.79;

const featuredQuery = '(name:Charizard OR name:Pikachu OR name:Mewtwo OR name:Eevee OR name:Gengar OR name:Rayquaza OR name:Lugia OR name:Umbreon)';

// Fetch live USD to GBP exchange rate.
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

// Fetch featured cards from the Pokemon TCG API.
async function fetchFeaturedCards() {
  try {
    featuredLoading.classList.remove('d-none');
    featuredError.classList.add('d-none');
    featuredCarousel.classList.add('d-none');

    const url = new URL(FEATURED_CARDS_API_URL);

    url.searchParams.set('page', 1);
    url.searchParams.set('pageSize', 30);
    url.searchParams.set('q', featuredQuery);
    url.searchParams.set('orderBy', '-set.releaseDate');
    url.searchParams.set('select', 'id,name,images,set,rarity,number,tcgplayer');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch featured cards');
    }

    const result = await response.json();

    featuredCards = (result.data || [])
      .filter(card => hasPriceData(card.tcgplayer))
      .slice(0, 8);

    renderFeaturedCards();
  } catch (error) {
    console.error(error);
    featuredError.textContent = 'Unable to load featured cards right now.';
    featuredError.classList.remove('d-none');
  } finally {
    featuredLoading.classList.add('d-none');
  }
}

// Render carousel once cards have loaded.
function renderFeaturedCards() {
  if (!featuredCards.length) {
    featuredError.textContent = 'No featured cards with prices were found.';
    featuredError.classList.remove('d-none');
    return;
  }

  currentFeaturedIndex = 0;
  updateCarouselCards();

  featuredCarousel.classList.remove('d-none');
}

// Updates the visible cards.
function updateCarouselCards() {
  const visibleCards = getVisibleCardCount();
  const cardsToShow = [];

  for (let i = 0; i < visibleCards; i++) {
    const cardIndex = (currentFeaturedIndex + i) % featuredCards.length;
    cardsToShow.push(featuredCards[cardIndex]);
  }

  featuredTrack.innerHTML = cardsToShow
    .map(card => createFeaturedCardHtml(card))
    .join('');
}

// Next card button.
featuredNextButton.addEventListener('click', () => {
  currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredCards.length;
  updateCarouselCards();
});

// Previous card button.
featuredPrevButton.addEventListener('click', () => {
  currentFeaturedIndex =
    (currentFeaturedIndex - 1 + featuredCards.length) % featuredCards.length;

  updateCarouselCards();
});

// Re-render visible cards when screen size changes.
window.addEventListener('resize', updateCarouselCards);

// Currency toggle: GBP.
gbpButton.addEventListener('click', () => {
  selectedCurrency = 'GBP';

  gbpButton.classList.remove('btn-outline-dark');
  gbpButton.classList.add('btn-dark');

  usdButton.classList.remove('btn-dark');
  usdButton.classList.add('btn-outline-dark');

  updateCarouselCards();
});

// Currency toggle: USD.
usdButton.addEventListener('click', () => {
  selectedCurrency = 'USD';

  usdButton.classList.remove('btn-outline-dark');
  usdButton.classList.add('btn-dark');

  gbpButton.classList.remove('btn-dark');
  gbpButton.classList.add('btn-outline-dark');

  updateCarouselCards();
});

// Desktop shows 4, tablet shows 2, mobile shows 1.
function getVisibleCardCount() {
  if (window.innerWidth < 576) {
    return 1;
  }

  if (window.innerWidth < 992) {
    return 2;
  }

  return 4;
}

// Create one featured card.
function createFeaturedCardHtml(card) {
  const marketPrice = getMarketPrice(card.tcgplayer);

  return `
    <div class="featured-card-item">
      <a href="card.html?id=${encodeURIComponent(card.id)}" class="text-decoration-none text-dark">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-link-card">
          <img
            src="${card.images?.small || ''}"
            alt="${card.name}"
            class="pokemon-card-image"
          >

          <div class="card-body">
            <p class="text-secondary small mb-2">${card.set?.name || 'Unknown set'}</p>

            <h3 class="h5 card-title mb-2">
              ${card.name}
            </h3>

            <p class="text-secondary mb-1">
              ${card.rarity || 'Rarity unavailable'}
            </p>

            <p class="text-secondary mb-2">
              Card #${card.number || 'N/A'}
            </p>

            <p class="fw-bold fs-5 mb-0">
              ${marketPrice}
            </p>
          </div>
        </article>
      </a>
    </div>
  `;
}

// Check if a card has any usable price data.
function hasPriceData(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return false;
  }

  const priceGroups = Object.values(tcgplayerData.prices);

  return priceGroups.some(group => {
    return group &&
      (
        typeof group.market === 'number' ||
        typeof group.mid === 'number' ||
        typeof group.low === 'number' ||
        typeof group.high === 'number'
      );
  });
}

// Get price and convert it depending on selected currency.
function getMarketPrice(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'Price unavailable';
  }

  const priceGroups = Object.values(tcgplayerData.prices);

  for (const group of priceGroups) {
    if (!group) continue;

    const value =
      group.market ??
      group.mid ??
      group.low ??
      group.high;

    if (typeof value === 'number') {
      if (selectedCurrency === 'GBP') {
        return formatCurrency(value * usdToGbpRate, 'GBP');
      }

      return formatCurrency(value, 'USD');
    }
  }

  return 'Price unavailable';
}

// Format currency properly.
function formatCurrency(value, currency) {
  return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
}

// Home page search sends users to cards page.
const homeSearchForm = document.querySelector('.search-form');
const homeSearchInput = document.getElementById('card-search');

homeSearchForm.addEventListener('submit', event => {
  event.preventDefault();

  const searchValue = homeSearchInput.value.trim();

  if (searchValue) {
    window.location.href = `cards.html?search=${encodeURIComponent(searchValue)}`;
  } else {
    window.location.href = 'cards.html';
  }
});

// Start homepage.
async function initHomePage() {
  await fetchExchangeRate();
  await fetchFeaturedCards();
}

initHomePage();