---
layout: base.njk
title: "Exercice 2 : Partie II - Requêtes intermédiaires"
intitule: "TP 5 — Grand Cas de Synthèse (Gymnase2000)"
base: "Gymnase2000.sqlite"
tpNum: 5
exerciceNum: 2
titre: "Exercice 2 : Partie II - Requêtes intermédiaires"
permalink: "/tp5/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Partie II - Requêtes intermédiaires

## Questions (9 questions)

**1. Calculer le nombre de sports pratiqués par chaque sportif**

Pour chaque adhérent du complexe, affichez son nom (`Nom`), son prénom (`Prenom`) et le nombre de sports qu'il pratique sous l'alias `NbSports` (en affichant 0 pour les sportifs ne pratiquant aucun sport).

<details>
<summary>💡 Indice</summary>

Avec une jointure externe `LEFT JOIN`, `COUNT(*)` compte la ligne jointe même si tous ses champs sont `NULL` (renvoyant 1 au lieu de 0). Comptez plutôt un champ spécifique de la table jointe (ex: `COUNT(Jouer.IdSport)`).
</details>

<!-- expected-query: Q1
SELECT Sportifs.Nom, Sportifs.Prenom, COUNT(Jouer.IdSport) AS NbSports FROM Sportifs LEFT JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom;
-->

**2. Afficher les sportifs accompagnés du nom de leur conseiller**

Pour tous les sportifs disposant d'un conseiller officiel, affichez le nom du sportif sous l'alias `Sportif` ainsi que le nom de famille de son conseiller sous l'alias `Conseiller`.

<!-- expected-query: Q2
SELECT S.Nom AS Sportif, Conseiller.Nom AS Conseiller FROM Sportifs S LEFT JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif WHERE S.IdSportifConseiller IS NOT NULL;
-->

**3. Dénombrer les entraîneurs habilités pour chaque discipline**

Pour chaque discipline sportive, affichez son libellé (`Libelle`) ainsi que le nombre d'entraîneurs distincts habilités à l'enseigner sous l'alias `NbEntraineurs` (en incluant les sports sans aucun entraîneur avec la valeur 0).

<!-- expected-query: Q3
SELECT Sports.Libelle, COUNT(DISTINCT Entrainer.IdSportifEntraineur) AS NbEntraineurs FROM Sports LEFT JOIN Entrainer ON Sports.IdSport = Entrainer.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**4. Synthèse d'activité par gymnase : séances et disciplines**

Pour chaque gymnase du complexe, affichez son nom (`NomGymnase`), le nombre total de séances qui y sont programmées sous l'alias `NbSeances`, ainsi que le nombre de sports distincts qui y sont pratiqués sous l'alias `NbSports`.

<!-- expected-query: Q4
SELECT Gymnases.NomGymnase, COUNT(Seances.IdSport) AS NbSeances, COUNT(DISTINCT Seances.IdSport) AS NbSports FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase;
-->

**5. Identifier les sportifs admissibles à un créneau d'entraînement précis**

Pour la séance se déroulant au gymnase 1 le lundi à 9h, déterminez la discipline concernée et affichez le nom (`Nom`), le prénom (`Prenom`) et l'identifiant du sport (`IdSport`) pour tous les sportifs habilités à y participer car pratiquant cette discipline.

<details>
<summary>💡 Indice</summary>

Déterminez le sport associé à cette séance spécifique à l'aide d'une sous-requête scalaire dans la clause `WHERE`.
</details>

<!-- expected-query: Q5
SELECT Sportifs.Nom, Sportifs.Prenom, Jouer.IdSport FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif WHERE Jouer.IdSport = (SELECT IdSport FROM Seances WHERE IdGymnase = 1 AND Jour = 'Lundi' AND Horaire = 9 LIMIT 1);
-->

**6. Calculer la durée moyenne des séances par sport**

Pour chaque sport ayant au moins une séance programmée, affichez son intitulé (`Libelle`) et la durée moyenne d'une séance (arrondie à 1 décimale) sous l'alias `DureeMoyenneMinutes`.

<!-- expected-query: Q6
SELECT Sports.Libelle, ROUND(AVG(Seances.Duree), 1) AS DureeMoyenneMinutes FROM Sports JOIN Seances ON Sports.IdSport = Seances.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**7. Détecter les adhérents n'ayant aucune activité sportive**

Affichez l'identifiant (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) des sportifs inscrits dans le complexe qui ne pratiquent actuellement aucun sport.

<details>
<summary>💡 Indice</summary>

Une jointure externe `LEFT JOIN` avec une condition `WHERE ... IS NULL` sur la clé de la table de droite permet d'isoler les lignes orphelines.
</details>

<!-- expected-query: Q7
SELECT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom FROM Sportifs LEFT JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif WHERE Jouer.IdSport IS NULL;
-->

**8. Répartition hebdomadaire des séances par gymnase**

Pour chaque gymnase et chaque jour de la semaine où des activités ont lieu, affichez le nom du gymnase (`NomGymnase`), le jour (`Jour`) et le nombre de séances programmées sous l'alias `NbSeances`.

<!-- expected-query: Q8
SELECT Gymnases.NomGymnase, Seances.Jour, COUNT(*) AS NbSeances FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Seances.Jour;
-->

**9. Classifier les sportifs selon leur majorité légale**

À partir de la table `Sportifs`, affichez le nom (`Nom`), le prénom (`Prenom`), l'âge (`Age`) et une colonne sous l'alias `Statut` affichant 'Majeur' si l'adhérent a 18 ans ou plus, et 'Mineur' dans le cas contraire.

<!-- expected-query: Q9
SELECT Nom, Prenom, Age, CASE WHEN Age >= 18 THEN 'Majeur' ELSE 'Mineur' END AS Statut FROM Sportifs;
-->
