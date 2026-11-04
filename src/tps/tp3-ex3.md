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

Cet exercice permet de manipuler les fonctions de formatage temporel et de calcul d'écarts en jours, aussi bien avec la syntaxe **MariaDB / Standard SQL** (`DATE_FORMAT`, `DATEDIFF`, `YEAR`, `MONTH`) qu'avec la syntaxe **SQLite** (`STRFTIME`, `JULIANDAY`).

## Questions

**1. Filtrer les commandes de décembre 2014**

À partir de la table `Commande`, sélectionnez uniquement les commandes passées en décembre 2014 et affichez :
- `NoCom` : Le numéro de commande
- `CodeCli` : Le code du client
- `DateCom` : La date de commande
- `AnneeMois` : L'année et le mois de la commande au format `'AAAA-MM'` (ex. `'2014-12'`)

<details>
<summary>💡 Indice</summary>

- **MariaDB** : utilisez `DATE_FORMAT(DateCom, '%Y-%m') AS AnneeMois` (ou filtrez avec `YEAR(DateCom) = 2014 AND MONTH(DateCom) = 12`).
- **SQLite** : utilisez `STRFTIME('%Y-%m', DateCom) AS AnneeMois`.
</details>

<!-- expected-query: Q1
SELECT NoCom, CodeCli, DateCom, STRFTIME('%Y-%m', DateCom) AS AnneeMois FROM Commande WHERE STRFTIME('%Y-%m', DateCom) = '2014-12';
-->

**2. Calculer le délai d'expédition en jours**

À partir de la table `Commande`, sélectionnez les commandes déjà expédiées (la date d'envoi `DateEnv` est renseignée, c'est-à-dire non nulle) et affichez :
- `NoCom` : Le numéro de commande
- `DelaiLivraisonJours` : Le nombre entier de jours entre la date de commande (`DateCom`) et la date d'envoi (`DateEnv`)

<details>
<summary>💡 Indice</summary>

- **MariaDB** : utilisez directement `DATEDIFF(DateEnv, DateCom)` qui renvoie le nombre de jours entre deux dates (`date1 - date2`).
- **SQLite** : convertissez chaque date en jours avec `JULIANDAY()` avant de soustraire, puis convertissez le résultat en entier : `CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT)`.
</details>

<!-- expected-query: Q2
SELECT NoCom, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiLivraisonJours FROM Commande WHERE DateEnv IS NOT NULL;
-->

## Rappel de cours

### Extraire ou formater une date

#### MariaDB / Standard SQL
- Fonctions d'extraction : `YEAR(date)`, `MONTH(date)`, `DAY(date)` (ou `EXTRACT(partie FROM date)`).
- Formatage personnalisé avec `DATE_FORMAT(date, format)` :
  - `%Y` : Année à 4 chiffres (ex. `2014`)
  - `%m` : Mois à 2 chiffres (`01` à `12`)
  - `%d` : Jour du mois (`01` à `31`)

```sql
-- Extraire l'année d'embauche (MariaDB)
SELECT Nom, YEAR(DateEmbauche) AS Annee FROM Employe;

-- Formater au format 'AAAA-MM' (MariaDB)
SELECT NoCom, DATE_FORMAT(DateCom, '%Y-%m') AS AnneeMois FROM Commande;
```

#### SQLite
- Fonction `STRFTIME(format, date)` : extrait une composante sous forme de texte.
  - Spécificateurs courants : `%Y` (année), `%m` (mois), `%d` (jour).

```sql
-- Extraire l'année d'embauche (SQLite)
SELECT Nom, STRFTIME('%Y', DateEmbauche) AS Annee FROM Employe;

-- Formater au format 'AAAA-MM' (SQLite)
SELECT NoCom, STRFTIME('%Y-%m', DateCom) AS AnneeMois FROM Commande;
```

### Calculer un écart en jours entre deux dates

#### MariaDB / Standard SQL
La fonction `DATEDIFF(date1, date2)` renvoie directement le nombre de jours séparant les deux dates (`date1 - date2`).

```sql
-- Écart en jours entre la commande et l'expédition (MariaDB)
SELECT NoCom, DATEDIFF(DateEnv, DateCom) AS DelaiLivraisonJours
FROM Commande
WHERE DateEnv IS NOT NULL;
```

#### SQLite
SQLite ne possède pas de type date dédié : les dates sont stockées sous forme de texte ISO (`'AAAA-MM-JJ'`).
La fonction `JULIANDAY(date)` convertit la date en nombre de jours juliens, permettant la soustraction :

```sql
-- Écart en jours entre la commande et l'expédition (SQLite)
SELECT NoCom, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiLivraisonJours
FROM Commande
WHERE DateEnv IS NOT NULL;
```

### Tableau récapitulatif des équivalences

| Opération | MariaDB / Standard SQL | SQLite |
| :--- | :--- | :--- |
| **Date courante** | `CURRENT_DATE` ou `CURDATE()` | `DATE('now')` |
| **Date & heure courantes** | `NOW()` ou `CURRENT_TIMESTAMP` | `DATETIME('now')` |
| **Extraire l'année** | `YEAR(d)` ou `EXTRACT(YEAR FROM d)` | `STRFTIME('%Y', d)` |
| **Extraire le mois** | `MONTH(d)` ou `EXTRACT(MONTH FROM d)` | `STRFTIME('%m', d)` |
| **Extraire le jour** | `DAY(d)` ou `DAYOFMONTH(d)` | `STRFTIME('%d', d)` |
| **Formatage 'AAAA-MM'** | `DATE_FORMAT(d, '%Y-%m')` | `STRFTIME('%Y-%m', d)` |
| **Écart en jours (d1 - d2)** | `DATEDIFF(d1, d2)` | `JULIANDAY(d1) - JULIANDAY(d2)` |
| **Ajouter un intervalle** | `d + INTERVAL 7 DAY` / `ADDDATE(d, 7)` | `DATE(d, '+7 days')` |
