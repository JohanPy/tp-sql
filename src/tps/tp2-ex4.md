---
layout: base.njk
title: "Exercice 4 : Dates et Formats"
intitule: "TP 2 - Agrégats et Choix multiple"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 4
titre: "Exercice 4 : Dates et Formats"
permalink: "/tp2/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Dates et Formats

## Questions

**1. Afficher l'année et le mois pour toutes les commandes**

Pour chaque commande, montrez la date sous le format "2024-03" (année-mois).

**2. Calculer le délai de livraison en jours**

Affichez le numéro de commande et le nombre de jours entre DateCom et DateLivraison.

<details>
<summary>💡 Indice</summary>

La fonction `JULIANDAY()` convertit une date en nombre de jours depuis une date de référence.
</details>

**3. Lister les commandes passées au cours du mois de décembre 1999**

Affichez toutes les commandes dont la date est en décembre 1999.


