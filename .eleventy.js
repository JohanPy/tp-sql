module.exports = function(eleventyConfig) {
  // Copier les assets statiques
  eleventyConfig.addPassthroughCopy("src/assets");
  
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
  
  // Filtre pour afficher les dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('fr-FR');
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
  
  return {
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
