---
layout: base.njk
title: "Exercice 3 : Dates et Formats"
intitule: "TP 2 - Agrégats et Choix multiple"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 3
titre: "Exercice 3 : Dates et Formats"
permalink: "/tp2/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Dates et Formats

## Questions

**1. Afficher l'année et le mois pour toutes les commandes**

Pour chaque commande, montrez la date sous le format "2024-03" (année-mois).

**2. Calculer le délai de livraison en jours**

Affichez le numéro de commande et le nombre de jours entre DateCom et DateLivraison.

<details>
<summary>💡 Indice</summary>

La fonction `JULIANDAY()` convertit une date en nombre de jours depuis une date de référence.
</details>

**3. Lister les commandes passées au cours du mois de décembre 2014**

Affichez toutes les commandes dont la date est en décembre 2014.

## Rappel de cours

### Manipulation de dates (SQLite)

SQLite stocke les dates sous forme de chaînes de caractères (TEXT), de nombres réels (REAL) ou d'entiers (INTEGER).

### Extraction de parties de date (STRFTIME)

La fonction `STRFTIME` permet de formater une date.
Formats courants : `%Y` (Année), `%m` (Mois), `%d` (Jour).

```sql
-- Extraire l'année d'une date
SELECT STRFTIME('%Y', DateCom) FROM Commande;

-- Extraire le mois
SELECT STRFTIME('%m', DateCom) FROM Commande;
```

### Calculs sur les dates (JULIANDAY)

Pour calculer une différence entre deux dates, on les convertit en "Jour Julien" (nombre de jours).

```sql
-- Nombre de jours entre deux dates
SELECT JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS DelaiLivraison
FROM Commande;

-- Ajouter des jours à une date
SELECT DATE('now', '+7 days');
```


