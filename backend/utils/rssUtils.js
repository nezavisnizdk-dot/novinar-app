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

// ULTRA AGGRESSIVE CLEANER - SAMO H1 + P TAGOVI!
function cleanHTMLContent(html) {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  
  // Ekstraktuj SAMO H1 i P tagove
  const title = $('h1').first().text().trim() || $('h2').first().text().trim();
  const paragraphs = [];
  
  $('p').each((i, elem) => {
    let text = $(elem).text().trim();
    
    // ULTRA STROGI FILTERI - samo pravi sadržaj
    if (
      text.length >= 100 && // Minimum 100 karaktera
      text.split(' ').length >= 15 && // Minimum 15 riječi
      // Bez spam fraza
      !text.match(/share|podijeli|facebook|twitter|instagram|whatsapp|telegram/i) &&
      !text.match(/click|klikni|subscribe|pretplati|advertisement|reklama/i) &&
      !text.match(/read more|pročitaj|related|povezano|recommended|preporučeno/i) &&
      !text.match(/copyright|©|all rights|sva prava/i) &&
      !text.match(/^\s*foto:/i) &&
      !text.match(/^\s*izvor:/i) &&
      !text.match(/^\s*autor:/i) &&
      !text.match(/^\s*\[.*\]\s*$/i) // Bez [brackets]
    ) {
      paragraphs.push(text);
    }
  });
  
  // Kombinuj naslov + paragrafi
  let result = '';
  if (title) result = title + '\n\n';
  result += paragraphs.join('\n\n');
  
  return result.trim();
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
  
  return images.slice(0, 5);
}

// ULTRA AGGRESSIVE ARTICLE SCRAPER - SAMO H1 i P!
async function fetchFullArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // ===== NUKLEARNO ČIŠĆENJE =====
    
    // Ukloni sve non-content elemente
    $('script, style, noscript, iframe, svg, canvas, video, audio, embed, object').remove();
    $('nav, header, footer, aside, menu').remove();
    
    // Reklame i promo
    $('.advertisement, .ad, .ads, .banner, .promo, .promotional').remove();
    $('[class*="ad-"], [class*="ads-"], [id*="ad-"], [id*="ads-"]').remove();
    
    // Social share
    $('.share, .social, .social-share, .sharing, .sharethis, .addthis').remove();
    $('[class*="share"], [class*="social"]').remove();
    
    // Related posts
    $('.related, .related-posts, .related-articles, .similar, .more-stories').remove();
    $('[class*="related"]').remove();
    
    // Sidebar i widgets
    $('.sidebar, .widget, .widgets').remove();
    
    // Comments
    $('.comments, .comment, .comment-section, .disqus').remove();
    
    // Metadata
    $('.author, .author-bio, .byline').remove();
    $('.date, .time, .timestamp, .posted, .published').remove();
    $('.meta, .metadata, .post-meta, .entry-meta').remove();
    $('.tags, .tag, .category, .categories').remove();
    $('.breadcrumb, .breadcrumbs').remove();
    
    // Newsletter i subscription
    $('.newsletter, .subscribe, .subscription, .signup').remove();
    
    // Popup i overlay
    $('.popup, .modal, .overlay').remove();
    
    // ===== SITE-SPECIFIC FILTERS =====
    
    // Avaz.ba
    $('.najnovije, .najcitanije, .preporucujemo, .najpopularnije').remove();
    $('.komentar-box, .komentari, .avaz-comments').remove();
    $('.avaz-widget, .avaz-banner, .avaz-ad').remove();
    
    // Klix.ba
    $('.widget-box, .box-najnovije, .box-najcitanije').remove();
    $('.klix-tags, .klix-share, .klix-related').remove();
    $('.klix-widget, .klix-banner').remove();
    
    // Crna-hronika.info
    $('.crna-hronika-related, .ch-widget, .ch-banner').remove();
    $('.ch-share, .ch-social').remove();
    
    // Nezavisne.com
    $('.nezavisne-widget, .nz-related, .nz-widget').remove();
    $('.nz-share, .nz-social, .nz-banner').remove();
    
    // ===== CONTENT EXTRACTION =====
    
    // Nađi glavni sadržaj
    const contentSelectors = [
      'article .entry-content',
      'article .post-content', 
      'article .article-content',
      'article .article-body',
      'article .content',
      '.entry-content',
      '.post-content',
      '.article-content',
      '.article-body',
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
    
    // Load content i izvuci SAMO H1 i P
    const $content = cheerio.load(content);
    
    // NASLOV - Samo prvi H1 ili H2
    let title = $content('h1').first().text().trim();
    if (!title) {
      title = $content('h2').first().text().trim();
    }
    if (!title) {
      title = $content('.title, .post-title, .entry-title, .article-title').first().text().trim();
    }
    
    // PARAGRAFI - Samo P tagovi sa strogim filterima
    const paragraphs = [];
    $content('p').each((i, elem) => {
      let text = $content(elem).text().trim();
      
      // ULTRA STROGI KRITERIJI
      if (
        text.length >= 100 && // Min 100 karaktera
        text.split(' ').length >= 15 && // Min 15 riječi
        // Filteri za spam fraze
        !text.match(/share|podijeli|tweet|facebook|twitter|instagram|whatsapp|telegram|viber/i) &&
        !text.match(/click here|klikni ovdje|kliknite|click to/i) &&
        !text.match(/subscribe|pretplati|newsletter|email/i) &&
        !text.match(/advertisement|reklama|sponsored|sponzorisano/i) &&
        !text.match(/read more|pročitaj više|više o tome|nastavi čitati/i) &&
        !text.match(/related|povezano|slični|similar|recommended|preporučeno/i) &&
        !text.match(/copyright|©|™|®|all rights reserved|sva prava pridržana/i) &&
        !text.match(/^\s*foto:/i) &&
        !text.match(/^\s*fotografija:/i) &&
        !text.match(/^\s*izvor:/i) &&
        !text.match(/^\s*autor:/i) &&
        !text.match(/^\s*published/i) &&
        !text.match(/^\s*objavljeno/i) &&
        !text.match(/^\s*\[.*\]\s*$/i) && // Bez [brackets]
        !text.match(/^\s*\(.*\)\s*$/i) && // Bez (parentheses)
        !text.match(/^\d+\.?\s*$/i) && // Bez samo brojeva
        !text.match(/^[A-Z\s]+$/i) // Bez samo velikih slova (headeri)
      ) {
        paragraphs.push(text);
      }
    });
    
    // ===== FINALNI OUTPUT =====
    let cleanedText = '';
    if (title && title.length > 10) {
      cleanedText = title + '\n\n';
    }
    cleanedText += paragraphs.join('\n\n');
    
    // Backup ako nema dovoljno sadržaja
    if (cleanedText.length < 300) {
      cleanedText = cleanHTMLContent(content);
    }
    
    // Još jedno čišćenje whitespace-a
    cleanedText = cleanedText
      .replace(/\s+/g, ' ') // Višestruki razmaci u jedan
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 prazne linije
      .trim();
    
    return {
      html: content,
      cleanText: cleanedText,
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
