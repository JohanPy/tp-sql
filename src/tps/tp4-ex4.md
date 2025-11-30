---
layout: base.njk
title: "Exercice 4 : Bonus - Défis Gymnase2000"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 4
titre: "Exercice 4 : Bonus - Défis Gymnase2000"
permalink: "/tp4/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Défis Gymnase2000

## Questions bonus (8 questions)

Combinez tous les concepts pour résoudre des problèmes complexes sur Gymnase2000. À faire uniquement si vous avez le temps !

**1. Le "Grand Chelem" : Sportifs ayant les 4 casquettes**

Trouvez les sportifs qui sont à la fois : Joueur, Entraîneur, Arbitre ET Conseiller (ils conseillent quelqu'un).

<details>
<summary>💡 Indice</summary>
Utilisez `INTERSECT` ou des jointures multiples (`INNER JOIN`). Pour "Conseiller", vérifiez si leur ID apparaît dans la colonne `IdSportifConseiller` de la table `Sportifs`.
</details>

**2. Les "Intrus" : Entraîneurs qui animent une séance d'un sport qu'ils ne pratiquent pas**

Identifiez les entraîneurs qui donnent une séance (table `Seances`) pour un sport qu'ils ne sont pas censés jouer (table `Jouer`).

**3. La "Division" : Trouver les sportifs qui pratiquent TOUS les sports**

C'est le problème de la division relationnelle : quels sportifs ont une relation avec la totalité des éléments de la table Sports ?

<details>
<summary>💡 Indice</summary>
Comparez le nombre de sports distincts pratiqués par le sportif avec le nombre total de sports existants (`COUNT`).
</details>

**4. L' "Ubiquité" : Détecter les conflits d'horaire des entraîneurs**

Trouvez les entraîneurs qui ont deux séances programmées le même jour à la même heure.

<details>
<summary>💡 Indice</summary>
Faites une auto-jointure sur la table `Seances` pour trouver deux lignes différentes avec le même entraîneur, le même jour et le même horaire.
</details>

**5. La "Chaîne de conseil" : Afficher les trios hiérarchiques**

Affichez le nom du "Grand-Conseiller", du "Conseiller" et du "Conseillé" (A conseille B qui conseille C).

**6. La "Densité" : Classement des gymnases par occupation au m²**

Calculez le nombre de séances par unité de surface pour chaque gymnase.

**7. Les "Sports Orphelins" : Sports avec joueurs mais sans séances**

Quels sports ont des pratiquants inscrits (table `Jouer`) mais n'ont aucune séance programmée dans aucun gymnase ?

**8. L' "Exclusivité" : Les sports gérés par un seul entraîneur**

Trouvez les sports pour lesquels il n'y a qu'un seul entraîneur distinct qui anime des séances (sur l'ensemble de tous les gymnases).

