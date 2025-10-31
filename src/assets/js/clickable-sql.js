/**
 * Rendre les blocs SQL cliquables et chargeables dans l'éditeur
 * Compatible avec les pages cours et TPs
 */

(function() {
  'use strict';

  // Attendre que l'éditeur CodeMirror soit prêt
  function waitForEditor(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkEditor = setInterval(function() {
      attempts++;
      if (window.editor) {
        clearInterval(checkEditor);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkEditor);
        console.warn('CodeMirror editor not found after', maxAttempts, 'attempts');
      }
    }, 100); // Vérifier toutes les 100ms
  }

  // Initialiser les blocs SQL cliquables
  function initClickableSQLBlocks() {
    // Sélectionner tous les blocs <pre> contenant du code SQL
    // Compatible avec markdown-it et Prism.js
    const sqlPres = document.querySelectorAll('pre:has(code.language-sql), pre:has(code[class*="language-sql"])');
    
    // Fallback pour les navigateurs ne supportant pas :has()
    const allPres = document.querySelectorAll('pre');
    const sqlBlocks = [];
    
    allPres.forEach(function(pre) {
      const code = pre.querySelector('code.language-sql, code[class*="language-sql"]');
      if (code) {
        sqlBlocks.push({ pre: pre, code: code });
      }
    });
    
    if (sqlBlocks.length === 0) {
      console.log('No SQL code blocks found');
      console.log('Total <pre> elements:', allPres.length);
      return;
    }

    console.log(`Found ${sqlBlocks.length} SQL code blocks`);

    sqlBlocks.forEach(function(block) {
      const pre = block.pre;
      const codeBlock = block.code;
      
      if (!pre) return;

      // Ajouter le style visuel
      pre.classList.add('sql-clickable');
      pre.style.cursor = 'pointer';
      pre.style.position = 'relative';
      pre.title = 'Cliquez pour charger cet exemple dans l\'éditeur SQL';

      // Ajouter une icône d'indication
      const clickIcon = document.createElement('span');
      clickIcon.className = 'sql-click-icon';
      clickIcon.innerHTML = '▶';
      clickIcon.title = 'Charger dans l\'éditeur';
      pre.appendChild(clickIcon);

      // Ajouter l'événement de clic
      pre.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Extraire le code SQL
        const sql = codeBlock.textContent.trim();
        
        if (window.editor) {
          // Charger dans l'éditeur
          window.editor.setValue(sql);
          window.editor.focus();
          
          // Feedback visuel
          pre.style.transition = 'background-color 0.3s ease';
          pre.style.backgroundColor = '#4fb8ff22';
          clickIcon.style.color = '#4fbeff';
          
          setTimeout(() => {
            pre.style.backgroundColor = '';
            clickIcon.style.color = '';
          }, 500);

          // Scroll vers la console si nécessaire
          const consolePanel = document.querySelector('.console-panel, .cours-console');
          if (consolePanel) {
            consolePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          console.error('CodeMirror editor not available');
          alert('L\'éditeur SQL n\'est pas encore chargé. Veuillez réessayer dans un instant.');
        }
      });

      // Effet hover
      pre.addEventListener('mouseenter', function() {
        pre.style.transition = 'box-shadow 0.2s ease';
        pre.style.boxShadow = '0 0 0 2px rgba(79, 190, 255, 0.3)';
        clickIcon.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', function() {
        pre.style.boxShadow = '';
        clickIcon.style.opacity = '0.5';
      });
    });

    console.log('✓ SQL blocks are now clickable');
  }

  // Initialiser quand le DOM et l'éditeur sont prêts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded, waiting for editor and Prism...');
      // Attendre un peu que Prism ait le temps de s'exécuter
      setTimeout(function() {
        waitForEditor(initClickableSQLBlocks);
      }, 500);
    });
  } else {
    console.log('DOM already loaded, waiting for editor and Prism...');
    setTimeout(function() {
      waitForEditor(initClickableSQLBlocks);
    }, 500);
  }

  // Exposer une fonction pour réinitialiser si nécessaire
  window.initClickableSQLBlocks = function() {
    waitForEditor(initClickableSQLBlocks);
  };

})();
