if (!window.location.search.includes('v')) {
  const url = new URL(window.location.href);
  url.searchParams.set('v', Date.now());
  window.location.replace(url);
}
