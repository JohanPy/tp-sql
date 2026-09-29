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

Affichez le nom du sportif et le nombre de sports.

<!-- expected-query: Q1
SELECT Sportifs.Nom, Sportifs.Prenom, COUNT(Jouer.IdSport) AS NbSports FROM Sportifs LEFT JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom;
-->

**2. Afficher le nom des sportifs et le nom de leur conseiller**

Affichez le nom du sportif et le nom de son conseiller.

<details>
<summary>💡 Indice</summary>
Utilisez une auto-jointure sur la table Sportifs.
</details>

<!-- expected-query: Q2
SELECT S.Nom AS Sportif, Conseiller.Nom AS Conseiller FROM Sportifs S LEFT JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif WHERE S.IdSportifConseiller IS NOT NULL;
-->

**3. Calculer le nombre d'entraîneurs par sport**

Comptez les entraîneurs disponibles pour chaque discipline.

<!-- expected-query: Q3
SELECT Sports.Libelle, COUNT(DISTINCT Entrainer.IdSportifEntraineur) AS NbEntraineurs FROM Sports LEFT JOIN Entrainer ON Sports.IdSport = Entrainer.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**4. Lister les gymnases avec le nombre total de séances et le nombre de sports distincts offerts**

Analysez le gymnase, le nombre de séances programmées et le nombre de sports différents proposés.

<!-- expected-query: Q4
SELECT Gymnases.NomGymnase, COUNT(Seances.IdSport) AS NbSeances, COUNT(DISTINCT Seances.IdSport) AS NbSports FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase;
-->

**5. Afficher les sportifs pouvant participer à une séance donnée (ex: idGymnase = 1, Jour = "Lundi", Horaire = 9)**

Affichez les noms, les prénoms des sportifs et l'`IdSport` correspondant au sport de la séance.

<!-- expected-query: Q5
SELECT Sportifs.Nom, Sportifs.Prenom, Jouer.IdSport FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif WHERE Jouer.IdSport = (SELECT IdSport FROM Seances WHERE IdGymnase = 1 AND Jour = 'Lundi' AND Horaire = 9 LIMIT 1);
-->

**6. Calculer la durée moyenne des séances par sport**

Affichez le sport et la durée moyenne en minutes.

<!-- expected-query: Q6
SELECT Sports.Libelle, ROUND(AVG(Seances.Duree), 1) AS DureeMoyenneMinutes FROM Sports JOIN Seances ON Sports.IdSport = Seances.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**7. Trouver les sportifs qui ne pratiquent aucun sport**

Identifiez les sportifs absents de la table Jouer.

<!-- expected-query: Q7
SELECT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom FROM Sportifs LEFT JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif WHERE Jouer.IdSport IS NULL;
-->

**8. Pour chaque gymnase, compter le nombre de séances par jour de la semaine**

Affichez le nom du gymnase, le jour, et le nombre de séances.

<!-- expected-query: Q8
SELECT Gymnases.NomGymnase, Seances.Jour, COUNT(*) AS NbSeances FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Seances.Jour;
-->

**9. Lister les sportifs en indiquant s'ils sont majeurs ou mineurs (Age >= 18)**

Affichez le nom, l'âge et une colonne "Statut" ("Majeur" ou "Mineur").

<details>
<summary>💡 Indice</summary>
Utilisez une structure conditionnelle (CASE) pour créer une nouvelle colonne "Statut".
</details>

<!-- expected-query: Q9
SELECT Nom, Prenom, Age, CASE WHEN Age >= 18 THEN 'Majeur' ELSE 'Mineur' END AS Statut FROM Sportifs;
-->
