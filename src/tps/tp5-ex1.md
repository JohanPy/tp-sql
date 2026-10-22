---
layout: base.njk
title: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
intitule: "TP 5 — Grand Cas de Synthèse (Gymnase2000)"
base: "Gymnase2000.sqlite"
tpNum: 5
exerciceNum: 1
titre: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
permalink: "/tp5/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Partie I - Requêtes de base et jointures simples

## Questions (15 questions)

**1. Afficher tous les sportifs du complexe**

À partir de la table `Sportifs`, affichez le numéro de licence (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) de tous les adhérents.

<!-- expected-query: Q1
SELECT IdSportif, Nom, Prenom FROM Sportifs;
-->

**2. Lister tous les sports disponibles**

À partir de la table `Sports`, affichez l'identifiant (`IdSport`) et le nom (`Libelle`) de l'ensemble des disciplines sportives proposées.

<!-- expected-query: Q2
SELECT IdSport, Libelle FROM Sports;
-->

**3. Afficher les sports pratiqués par un sportif donné**

Pour le sportif ayant l'identifiant 1 (`IdSportif = 1`), affichez le numéro (`IdSport`) et le libellé (`Libelle`) de chaque sport qu'il pratique.

<!-- expected-query: Q3
SELECT Sports.IdSport, Sports.Libelle FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport WHERE Jouer.IdSportif = 1;
-->

**4. Lister les séances d'entraînement programmées**

Pour chaque séance d'entraînement enregistrée, affichez le libellé du sport sous l'alias `Sport`, le nom du gymnase (`NomGymnase`), le jour (`Jour`) et l'horaire de début (`Horaire`).

<!-- expected-query: Q4
SELECT Sports.Libelle AS Sport, Gymnases.NomGymnase, Seances.Jour, Seances.Horaire FROM Seances JOIN Sports ON Seances.IdSport = Sports.IdSport JOIN Gymnases ON Seances.IdGymnase = Gymnases.IdGymnase;
-->

**5. Identifier les entraîneurs et les disciplines qu'ils enseignent**

Affichez sans doublon l'identifiant (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) des sportifs ayant un rôle d'entraîneur, ainsi que le sport qu'ils encadrent sous l'alias `SportEnseigne`.

<!-- expected-query: Q5
SELECT DISTINCT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS SportEnseigne FROM Sportifs JOIN Entrainer ON Sportifs.IdSportif = Entrainer.IdSportifEntraineur JOIN Sports ON Entrainer.IdSport = Sports.IdSport;
-->

**6. Identifier les arbitres officiels et leurs sports d'arbitrage**

Affichez sans doublon l'identifiant (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) des sportifs qualifiés pour arbitrer, ainsi que le nom du sport arbitré sous l'alias `SportArbitre`.

<!-- expected-query: Q6
SELECT DISTINCT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS SportArbitre FROM Sportifs JOIN Arbitrer ON Sportifs.IdSportif = Arbitrer.IdSportif JOIN Sports ON Arbitrer.IdSport = Sports.IdSport;
-->

**7. Afficher le planning des séances du gymnase numéro 1**

Pour le gymnase numéro 1 (`IdGymnase = 1`), affichez le sport sous l'alias `Sport`, le jour de la séance (`Jour`) et l'horaire (`Horaire`).

<!-- expected-query: Q7
SELECT Sports.Libelle AS Sport, Seances.Jour, Seances.Horaire FROM Seances JOIN Sports ON Seances.IdSport = Sports.IdSport WHERE Seances.IdGymnase = 1;
-->

**8. Croiser les sportifs avec les séances auxquelles ils peuvent participer**

Pour chaque sportif, affichez sans doublon son nom (`Nom`), son prénom (`Prenom`), le sport pratiqué sous l'alias `Sport`, ainsi que le jour (`Jour`) et l'horaire (`Horaire`) des séances programmées dans ce sport.

<!-- expected-query: Q8
SELECT DISTINCT Sportifs.Nom, Sportifs.Prenom, Sports.Libelle AS Sport, Seances.Jour, Seances.Horaire FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif JOIN Sports ON Jouer.IdSport = Sports.IdSport JOIN Seances ON Sports.IdSport = Seances.IdSport;
-->

**9. Dénombrer les pratiquants par discipline sportive**

