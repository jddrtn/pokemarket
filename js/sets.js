// API endpoint
const SETS_API_URL = 'https://api.pokemontcg.io/v2/sets';

// Pagination state
let currentSetPage = 1;
const setPageSize = 12;
let totalSetPages = 1;

// DOM elements
const setsGrid = document.getElementById('sets-grid');
const setsLoading = document.getElementById('sets-loading');
const setsError = document.getElementById('sets-error');
const setsCount = document.getElementById('sets-count');
const setsPageInfo = document.getElementById('sets-page-info');

const prevSetsButton = document.getElementById('prev-sets');
const nextSetsButton = document.getElementById('next-sets');

const setSearchInput = document.getElementById('set-search');
const setSortSelect = document.getElementById('set-sort');
const setSearchButton = document.getElementById('set-search-button');

// Fetch sets from API
async function fetchSets() {
  setsLoading.classList.remove('d-none');
  setsError.classList.add('d-none');
  setsGrid.innerHTML = '';

  const searchValue = setSearchInput.value.trim();
  const sortValue = setSortSelect.value;

  const url = new URL(SETS_API_URL);

  url.searchParams.set('page', currentSetPage);
  url.searchParams.set('pageSize', setPageSize);
  url.searchParams.set('orderBy', sortValue);

  if (searchValue) {
    const safeSearchValue = searchValue.replace(/"/g, '\\"');

    url.searchParams.set(
      'q',
      `(name:"${safeSearchValue}" OR series:"${safeSearchValue}")`
    );
  }

  const cacheKey = `sets-${currentSetPage}-${encodeURIComponent(searchValue)}-${sortValue}`;

  const cachedSetsResult = getCachedData(cacheKey, 60);

  if (cachedSetsResult) {
    totalSetPages = Math.ceil(cachedSetsResult.totalCount / cachedSetsResult.pageSize) || 1;

    renderSets(cachedSetsResult.data || []);

    setsCount.textContent = `${cachedSetsResult.totalCount} set${cachedSetsResult.totalCount === 1 ? '' : 's'} found`;
    setsPageInfo.textContent = `Page ${cachedSetsResult.page} of ${totalSetPages}`;

    prevSetsButton.disabled = currentSetPage === 1;
    nextSetsButton.disabled = currentSetPage === totalSetPages;

    setsLoading.classList.add('d-none');
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }

    const result = await response.json();

    setCachedData(cacheKey, result);

    const sets = result.data || [];

    totalSetPages = Math.ceil(result.totalCount / result.pageSize) || 1;

    renderSets(sets);

    setsCount.textContent = `${result.totalCount} set${result.totalCount === 1 ? '' : 's'} found`;
    setsPageInfo.textContent = `Page ${result.page} of ${totalSetPages}`;

    prevSetsButton.disabled = currentSetPage === 1;
    nextSetsButton.disabled = currentSetPage === totalSetPages;
  } catch (error) {
    console.error(error);
    setsError.classList.remove('d-none');
    setsCount.textContent = 'Could not load sets';
    setsPageInfo.textContent = `Page ${currentSetPage}`;
  } finally {
    setsLoading.classList.add('d-none');
  }
}

// Render set grid
function renderSets(sets) {
  if (!sets.length) {
    setsGrid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border text-center mb-0">
          No sets matched your search.
        </div>
      </div>
    `;
    return;
  }

  setsGrid.innerHTML = sets.map(set => {
    return `
      <div class="col-sm-6 col-xl-4">
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
            <dd class="col-7 mb-2">${formatDate(set.releaseDate)}</dd>

            <dt class="col-5 text-secondary">Printed total</dt>
            <dd class="col-7 mb-2">${set.printedTotal ?? 'N/A'}</dd>

            <dt class="col-5 text-secondary">Total cards</dt>
            <dd class="col-7 mb-0">${set.total ?? 'N/A'}</dd>
          </dl>

          <a href="cards.html?set=${encodeURIComponent(set.id)}" class="btn btn-dark mt-auto">
            See all cards
          </a>
        </article>
      </div>
    `;
  }).join('');
}

// Format API date for UK display
function formatDate(dateString) {
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

// Move to previous page
prevSetsButton.addEventListener('click', () => {
  if (currentSetPage > 1) {
    currentSetPage--;
    fetchSets();
  }
});

// Move to next page
nextSetsButton.addEventListener('click', () => {
  if (currentSetPage < totalSetPages) {
    currentSetPage++;
    fetchSets();
  }
});

// Search sets when button is clicked
setSearchButton.addEventListener('click', () => {
  currentSetPage = 1;
  fetchSets();
});

// Search sets when Enter is pressed
setSearchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    currentSetPage = 1;
    fetchSets();
  }
});

// Sort sets
setSortSelect.addEventListener('change', () => {
  currentSetPage = 1;
  fetchSets();
});

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

// Initialise sets page
setupNavbarSearch();
fetchSets();