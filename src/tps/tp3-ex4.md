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
---

# Exercice 3 : Bonus - Requêtes plus complexes

## Questions bonus

Combinez jointures avancées, sous-requêtes corrélées et agrégations complexes. À faire uniquement si vous avez le temps !

**1. Trouver les "paires de clients" dans le même pays ayant commandé les mêmes produits**

Identifiez les clients similaires dans leurs achats.

**2. Calculer le "coefficient de fidélité" : (nombre de commandes) / (délai entre première et dernière commande en jours + 1)**

Affichez le client et son coefficient de fidélité (plus élevé = plus fidèle).

**3. Identifier les "hotspots" : combinaisons client-produit avec anomalies (quantités très élevées vs moyenne)**

Trouvez les achats inhabituels.

**4. Créer un "ranking 3-niveaux" : pour chaque employé, classe les clients par montant total**

Affichez NoEmp, Nom, CodeCli (client), et rang du client pour cet employé.

**5. Analyser les "cycles de réapprovisionnement" : délai moyen entre 2 commandes pour chaque client**

Calculez la fréquence d'achat de chaque client.

**6. Déterminer les employés "spécialisés" : qui gère toujours les mêmes clients (peu de clients différents)**

Affichez le nom de l'employé et le nombre de clients distincts qu'il a traités.

**7. Créer une "chaîne de distribution" : Fournisseur → Produit → Commande → Client**

Affichez le fournisseur, ses produits commandés, le nombre de commandes et le nombre de clients distincts.

**8. Identifier les produits "substituables" : commandés ensemble dans au moins 50% des commandes**

Trouvez les produits souvent achetés ensemble.

**9. Calculer l'impact de chaque catégorie sur le CA total par mois**

Affichez le mois, la catégorie, le CA mensuel catégorique et le % du CA total.

**10. Analyser la "qualité" de chaque client : livraison à temps, montants constants vs volatiles, etc.**

Comparez le client avec les délais de livraison, la variance des montants de commande, etc.