Pour chaque sport, affichez son intitulé (`Libelle`) ainsi que le nombre de sportifs qui le pratiquent, sous l'alias `NbSportifs`. Tous les sports doivent figurer dans le résultat, y compris ceux sans aucun pratiquant (affichant alors 0).

<!-- expected-query: Q9
SELECT Sports.Libelle, COUNT(Jouer.IdSportif) AS NbSportifs FROM Sports LEFT JOIN Jouer ON Sports.IdSport = Jouer.IdSport GROUP BY Sports.IdSport, Sports.Libelle;
-->

**10. Identifier les sportifs polyvalents pratiquant plusieurs sports**

Affichez le nom (`Nom`), le prénom (`Prenom`) et le nombre de sports pratiqués sous l'alias `NbSports` pour les adhérents qui pratiquent strictement plus d'un sport.

<!-- expected-query: Q10
SELECT Sportifs.Nom, Sportifs.Prenom, COUNT(Jouer.IdSport) AS NbSports FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom HAVING COUNT(Jouer.IdSport) > 1;
-->

**11. Mesurer la fréquentation des gymnases par le nombre de séances**

Pour chaque gymnase du complexe, affichez son nom (`NomGymnase`) et le nombre de séances d'entraînement qui y sont programmées sous l'alias `NbSeances` (en incluant les gymnases sans aucune séance programmée avec un total de 0).

<!-- expected-query: Q11
SELECT Gymnases.NomGymnase, COUNT(Seances.IdSport) AS NbSeances FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase;
-->

**12. Trouver les entraîneurs qui pratiquent eux-mêmes le sport qu'ils enseignent**

Affichez sans doublon le nom (`Nom`), le prénom (`Prenom`) et le libellé du sport (`Libelle`) pour les sportifs qui entraînent une discipline sportive qu'ils pratiquent également à titre personnel.

<details>
<summary>💡 Indice</summary>

Rappelez-vous que les entraîneurs sont eux-mêmes des sportifs : la colonne `IdSportifEntraineur` de la table `Entrainer` correspond à l'identifiant `IdSportif` de la table `Jouer`.
</details>

<!-- expected-query: Q12
SELECT DISTINCT Sportifs.Nom, Sportifs.Prenom, Sports.Libelle FROM Sportifs JOIN Entrainer ON Sportifs.IdSportif = Entrainer.IdSportifEntraineur JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif AND Entrainer.IdSport = Jouer.IdSport JOIN Sports ON Entrainer.IdSport = Sports.IdSport;
-->

**13. Cibler les sportifs dans une tranche d'âge spécifique**

À partir de la table `Sportifs`, affichez le numéro (`IdSportif`), le nom (`Nom`), le prénom (`Prenom`) et l'âge (`Age`) des sportifs âgés de 20 à 30 ans inclus.

<!-- expected-query: Q13
SELECT IdSportif, Nom, Prenom, Age FROM Sportifs WHERE Age BETWEEN 20 AND 30;
-->

**14. Associer chaque entraîneur aux sportifs qu'il peut potentiellement former**

Trouvez les binômes entraîneur-pratiquant : affichez sans doublon le nom de l'entraîneur sous l'alias `EntraineurNom`, le nom de l'adhérent sous l'alias `SportifNom`, et la discipline partagée sous l'alias `Sport`, pour chaque cas où l'entraîneur enseigne un sport que l'adhérent pratique (en excluant les cas où l'entraîneur est comparé à lui-même).

<!-- expected-query: Q14
SELECT DISTINCT E.Nom AS EntraineurNom, S.Nom AS SportifNom, Sports.Libelle AS Sport FROM Sportifs E JOIN Entrainer ON E.IdSportif = Entrainer.IdSportifEntraineur JOIN Jouer ON Entrainer.IdSport = Jouer.IdSport JOIN Sportifs S ON Jouer.IdSportif = S.IdSportif JOIN Sports ON Entrainer.IdSport = Sports.IdSport WHERE E.IdSportif <> S.IdSportif;
-->

**15. Détecter les disciplines sportives sans créneau d'entraînement**

Identifiez les sports orphelins : affichez l'identifiant (`IdSport`) et le libellé (`Libelle`) des sports pour lesquels aucune séance d'entraînement n'est programmée dans aucun gymnase.

<!-- expected-query: Q15
SELECT Sports.IdSport, Sports.Libelle FROM Sports LEFT JOIN Seances ON Sports.IdSport = Seances.IdSport WHERE Seances.IdSport IS NULL;
-->
