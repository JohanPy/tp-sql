# 🧪 Guide de Test - Blocs SQL Cliquables

## ✅ Ce qui a été implémenté

### 1. **Coloration syntaxique Prism.js**
- Bibliothèque Prism.js ajoutée dans `cours.njk` et `base.njk`
- Thème : `prism-tomorrow` (dark theme compatible)
- Support SQL complet

### 2. **Script clickable-sql.js**
- Attente intelligente de l'éditeur CodeMirror (max 5 secondes, vérification toutes les 100ms)
- Sélection de tous les blocs `<pre><code class="language-sql">`
- Ajout automatique d'icône ▶ en haut à droite
- Feedback visuel au clic (flash bleu + scroll vers console)
- Effet hover avec bordure bleue

### 3. **CSS amélioré**
- Bordure subtile bleu sur les blocs SQL
- Icône play transparente (opacité 0.5 → 1 au hover)
- Animation de transformation au hover
- Style cohérent avec le reste du site

## 📋 Procédure de test

### Test 1 : Cours - Chapitre 1
1. **Démarrer le serveur** : `npm start`
2. **Ouvrir** : http://localhost:8080/cours/interrogation/chapitre-1/
3. **Attendre** que la base de données se charge (voir "Base de données ... chargée" dans le status)
4. **Observer** les blocs SQL :
   - ✓ Coloration syntaxique visible (mots-clés SELECT, FROM en couleur)
   - ✓ Icône ▶ en haut à droite de chaque bloc
   - ✓ Bordure bleue au survol
5. **Cliquer** sur le premier bloc SQL (`SELECT * FROM nom_table;`)
6. **Vérifier** :
   - ✓ Le code apparaît dans l'éditeur SQL (panneau droit)
   - ✓ Flash bleu sur le bloc cliqué
   - ✓ Scroll automatique vers la console si nécessaire

### Test 2 : TP - Exercice 1
1. **Ouvrir** : http://localhost:8080/tp1/exercice1/
2. **Vérifier** que les blocs SQL dans le contenu TP sont aussi cliquables
3. **Cliquer** sur un exemple
4. **Confirmer** le chargement dans l'éditeur

### Test 3 : Multiple clics
1. **Cliquer** sur plusieurs blocs SQL différents
2. **Vérifier** que chaque clic remplace le contenu de l'éditeur
3. **Observer** l'animation à chaque clic

## 🔍 Points de vérification

### Console navigateur
Ouvrir la console (F12) et vérifier les messages :
- `Found X SQL code blocks` (au chargement)
- `✓ SQL blocks are now clickable`
- Aucune erreur rouge

### Coloration Prism
Vérifier que les mots-clés SQL sont colorés :
- `SELECT`, `FROM`, `WHERE` → Rose/magenta
- Chaînes `'texte'` → Cyan
- Nombres → Violet
- Commentaires `--` → Gris italique

### Icône ▶
- Visible en transparence
- Devient opaque au hover
- Positionnée en haut à droite du bloc
- N'interfère pas avec le texte

## 🐛 Dépannage

### Blocs non cliquables
**Symptôme** : Pas d'icône ▶, pas de cursor pointer  
**Cause** : CodeMirror pas chargé à temps  
**Solution** : Attendre 1-2 secondes de plus, ou recharger la page

### Pas de coloration
**Symptôme** : Blocs SQL en gris uniforme  
**Cause** : Prism.js non chargé  
**Vérification** : Console → Network → Chercher `prism`  
**Solution** : Vérifier connexion internet ou CDN

### Clic sans effet
**Symptôme** : Clic mais pas de chargement  
**Cause** : `window.editor` non disponible  
**Solution** : Ouvrir console et taper `window.editor` pour vérifier

## 📊 Résultat attendu

```
✅ Tous les blocs SQL (cours et TPs) sont :
   1. Colorés avec Prism.js
   2. Cliquables (cursor pointer + icône ▶)
   3. Chargent leur contenu dans l'éditeur au clic
   4. Affichent un feedback visuel (flash bleu)
   5. Scrollent vers la console si nécessaire
```

## 🎯 Fichiers modifiés

- `src/_includes/cours.njk` → Ajout Prism.js + clickable-sql.js
- `src/_includes/base.njk` → Ajout Prism.js + clickable-sql.js
- `src/assets/js/clickable-sql.js` → **NOUVEAU** Script intelligent
- `src/assets/css/demo.css` → Styles .sql-clickable, .sql-click-icon

## 📝 Notes techniques

### Ordre de chargement
```
1. Prism.js (coloration)
2. CodeMirror (éditeur)
3. progression.js
4. clickable-sql.js (attend l'éditeur)
5. gui.js (initialise l'éditeur)
```

### Sélecteurs utilisés
```javascript
// Trouve tous les blocs SQL
'pre code.language-sql, pre code[class*="language-sql"]'

// Attend l'éditeur
window.editor
```

### Événements
- `DOMContentLoaded` → Déclenche l'initialisation
- `click` sur `<pre>` → Charge le SQL
- `mouseenter/mouseleave` → Effets hover
