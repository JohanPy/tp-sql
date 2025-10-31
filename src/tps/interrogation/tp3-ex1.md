---
layout: base.njk
category: interrogation
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
2. **Sous-requêtes** : Sous-requêtes scalaires, IN/EXISTS, requêtes corrélées
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

```sql
FROM Clients c
LEFT JOIN Commandes co ON c.IdClient = co.IdClient
LEFT JOIN Details d ON co.IdCommande = d.IdCommande
GROUP BY c.IdClient
ORDER BY DerniereCommande DESC;
```

```sql
SELECT p.NomProduit
FROM Produits p
WHERE p.IdProduit NOT IN (SELECT DISTINCT IdProduit FROM Details);
```
