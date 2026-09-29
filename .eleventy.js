module.exports = function(eleventyConfig) {
  // Copier les assets statiques
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copier le dossier bases contenant les fichiers .png et .sqlite
  eleventyConfig.addPassthroughCopy({
    "bases": "assets/bases"
  });
  
  // Copier sql.js depuis node_modules si disponible
  eleventyConfig.addPassthroughCopy({
    "node_modules/sql.js/dist": "assets/sql.js"
  });
  
  // Créer une collection pour tous les TPs
  eleventyConfig.addCollection("allTPs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/tps/**/*.md")
      .sort((a, b) => {
        // Trier par ordre TP1, TP2, etc. puis par exercice
        const orderA = (a.data.tpNum || 0) * 100 + (a.data.exerciceNum || 0);
        const orderB = (b.data.tpNum || 0) * 100 + (b.data.exerciceNum || 0);
        return orderA - orderB;
      });
  });
  
  // Créer une collection groupée par TP
  eleventyConfig.addCollection("tpsByNumber", function(collectionApi) {
    const tps = {};
    collectionApi.getFilteredByGlob("src/tps/**/*.md").forEach(item => {
      const tpNum = item.data.tpNum !== undefined ? item.data.tpNum : 2;
      if (!tps[tpNum]) {
        tps[tpNum] = [];
      }
      tps[tpNum].push(item);
    });
    
    // Trier les exercices dans chaque TP
    Object.keys(tps).forEach(key => {
      tps[key].sort((a, b) => (a.data.exerciceNum || 0) - (b.data.exerciceNum || 0));
    });
    
    return tps;
  });
  
  // Filtre pour afficher les dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('fr-FR');
  });
  
  // Obfuscation pour requêtes SQL attendues
  function obfuscateQuery(query) {
    const key = "IUT-BDR-SQL-SECRET";
    let encoded = "";
    const trimmed = query.trim();
    for (let i = 0; i < trimmed.length; i++) {
      encoded += String.fromCharCode(trimmed.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(encoded, 'binary').toString('base64');
  }

  // Configuration markdown avec support des attributs et des solutions attendues
  const markdownIt = require("markdown-it");
  const markdownItAttrs = require("markdown-it-attrs");
  
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAttrs);

  let qCounter = 0;
  const originalRender = markdownLibrary.render;
  markdownLibrary.render = function(src, env) {
    qCounter = 0;
    return originalRender.call(this, src, env);
  };

  const defaultHtmlBlock = markdownLibrary.renderer.rules.html_block || function(tokens, idx) { return tokens[idx].content; };
  const defaultHtmlInline = markdownLibrary.renderer.rules.html_inline || function(tokens, idx) { return tokens[idx].content; };

  function replaceComment(content) {
    const regex = /<!--\s*(?:expected[-_]?query|solution)(?:[ :]\s*([^\r\n]+))?\r?\n([\s\S]*?)-->/gi;
    return content.replace(regex, (match, customLabel, sqlQuery) => {
      qCounter++;
      let label = customLabel ? customLabel.trim() : `Q${qCounter}`;
      if (!label.startsWith('Q') && !isNaN(parseInt(label))) {
        label = `Q${label}`;
      }
      const trimmedQuery = sqlQuery.trim();
      if (!trimmedQuery) return "";
      const obfuscated = obfuscateQuery(trimmedQuery);
      
      return `\n<div class="expected-action-wrapper">\n  <button type="button" class="btn-expected-result" data-qid="${label}" data-query="${obfuscated}" title="Afficher le résultat attendu pour ${label}">\n    <svg class="expected-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <circle cx="12" cy="12" r="10"></circle>\n      <path d="M12 8v4l3 3"></path>\n    </svg>\n    <span>Résultat attendu (${label})</span>\n  </button>\n</div>\n`;
    });
  }

  markdownLibrary.renderer.rules.html_block = function(tokens, idx, options, env, self) {
    const raw = tokens[idx].content;
    if (/<!--\s*(?:expected[-_]?query|solution)/i.test(raw)) {
      return replaceComment(raw);
    }
    return defaultHtmlBlock(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.html_inline = function(tokens, idx, options, env, self) {
    const raw = tokens[idx].content;
    if (/<!--\s*(?:expected[-_]?query|solution)/i.test(raw)) {
      return replaceComment(raw);
    }
    return defaultHtmlInline(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", markdownLibrary);
  
  // Déterminer le pathPrefix en fonction de l'environnement
  const isProduction = process.env.ELEVENTY_ENV === 'production';
  const pathPrefix = isProduction ? '/tp-sql' : '';
  
  // Filtre personnalisé pour les URLs relatives
  eleventyConfig.addFilter("absUrl", (url) => {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    const cleanUrl = (url.startsWith('/') ? url : '/' + url);
    return pathPrefix + cleanUrl;
  });
  
  return {
    pathPrefix: pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
