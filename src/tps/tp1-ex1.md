---
layout: base.njk
title: "TP1 - Descriptif de la base Comptoir2000"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 1
titre: "TP1 - Descriptif de la base Comptoir2000"
permalink: "/tp1/exercice1/"
tags: tp
---

# TP1 - Descriptif de la base Comptoir2000

La base de données **`Comptoir2000`** est une base de données de gestion commerciale contenant des informations relatives à une entreprise.

La table **`Client`** contient les données des clients professionnels de l'entreprise, tandis que la table **`Produit`** recense les produits commercialisés. La table **`Commande`** contient les informations des commandes passées par les clients.

La table **`DetailCommande`** établit le lien entre les commandes et les produits, en précisant la quantité commandée et le prix unitaire.

Enfin, les tables **`Employe`** et **`Categorie`** complètent ce modèle en fournissant respectivement les informations des employés de l'entreprise et les catégories de produits disponibles.

## Structure complète de la base

```
Client (CodeCli, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax)
Employe (NoEmp, Nom, Prenom, Fonction, TitreCourtoisie, DateNaissance, DateEmbauche, Adresse, Ville, Region, CodePostal, Pays, TelDom, Extension, RendCompteA)
Commande (NoCom, #CodeCli, #NoEmp, DateCom, ALivAvant, DateEnv, #NoMess, Port, Destinataire, AdrLiv, VilleLiv, RegionLiv, CodePostalLiv, PaysLiv)
Messager (NoMess, NomMess, Tel)
Produit (Refprod, Nomprod, #NoFour, #CodeCateg, QteParUnit, PrixUnit, UnitesStock, UnitesCom, NiveauReap, Indisponible)
Fournisseur (NoFour, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax, PageAccueil)
DetailCommande (NoCom, Refprod, PrixUnit, Qte, Remise)
Categorie (CodeCateg, NomCateg, Description)
```

## Conseils pour le TP

- Lisez attentivement les énoncés
- Vous allez utiliser des requêtes SELECT 
- Vérifiez la cohérence de vos résultats
- Utilisez les spoilers pour les indices si vous êtes bloqué
- Les bonus ne sont à faire que si vous avez le temps
