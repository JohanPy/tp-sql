# 🎉 Mise en place terminée !

## ✅ Ce qui a été fait

### 1. **Structure Eleventy créée**
- Configuration `.eleventy.js` avec collections automatiques
- Layout Nunjucks `base.njk` avec 3 panneaux (Navigation | Contenu | Console)
- Page d'accueil dynamique listant tous les TPs

### 2. **Conversion des TPs**
- Script Python `convert_tps.py` créé
- 19 exercices convertis (TP2-TP5) avec front-matter
- Fichiers générés dans `src/tps/`

### 3. **Assets configurés**
- CSS adapté pour la nouvelle structure 3 panneaux
- JavaScript modifié pour charger dynamiquement les bases de données
- Toutes les bases SQLite copiées dans `src/assets/db/`
- sql.js intégré via npm

### 4. **Déploiement automatique**
- GitHub Actions workflow créé (`.github/workflows/deploy.yml`)
- Configuration pour GitHub Pages

## 🚀 Prochaines étapes

### 1. Tester le site localement

Le serveur de développement tourne déjà sur http://localhost:8081

Vérifiez :
- ✅ La navigation entre les TPs fonctionne
- ✅ Les consignes s'affichent correctement
- ✅ La console SQL est opérationnelle
- ⚠️  **Les bases de données se chargent** (à vérifier dans la console navigateur)

### 2. Corrections potentielles nécessaires

#### a) Vérifier le chargement de sql.js

Ouvrez la console du navigateur (F12) et vérifiez s'il y a des erreurs sur :
- Le chargement de `worker.sql-wasm.js`
- Le chargement des fichiers `.wasm`

**Si erreur** : Il faudra peut-être ajuster les chemins dans `gui.js` ou la configuration Eleventy.

#### b) Tester une requête SQL

1. Allez sur un exercice (ex: TP1 Exercice 2)
2. Écrivez une requête simple : `SELECT * FROM Client LIMIT 5;`
3. Cliquez sur "Exécuter"
4. Vérifiez que les résultats s'affichent

**Si erreur** : Vérifiez que la base de données se charge correctement.

### 3. Ajustements du style (si nécessaire)

Le CSS a été adapté pour le layout 3 panneaux, mais vous pouvez vouloir ajuster :
- Les largeurs des panneaux (dans `demo.css`, `.main-layout`)
- Les couleurs
- Le responsive design

### 4. Déployer sur GitHub Pages

Une fois les tests locaux réussis :

```bash
# Commitez vos changements
git add .
git commit -m "✨ Mise en place site Eleventy avec TPs SQL"
git push origin main
```

Puis dans GitHub :
1. Allez dans **Settings > Pages**
2. Source : **GitHub Actions**
3. Le workflow se lance automatiquement

## 🐛 Debugging si problèmes

### Problème : sql.js ne se charge pas

**Solution** : Vérifier que le chemin du worker est correct dans `gui.js` :
```javascript
const worker = new Worker("/assets/sql.js/worker.sql-wasm.js");
```

Si le fichier n'existe pas dans `_site/assets/sql.js/`, vérifiez `.eleventy.js` ligne 5.

### Problème : Les bases de données ne se chargent pas

**Solution** : Ouvrir la console navigateur (F12) et vérifier :
1. Le chemin de fetch : `/assets/db/Comptoir2000.sqlite`
2. Si le fichier existe dans `_site/assets/db/`
3. Les erreurs réseau (onglet Network)

### Problème : Les styles ne s'appliquent pas

**Solution** : Vérifier que `demo.css` est bien copié dans `_site/assets/css/`

### Problème : La navigation ne fonctionne pas

**Solution** : Vérifier dans `base.njk` que la boucle sur `collections.tpsByNumber` génère bien les liens.

## 📊 Structure finale

```
tp-sql/
├── src/
│   ├── _includes/base.njk          ← Layout principal
│   ├── tps/                         ← 19 exercices générés
│   ├── assets/
│   │   ├── css/demo.css            ← Styles 3 panneaux
│   │   ├── js/gui.js               ← Logique SQL + UI
│   │   └── db/*.sqlite             ← 10 bases de données
│   └── index.md                     ← Page d'accueil
├── _site/                           ← Site généré (19 pages HTML)
├── .eleventy.js                     ← Config Eleventy
├── convert_tps.py                   ← Script conversion
└── package.json                     ← Dépendances npm
```

## 💡 Améliorations futures possibles

1. **Système de progression** : Sauvegarder les exercices complétés (localStorage)
2. **Validation automatique** : Vérifier si la requête est correcte
3. **Hints progressifs** : Révéler des indices au fur et à mesure
4. **Mode sombre/clair** : Toggle de thème
5. **Export des résultats** : Exporter en CSV
6. **Partage de requêtes** : URL avec requête pré-remplie

---

🎓 **Bon entraînement SQL !**
