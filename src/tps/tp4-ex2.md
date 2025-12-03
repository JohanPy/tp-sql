---
layout: base.njk
title: "Exercice 2 : Partie II - Requêtes intermédiaires"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 2
titre: "Exercice 2 : Partie II - Requêtes intermédiaires"
permalink: "/tp4/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Partie II - Requêtes intermédiaires

## Questions (9 questions)

**1. Calculer le nombre de sports pratiqués par chaque sportif**

Affichez le nom du sportif et le nombre de sports.

**2. Afficher le nom des sportifs et le nom de leur conseiller**

Affichez le nom du sportif et le nom de son conseiller.

<details>
<summary>💡 Indice</summary>
Utilisez une auto-jointure sur la table Sportifs.
</details>

**3. Calculer le nombre d'entraîneurs par sport**

Comptez les entraîneurs disponibles pour chaque discipline.

**4. Lister les gymnases avec le nombre total de séances et le nombre de sports distincts offerts**

Analysez le gymnase, le nombre de séances programmées et le nombre de sports différents proposés.

**5. Afficher les sportifs pouvant participer à une séance donnée (ex: idGymnase = 1, Jour = "Lundi", Horaire = 9)**

Affichez les noms, les prénoms des sportifs et l'`IdSport` correspondant au sport de la séance.

**6. Calculer la durée moyenne des séances par sport**

Affichez le sport et la durée moyenne en minutes.

**7. Trouver les sportifs qui ne pratiquent aucun sport**

Identifiez les sportifs absents de la table Jouer.

**8. Pour chaque gymnase, compter le nombre de séances par jour de la semaine**

Affichez le nom du gymnase, le jour, et le nombre de séances.

**9. Lister les sportifs en indiquant s'ils sont majeurs ou mineurs (Age >= 18)**

Affichez le nom, l'âge et une colonne "Statut" ("Majeur" ou "Mineur").

<details>
<summary>💡 Indice</summary>
Utilisez une structure conditionnelle (CASE) pour créer une nouvelle colonne "Statut".
</details>
