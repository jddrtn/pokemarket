// API endpoints
const FEATURED_CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';
const SETS_API_URL = 'https://api.pokemontcg.io/v2/sets';
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

// Fetch USD → GBP exchange rate with caching
async function fetchExchangeRate() {
  // Try to get cached exchange rate first.
  // The exchange rate does not need to be fetched every page load,
  // so it is cached for 24 hours to reduce API requests.
  const cachedRate = getCachedData('usdToGbpRate', 1440);

  if (cachedRate) {
    usdToGbpRate = cachedRate;
    return;
  }

  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const result = await response.json();

    if (result.rates && typeof result.rates.GBP === 'number') {
      usdToGbpRate = result.rates.GBP;

      // Store the exchange rate so other pages can reuse it.
      setCachedData('usdToGbpRate', usdToGbpRate);
    }
  } catch (error) {
    // If the exchange rate API fails, the fallback value is used.
    console.error('Using fallback exchange rate:', error);
  }
}

// Fetch featured cards from API
async function fetchFeaturedCards() {
  try {
    featuredLoading.classList.remove('d-none');
    featuredError.classList.add('d-none');
    featuredCarousel.classList.add('d-none');

    // Try to load featured cards from cache first.
    // This makes the homepage faster when users revisit or refresh it.
    const cachedFeaturedCards = getCachedData('featuredCards', 60);

    if (cachedFeaturedCards) {
      featuredCards = cachedFeaturedCards;
      renderFeaturedCards();
      return;
    }

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

    // Keep only cards with price data and limit to 8.
    featuredCards = (result.data || [])
      .filter(card => hasPriceData(card.tcgplayer))
      .slice(0, 8);

    // Cache featured cards for 60 minutes to reduce repeated API requests.
    setCachedData('featuredCards', featuredCards);

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

// Create HTML for a single featured card
function createFeaturedCardHtml(card) {
  const price = getMarketPrice(card.tcgplayer);

  return `
    <div class="featured-card-item">
      <a href="index.php?p=card&id=${encodeURIComponent(card.id)}" class="text-decoration-none text-dark">
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

// Fetch the 3 newest Pokémon TCG sets
async function fetchRecentSets() {
  await fetchHomeSets({
    gridId: 'recent-sets-grid',
    loadingId: 'recent-sets-loading',
    errorId: 'recent-sets-error',
    orderBy: '-releaseDate',
    cacheMinutes: 60
  });
}

// Fetch the 3 oldest Pokémon TCG sets
async function fetchVintageSets() {
  await fetchHomeSets({
    gridId: 'vintage-sets-grid',
    loadingId: 'vintage-sets-loading',
    errorId: 'vintage-sets-error',
    orderBy: 'releaseDate',
    cacheMinutes: 1440
  });
}

// Shared function for loading home page set sections
async function fetchHomeSets(config) {
  const grid = document.getElementById(config.gridId);
  const loading = document.getElementById(config.loadingId);
  const error = document.getElementById(config.errorId);

  try {
    loading.classList.remove('d-none');
    error.classList.add('d-none');
    grid.innerHTML = '';

    // Create a unique cache key from the sort order.
    // This keeps recent sets and vintage sets stored separately.
    const cacheKey = `homeSets-${config.orderBy}`;

    // Try cached data first to avoid making the same API request repeatedly.
    const cachedSets = getCachedData(cacheKey, config.cacheMinutes);

    if (cachedSets) {
      renderHomeSets(grid, cachedSets);
      return;
    }

    const url = new URL(SETS_API_URL);

    url.searchParams.set('page', 1);
    url.searchParams.set('pageSize', 3);
    url.searchParams.set('orderBy', config.orderBy);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }

    const result = await response.json();
    const sets = result.data || [];

    // Save the API result so it can be reused on future page loads.
    setCachedData(cacheKey, sets);

    renderHomeSets(grid, sets);
  } catch (errorMessage) {
    console.error(errorMessage);
    error.classList.remove('d-none');
  } finally {
    loading.classList.add('d-none');
  }
}

// Render set cards on the home page
function renderHomeSets(grid, sets) {
  if (!sets.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border text-center mb-0">
          No sets were found.
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = sets.map(set => `
    <div class="col-md-4">
      <article class="set-result-card h-100 border rounded-4 p-4 shadow-sm bg-white d-flex flex-column">
        <div class="d-flex align-items-center gap-3 mb-3">
          <img src="${set.images?.symbol || ''}" alt="${set.name} symbol" class="set-symbol">

          <div>
            <p class="text-secondary small mb-1">${set.series || 'Unknown series'}</p>
            <h3 class="h5 mb-0">${set.name}</h3>
          </div>
        </div>

        <div class="set-logo-wrap mb-3">
          <img src="${set.images?.logo || ''}" alt="${set.name} logo" class="set-logo img-fluid">
        </div>

        <dl class="row small mb-4">
          <dt class="col-5 text-secondary">Release date</dt>
          <dd class="col-7 mb-2">${formatSetDate(set.releaseDate)}</dd>

          <dt class="col-5 text-secondary">Printed total</dt>
          <dd class="col-7 mb-2">${set.printedTotal ?? 'N/A'}</dd>

          <dt class="col-5 text-secondary">Total cards</dt>
          <dd class="col-7 mb-0">${set.total ?? 'N/A'}</dd>
        </dl>

        <a href="index.php?p=cards&set=${encodeURIComponent(set.id)}" class="btn btn-dark mt-auto">
          See all cards
        </a>
      </article>
    </div>
  `).join('');
}

// Format set release dates for UK display
function formatSetDate(dateString) {
  if (!dateString) {
    return 'Unknown';
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

// Navbar search redirects to cards page
function setupNavbarSearch() {
  const form = document.querySelector('.nav-search-form');
  const input = document.getElementById('card-search');

  if (!form || !input) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const value = input.value.trim();

window.location.href = value
  ? `index.php?p=cards&search=${encodeURIComponent(value)}`
  : 'index.php?p=cards';
  });
}

// Initialise homepage
async function initHomePage() {
  setupNavbarSearch();

  await fetchExchangeRate();
  await fetchFeaturedCards();

  fetchRecentSets();
  fetchVintageSets();
}

initHomePage();