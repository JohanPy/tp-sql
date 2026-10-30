---
layout: base.njk
title: "Exercice 2 : Choix multiple (CASE)"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 2
titre: "Exercice 2 : Choix multiple (CASE)"
permalink: "/tp3/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Choix multiple (CASE)

Cet exercice permet de pratiquer l'expression conditionnelle `CASE WHEN ... THEN ... ELSE ... END` sur des colonnes simples puis sur des résultats d'agrégation.

## Questions

**1. Classer les produits par gamme de prix et par disponibilité**

À partir de la table `Produit`, affichez :
- `Refprod` : La référence du produit
- `Nomprod` : Le nom du produit
- `PrixUnit` : Le prix unitaire
- `Gamme` : Une catégorie de prix qui vaut :
  - `'Économique'` si le prix unitaire est strictement inférieur à 50 €
  - `'Standard'` si le prix unitaire est compris entre 50 et 200 € inclus
  - `'Premium'` si le prix unitaire est strictement supérieur à 200 €
- `Statut` : La disponibilité qui vaut `'Indispo'` si le produit n'est plus vendu (colonne `Indisponible` égale à 1), et `'Disponible'` sinon.

<details>
<summary>💡 Indice</summary>

Utilisez une expression `CASE WHEN ... THEN ... ELSE ... END` pour chaque colonne calculée.
</details>

<!-- expected-query: Q1
SELECT Refprod, Nomprod, PrixUnit, CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit BETWEEN 50 AND 200 THEN 'Standard' ELSE 'Premium' END AS Gamme, CASE WHEN Indisponible = 1 THEN 'Indispo' ELSE 'Disponible' END AS Statut FROM Produit;
-->

**2. Classer les commandes selon leur montant total**

À partir de la table `DetailCommande`, regroupez les lignes par numéro de commande (`Nocom`) et affichez :
- `Nocom` : Le numéro de commande
- `MontantTotal` : Le montant total net de la commande (avec remise déduite), arrondi à 2 décimales
- `CategorieCommande` : La taille de la commande selon ce montant total (avant arrondi) :
  - `'Petit'` si le total est strictement inférieur à 100 €
  - `'Moyen'` si le total est compris entre 100 et 500 € inclus
  - `'Gros'` si le total est strictement supérieur à 500 €

<details>
<summary>💡 Indice</summary>

Vous pouvez utiliser une fonction d'agrégation comme `SUM(...)` directement dans les conditions `WHEN` d'un bloc `CASE`.
</details>

<!-- expected-query: Q2
SELECT Nocom, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS MontantTotal, CASE WHEN SUM(PrixUnit * Qte * (1 - Remise)) < 100 THEN 'Petit' WHEN SUM(PrixUnit * Qte * (1 - Remise)) BETWEEN 100 AND 500 THEN 'Moyen' ELSE 'Gros' END AS CategorieCommande FROM DetailCommande GROUP BY Nocom;
-->

## Rappel de cours

### Expression conditionnelle `CASE`

L'expression `CASE` permet d'afficher une valeur différente selon une ou plusieurs conditions (comme un `IF / ELSE IF / ELSE`) :

```sql
SELECT NoCom, Port,
    CASE
        WHEN Port < 20 THEN 'Faible'
        WHEN Port BETWEEN 20 AND 100 THEN 'Modéré'
        ELSE 'Élevé'
    END AS NiveauFraisPort
FROM Commande;
```
