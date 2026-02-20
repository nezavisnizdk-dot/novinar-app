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

// Čisti HTML sadržaj - SAMO naslov i glavni tekst
function cleanHTMLContent(html) {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  
  // Prvo ukloni SVE što nije sadržaj
  $('script').remove();
  $('style').remove();
  $('noscript').remove();
  $('iframe').remove();
  $('form').remove();
  $('button').remove();
  $('input').remove();
  
  // Ukloni navigaciju, header, footer
  $('nav').remove();
  $('header').remove();
  $('footer').remove();
  $('aside').remove();
  
  // Ukloni reklame i widget-e
  $('.advertisement').remove();
  $('.ad').remove();
  $('.ads').remove();
  $('.promo').remove();
  $('.related').remove();
  $('.share').remove();
  $('.social').remove();
  $('.sidebar').remove();
  $('.widget').remove();
  $('.comments').remove();
  $('.comment').remove();
  
  // Ukloni authora, datum, kategorije, tag-ove
  $('.author').remove();
  $('.date').remove();
  $('.posted').remove();
  $('.meta').remove();
  $('.tags').remove();
  $('.category').remove();
  $('.breadcrumb').remove();
  
  // Ukloni "Share", "Read more", "Subscribe" linkove
  $('a:contains("Share")').remove();
  $('a:contains("Podijeli")').remove();
  $('a:contains("Subscribe")').remove();
  $('a:contains("Pretplati")').remove();
  $('a:contains("Read more")').remove();
  $('a:contains("Pročitaj")').remove();
  
  // Pokušaj naći SAMO glavni sadržaj članka
  const contentSelectors = [
    'article .entry-content',
    'article .post-content',
    'article .article-content',
    '.entry-content',
    '.post-content',
    '.article-content',
    '.content',
    'article p',
    'main p'
  ];
  
  let cleanText = '';
  
  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length) {
      cleanText = element.text();
      break;
    }
  }
  
  // Ako ništa nije pronađeno, probaj body (backup)
  if (!cleanText) {
    cleanText = $('body').text();
  }
  
  // Aggressive cleaning
  cleanText = cleanText
    // Ukloni višestruke razmake
    .replace(/\s+/g, ' ')
    // Ukloni višestruke nove linije
    .replace(/\n\s*\n/g, '\n\n')
    // Ukloni common fraze koje nisu sadržaj
    .replace(/Advertisement/gi, '')
    .replace(/Pročitaj više/gi, '')
    .replace(/Read more/gi, '')
    .replace(/Share on/gi, '')
    .replace(/Podijeli na/gi, '')
    .replace(/Pogledaj još/gi, '')
    .replace(/Related posts/gi, '')
    .replace(/Povezani članci/gi, '')
    .replace(/Prenesi/gi, '')
    .replace(/Tweet/gi, '')
    .replace(/Facebook/gi, '')
    .replace(/Twitter/gi, '')
    .replace(/WhatsApp/gi, '')
    // Ukloni email subscribe text
    .replace(/Subscribe to.*/gi, '')
    .replace(/Pretplati se.*/gi, '')
    // Ukloni "Click here" text
    .replace(/Click here.*/gi, '')
    .replace(/Klikni ovdje.*/gi, '')
    .trim();
  
  // Split u paragrafe i uzmi samo one duže od 50 karaktera
  const paragraphs = cleanText
    .split('\n\n')
    .filter(p => p.trim().length > 50)
    .join('\n\n');
  
  return paragraphs || cleanText;
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
    
    // Ukloni SVE što sigurno nije sadržaj
    $('script, style, noscript, iframe, nav, header, footer, aside').remove();
    $('.advertisement, .ad, .ads, .promo, .related, .share, .social, .sidebar, .widget, .comments').remove();
    $('.author, .date, .posted, .meta, .tags, .category, .breadcrumb').remove();
    
    // Pokušaj naći glavni sadržaj - prioritet selektori
    const contentSelectors = [
      'article .entry-content',
      'article .post-content', 
      'article .article-content',
      '.entry-content',
      '.post-content',
      '.article-content',
      'article',
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
    
    // Ekstraktuj SAMO paragrafe (najvažniji dio!)
    const $content = cheerio.load(content);
    const paragraphs = [];
    
    $content('p').each((i, elem) => {
      const text = $content(elem).text().trim();
      // Samo paragrafi duži od 100 karaktera (pravi sadržaj)
      if (text.length > 100) {
        paragraphs.push(text);
      }
    });
    
    // Join paragrafe sa dvostrukim novim linijama
    const cleanedText = paragraphs.join('\n\n');
    
    return {
      html: content,
      cleanText: cleanedText.length > 200 ? cleanedText : cleanHTMLContent(content),
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
