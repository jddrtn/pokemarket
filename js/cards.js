// API endpoints
const CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';
const EXCHANGE_RATE_API_URL = 'https://api.frankfurter.dev/v2/rates?base=USD&quotes=GBP';

// Pagination state
let currentCardPage = 1;
const cardPageSize = 12;
let totalCardPages = 1;

// Currency state
let selectedCurrency = 'GBP';
let usdToGbpRate = 0.79;

// DOM elements
const cardsGrid = document.getElementById('cards-grid');
const cardsLoading = document.getElementById('cards-loading');
const cardsError = document.getElementById('cards-error');
const cardsCount = document.getElementById('cards-count');
const cardsPageInfo = document.getElementById('cards-page-info');

const prevCardsButton = document.getElementById('prev-cards');
const nextCardsButton = document.getElementById('next-cards');

const cardSearchInput = document.getElementById('card-search-page');
const cardSetFilterInput = document.getElementById('card-set-filter');
const cardSortSelect = document.getElementById('card-sort');

const gbpButton = document.getElementById('currency-gbp');
const usdButton = document.getElementById('currency-usd');

const cardSearchButton = document.getElementById('card-search-button');
const cardSetFilterButton = document.getElementById('card-set-filter-button');

// Fetch exchange rate
async function fetchExchangeRate() {
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
      setCachedData('usdToGbpRate', usdToGbpRate);
    }
  } catch (error) {
    console.error('Using fallback exchange rate:', error);
  }
}

// Fetch cards from API
async function fetchCards() {
  cardsLoading.classList.remove('d-none');
  cardsError.classList.add('d-none');
  cardsGrid.innerHTML = '';

  const queryParts = [];

  if (cardSearchInput.value.trim()) {
    const safeCardSearch = cardSearchInput.value.trim().replace(/"/g, '\\"');
    queryParts.push(`name:"${safeCardSearch}"`);
  }

  if (cardSetFilterInput.value.trim()) {
    const safeSetSearch = cardSetFilterInput.value.trim().replace(/"/g, '\\"');
    queryParts.push(`set.name:"${safeSetSearch}"`);
  }

  const url = new URL(CARDS_API_URL);

  url.searchParams.set('page', currentCardPage);
  url.searchParams.set('pageSize', cardPageSize);
  url.searchParams.set('orderBy', cardSortSelect.value);
  url.searchParams.set('select', 'id,name,images,set,rarity,number,tcgplayer');

  if (queryParts.length) {
    url.searchParams.set('q', queryParts.join(' '));
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    const result = await response.json();

    totalCardPages = Math.ceil(result.totalCount / result.pageSize) || 1;

    renderCards(result.data || []);

    cardsCount.textContent = `${result.totalCount} cards found`;
    cardsPageInfo.textContent = `Page ${result.page} of ${totalCardPages}`;

    prevCardsButton.disabled = currentCardPage === 1;
    nextCardsButton.disabled = currentCardPage === totalCardPages;
  } catch (error) {
    console.error(error);
    cardsError.classList.remove('d-none');
    cardsCount.textContent = 'Could not load cards';
    cardsPageInfo.textContent = `Page ${currentCardPage}`;
  } finally {
    cardsLoading.classList.add('d-none');
  }
}

// Render cards
function renderCards(cards) {
  if (!cards.length) {
    cardsGrid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border text-center mb-0">
          No cards matched your search.
        </div>
      </div>
    `;
    return;
  }

  cardsGrid.innerHTML = cards.map(card => `
    <div class="col-sm-6 col-xl-3">
      <a href="card.html?id=${encodeURIComponent(card.id)}" class="text-decoration-none text-dark">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-link-card">
          <img
            src="${card.images?.small || ''}"
            alt="${card.name}"
            class="pokemon-card-image"
          >

          <div class="card-body">
            <p class="text-secondary small mb-2">${card.set?.name || 'Unknown set'}</p>
            <h3 class="h5">${card.name}</h3>
            <p class="fw-bold">${getMarketPrice(card.tcgplayer)}</p>
          </div>
        </article>
      </a>
    </div>
  `).join('');
}

// Convert and format price
function getMarketPrice(tcgplayer) {
  if (!tcgplayer || !tcgplayer.prices) {
    return 'Price unavailable';
  }

  for (const group of Object.values(tcgplayer.prices)) {
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

// Format currency
function formatCurrency(value, currency) {
  return new Intl.NumberFormat(
    currency === 'GBP' ? 'en-GB' : 'en-US',
    { style: 'currency', currency }
  ).format(value);
}

// Set up currency toggle
function setupCurrencyToggle() {
  if (!gbpButton || !usdButton) return;

  gbpButton.addEventListener('click', () => {
    selectedCurrency = 'GBP';

    gbpButton.classList.replace('btn-outline-dark', 'btn-dark');
    usdButton.classList.replace('btn-dark', 'btn-outline-dark');

    fetchCards();
  });

  usdButton.addEventListener('click', () => {
    selectedCurrency = 'USD';

    usdButton.classList.replace('btn-outline-dark', 'btn-dark');
    gbpButton.classList.replace('btn-dark', 'btn-outline-dark');

    fetchCards();
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

// Apply search from URL
function applySearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');

  if (search && cardSearchInput) {
    cardSearchInput.value = search;
  }
}

// Set up pagination buttons
function setupPaginationButtons() {
  if (prevCardsButton) {
    prevCardsButton.addEventListener('click', () => {
      if (currentCardPage > 1) {
        currentCardPage--;
        fetchCards();
      }
    });
  }

  if (nextCardsButton) {
    nextCardsButton.addEventListener('click', () => {
      if (currentCardPage < totalCardPages) {
        currentCardPage++;
        fetchCards();
      }
    });
  }
}

// Set up search and filter buttons
function setupSearchButtons() {
  if (cardSearchButton) {
    cardSearchButton.addEventListener('click', () => {
      currentCardPage = 1;
      fetchCards();
    });
  }

  if (cardSetFilterButton) {
    cardSetFilterButton.addEventListener('click', () => {
      currentCardPage = 1;
      fetchCards();
    });
  }

  if (cardSearchInput) {
    cardSearchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        currentCardPage = 1;
        fetchCards();
      }
    });
  }

  if (cardSetFilterInput) {
    cardSetFilterInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        currentCardPage = 1;
        fetchCards();
      }
    });
  }
}

// Set up sort dropdown
function setupSortDropdown() {
  if (!cardSortSelect) return;

  cardSortSelect.addEventListener('change', () => {
    currentCardPage = 1;
    fetchCards();
  });
}

// Initialise cards page
async function initCardsPage() {
  setupNavbarSearch();
  setupCurrencyToggle();
  setupPaginationButtons();
  setupSearchButtons();
  setupSortDropdown();
  applySearchFromUrl();

  await fetchExchangeRate();
  fetchCards();
}

initCardsPage();