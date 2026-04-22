// Base API URL for Pokémon TCG sets.
const SETS_API_URL = 'https://api.pokemontcg.io/v2/sets';

// Track the current page state.
let currentSetPage = 1;
const setPageSize = 12;
let totalSetPages = 1;

// Grab page elements once.
const setsGrid = document.getElementById('sets-grid');
const setsLoading = document.getElementById('sets-loading');
const setsError = document.getElementById('sets-error');
const setsCount = document.getElementById('sets-count');
const setsPageInfo = document.getElementById('sets-page-info');
const prevSetsButton = document.getElementById('prev-sets');
const nextSetsButton = document.getElementById('next-sets');
const setSearchInput = document.getElementById('set-search');
const setSortSelect = document.getElementById('set-sort');

// debounce timer for search.
let setSearchTimeout;

// Fetch sets from the API.
async function fetchSets() {
  // Show loading state.
  setsLoading.classList.remove('d-none');
  setsError.classList.add('d-none');
  setsGrid.innerHTML = '';

  // Read current filters.
  const searchValue = setSearchInput.value.trim();
  const sortValue = setSortSelect.value;

  let q = '';
  if (searchValue) {
    q = `name:*${searchValue}* OR series:*${searchValue}*`;
  }


  const url = new URL(SETS_API_URL);
  url.searchParams.set('page', currentSetPage);
  url.searchParams.set('pageSize', setPageSize);
  url.searchParams.set('orderBy', sortValue);

  if (q) {
    url.searchParams.set('q', q);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }

    const result = await response.json();
    const sets = result.data || [];

    // Calculate pagination
    totalSetPages = Math.ceil(result.totalCount / result.pageSize);

    // Render cards.
    renderSets(sets);

    // Update labels and controls.
    setsCount.textContent = `${result.totalCount} set${result.totalCount === 1 ? '' : 's'} found`;
    setsPageInfo.textContent = `Page ${result.page} of ${totalSetPages}`;
    prevSetsButton.disabled = currentSetPage === 1;
    nextSetsButton.disabled = currentSetPage === totalSetPages;
  } catch (error) {
    setsError.classList.remove('d-none');
    setsCount.textContent = 'Could not load sets';
    setsPageInfo.textContent = `Page ${currentSetPage}`;
  } finally {
    setsLoading.classList.add('d-none');
  }
}

// Render set cards.
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
        <article class="set-result-card h-100 border rounded-4 p-4 shadow-sm bg-white">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img
              src="${set.images?.symbol || ''}"
              alt="${set.name} symbol"
              class="set-symbol"
            >
            <div>
              <p class="text-secondary small mb-1">${set.series || 'Unknown series'}</p>
              <h3 class="h5 mb-0">${set.name}</h3>
            </div>
          </div>

          <div class="set-logo-wrap mb-3">
            <img
              src="${set.images?.logo || ''}"
              alt="${set.name} logo"
              class="set-logo img-fluid"
            >
          </div>

          <dl class="row small mb-0">
            <dt class="col-5 text-secondary">Release date</dt>
            <dd class="col-7 mb-2">${formatDate(set.releaseDate)}</dd>

            <dt class="col-5 text-secondary">Printed total</dt>
            <dd class="col-7 mb-2">${set.printedTotal ?? 'N/A'}</dd>

            <dt class="col-5 text-secondary">Total cards</dt>
            <dd class="col-7 mb-2">${set.total ?? 'N/A'}</dd>

            <dt class="col-5 text-secondary">PTCGO code</dt>
            <dd class="col-7 mb-0">${set.ptcgoCode || 'N/A'}</dd>
          </dl>
        </article>
      </div>
    `;
  }).join('');
}

// Format API dates
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

// Previous page button.
prevSetsButton.addEventListener('click', () => {
  if (currentSetPage > 1) {
    currentSetPage--;
    fetchSets();
  }
});

// Next page button.
nextSetsButton.addEventListener('click', () => {
  if (currentSetPage < totalSetPages) {
    currentSetPage++;
    fetchSets();
  }
});

// Search sets with debounce.
setSearchInput.addEventListener('input', () => {
  clearTimeout(setSearchTimeout);

  setSearchTimeout = setTimeout(() => {
    currentSetPage = 1;
    fetchSets();
  }, 400);
});

// Sort sets.
setSortSelect.addEventListener('change', () => {
  currentSetPage = 1;
  fetchSets();
});


fetchSets();