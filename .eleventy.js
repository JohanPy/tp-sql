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
      const tpNum = item.data.tpNum || 1;
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
  
  // Créer une collection pour tous les cours
  eleventyConfig.addCollection("cours", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/cours/**/*.md")
      .sort((a, b) => {
        // Trier par numéro de chapitre
        const orderA = a.data.chapNum || 0;
        const orderB = b.data.chapNum || 0;
        return orderA - orderB;
      });
  });
  
  // Créer une collection de cours groupés par catégorie
  eleventyConfig.addCollection("coursByCategory", function(collectionApi) {
    const categories = {};
    collectionApi.getFilteredByGlob("src/cours/**/*.md").forEach(item => {
      const category = item.data.category || 'autre';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    // Trier les cours dans chaque catégorie
    Object.keys(categories).forEach(key => {
      categories[key].sort((a, b) => (a.data.chapNum || 0) - (b.data.chapNum || 0));
    });
    
    return categories;
  });
  
  // Créer une collection de TPs groupés par catégorie
  eleventyConfig.addCollection("tpsByCategory", function(collectionApi) {
    const categories = {};
    collectionApi.getFilteredByGlob("src/tps/**/*.md").forEach(item => {
      const category = item.data.category || 'autre';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    // Trier les TPs dans chaque catégorie
    Object.keys(categories).forEach(key => {
      categories[key].sort((a, b) => {
        const orderA = (a.data.tpNum || 0) * 100 + (a.data.exerciceNum || 0);
        const orderB = (b.data.tpNum || 0) * 100 + (b.data.exerciceNum || 0);
        return orderA - orderB;
      });
    });
    
    return categories;
  });
  
  // Filtre pour afficher les dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('fr-FR');
  });

  // Filtre pour obtenir le chapitre précédent
  eleventyConfig.addFilter("getPrevCours", function(collections, category, chapNum) {
    if (!category || !chapNum) return null;
    const coursList = collections.coursByCategory && collections.coursByCategory[category] 
      ? collections.coursByCategory[category] 
      : [];
    const currentIndex = coursList.findIndex(c => c.data.chapNum === chapNum);
    return currentIndex > 0 ? coursList[currentIndex - 1] : null;
  });

  // Filtre pour obtenir le chapitre suivant
  eleventyConfig.addFilter("getNextCours", function(collections, category, chapNum) {
    if (!category || !chapNum) return null;
    const coursList = collections.coursByCategory && collections.coursByCategory[category] 
      ? collections.coursByCategory[category] 
      : [];
    const currentIndex = coursList.findIndex(c => c.data.chapNum === chapNum);
    return currentIndex >= 0 && currentIndex < coursList.length - 1 
      ? coursList[currentIndex + 1] 
      : null;
  });
  
  // Configuration markdown avec support des attributs
  const markdownIt = require("markdown-it");
  const markdownItAttrs = require("markdown-it-attrs");
  
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAttrs);
  
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
