// Small localStorage cache helper to imrove performance and reduce API calls

function getCachedData(key, maxAgeMinutes) {
  const cachedItem = localStorage.getItem(key);

  if (!cachedItem) {
    return null;
  }

  const parsedItem = JSON.parse(cachedItem);
  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;

  if (now - parsedItem.savedAt > maxAge) {
    localStorage.removeItem(key);
    return null;
  }

  return parsedItem.data;
}

function setCachedData(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      savedAt: Date.now(),
      data: data
    })
  );
}