---
layout: base.njk
title: "Exercice 4 : Bonus - Défis Gymnase2000"
intitule: "TP 5 — Grand Cas de Synthèse (Gymnase2000)"
base: "Gymnase2000.sqlite"
tpNum: 5
exerciceNum: 4
titre: "Exercice 4 : Bonus - Défis Gymnase2000"
permalink: "/tp5/exercice4/"
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

<!-- expected-query: Q1
SELECT IdSportif, Nom, Prenom FROM Sportifs WHERE IdSportif IN (SELECT IdSportif FROM Jouer) AND IdSportif IN (SELECT IdSportifEntraineur FROM Entrainer) AND IdSportif IN (SELECT IdSportif FROM Arbitrer) AND IdSportif IN (SELECT DISTINCT IdSportifConseiller FROM Sportifs WHERE IdSportifConseiller IS NOT NULL);
-->

**2. Les "Intrus" : Entraîneurs qui animent une séance d'un sport qu'ils ne pratiquent pas**

Identifiez les entraîneurs qui donnent une séance (table `Seances`) pour un sport qu'ils ne sont pas censés jouer (table `Jouer`).

<!-- expected-query: Q2
SELECT DISTINCT Sportifs.Nom AS Entraineur, Sports.Libelle AS SportAnime FROM Seances JOIN Sportifs ON Seances.IdSportifEntraineur = Sportifs.IdSportif JOIN Sports ON Seances.IdSport = Sports.IdSport WHERE NOT EXISTS (SELECT 1 FROM Jouer WHERE Jouer.IdSportif = Seances.IdSportifEntraineur AND Jouer.IdSport = Seances.IdSport);
-->

**3. La "Division" : Trouver les sportifs qui pratiquent TOUS les sports**

C'est le problème de la division relationnelle : quels sportifs ont une relation avec la totalité des éléments de la table Sports ?

<details>
<summary>💡 Indice</summary>
Comparez le nombre de sports distincts pratiqués par le sportif avec le nombre total de sports existants (`COUNT`).
</details>

<!-- expected-query: Q3
SELECT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom HAVING COUNT(DISTINCT Jouer.IdSport) = (SELECT COUNT(*) FROM Sports);
-->

**4. L' "Ubiquité" : Détecter les conflits d'horaire des entraîneurs**

Trouvez les entraîneurs qui ont deux séances programmées le même jour à la même heure.

<details>
<summary>💡 Indice</summary>
Faites une auto-jointure sur la table `Seances` pour trouver deux lignes différentes avec le même entraîneur, le même jour et le même horaire.
</details>

<!-- expected-query: Q4
SELECT S1.IdSportifEntraineur, Sportifs.Nom, S1.Jour, S1.Horaire, S1.IdGymnase AS Gym1, S2.IdGymnase AS Gym2 FROM Seances S1 JOIN Seances S2 ON S1.IdSportifEntraineur = S2.IdSportifEntraineur AND S1.Jour = S2.Jour AND S1.Horaire = S2.Horaire AND S1.IdGymnase < S2.IdGymnase JOIN Sportifs ON S1.IdSportifEntraineur = Sportifs.IdSportif;
-->

**5. La "Chaîne de conseil" : Afficher les trios hiérarchiques**

Affichez le nom du "Grand-Conseiller", du "Conseiller" et du "Conseillé" (A conseille B qui conseille C).

<!-- expected-query: Q5
SELECT GrandConseiller.Nom AS GrandConseiller, Conseiller.Nom AS Conseiller, Filleul.Nom AS Conseille FROM Sportifs Filleul JOIN Sportifs Conseiller ON Filleul.IdSportifConseiller = Conseiller.IdSportif JOIN Sportifs GrandConseiller ON Conseiller.IdSportifConseiller = GrandConseiller.IdSportif;
-->

**6. La "Densité" : Classement des gymnases par occupation au m²**

Calculez le nombre de séances par unité de surface pour chaque gymnase.

<!-- expected-query: Q6
SELECT Gymnases.NomGymnase, Gymnases.Surface, COUNT(Seances.IdSport) AS NbSeances, ROUND(CAST(COUNT(Seances.IdSport) AS FLOAT) / Gymnases.Surface, 4) AS DensiteSeancesParM2 FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Gymnases.Surface ORDER BY DensiteSeancesParM2 DESC;
-->

**7. Les "Sports Orphelins" : Sports avec joueurs mais sans séances**

Quels sports ont des pratiquants inscrits (table `Jouer`) mais n'ont aucune séance programmée dans aucun gymnase ?

<!-- expected-query: Q7
SELECT DISTINCT Sports.IdSport, Sports.Libelle FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport WHERE Sports.IdSport NOT IN (SELECT DISTINCT IdSport FROM Seances);
-->

**8. L' "Exclusivité" : Les sports gérés par un seul entraîneur**

Trouvez les sports pour lesquels il n'y a qu'un seul entraîneur distinct qui anime des séances (sur l'ensemble de tous les gymnases).

<!-- expected-query: Q8
SELECT Sports.Libelle, COUNT(DISTINCT Seances.IdSportifEntraineur) AS NbEntraineursDistincts FROM Sports JOIN Seances ON Sports.IdSport = Seances.IdSport GROUP BY Sports.IdSport, Sports.Libelle HAVING COUNT(DISTINCT Seances.IdSportifEntraineur) = 1;
-->

