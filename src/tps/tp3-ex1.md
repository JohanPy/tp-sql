---
layout: base.njk
title: "TP 3 : Jointures et Sous-requêtes"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 1
titre: "TP 3 : Jointures et Sous-requêtes"
permalink: "/tp3/exercice1/"
tags: tp
---

# TP 3 : Jointures et Sous-requêtes

## Description

Ce TP approfondit les concepts avancés sur la base **`Comptoir2000`** :

1. **Jointures** : INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, auto-jointures
2. **Sous-requêtes** : Sous-requêtes, IN/EXISTS, requêtes corrélées
3. **Combinaison** : Mixte de jointures et sous-requêtes pour résoudre des problèmes complexes

## Schéma de la base de données

La base `Comptoir2000` contient les tables principales :

- **Client** : CodeCli, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax
- **Produit** : Refprod, Nomprod, Fournisseur, Categorie, UnitesStock, UnitesCom, PrixUnit, QteParUnit, Indisponible
- **Commande** : NoCom, CodeCli, DateCom, NoEmp, DateEnv, DateLivraison, ALivAvant, VilleLiv, AdresseLiv, CodePostalLiv, PaysLiv, Frais, Remise
- **DetailCommande** : NoCom, Refprod, Qte, Remise
- **Employe** : NoEmp, Nom, Prenom, Fonction, Responsable, DateEmbauche, DateNaissance, Adresse, Ville, Region, CodePostal, Pays, Tel, Notes
- **Fournisseur** : CodeFournisseur, NomFournisseur, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax
- **Categorie** : CodeCategorie, NomCategorie, Description
- **Messager** : CodeMessager, NomMessager

## Conseils pour bien démarrer

- Vérifiez toujours les clés de liaison (clés étrangères) avant de joindre
- Les LEFT JOIN conservent tous les enregistrements de la table de gauche
- Les sous-requêtes IN() et EXISTS() offrent des alternatives aux jointures
- Testez vos jointures étape par étape pour vérifier les résultats intermédiaires
- Les performances diffèrent : préférez les jointures pour les requêtes simples, les sous-requêtes pour la complexité

## Quelques requêtes d'exemple

```sql
-- 1. Lister tous les clients avec leurs commandes (LEFT JOIN)
SELECT C.Societe, O.NoCom, O.DateCom
FROM Client C
LEFT JOIN Commande O ON C.CodeCli = O.CodeCli;
```
```sql
-- 2. Trouver les produits jamais commandés (LEFT JOIN + IS NULL)
SELECT P.Nomprod
FROM Produit P
LEFT JOIN DetailCommande D ON P.Refprod = D.Refprod
WHERE D.Refprod IS NULL;
```
```sql
-- 3. Lister les employés avec le nombre de commandes traitées (sous-requête)
SELECT E.Nom, E.Prenom,
       (SELECT COUNT(*)
        FROM Commande O
        WHERE O.NoEmp = E.NoEmp) AS NbCommandes
FROM Employe E;
```
```sql
-- 4. Trouver les clients ayant passé plus de 5 commandes (sous-requête IN)
SELECT C.Societe
FROM Client C
WHERE C.CodeCli IN (
    SELECT O.CodeCli
    FROM Commande O
    GROUP BY O.CodeCli
    HAVING COUNT(*) > 5
);
```
```sql
-- 5. Lister les produits avec leur fournisseur et catégorie (INNER JOIN)
SELECT P.Nomprod, F.NomFournisseur, Cat.NomCategorie
FROM Produit P
INNER JOIN Fournisseur F ON P.Fournisseur = F.CodeFournisseur
INNER JOIN Categorie Cat ON P.Categorie = Cat.CodeCategorie;
```
