const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description']
    ]
  }
});

// Fetch RSS feed
async function fetchRSSFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error(`Greška pri dohvaćanju RSS: ${url}`, error.message);
    throw error;
  }
}

// Čisti HTML sadržaj
function cleanHTMLContent(html) {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  
  // Ukloni skripte, stilove, reklame
  $('script').remove();
  $('style').remove();
  $('noscript').remove();
  $('iframe').remove();
  $('.advertisement').remove();
  $('.ad').remove();
  $('.ads').remove();
  $('.promo').remove();
  $('.related').remove();
  $('.share').remove();
  $('.social').remove();
  $('nav').remove();
  $('header').remove();
  $('footer').remove();
  
  // Izvuci tekst
  let cleanText = $('body').text();
  
  // Očisti whitespace
  cleanText = cleanText
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  return cleanText;
}

// Izvuci slike
function extractImages(html) {
  if (!html) return [];
  
  const $ = cheerio.load(html);
  const images = [];
  
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon')) {
      images.push(src);
    }
  });
  
  return images.slice(0, 5); // Max 5 slika
}

// Fetch full article
async function fetchFullArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      'main'
    ];
    
    let content = '';
    for (const selector of contentSelectors) {
      const elem = $(selector).first();
      if (elem.length) {
        content = elem.html();
        break;
      }
    }
    
    if (!content) {
      content = $('body').html();
    }
    
    return {
      html: content,
      cleanText: cleanHTMLContent(content),
      images: extractImages(content)
    };
  } catch (error) {
    console.error(`Greška pri dohvaćanju članka: ${url}`, error.message);
    return null;
  }
}

module.exports = {
  fetchRSSFeed,
  cleanHTMLContent,
  extractImages,
  fetchFullArticle
};
