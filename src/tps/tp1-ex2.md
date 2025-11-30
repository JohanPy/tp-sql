---
layout: base.njk
title: "Exercice 2 : Calculs"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 2
titre: "Exercice 2 : Calculs"
permalink: "/tp1/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Calculs

## Questions

**1. Affichez pour chaque produit, le nombre d'unité en ajoutant les unités en stock et celles commandées**

Pour chaque produit, calculez le total d'unités disponibles (unités en stock + unités en commande).

**2. À partir de la table DetailCommande, calculez pour chaque produit de la commande numéro 10251 : le montant de la remise (exprimé en %) et le montant à payer**

Affichez le montant original, la remise en euros et le montant final.

## Rappel de cours

### Opérateurs arithmétiques

Vous pouvez effectuer des calculs directement dans le SELECT :

- Addition : `+`
- Soustraction : `-`
- Multiplication : `*`
- Division : `/`

```sql
-- Calculer un prix total
SELECT PrixUnit * Qte FROM DetailCommande;
```

### Alias de colonnes

Pour renommer une colonne ou le résultat d'un calcul, utilisez `AS`.

```sql
-- Renommer une colonne dans le résultat
SELECT PrixUnit * Qte AS MontantTotal FROM DetailCommande;
```


