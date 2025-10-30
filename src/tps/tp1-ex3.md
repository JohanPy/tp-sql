---
layout: base.njk
title: "Exercice 2 : Calculs"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 3
titre: "Exercice 2 : Calculs"
permalink: "/tp1/exercice3/"
tags: tp
---

# Exercice 2 : Calculs

## Questions

**1. Affichez pour chaque produit, le nombre d'unité en ajoutant les unités en stock et celles commandées**

Pour chaque produit, calculez le total d'unités disponibles (unités en stock + unités en commande).

<details>
<summary>💡 Indice</summary>

Utilisez l'opérateur `+` pour additionner deux colonnes :
```sql
SELECT Nomprod, UnitesStock + UnitesCom AS TotalUnites FROM Produit
```
</details>

**2. À partir de la table DetailCommande, calculez pour chaque produit de la commande numéro 10251 : le montant de la remise (exprimé en %) et le montant à payer**

Affichez le montant original, la remise en euros et le montant final.

<details>
<summary>💡 Indice</summary>

La remise en euros est `(Qte * PrixUnit) * (Remise / 100)`.
</details>


