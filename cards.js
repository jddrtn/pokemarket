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

let cardSearchTimeout;

// Fetch exchange rate
async function fetchExchangeRate() {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);

    if (!response.ok) throw new Error();

    const result = await response.json();

    if (result.rates?.GBP) {
      usdToGbpRate = result.rates.GBP;
    }
  } catch {
    console.error('Using fallback exchange rate');
  }
}

// Fetch cards
async function fetchCards() {
  cardsLoading.classList.remove('d-none');
  cardsError.classList.add('d-none');
  cardsGrid.innerHTML = '';

  const queryParts = [];

  if (cardSearchInput.value.trim()) {
    queryParts.push(`name:*${cardSearchInput.value.trim()}*`);
  }

  if (cardSetFilterInput.value.trim()) {
    queryParts.push(`set.name:*${cardSetFilterInput.value.trim()}*`);
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

    if (!response.ok) throw new Error();

    const result = await response.json();

    totalCardPages = Math.ceil(result.totalCount / result.pageSize);

    renderCards(result.data || []);

    cardsCount.textContent = `${result.totalCount} cards found`;
    cardsPageInfo.textContent = `Page ${result.page} of ${totalCardPages}`;

    prevCardsButton.disabled = currentCardPage === 1;
    nextCardsButton.disabled = currentCardPage === totalCardPages;
  } catch {
    cardsError.classList.remove('d-none');
  } finally {
    cardsLoading.classList.add('d-none');
  }
}

// Render cards
function renderCards(cards) {
  cardsGrid.innerHTML = cards.map(card => `
    <div class="col-sm-6 col-xl-3">
      <a href="card.html?id=${card.id}" class="text-decoration-none text-dark">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-link-card">
          <img src="${card.images?.small || ''}" class="pokemon-card-image">

          <div class="card-body">
            <p class="text-secondary small mb-2">${card.set?.name || ''}</p>
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
  if (!tcgplayer?.prices) return 'Price unavailable';

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

// Currency toggle
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

// Navbar search
function setupNavbarSearch() {
  const form = document.querySelector('.nav-search-form');
  const input = document.getElementById('card-search');

  if (!form || !input) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    window.location.href = `cards.html?search=${encodeURIComponent(input.value)}`;
  });
}

// Apply search from URL
function applySearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');

  if (search) {
    cardSearchInput.value = search;
  }
}

// Init
async function init() {
  setupNavbarSearch();
  setupCurrencyToggle();
  applySearchFromUrl();

  await fetchExchangeRate();
  fetchCards();
}

init();