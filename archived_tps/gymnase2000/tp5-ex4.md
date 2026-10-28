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

**1. Identifier les sportifs cumulant les 4 statuts clés**

Trouvez les sportifs les plus investis dans la vie du complexe, qui cumulent à la fois les 4 rôles suivants : joueur, entraîneur, arbitre et conseiller officiel d'au moins un autre adhérent. Affichez leur identifiant (`IdSportif`), leur nom (`Nom`) et leur prénom (`Prenom`).

<!-- expected-query: Q1
SELECT IdSportif, Nom, Prenom FROM Sportifs WHERE IdSportif IN (SELECT IdSportif FROM Jouer) AND IdSportif IN (SELECT IdSportifEntraineur FROM Entrainer) AND IdSportif IN (SELECT IdSportif FROM Arbitrer) AND IdSportif IN (SELECT DISTINCT IdSportifConseiller FROM Sportifs WHERE IdSportifConseiller IS NOT NULL);
-->

**2. Détecter les entraîneurs animant une discipline qu'ils ne pratiquent pas**

Identifiez les entraîneurs qui encadrent au moins une séance programmée dans une discipline qu'ils ne pratiquent pas eux-mêmes en tant que joueur : affichez sans doublon le nom de l'entraîneur sous l'alias `Entraineur` ainsi que le nom du sport enseigné sous l'alias `SportAnime`.

<!-- expected-query: Q2
SELECT DISTINCT Sportifs.Nom AS Entraineur, Sports.Libelle AS SportAnime FROM Seances JOIN Sportifs ON Seances.IdSportifEntraineur = Sportifs.IdSportif JOIN Sports ON Seances.IdSport = Sports.IdSport WHERE NOT EXISTS (SELECT 1 FROM Jouer WHERE Jouer.IdSportif = Seances.IdSportifEntraineur AND Jouer.IdSport = Seances.IdSport);
-->

**3. Identifier les sportifs pratiquant l'intégralité des sports**

Problème classique de division relationnelle : affichez l'identifiant (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) des sportifs d'exception qui pratiquent l'intégralité de toutes les disciplines sportives répertoriées dans le complexe.

<details>
<summary>💡 Indice</summary>

Dans une clause `HAVING`, comparez le nombre de disciplines distinctes pratiquées par le sportif avec le nombre total de sports de la base obtenu par la sous-requête `(SELECT COUNT(*) FROM Sports)`.
</details>

<!-- expected-query: Q3
SELECT Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom FROM Sportifs JOIN Jouer ON Sportifs.IdSportif = Jouer.IdSportif GROUP BY Sportifs.IdSportif, Sportifs.Nom, Sportifs.Prenom HAVING COUNT(DISTINCT Jouer.IdSport) = (SELECT COUNT(*) FROM Sports);
-->

**4. Détecter les conflits d'emploi du temps des entraîneurs**

Détectez les erreurs de planification : identifiez les entraîneurs programmés sur deux séances distinctes se déroulant le même jour et à la même heure dans deux gymnases différents. Affichez l'identifiant de l'entraîneur (`IdSportifEntraineur`), son nom (`Nom`), le jour (`Jour`), l'horaire (`Horaire`), le numéro du premier gymnase sous l'alias `Gym1` et celui du second sous l'alias `Gym2`. Veillez à ce que chaque conflit n'apparaisse qu'une seule fois en imposant `Gym1 < Gym2`.

<details>
<summary>💡 Indice</summary>

Une auto-jointure sur la table `Seances` (`S1.IdSportifEntraineur = S2.IdSportifEntraineur AND S1.Jour = S2.Jour AND S1.Horaire = S2.Horaire`) permet d'isoler les doublons d'horaires. La condition `S1.IdGymnase < S2.IdGymnase` garantit qu'il s'agit de deux gymnases différents tout en évitant les doublons inversés.
</details>

