/**
 * clickable-sql.js
 * 
 * Rend tous les blocs de code SQL cliquables pour charger le code dans l'éditeur
 * Fonctionne avec Prism.js pour la coloration syntaxique
 */

(function() {
	'use strict';
	
	console.log('🎯 clickable-sql.js loaded');
	
	// Attendre que le DOM soit chargé et que Prism ait fini
	setTimeout(function() {
		console.log('DOM loaded, waiting for editor and Prism...');
		
		// Attendre que l'éditeur soit disponible
		waitForEditor(function() {
			makeCodeBlocksClickable();
		});
	}, 500);
	
	/**
	 * Attendre que window.editor soit disponible
	 */
	function waitForEditor(callback) {
		var maxAttempts = 50; // 5 secondes max
		var attempts = 0;
		
		function check() {
			attempts++;
			if (window.editor) {
				console.log('✓ Editor found, initializing clickable blocks...');
				callback();
			} else if (attempts < maxAttempts) {
				setTimeout(check, 100);
			} else {
				console.warn('⚠ Editor not found after', maxAttempts * 100, 'ms');
			}
		}
		
		check();
	}
	
	/**
	 * Rendre tous les blocs SQL cliquables
	 */
	function makeCodeBlocksClickable() {
		// Trouver tous les <pre> contenant du code SQL
		var allPres = document.querySelectorAll('pre');
		var sqlBlocks = [];
		
		allPres.forEach(function(pre) {
			var code = pre.querySelector('code.language-sql, code[class*="language-sql"]');
			if (code) {
				sqlBlocks.push({ pre: pre, code: code });
			}
		});
		
		console.log('Found', sqlBlocks.length, 'SQL code blocks');
		
		if (sqlBlocks.length === 0) {
			return;
		}
		
		// Ajouter les styles et événements
		sqlBlocks.forEach(function(block) {
			var pre = block.pre;
			var code = block.code;
			
			// Ajouter la classe pour le style
			pre.classList.add('sql-clickable');
			
			// Créer l'icône de lecture
			var icon = document.createElement('div');
			icon.className = 'sql-click-icon';
			icon.innerHTML = '▶';
			icon.title = 'Cliquer pour charger dans l\'éditeur';
			pre.appendChild(icon);
			
			// Ajouter l'événement de clic
			pre.addEventListener('click', function() {
				var sqlCode = code.textContent || code.innerText;
				
				// Nettoyer le code (supprimer les lignes vides au début/fin)
				sqlCode = sqlCode.trim();
				
				// Charger dans l'éditeur
				if (window.editor) {
					window.editor.setValue(sqlCode);
					window.editor.focus();
					
					// Feedback visuel
					pre.style.transition = 'background-color 0.3s ease';
					var originalBg = window.getComputedStyle(pre).backgroundColor;
					pre.style.backgroundColor = 'rgba(79, 190, 255, 0.2)';
					
					setTimeout(function() {
						pre.style.backgroundColor = originalBg;
					}, 300);
					
					// Scroll vers l'éditeur si nécessaire
					var editorElement = document.querySelector('.CodeMirror');
					if (editorElement) {
						editorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
					}
					
					console.log('✓ SQL code loaded into editor');
				}
			});
			
			// Changer le curseur au survol
			pre.style.cursor = 'pointer';
		});
		
		console.log('✓ SQL blocks are now clickable');
	}
})();
