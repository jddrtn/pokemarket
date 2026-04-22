// Base API URL for Pokemon TCG cards.
const CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';

// Track pagination state.
let currentCardPage = 1;
const cardPageSize = 12;
let totalCardPages = 1;

// Grab page elements.
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

// Search debounce timer.
let cardSearchTimeout;

// Fetch cards from the API.
async function fetchCards() {
  // Show loading.
  cardsLoading.classList.remove('d-none');
  cardsError.classList.add('d-none');
  cardsGrid.innerHTML = '';

  // Read filters.
  const cardSearch = cardSearchInput.value.trim();
  const setFilter = cardSetFilterInput.value.trim();
  const sortValue = cardSortSelect.value;

  // Build Lucene-like query string.
  const queryParts = [];

  if (cardSearch) {
    queryParts.push(`name:*${cardSearch}*`);
  }

  if (setFilter) {
    queryParts.push(`set.name:*${setFilter}*`);
  }

  const q = queryParts.join(' ');

  // Build URL.
  const url = new URL(CARDS_API_URL);
  url.searchParams.set('page', currentCardPage);
  url.searchParams.set('pageSize', cardPageSize);
  url.searchParams.set('orderBy', sortValue);

  // Request only fields we need for performance.
  url.searchParams.set(
    'select',
    'id,name,images,set,rarity,number,tcgplayer'
  );

  if (q) {
    url.searchParams.set('q', q);
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
    cardsError.classList.remove('d-none');
    cardsCount.textContent = 'Could not load cards';
    cardsPageInfo.textContent = `Page ${currentCardPage}`;
  } finally {
    cardsLoading.classList.add('d-none');
  }
}

// Render card results.
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
    const marketPrice = getMarketPrice(card.tcgplayer);

    return `
      <div class="col-sm-6 col-xl-3">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <img
            src="${card.images?.small || ''}"
            alt="${card.name}"
            class="pokemon-card-image"
          >

          <div class="card-body">
            <p class="text-secondary small mb-2">${card.set?.name || 'Unknown set'}</p>
            <h3 class="h5 card-title mb-2">${card.name}</h3>

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
      </div>
    `;
  }).join('');
}

// Extract a sensible market price from whichever tcgplayer price bucket exists.
function getMarketPrice(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'Price unavailable';
  }

  const priceGroups = Object.values(tcgplayerData.prices);

  // Look for the first price group with a market value.
  for (const group of priceGroups) {
    if (group && typeof group.market === 'number') {
      return `$${group.market.toFixed(2)}`;
    }
  }

  return 'Price unavailable';
}

// Previous page.
prevCardsButton.addEventListener('click', () => {
  if (currentCardPage > 1) {
    currentCardPage--;
    fetchCards();
  }
});

// Next page.
nextCardsButton.addEventListener('click', () => {
  if (currentCardPage < totalCardPages) {
    currentCardPage++;
    fetchCards();
  }
});

// Debounced search/filter.
function triggerCardSearch() {
  clearTimeout(cardSearchTimeout);

  cardSearchTimeout = setTimeout(() => {
    currentCardPage = 1;
    fetchCards();
  }, 400);
}

cardSearchInput.addEventListener('input', triggerCardSearch);
cardSetFilterInput.addEventListener('input', triggerCardSearch);

// Sort change.
cardSortSelect.addEventListener('change', () => {
  currentCardPage = 1;
  fetchCards();
});


fetchCards();