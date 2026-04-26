// API endpoints
const FEATURED_CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';
const EXCHANGE_RATE_API_URL = 'https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP';

// DOM elements
const featuredLoading = document.getElementById('trending-loading');
const featuredError = document.getElementById('trending-error');
const featuredCarousel = document.getElementById('trendingCardsCarousel');
const featuredTrack = document.getElementById('trending-cards-carousel-inner');

const featuredPrevButton = document.getElementById('featured-prev');
const featuredNextButton = document.getElementById('featured-next');

const gbpButton = document.getElementById('currency-gbp');
const usdButton = document.getElementById('currency-usd');

// State
let featuredCards = [];
let currentFeaturedIndex = 0;
let selectedCurrency = 'GBP';
let usdToGbpRate = 0.79;

// Query for featured cards
const featuredQuery = '(name:Charizard OR name:Pikachu OR name:Mewtwo OR name:Eevee OR name:Gengar OR name:Rayquaza OR name:Lugia OR name:Umbreon)';

// Fetch USD → GBP exchange rate
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

// Fetch featured cards from API
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

    // Keep only cards with price data and limit to 8
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

// Render carousel after data loads
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

// Update visible cards in carousel
function updateCarouselCards() {
  if (!featuredCards.length) return;

  const visibleCards = getVisibleCardCount();
  const cardsToShow = [];

  for (let i = 0; i < visibleCards; i++) {
    const index = (currentFeaturedIndex + i) % featuredCards.length;
    cardsToShow.push(featuredCards[index]);
  }

  featuredTrack.innerHTML = cardsToShow
    .map(card => createFeaturedCardHtml(card))
    .join('');
}

// Move forward one card
featuredNextButton.addEventListener('click', () => {
  currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredCards.length;
  updateCarouselCards();
});

// Move backward one card
featuredPrevButton.addEventListener('click', () => {
  currentFeaturedIndex =
    (currentFeaturedIndex - 1 + featuredCards.length) % featuredCards.length;

  updateCarouselCards();
});

// Recalculate layout on resize
window.addEventListener('resize', updateCarouselCards);

// Currency toggle: GBP
gbpButton.addEventListener('click', () => {
  selectedCurrency = 'GBP';

  gbpButton.classList.replace('btn-outline-dark', 'btn-dark');
  usdButton.classList.replace('btn-dark', 'btn-outline-dark');

  updateCarouselCards();
});

// Currency toggle: USD
usdButton.addEventListener('click', () => {
  selectedCurrency = 'USD';

  usdButton.classList.replace('btn-outline-dark', 'btn-dark');
  gbpButton.classList.replace('btn-dark', 'btn-outline-dark');

  updateCarouselCards();
});

// Determine how many cards to show based on screen size
function getVisibleCardCount() {
  if (window.innerWidth < 576) return 1;
  if (window.innerWidth < 992) return 2;
  return 4;
}

// Create HTML for a single card
function createFeaturedCardHtml(card) {
  const price = getMarketPrice(card.tcgplayer);

  return `
    <div class="featured-card-item">
      <a href="card.html?id=${encodeURIComponent(card.id)}" class="text-decoration-none text-dark">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-link-card">
          <img src="${card.images?.small || ''}" alt="${card.name}" class="pokemon-card-image">

          <div class="card-body">
            <p class="text-secondary small mb-2">${card.set?.name || 'Unknown set'}</p>
            <h3 class="h5 card-title mb-2">${card.name}</h3>

            <p class="text-secondary mb-1">${card.rarity || 'Rarity unavailable'}</p>
            <p class="text-secondary mb-2">Card #${card.number || 'N/A'}</p>

            <p class="fw-bold fs-5 mb-0">${price}</p>
          </div>
        </article>
      </a>
    </div>
  `;
}

// Check if card has any usable price
function hasPriceData(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) return false;

  return Object.values(tcgplayerData.prices).some(group =>
    group && (group.market || group.mid || group.low || group.high)
  );
}

// Get formatted price depending on selected currency
function getMarketPrice(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'Price unavailable';
  }

  for (const group of Object.values(tcgplayerData.prices)) {
    if (!group) continue;

    const value = group.market ?? group.mid ?? group.low ?? group.high;

    if (typeof value === 'number') {
      return selectedCurrency === 'GBP'
        ? formatCurrency(value * usdToGbpRate, 'GBP')
        : formatCurrency(value, 'USD');
    }
  }

  return 'Price unavailable';
}

// Format currency display
function formatCurrency(value, currency) {
  return new Intl.NumberFormat(
    currency === 'GBP' ? 'en-GB' : 'en-US',
    { style: 'currency', currency }
  ).format(value);
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

// Initialise homepage
async function initHomePage() {
  setupNavbarSearch();
  await fetchExchangeRate();
  await fetchFeaturedCards();
}

initHomePage();