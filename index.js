const FEATURED_CARDS_API_URL = 'https://api.pokemontcg.io/v2/cards';

const featuredLoading = document.getElementById('trending-loading');
const featuredError = document.getElementById('trending-error');
const featuredCarousel = document.getElementById('trendingCardsCarousel');
const featuredTrack = document.getElementById('trending-cards-carousel-inner');
const featuredPrevButton = document.getElementById('featured-prev');
const featuredNextButton = document.getElementById('featured-next');

let featuredCards = [];
let currentFeaturedIndex = 0;

const featuredQuery = '(name:Charizard OR name:Pikachu OR name:Mewtwo OR name:Eevee OR name:Gengar OR name:Rayquaza OR name:Lugia OR name:Umbreon)';

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

function renderFeaturedCards() {
  if (!featuredCards.length) {
    featuredError.textContent = 'No featured cards with prices were found.';
    featuredError.classList.remove('d-none');
    return;
  }

  featuredTrack.innerHTML = featuredCards
    .map(card => createFeaturedCardHtml(card))
    .join('');

  currentFeaturedIndex = 0;
  updateCarouselCards();

  featuredCarousel.classList.remove('d-none');
}

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

featuredNextButton.addEventListener('click', () => {
  currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredCards.length;
  updateCarouselCards();
});

featuredPrevButton.addEventListener('click', () => {
  currentFeaturedIndex =
    (currentFeaturedIndex - 1 + featuredCards.length) % featuredCards.length;

  updateCarouselCards();
});

window.addEventListener('resize', updateCarouselCards);

function getVisibleCardCount() {
  if (window.innerWidth < 576) {
    return 1;
  }

  if (window.innerWidth < 992) {
    return 2;
  }

  return 4;
}

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

function getMarketPrice(tcgplayerData) {
  if (!tcgplayerData || !tcgplayerData.prices) {
    return 'Price unavailable';
  }

  const priceGroups = Object.values(tcgplayerData.prices);

  for (const group of priceGroups) {
    if (!group) continue;

    if (typeof group.market === 'number') {
      return `$${group.market.toFixed(2)}`;
    }

    if (typeof group.mid === 'number') {
      return `$${group.mid.toFixed(2)}`;
    }

    if (typeof group.low === 'number') {
      return `$${group.low.toFixed(2)}`;
    }

    if (typeof group.high === 'number') {
      return `$${group.high.toFixed(2)}`;
    }
  }

  return 'Price unavailable';
}

fetchFeaturedCards();