<!-- expected-query: Q4
SELECT S1.IdSportifEntraineur, Sportifs.Nom, S1.Jour, S1.Horaire, S1.IdGymnase AS Gym1, S2.IdGymnase AS Gym2 FROM Seances S1 JOIN Seances S2 ON S1.IdSportifEntraineur = S2.IdSportifEntraineur AND S1.Jour = S2.Jour AND S1.Horaire = S2.Horaire AND S1.IdGymnase < S2.IdGymnase JOIN Sportifs ON S1.IdSportifEntraineur = Sportifs.IdSportif;
-->

**5. Reconstituer les chaînes hiérarchiques de conseil à trois niveaux**

Identifiez les lignées de mentorat à 3 échelons successifs (le sportif A conseille le sportif B qui conseille le sportif C) : affichez le nom du mentor de premier niveau sous l'alias `GrandConseiller`, le nom du mentor intermédiaire sous l'alias `Conseiller`, et le nom du protégé final sous l'alias `Conseille`.

<details>
<summary>💡 Indice</summary>

Enchaînez deux auto-jointures sur la table `Sportifs` en utilisant des alias de table distincts (par exemple `Filleul`, `Conseiller` et `GrandConseiller`) pour relier les deux générations de conseil.
</details>

<!-- expected-query: Q5
SELECT GrandConseiller.Nom AS GrandConseiller, Conseiller.Nom AS Conseiller, Filleul.Nom AS Conseille FROM Sportifs Filleul JOIN Sportifs Conseiller ON Filleul.IdSportifConseiller = Conseiller.IdSportif JOIN Sportifs GrandConseiller ON Conseiller.IdSportifConseiller = GrandConseiller.IdSportif;
-->

**6. Calculer la densité d'occupation au mètre carré par gymnase**

Pour chaque gymnase, affichez son nom (`NomGymnase`), sa surface en mètres carrés (`Surface`), le nombre total de séances qui y sont programmées sous l'alias `NbSeances`, ainsi que le ratio d'occupation (nombre de séances divisé par la surface au m²), arrondi à 4 décimales sous l'alias `DensiteSeancesParM2`. Triez par densité décroissante.

<details>
<summary>💡 Indice</summary>

En SQLite, la division entre deux entiers produit un entier tronqué. Convertissez l'un des opérandes en décimal avec `CAST(... AS FLOAT)` pour obtenir une division réelle avant d'arrondir.
</details>

<!-- expected-query: Q6
SELECT Gymnases.NomGymnase, Gymnases.Surface, COUNT(Seances.IdSport) AS NbSeances, ROUND(CAST(COUNT(Seances.IdSport) AS FLOAT) / Gymnases.Surface, 4) AS DensiteSeancesParM2 FROM Gymnases LEFT JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Gymnases.Surface ORDER BY DensiteSeancesParM2 DESC;
-->

**7. Identifier les sports demandés par les adhérents mais sans créneau programmé**

Trouvez les disciplines "orphelines" : affichez sans doublon le numéro (`IdSport`) et le libellé (`Libelle`) des sports qui comptent au moins un pratiquant inscrit, mais pour lesquels aucune séance d'entraînement n'est programmée dans aucun gymnase.

<!-- expected-query: Q7
SELECT DISTINCT Sports.IdSport, Sports.Libelle FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport WHERE Sports.IdSport NOT IN (SELECT DISTINCT IdSport FROM Seances);
-->

**8. Identifier les disciplines sous la responsabilité exclusive d'un seul entraîneur**

Affichez le libellé (`Libelle`) et le nombre d'entraîneurs sous l'alias `NbEntraineursDistincts`, pour les seuls sports dont l'ensemble des séances programmées dans le complexe est assuré par un seul et unique entraîneur.

<!-- expected-query: Q8
SELECT Sports.Libelle, COUNT(DISTINCT Seances.IdSportifEntraineur) AS NbEntraineursDistincts FROM Sports JOIN Seances ON Sports.IdSport = Seances.IdSport GROUP BY Sports.IdSport, Sports.Libelle HAVING COUNT(DISTINCT Seances.IdSportifEntraineur) = 1;
-->

