---
layout: base.njk
category: interrogation
title: "Exercice 2 : Choix multiple (CASE) et Dates"
intitule: "TP 2 - Dates et agrégats"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 3
titre: "Exercice 2 : Choix multiple (CASE) et Dates"
permalink: "/tp2/exercice3/"
tags: tp
---

# Exercice 2 : Choix multiple (CASE) et Dates

## Questions - Partie 1 : Choix multiple

**1. Classer les produits par gamme de prix (CASE)**

Affichez tous les produits avec une colonne "Gamme" affichant "Économique" (< 50), "Standard" (50-200), ou "Premium" (> 200).

<details>
<summary>💡 Indice</summary>

Utilisez `CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit <= 200 THEN 'Standard' ELSE 'Premium' END`.
</details>

**2. Ajouter une colonne "Statut" pour les produits (disponible/indisponible)**

Affichez tous les produits avec leur nom et un statut "Disponible" ou "Indisponible" selon le champ Indisponible.

<details>
<summary>💡 Indice</summary>

Utilisez `CASE WHEN Indisponible = 0 THEN 'Disponible' ELSE 'Indisponible' END`.
</details>

**3. Évaluer la performance de chaque employé par rapport à la moyenne**

Affichez le nom et une évaluation "Excellent", "Bon", ou "À améliorer" basée sur le nombre de commandes traitées vs la moyenne.

<details>
<summary>💡 Indice</summary>

D'abord, calculez la moyenne des commandes par employé (sous-requête), puis utilisez `CASE` pour comparer.
</details>

## Questions - Partie 2 : Dates

**4. Afficher l'année et le mois pour toutes les commandes**

Pour chaque commande, montrez la date sous le format "2024-03" (année-mois).

<details>
<summary>💡 Indice</summary>

Utilisez `STRFTIME('%Y-%m', DateCom)` pour extraire année et mois de la date.
</details>

**5. Calculer le délai de livraison en jours**

Affichez le numéro de commande et le nombre de jours entre DateCom et DateLivraison.

<details>
<summary>💡 Indice</summary>

Utilisez `JULIANDAY(xxx)` pour un nombre de jours.
</details>
