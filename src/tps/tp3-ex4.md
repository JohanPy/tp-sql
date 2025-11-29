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

# Exercice 3 : Bonus - Requêtes plus complexes

## Questions bonus

Combinez jointures avancées, sous-requêtes corrélées et agrégations complexes. À faire si vous avez le temps après avoir terminé les exercices précédents.

**1. Déterminer les employés "spécialisés" : qui gère toujours les mêmes clients (peu de clients différents)**

Affichez le nom de l'employé et le nombre de clients distincts qu'il a traités.
<details>
<summary>💡 Indice</summary>
Groupez par NoEmp et comptez DISTINCT CodeCli via COUNT(DISTINCT CodeCli) ; triez ensuite sur ce compteur pour repérer ceux qui ont peu de clients.
</details>

**2. Calculer le "coefficient de fidélité" : (nombre de commandes) / (délai entre première et dernière commande en jours + 1)**

Affichez le client et son coefficient de fidélité (plus élevé = plus fidèle).
<details>
<summary>💡 Indice</summary>
Calculez pour chaque client la date min/max des commandes et le nombre total ; utilisez julianday() pour obtenir les jours entre deux dates avant de former le ratio.
</details>

**3. Calculer l'impact de chaque catégorie sur le CA total par mois**

Affichez le mois, la catégorie, le CA mensuel catégorique et le % du CA total.
<details>
<summary>💡 Indice</summary>
Regroupez par strftime('%Y-%m', DateCom) et CodeCateg ; calculez SUM(PrixUnit * Qte * (1-Remise)) pour le CA, puis calculez le pourcentage par rapport au CA total du mois (sous-requête ou fenêtre utile).
</details>

**4. Analyser les "cycles de réapprovisionnement" : délai moyen entre 2 commandes pour chaque client**

Calculez la fréquence d'achat de chaque client.
<details>
<summary>💡 Indice</summary>
Ordonnez les dates de commande par client et calculez la différence entre commandes consécutives (julianday). Moyennez ces différences par client. En SQL sans fenêtres, pensez aux sous-requêtes corrélées ou aux fonctions de fenêtre si disponibles.
</details>

**5. Créer une "chaîne de distribution" : Fournisseur → Produit → Commande → Client**

Affichez le fournisseur, ses produits commandés, le nombre de commandes et le nombre de clients distincts.
<details>
<summary>💡 Indice</summary>
Départ : table Produit pour lier Fournisseur→Produit. Agrégez ensuite les DetailCommande par Refprod pour compter commandes et clients distincts ; regroupez au niveau du fournisseur.
</details>

**6. Créer un "ranking 3-niveaux" : pour chaque employé, classe les clients par montant total**

Affichez NoEmp, Nom, CodeCli (client), et rang du client pour cet employé.
<details>
<summary>💡 Indice</summary>
Calculez le montant total par (NoEmp, CodeCli) via SUM sur DetailCommande joint à Commande (si nécessaire), puis utilisez des comparaisons de seuils ou la fonction ROW_NUMBER() si votre SQL le permet; autrement, simulez le rang par agrégats et conditions.
</details>

**7. Trouver les "paires de clients" dans le même pays ayant commandé les mêmes produits**

Identifiez les clients des même pays qui ont acheté la même chose.
<details>
<summary>💡 Indice</summary>
Comptez les produits par client (par produit), regroupez par client et comparez les ensembles — une auto-jointure (client vs client) ou une comparaison d'agrégats/groupes permet d'identifier les paires du même pays.
</details>

**8. Identifier les "hotspots" : combinaisons client-produit avec anomalies (quantités très élevées vs moyenne)**

Trouvez les achats inhabituels.
<details>
<summary>💡 Indice</summary>
Pour chaque paire client-produit, comparez la quantité à la moyenne de ce produit (agrégat sur DetailCommande). Repérez les lignes où Qte est beaucoup plus élevée qu'une moyenne ± multiple d'écart-type ou d'un facteur fixé.
</details>

**9. Identifier les produits "substituables" : commandés ensemble dans au moins 50% des commandes**

Trouvez les produits souvent achetés ensemble.
<details>
<summary>💡 Indice</summary>
Pour chaque paire de produits, comptez le nombre de commandes où les deux apparaissent et divisez par le nombre total de commandes contenant l'un d'eux (ou par total général selon la définition) ; une auto-jointure sur DetailCommande par NoCom et Refprod permet d'obtenir les paires.
</details>

## Rappel de cours

### Stratégie pour requêtes complexes

1. **Décomposer le problème** : Ne cherchez pas à tout écrire d'un coup.
2. **Commencer par le "FROM"** : Quelles tables contiennent les données ? Comment sont-elles liées ?
3. **Filtrer (WHERE)** : Quelles lignes garder ?
4. **Grouper (GROUP BY)** : Quel est le niveau de détail (par client, par mois...) ?
5. **Filtrer les groupes (HAVING)** : Conditions sur les agrégats ?
6. **Trier (ORDER BY)** : Ordre final ?

### Exemple de structure complexe

```sql
SELECT C.Societe, COUNT(O.NoCom) AS NbCommandes
FROM Client C
LEFT JOIN Commande O ON C.CodeCli = O.CodeCli
WHERE C.Pays = 'France'
GROUP BY C.Societe
HAVING COUNT(O.NoCom) > 10
ORDER BY NbCommandes DESC;
```

