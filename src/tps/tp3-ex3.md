---
layout: base.njk
title: "Exercice 3 : Dates et Formats"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 3
titre: "Exercice 3 : Dates et Formats"
permalink: "/tp3/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Dates et Formats

## Questions

**1. Extraire l'année et le mois de chaque commande**

À partir de la table `Commande`, affichez pour chaque commande son numéro (`NoCom`) et sa date de commande formatée sous la forme 'AAAA-MM' (année et mois à deux chiffres) sous l'alias `AnneeMois`.

<!-- expected-query: Q1
SELECT NoCom, STRFTIME('%Y-%m', DateCom) AS AnneeMois FROM Commande;
-->

**2. Calculer le délai d'expédition en jours**

À partir de la table `Commande`, pour les commandes déjà expédiées (colonne `DateEnv` renseignée), affichez le numéro de commande (`NoCom`) ainsi que le délai d'acheminement exprimé en nombre entier de jours (écart entre la date d'envoi et la date de commande) sous l'alias `DelaiLivraisonJours`.

<details>
<summary>💡 Indice</summary>

Sous SQLite, la soustraction directe de deux dates textuelles ne donne pas le nombre de jours. Utilisez la fonction `JULIANDAY()` pour convertir les dates en jours avant d'en calculer l'écart.
</details>

<!-- expected-query: Q2
SELECT NoCom, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiLivraisonJours FROM Commande WHERE DateEnv IS NOT NULL;
-->

**3. Cibler les commandes d'une période spécifique**

À partir de la table `Commande`, affichez toutes les colonnes (`*`) pour les commandes passées au cours du mois de décembre 2014.

<!-- expected-query: Q3
SELECT * FROM Commande WHERE STRFTIME('%Y-%m', DateCom) = '2014-12';
-->

## Rappel de cours

### Manipulation de dates (SQLite)

SQLite stocke les dates sous forme de chaînes de caractères (TEXT), de nombres réels (REAL) ou d'entiers (INTEGER).

### Extraction de parties de date (STRFTIME)

La fonction `STRFTIME` permet de formater une date.
Formats courants : `%Y` (Année), `%m` (Mois), `%d` (Jour).

```sql
-- Extraire l'année d'une date
SELECT STRFTIME('%Y', DateCom) FROM Commande;
```

```sql
-- Extraire le mois
SELECT STRFTIME('%m', DateCom) FROM Commande;
```

### Calculs sur les dates (JULIANDAY)

Pour calculer une différence entre deux dates, on les convertit en "Jour Julien" (nombre de jours).

```sql
-- Nombre de jours entre deux dates
SELECT JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS DelaiLivraison
FROM Commande;
```

```sql
-- Ajouter des jours à une date
SELECT DATE('now', '+7 days');
```


