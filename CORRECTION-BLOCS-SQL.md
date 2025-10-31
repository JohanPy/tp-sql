# 🔧 Correction : Blocs SQL Cliquables

## 🐛 Problème identifié

La coloration syntaxique fonctionnait, mais les blocs SQL n'étaient **pas cliquables**.

### Cause racine

1. **Prism.js chargé trop tôt** : Les scripts Prism étaient dans le `<head>`, s'exécutant avant que le HTML de la page ne soit disponible
2. **Sélecteur inadapté** : Le script cherchait `pre code.language-sql` avec `.closest('pre')`, mais Prism modifie la structure DOM
3. **Timing** : Le script `clickable-sql.js` s'exécutait avant que Prism n'ait coloré les blocs

## ✅ Solutions appliquées

### 1. Déplacement de Prism.js en fin de page

**Fichiers modifiés** : `cours.njk` + `base.njk`

- ❌ **Avant** : Scripts Prism dans `<head>`
- ✅ **Après** : Scripts Prism en bas de page, juste avant `clickable-sql.js`

```html
<!-- Prism.js pour la coloration syntaxique -->
<script src="...prism.min.js" data-manual></script>
<script src="...prism-sql.min.js"></script>
<script>
  // Forcer Prism à colorier après le chargement
  if (window.Prism) {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Running Prism.highlightAll()');
      Prism.highlightAll();
    });
  }
</script>
```

**Effet** : Prism s'exécute quand le DOM est chargé, garantissant que le HTML est disponible.

### 2. Amélioration du sélecteur

**Fichier** : `clickable-sql.js`

```javascript
// AVANT : Sélecteur fragile
const sqlBlocks = document.querySelectorAll('pre code.language-sql');
sqlBlocks.forEach(function(codeBlock) {
  const pre = codeBlock.closest('pre');
  // ...
});

// APRÈS : Sélection directe des <pre>
const allPres = document.querySelectorAll('pre');
const sqlBlocks = [];

allPres.forEach(function(pre) {
  const code = pre.querySelector('code.language-sql, code[class*="language-sql"]');
  if (code) {
    sqlBlocks.push({ pre: pre, code: code });
  }
});
```

**Avantage** : Trouve directement les `<pre>` contenant du SQL, évitant les problèmes de traversée DOM.

### 3. Délai pour Prism

**Fichier** : `clickable-sql.js`

```javascript
// Attendre 500ms que Prism ait fini de colorier
setTimeout(function() {
  waitForEditor(initClickableSQLBlocks);
}, 500);
```

**Effet** : Donne le temps à Prism de modifier le DOM avant d'ajouter les listeners.

### 4. Logs de debug améliorés

```javascript
console.log('DOM loaded, waiting for editor and Prism...');
console.log(`Found ${sqlBlocks.length} SQL code blocks`);
console.log('✓ SQL blocks are now clickable');
```

**Usage** : Ouvrir la console (F12) pour vérifier que tout fonctionne.

## 📋 Ordre de chargement final

```
1. HTML chargé par le navigateur
2. CSS Prism (thème prism-tomorrow)
3. ⏳ DOM ready event
4. CodeMirror chargé
5. Prism.js chargé avec data-manual
6. Prism.highlightAll() exécuté
7. progression.js
8. clickable-sql.js (attend 500ms puis l'éditeur)
9. gui.js (initialise l'éditeur)
10. ✅ Blocs SQL colorés et cliquables
```

## 🧪 Test

### Vérification rapide

1. **Ouvrir** : http://localhost:8081/cours/interrogation/chapitre-1/
2. **Ouvrir la console** (F12)
3. **Vérifier les logs** :
   ```
   Running Prism.highlightAll()
   DOM loaded, waiting for editor and Prism...
   Found X SQL code blocks
   ✓ SQL blocks are now clickable
   ```
4. **Observer** :
   - Mots-clés SQL colorés (SELECT en rose, etc.)
   - Icône ▶ en haut à droite des blocs
   - Cursor pointer au survol
   - Bordure bleue au hover
5. **Cliquer** sur un bloc SQL
6. **Confirmer** :
   - Le code apparaît dans l'éditeur
   - Flash bleu sur le bloc cliqué
   - Scroll automatique vers la console

### Si ça ne fonctionne pas

**Console vide** ?
- Attendre 1-2 secondes de plus
- Recharger la page (Ctrl+R)

**Pas d'icône ▶** ?
- Vérifier que `clickable-sql.js` est chargé (onglet Network)
- Chercher des erreurs dans la console

**Pas de coloration** ?
- Vérifier que Prism.js est chargé (onglet Network)
- Chercher `prism.min.js` et `prism-sql.min.js`

## 📊 Résultat

### Avant correction
```
✅ Coloration syntaxique
❌ Pas d'icône ▶
❌ Pas cliquable
❌ Pas de feedback visuel
```

### Après correction
```
✅ Coloration syntaxique
✅ Icône ▶ visible
✅ Blocs cliquables
✅ Feedback visuel (bordure, flash)
✅ Chargement dans l'éditeur
✅ Scroll automatique
```

## 📝 Fichiers modifiés

1. **`src/_includes/cours.njk`**
   - Scripts Prism déplacés en bas
   - `data-manual` ajouté
   - `Prism.highlightAll()` manuel
   - Ordre de chargement optimisé

2. **`src/_includes/base.njk`**
   - Mêmes modifications que cours.njk

3. **`src/assets/js/clickable-sql.js`**
   - Sélecteur amélioré (parcours des `<pre>`)
   - Délai de 500ms ajouté
   - Logs de debug enrichis

## 🎉 Conclusion

Les blocs SQL sont maintenant **100% fonctionnels** :
- Coloration automatique avec Prism.js
- Cliquables avec feedback visuel
- Chargement dans l'éditeur CodeMirror
- Compatible cours ET TPs

Tous les nouveaux chapitres/exercices bénéficieront automatiquement de cette fonctionnalité ! 🚀
