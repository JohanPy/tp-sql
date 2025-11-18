---
layout: base.njk
title: "Exercice 1 : Jointures"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 2
titre: "Exercice 1 : Jointures"
permalink: "/tp3/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Jointures

## Questions

**1. Afficher toutes les commandes avec les informations du client et de l'employé**

Pour chaque commande, affichez le numéro, la date, le nom du client et le nom de l'employé qui l'a traitée.

**2. Lister tous les produits avec leur catégorie et leur fournisseur**

Affichez le nom du produit, le nom de la catégorie et le nom du fournisseur.

**3. Afficher les détails de toutes les commandes avec les noms des produits**

Pour chaque ligne de commande, affichez le numéro de commande, la référence du produit et son nom.

**4. Trouver les clients qui n'ont jamais commandé (LEFT JOIN)**

Affichez les clients (societe) de la base qui n'ont aucune commande enregistrée.

<details>
<summary>💡 Indice</summary>

Pensez au LEFT JOIN qui conserve toutes les lignes de la table de gauche, même sans correspondance.
</details>

**5. Afficher tous les produits, qu'ils aient été commandés ou non**

Affichez le nom du produit et le nombre de fois qu'il a été commandé et 0 si le produit n'a jamais été commandé (ne confondez pas avec le champs uniteCom).

**6. Lister les employés et leurs responsables**

Pour chaque employé, affichez son nom et le nom de son responsable.
Regardez bien le schéma de la table Employe pour comprendre comment les employés sont liés à leurs responsables.

<details>
<summary>💡 Indice</summary>
Les responsables sont aussi des employés.
Joignez la table Employe avec elle-même en utilisant deux alias différents. 
</details>

**7. Afficher les commandes groupées avec client, employé, et informations complètes**

Pour chaque commande : client, employé, nombre de produits et montant total (avec remise).

**8. Trouver les clients et les fournisseurs du même pays**

Affichez les paires client-fournisseur pour chaque pays.

**9. Afficher les commandes avec délai de livraison**

Affichez le numéro de commande, la date de commande, la date de livraison et le délai en jours.

**10. Créer un résumé complet : client → commandes → produits avec tous les détails**

Affichez pour chaque commande : Societe, DateCom, NoCom, Nomprod, Qte, Remise, montant ligne.

