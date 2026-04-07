const url1 = "https://calendar.google.com/calendar/embed?src=c_xyz%40group.calendar.google.com&ctz=America%2FSao_Paulo"
const url2 = "https://calendar.google.com/calendar/embed?src=franco@example.com"
const url3 = "https://calendar.google.com/calendar/u/0?cid=xyz"

function getEmbedUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'calendar.google.com') return url;
    
    // Base embed URL
    const baseUrl = 'https://calendar.google.com/calendar/embed';
    
    // Copy existing params or use the URL string as raw
    const searchParams = new URLSearchParams(urlObj.search);
    
    // Force specific display parameters
    searchParams.set('showTitle', '0');
    searchParams.set('showPrint', '0');
    searchParams.set('showTabs', '0');
    searchParams.set('showCalendars', '0');
    searchParams.set('showTz', '0');
    searchParams.set('mode', 'MONTH');
    searchParams.set('wkst', '1');
    searchParams.set('bgcolor', '#ffffff');
    searchParams.set('ctz', 'America/Sao_Paulo');
    
    // If the user pasted a non-embed URL (e.g. sharing link with cid), try to extract cid and use as src
    if (!urlObj.pathname.includes('/embed')) {
      const cid = searchParams.get('cid');
      if (cid) {
         searchParams.set('src', cid);
         searchParams.delete('cid');
      }
    }

    return `${baseUrl}?${searchParams.toString()}`;
  } catch (e) {
    // If invalid URL, return original to avoid breaking everything
    return url;
  }
}

console.log("URL 1:", getEmbedUrl(url1));
console.log("URL 2:", getEmbedUrl(url2));
console.log("URL 3:", getEmbedUrl(url3));
