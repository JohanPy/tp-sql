---
layout: base.njk
title: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 1
titre: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
permalink: "/tp4/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Partie I - Requêtes de base et jointures simples

## Questions (15 questions)

**1. Afficher tous les sportifs du gymnase**

Affichez la liste complète des sportifs : numéro de licence (idsportif), nom et prénom.

<!-- expected-query: Q1
SELECT IdSportif, Nom, Prenom FROM Sportifs;
-->

**2. Lister tous les sports disponibles**

Affichez le numéro et le nom de tous les sports proposés.

<!-- expected-query: Q2
SELECT IdSport, Libelle FROM Sports;
-->

**3. Afficher les sports pratiqués par un sportif donné (ex: id 1)**

Trouvez tous les sports qu'un sportif particulier pratique.

<!-- expected-query: Q3
SELECT Sports.IdSport, Sports.Libelle FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport WHERE Jouer.IdSportif = 1;
-->

**4. Lister les séances d'entraînement programmées**

Affichez le sport, le gymnase, et l'horaire pour chaque séance programmée.

<!-- expected-query: Q4
SELECT Sports.Libelle AS Sport, Gymnases.NomGymnase, Seances.Jour, Seances.Horaire FROM Seances JOIN Sports ON Seances.IdSport = Sports.IdSport JOIN Gymnases ON Seances.IdGymnase = Gymnases.IdGymnase;
-->

**5. Afficher les entraîneurs (sportifs qui entraînent) et les sports qu'ils enseignent**

Identifiez les sportifs ayant un rôle d'entraîneur.

<!-- expected-query: Q5
SELECT DISTINCT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS SportEnseigne FROM Sportifs JOIN Entrainer ON Sportifs.IdSportif = Entrainer.IdSportifEntraineur JOIN Sports ON Entrainer.IdSport = Sports.IdSport;
-->

**6. Trouver les arbitres et les sports qu'ils arbitrent**

Listez les sportifs arbitres et leurs sports.

<!-- expected-query: Q6
SELECT DISTINCT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS SportArbitre FROM Sportifs JOIN Arbitrer ON Sportifs.IdSportif = Arbitrer.IdSportif JOIN Sports ON Arbitrer.IdSport = Sports.IdSport;
-->

**7. Afficher toutes les séances du gymnase numéro 1**

Affichez le sport et l'horaire.

<!-- expected-query: Q7
SELECT Sports.Libelle AS Sport, Seances.Jour, Seances.Horaire FROM Seances JOIN Sports ON Seances.IdSport = Sports.IdSport WHERE Seances.IdGymnase = 1;
-->

**8. Lister les sportifs et les séances auxquelles ils peuvent participer (basé sur les sports qu'ils jouent)**

Affichez le nom du sportif, le sport, et l'horaire de la séance.

<!-- expected-query: Q8
SELECT DISTINCT Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS Sport, Seances.Jour, Seances.Horaire FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif JOIN Sports ON Jouer.IdSport = Sports.IdSport JOIN Seances ON Sports.IdSport = Seances.IdSport;
-->

**9. Afficher le nombre de sportifs par sport**

Comptez combien de sportifs pratiquent chaque sport.

<!-- expected-query: Q9
SELECT Sports.Libelle, COUNT(Jouer.IdSportif) AS NbSportifs FROM Sports LEFT JOIN Jouer ON Sports.IdSport = Jouer.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**10. Trouver les sportifs qui pratiquent plus d'un sport**

Identifiez les sportifs polyvalents.

<!-- expected-query: Q10
SELECT Sportifs.Nom, Sportifs.Prenom, COUNT(Jouer.IdSport) AS NbSports FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom HAVING COUNT(Jouer.IdSport) > 1;
-->

**11. Afficher les gymnases et le nombre de séances programmées dans chaque**

Comptez les activités par gymnase.

<!-- expected-query: Q11
SELECT Gymnases.NomGymnase, COUNT(Seances.IdSport) AS NbSeances FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase;
-->

**12. Lister les sportifs qui entraînent un sport qu'ils pratiquent eux-mêmes**

Trouvez les entraîneurs-pratiquants.

<details>
<summary>💡 Indice</summary>
les id_sportif_entraineur sont des id_sportifs qui ont un rôle d'entraîneur. 
</details>

<!-- expected-query: Q12
SELECT DISTINCT Sportifs.Nom, Sportifs.Prenom, Sports.Libelle FROM Sportifs JOIN Entrainer ON Sportifs.IdSportif = Entrainer.IdSportifEntraineur JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif AND Entrainer.IdSport = Jouer.IdSport JOIN Sports ON Entrainer.IdSport = Sports.IdSport;
-->

**13. Afficher les sportifs âgés de 20 à 30 ans**

Filtrez les sportifs sur leur âge.

<!-- expected-query: Q13
SELECT IdSportif, Nom, Prenom, Age FROM Sportifs WHERE Age BETWEEN 20 AND 30;
-->

**14. Trouver les paires (entraîneur, sportif) où l'entraîneur entraîne un sport que le sportif pratique**

Identifiez les relations entraîneur-apprenant potentielles.

<!-- expected-query: Q14
SELECT DISTINCT E.Nom AS EntraineurNom, S.Nom AS SportifNom, Sports.Libelle AS Sport FROM Sportifs E JOIN Entrainer ON E.IdSportif = Entrainer.IdSportifEntraineur JOIN Jouer ON Entrainer.IdSport = Jouer.IdSport JOIN Sportifs S ON Jouer.IdSportif = S.IdSportif JOIN Sports ON Entrainer.IdSport = Sports.IdSport WHERE E.IdSportif <> S.IdSportif;
-->

**15. Afficher les sports sans séances programmées**

Quel sport n'a aucune séance d'entraînement ?

<!-- expected-query: Q15
SELECT Sports.IdSport, Sports.Libelle FROM Sports LEFT JOIN Seances ON Sports.IdSport = Seances.IdSport WHERE Seances.IdSport IS NULL;
-->
