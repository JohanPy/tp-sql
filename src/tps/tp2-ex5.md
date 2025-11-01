---
layout: base.njk
title: "Exercice 5 : Bonus - Requêtes avancées"
intitule: "TP 2 - Agrégats et Choix multiple"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 5
titre: "Exercice 5 : Bonus - Requêtes avancées"
permalink: "/tp2/exercice5/"
tags: tp
---

# Exercice 5 : Bonus - Requêtes avancées

## Questions bonus

Combinez agrégats, CASE et dates pour résoudre des problèmes complexes. À faire uniquement si vous avez le temps !

**1. Calculer le montant moyen des commandes par trimestre**

Affichez le trimestre, le nombre de commandes et le montant moyen par trimestre.

<details>
<summary>💡 Indice</summary>

Vous devez d'abord extraire le mois, puis convertir en trimestre (01-03 = Q1, 04-06 = Q2, etc.).
</details>

**2. Identifier les produits "saisonniers" : vendus intensivement certains mois seulement**

Un produit est saisonnier s'il a une vente 3x supérieure certains mois vs autres mois.

**3. Afficher les commandes "à risque" : délai de livraison > 30 jours OU remise > 15%**

Listez les commandes avec un problème potentiel.

**4. Créer un "classement" mensuel des employés par CA généré**

Affichez le mois et les employés en fonction de leurs chiffre d'affaires.

**5. Calculer le "cycle de vie" du client : temps écoulé depuis première commande**

Affichez le client, sa première commande et le nombre de jours depuis.

**6. Identifier les produits "à relancer" : peu vendus mais en stock**

Produits avec stock > moyenne ET quantité vendue < 10 unités.

**7. Calculer la marge potentielle par catégorie**

Affichez la catégorie et le pourcentage de marge moyenne (supposez un coût = 60% du PrixUnit).

**8. Afficher les anomalies : commandes sans livraison (DateLivraison NULL) après 60 jours**

Identifiez les commandes potentiellement problématiques.

**9. Créer une segmentation client : "VIP" (> 5000€), "Régulier" (1000-5000€), "Occasionnel" (< 1000€)**

Affichez la segmentation avec le nombre de clients par catégorie.

**10. Analyser la tendance : comparer le CA des 3 premiers mois vs les 3 derniers mois**

Affichez la croissance ou décroissance en %.

