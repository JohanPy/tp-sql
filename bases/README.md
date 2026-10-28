# Bases de données et schémas

Ce dossier contient les bases de données SQLite et leurs schémas pour les TPs.

## Structure

- `*.sqlite` - Fichiers de base de données SQLite
- `*.png` - Diagrammes de schéma correspondants

## Comment ajouter une base de données

1. Placez votre fichier `.sqlite` dans ce dossier
2. Créez ou exportez un diagramme de la base de données au format PNG
3. Nommez le PNG exactement comme la base de données (sans l'extension)
4. Placez le PNG dans ce dossier
5. Relancez le build avec `npm run build`

### Exemple

Pour la base `Comptoir2000.sqlite` :
- Fichier de base : `Comptoir2000.sqlite`
- Schéma PNG : `Comptoir2000.png`

Le schéma s'affichera automatiquement dans l'onglet "📊 Schéma" lors du chargement de la base.

## Bases disponibles

| Base de données | Schéma PNG | Description |
|----------------|------------|-------------|
| Comptoir2000.sqlite | ✅ | Base Comptoir avec commandes, clients, produits |
| Chinook.sqlite | ✅ | Base musicale (artistes, albums, pistes) |
| ClassicModel.sqlite | ✅ | Base de vente de modèles réduits |
| Gymnase2000.sqlite | ✅ | Base de gestion de gymnase |
| Northwind.sqlite | ✅ | Base Northwind (version alternative) |
| bibliotheque.sqlite | ✅ | Base de gestion de bibliothèque |
| sakila.sqlite | ✅ | Base de location de films |
| world.sqlite | ✅ | Base mondiale (pays, villes, langues) |
| ca.sqlite | ✅ | Base CA (chiffre d'affaires) |
| NetflixStream.sqlite | ✅ | Base streaming vidéo (rapports Netflix 2023-2026, abonnés, visionnages) |
| AniBase.sqlite | ✅ | Base anime & pop-culture (AniList 2020-2026, studios, watchlist) |
| CineData.sqlite | ✅ | Base cinéma & box-office (TMDB 2022-2026, castings, avis) |

## Notes

- Voir [PROPOSITIONS_NOUVELLES_BASES.md](PROPOSITIONS_NOUVELLES_BASES.md) pour la spécification des futures bases candidates (Netflix, AniList, TMDB) destinées à remplacer Gymnase2000.
- Voir [CONCEPTION_TP6_TP7_TP8.md](CONCEPTION_TP6_TP7_TP8.md) pour la conception pédagogique complète des nouveaux TP 6, TP 7 et TP 8 (44 questions par TP en équivalence stricte avec TP 5).
- Les fichiers de ce dossier sont automatiquement copiés vers `_site/assets/bases/` lors du build
- Les PNG doivent être au format paysage pour un meilleur affichage
- Taille recommandée : max 2000px de largeur
