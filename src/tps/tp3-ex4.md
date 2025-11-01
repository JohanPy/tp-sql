---
layout: base.njk
title: "Exercice 3 : Bonus - Requêtes très complexes"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 4
titre: "Exercice 3 : Bonus - Requêtes très complexes"
permalink: "/tp3/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Bonus - Requêtes très complexes

## Questions bonus

Combinez jointures avancées, sous-requêtes corrélées et agrégations complexes. À faire uniquement si vous avez le temps !

**1. Trouver les "paires de clients" dans le même pays ayant commandé les mêmes produits**

<details>
<summary>💡 Indice</summary>

Utilisez 2 jointures sur Client (auto-jointure) et comparez les produits commandés avec `INTERSECT` ou une sous-requête.
</details>

**2. Calculer le "coefficient de fidélité" : (nombre de commandes) / (délai entre première et dernière commande en jours + 1)**

Affichez le client et son coefficient de fidélité (plus élevé = plus fidèle).

<details>
<summary>💡 Indice</summary>

Calculez `COUNT(DISTINCT NoCom)` et `JULIANDAY(MAX(DateCom)) - JULIANDAY(MIN(DateCom))`, puis divisez.
</details>

**3. Identifier les "hotspots" : combinaisons client-produit avec anomalies (quantités très élevées vs moyenne)**

<details>
<summary>💡 Indice</summary>

Calculez la moyenne de quantité par produit, puis identifiez les lignes > 2 × moyenne.
</details>

**4. Créer un "ranking 3-niveaux" : pour chaque employé, classe les clients par montant total**

Affichez NoEmp, Nom, CodeCli (client), et rang du client pour cet employé.

<details>
<summary>💡 Indice</summary>

Utilisez `ROW_NUMBER()` avec `PARTITION BY NoEmp ORDER BY SUM(montant) DESC`.
</details>

**5. Analyser les "cycles de réapprovisionnement" : délai moyen entre 2 commandes pour chaque client**

<details>
<summary>💡 Indice</summary>

Calculez les délais entre commandes successives avec une auto-jointure, puis le délai moyen par client.
</details>

**6. Déterminer les employés "spécialisés" : qui gère toujours les mêmes clients (peu de clients différents)**

Affichez le nom de l'employé et le nombre de clients distincts qu'il a traités.

<details>
<summary>💡 Indice</summary>

Comptez `DISTINCT CodeCli` par NoEmp et filtrez les employés avec peu de clients.
</details>

**7. Créer une "chaîne de distribution" : Fournisseur → Produit → Commande → Client**

Affichez le fournisseur, ses produits commandés, le nombre de commandes et le nombre de clients distincts.

<details>
<summary>💡 Indice</summary>

Joignez les 5 tables (Fournisseur, Produit, DetailCommande, Commande, Client) et agrégez.
</details>

**8. Identifier les produits "substituables" : commandés ensemble dans au moins 50% des commandes**

<details>
<summary>💡 Indice</summary>

Calculez la fréquence de co-occurrence : paires de produits dans la même commande / nombre total de commandes.
</details>

**9. Calculer l'impact de chaque catégorie sur le CA total par mois**

Affichez le mois, la catégorie, le CA mensuel catégorique et le % du CA total.

<details>
<summary>💡 Indice</summary>

Joignez jusqu'à Categorie, agrégez par mois/catégorie, puis calculez le pourcentage.
</details>

**10. Analyser la "qualité" de chaque client : livraison à temps, montants constants vs volatiles, etc.**

Comparez le client avec les délais de livraison, la variance des montants de commande, etc.

<details>
<summary>💡 Indice</summary>

Calculez des statistiques par client : délai moyen, écart-type des montants (variance), pourcentage de livraisons à temps.
</details>
