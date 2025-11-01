---
layout: base.njk
title: "Exercice 3 : Bonus - Requêtes avancées"
intitule: "TP 2 - Dates et agrégats"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 4
titre: "Exercice 3 : Bonus - Requêtes avancées"
permalink: "/tp2/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Bonus - Requêtes avancées

## Questions bonus

Combinez agrégats, CASE et dates pour résoudre des problèmes complexes. À faire uniquement si vous avez le temps !

**1. Calculer le montant moyen des commandes par trimestre (CASE + dates)**

Affichez le trimestre, le nombre de commandes et le montant moyen par trimestre.

<details>
<summary>💡 Indice</summary>

Utilisez `STRFTIME('%Y-%m', DateCom)` pour extraire le mois, puis `CASE` pour convertir en trimestre (01-03 = Q1, etc.).
</details>

**2. Identifier les produits "saisonniers" : vendus intensivement certains mois seulement**

Un produit est saisonnier s'il a une vente 3x supérieure certains mois vs autres mois.

<details>
<summary>💡 Indice</summary>

Calculez la quantité vendue par produit/mois, puis comparez le max et min par produit.
</details>

**3. Afficher les commandes "à risque" : délai de livraison > 30 jours OU remise > 15%**

<details>
<summary>💡 Indice</summary>

Utilisez `CASE` pour calculer le délai avec `JULIANDAY`, puis une condition combinant délai ET remise.
</details>

**4. Créer un "classement" mensuel des employés par CA généré**

Affichez le mois et les employés en fonction de leurs chiffre d'affaires.

<details>
<summary>💡 Indice</summary>

Utilisez `ORDER BY` et `GROUP BY` pour établir le classement par mois.
</details>

**5. Calculer le "cycle de vie" du client : temps écoulé depuis première commande**

Affichez le client, sa première commande et le nombre de jours depuis.

<details>
<summary>💡 Indice</summary>

Utilisez `MIN(DateCom)` pour trouver la première commande, puis calculez les jours avec `JULIANDAY`.
</details>

**6. Identifier les produits "à relancer" : peu vendus mais en stock**

Produits avec stock > moyenne ET quantité vendue < 10 unités.

<details>
<summary>💡 Indice</summary>

Comparez `AVG(UnitesStock)` avec les quantités vendues (SUM des ventes).
</details>

**7. Calculer la marge potentielle par catégorie (prix de vente vs prix de revient)**

Affichez la catégorie et le pourcentage de marge moyenne.

<details>
<summary>💡 Indice</summary>

Vous aurez besoin de la table `Fournisseur` ou d'une estimation de prix de revient. Sinon, supposez un coût = 60% du PrixUnit.
</details>

**8. Afficher les anomalies : commandes sans livraison (DateLivraison NULL) après 60 jours**

<details>
<summary>💡 Indice</summary>

Utilisez `DateLivraison IS NULL` et calculez les jours avec `JULIANDAY(DATE('now') - JULIANDAY(DateCom))`.
</details>

**9. Créer une segmentation client : "VIP" (> 5000€), "Régulier" (1000-5000€), "Occasionnel" (< 1000€)**

Affichez la segmentation avec le nombre de clients par catégorie.

<details>
<summary>💡 Indice</summary>

Utilisez `CASE` pour classifier, puis `COUNT()` et `GROUP BY` pour compter par segment.
</details>

**10. Analyser la tendance : comparer le CA des 3 premiers mois vs les 3 derniers mois**

Affichez la croissance ou décroissance en %.

<details>
<summary>💡 Indice</summary>

Calculez le CA des 3 premiers mois et des 3 derniers mois, puis faites (CA_recent - CA_ancien) / CA_ancien * 100.
</details>


