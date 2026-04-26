// API endpoint
const CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';

// Pagination state
let currentCardPage = 1;
const cardPageSize = 12;
let totalCardPages = 1;

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

let cardSearchTimeout;

// Fetch cards from API
async function fetchCards() {
  cardsLoading.classList.remove('d-none');
  cardsError.classList.add('d-none');
  cardsGrid.innerHTML = '';

  const cardSearch = cardSearchInput.value.trim();
  const setFilter = cardSetFilterInput.value.trim();
  const sortValue = cardSortSelect.value;

  const queryParts = [];

  if (cardSearch) {
    queryParts.push(`name:*${cardSearch}*`);
  }

  if (setFilter) {
    queryParts.push(`set.name:*${setFilter}*`);
  }

  const url = new URL(CARDS_API_URL);

  url.searchParams.set('page', currentCardPage);
  url.searchParams.set('pageSize', cardPageSize);
  url.searchParams.set('orderBy', sortValue);
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
    const cards = result.data || [];

    totalCardPages = Math.ceil(result.totalCount / result.pageSize);

    renderCards(cards);

    cardsCount.textContent = `${result.totalCount} card${result.totalCount === 1 ? '' : 's'} found`;
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

// Render card grid
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

  cardsGrid.innerHTML = cards.map(card => {
    const price = getMarketPrice(card.tcgplayer);

    return `
      <div class="col-sm-6 col-xl-3">
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
  }).join('');
}

// Get best available market price
function getMarketPrice(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'Price unavailable';
  }

  for (const group of Object.values(tcgplayerData.prices)) {
    if (!group) continue;

    const value = group.market ?? group.mid ?? group.low ?? group.high;

    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
  }

  return 'Price unavailable';
}

// Move to previous page
prevCardsButton.addEventListener('click', () => {
  if (currentCardPage > 1) {
    currentCardPage--;
    fetchCards();
  }
});

// Move to next page
nextCardsButton.addEventListener('click', () => {
  if (currentCardPage < totalCardPages) {
    currentCardPage++;
    fetchCards();
  }
});

// Search cards after user stops typing
function triggerCardSearch() {
  clearTimeout(cardSearchTimeout);

  cardSearchTimeout = setTimeout(() => {
    currentCardPage = 1;
    fetchCards();
  }, 400);
}

cardSearchInput.addEventListener('input', triggerCardSearch);
cardSetFilterInput.addEventListener('input', triggerCardSearch);

// Sort cards
cardSortSelect.addEventListener('change', () => {
  currentCardPage = 1;
  fetchCards();
});

// Fill search input from URL query
function applySearchFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const searchValue = params.get('search');

  if (searchValue) {
    cardSearchInput.value = searchValue;
  }
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

// Initialise cards page
setupNavbarSearch();
applySearchFromUrl();
fetchCards();