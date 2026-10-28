# Archives et Variantes des Travaux Pratiques

Ce dossier regroupe les sauvegardes et variantes de TP conservées hors du site actif :

## 1. Structure du dossier

- **`gymnase2000/`** : Fichiers d'origine du TP 5 historique (*Gymnase2000*). Conservé à des fins d'archive ou de rétro-compatibilité.
- **`anibase/`** : Fichiers du TP de synthèse sur l'animation japonaise (*AniBase*). Prêt à être déployé pour une rotation de promotion ou un examen machine (CC/DS).
- **`cinedata/`** : Fichiers complets du TP d'entraînement (*CineData*), **avec solutions intégrées (`<details><summary>💡 Solution</summary>`) et remarques didactiques**.

---

## 2. Activer / Masquer le TP 6 (CineData avec corrections)

Pour afficher CineData sur le site (par exemple une fois que les étudiants ont terminé le TP 5 sur NetflixStream) :

```bash
# Activation (copie dans src/tps/ et compilation)
./scripts/activer_cinedata.sh

# Masquage (suppression de src/tps/ et compilation)
./scripts/masquer_cinedata.sh
```

---

## 3. Réactiver AniBase ou Gymnase2000

Si vous souhaitez remplacer le TP de synthèse actuel par une autre variante :

```bash
# Pour réactiver AniBase comme TP 5 :
cp archived_tps/anibase/tp7-*.md src/tps/
# Puis ajuster le frontmatter tpNum: 5 et recompiler : npm run build
```
