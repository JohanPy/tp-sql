---
layout: base.njk
title: "Exercice 3 : Partie III - Requêtes très avancées"
intitule: "TP 5 — Grand Cas de Synthèse (Gymnase2000)"
base: "Gymnase2000.sqlite"
tpNum: 5
exerciceNum: 3
titre: "Exercice 3 : Partie III - Requêtes très avancées"
permalink: "/tp5/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Partie III - Requêtes très avancées

## Questions (12 questions)

**1. Évaluer la polyvalence globale des sportifs**

Pour chaque sportif, affichez son nom (`Nom`), son prénom (`Prenom`) et le total cumulé de ses engagements (somme de ses participations comme joueur, comme entraîneur et comme arbitre) sous l'alias `TotalActivites`. Triez par polyvalence décroissante.

<details>
<summary>💡 Indice</summary>

Vous pouvez additionner directement plusieurs sous-requêtes scalaires `(SELECT COUNT(*) FROM ...)` au sein de la clause `SELECT`.
</details>

<!-- expected-query: Q1
SELECT S.Nom, S.Prenom, (SELECT COUNT(*) FROM Jouer J WHERE J.IdSportif = S.IdSportif) + (SELECT COUNT(*) FROM Entrainer E WHERE E.IdSportifEntraineur = S.IdSportif) + (SELECT COUNT(*) FROM Arbitrer A WHERE A.IdSportif = S.IdSportif) AS TotalActivites FROM Sportifs S ORDER BY TotalActivites DESC;
-->

**2. Trouver les sportifs qui jouent un sport arbitré par leur propre conseiller**

Identifiez les situations croisées : affichez sans doublon le nom de l'adhérent sous l'alias `Sportif`, le nom de son conseiller sous l'alias `Conseiller` et le sport concerné sous l'alias `Sport`, pour chaque cas où le conseiller est arbitre officiel d'une discipline pratiquée par son protégé.

<!-- expected-query: Q2
SELECT DISTINCT S.Nom AS Sportif, Conseiller.Nom AS Conseiller, Sports.Libelle AS Sport FROM Sportifs S JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif JOIN Jouer ON S.IdSportif = Jouer.IdSportif JOIN Arbitrer ON Conseiller.IdSportif = Arbitrer.IdSportif AND Jouer.IdSport = Arbitrer.IdSport JOIN Sports ON Jouer.IdSport = Sports.IdSport;
-->

**3. Identifier le gymnase au volume d'occupation le plus élevé**

Affichez le nom (`NomGymnase`) et le volume horaire total cumulé des séances sous l'alias `DureeTotale` pour le gymnase qui totalise le plus grand temps d'occupation (somme des durées des séances).

<!-- expected-query: Q3
SELECT Gymnases.NomGymnase, SUM(Seances.Duree) AS DureeTotale FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase ORDER BY DureeTotale DESC LIMIT 1;
-->

**4. Identifier les sportifs cumulant les rôles de joueur, arbitre et entraîneur**

Affichez sans doublon l'identifiant (`IdSportif`), le nom (`Nom`) et le prénom (`Prenom`) des sportifs complets qui exercent simultanément les trois rôles dans le complexe : pratiquer au moins un sport, en entraîner au moins un et en arbitrer au moins un (pas nécessairement les mêmes disciplines).

<details>
<summary>💡 Indice</summary>

Le prédicat `WHERE EXISTS (SELECT 1 FROM ... WHERE ...)` permet de vérifier la présence dans chacune des trois tables d'activité sans risquer de démultiplier les lignes par des jointures.
</details>

<!-- expected-query: Q4
SELECT DISTINCT S.IdSportif, S.Nom, S.Prenom FROM Sportifs S WHERE EXISTS (SELECT 1 FROM Jouer WHERE IdSportif = S.IdSportif) AND EXISTS (SELECT 1 FROM Entrainer WHERE IdSportifEntraineur = S.IdSportif) AND EXISTS (SELECT 1 FROM Arbitrer WHERE IdSportif = S.IdSportif);
-->

**5. Détecter les disciplines sportives totalement inactives**

Affichez le numéro (`IdSport`) et le libellé (`Libelle`) des sports qui n'ont aucun pratiquant enregistré, aucun arbitre habilité et aucune séance d'entraînement programmée.

<!-- expected-query: Q5
SELECT Sports.IdSport, Sports.Libelle FROM Sports WHERE IdSport NOT IN (SELECT IdSport FROM Jouer) AND IdSport NOT IN (SELECT IdSport FROM Arbitrer) AND IdSport NOT IN (SELECT IdSport FROM Seances);
-->

**6. Détecter les homonymes parmi les sportifs**

Trouvez les sportifs partageant le même nom de famille : affichez le nom de famille (`Nom`), le prénom du premier sportif sous l'alias `Prenom1` et le prénom du second sous l'alias `Prenom2`. Veillez à ne pas associer un sportif avec lui-même et à éliminer les paires symétriques en imposant que l'identifiant du premier soit strictement inférieur à celui du second.

<!-- expected-query: Q6
SELECT S1.Nom, S1.Prenom AS Prenom1, S2.Prenom AS Prenom2 FROM Sportifs S1 JOIN Sportifs S2 ON S1.Nom = S2.Nom AND S1.IdSportif < S2.IdSportif;
-->

**7. Rechercher les gymnases ouverts le lundi et le mercredi mais fermés le mardi**

Affichez sans doublon le nom des gymnases (`NomGymnase`) qui accueillent au moins une séance le lundi ET au moins une séance le mercredi, mais aucune séance le mardi.

<details>
<summary>💡 Indice</summary>

Combinez deux jointures sur `Seances` pour exiger la présence simultanée de créneaux le lundi et le mercredi, puis une condition `WHERE ... NOT IN (SELECT IdGymnase FROM Seances WHERE Jour = 'Mardi')`.
</details>

<!-- expected-query: Q7
SELECT DISTINCT G.NomGymnase FROM Gymnases G JOIN Seances S1 ON G.IdGymnase = S1.IdGymnase AND S1.Jour = 'Lundi' JOIN Seances S2 ON G.IdGymnase = S2.IdGymnase AND S2.Jour = 'Mercredi' WHERE G.IdGymnase NOT IN (SELECT IdGymnase FROM Seances WHERE Jour = 'Mardi');
-->

**8. Associer les sportifs ayant exactement le même âge**

Affichez les binômes de sportifs du même âge : le nom du premier sous l'alias `Sportif1`, le nom du second sous l'alias `Sportif2` et leur âge commun (`Age`). Évitez les auto-associations et doublons symétriques en imposant que l'identifiant du premier soit strictement inférieur à celui du second, puis triez par âge croissant.

<!-- expected-query: Q8
SELECT S1.Nom AS Sportif1, S2.Nom AS Sportif2, S1.Age FROM Sportifs S1 JOIN Sportifs S2 ON S1.Age = S2.Age AND S1.IdSportif < S2.IdSportif ORDER BY S1.Age;
-->

**9. Mesurer le nombre de pratiquants potentiels par gymnase et par sport**

Pour chaque gymnase et chaque sport programmé dans ce gymnase, affichez le nom du gymnase (`NomGymnase`), le nom du sport sous l'alias `Sport` ainsi que le nombre d'adhérents distincts pratiquant ce sport sous l'alias `NbJoueurs`. Triez par nom de gymnase puis par nombre de joueurs décroissant.

<!-- expected-query: Q9
SELECT G.NomGymnase, S.Libelle AS Sport, COUNT(DISTINCT J.IdSportif) AS NbJoueurs FROM Gymnases G JOIN Seances Se ON G.IdGymnase = Se.IdGymnase JOIN Sports S ON Se.IdSport = S.IdSport JOIN Jouer J ON S.IdSport = J.IdSport GROUP BY G.IdGymnase, G.NomGymnase, S.IdSport, S.Libelle ORDER BY G.NomGymnase, NbJoueurs DESC;
-->

**10. Identifier les sportifs ne partageant aucun sport avec leur conseiller**

Pour tous les adhérents ayant un conseiller officiel, affichez le nom de l'adhérent sous l'alias `Sportif` et le nom de son conseiller sous l'alias `Conseiller`, pour les seuls cas où l'adhérent et son conseiller n'ont absolument aucun sport pratiqué en commun.

<details>
<summary>💡 Indice</summary>

Utilisez `WHERE NOT EXISTS` en liant la table `Jouer` de l'adhérent à la table `Jouer` du conseiller sur le même `IdSport`.
</details>

<!-- expected-query: Q10
SELECT S.Nom AS Sportif, Conseiller.Nom AS Conseiller FROM Sportifs S JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif WHERE NOT EXISTS (SELECT 1 FROM Jouer J1 JOIN Jouer J2 ON J1.IdSport = J2.IdSport WHERE J1.IdSportif = S.IdSportif AND J2.IdSportif = Conseiller.IdSportif);
-->

**11. Détecter les journées multi-sports par gymnase**

Affichez le nom du gymnase (`NomGymnase`), le jour (`Jour`) et le nombre de sports différents programmés sous l'alias `NbSportsDistincts`, pour tous les créneaux journaliers où un gymnase accueille au moins 3 disciplines distinctes.

<!-- expected-query: Q11
SELECT Gymnases.NomGymnase, Seances.Jour, COUNT(DISTINCT Seances.IdSport) AS NbSportsDistincts FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Seances.Jour HAVING COUNT(DISTINCT Seances.IdSport) >= 3;
-->

**12. Profil d'âge des disciplines à forte pratique**

Pour les sports comptant strictement plus de 5 pratiquants, affichez le libellé du sport (`Libelle`), la moyenne d'âge des pratiquants arrondie à 1 décimale sous l'alias `AgeMoyen`, ainsi que le nombre total de pratiquants sous l'alias `NbPratiquants`.

<!-- expected-query: Q12
SELECT Sports.Libelle, ROUND(AVG(Sportifs.Age), 1) AS AgeMoyen, COUNT(Jouer.IdSportif) AS NbPratiquants FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport JOIN Sportifs ON Jouer.IdSportif = Sportifs.IdSportif GROUP BY Sports.IdSport, Sports.Libelle HAVING COUNT(Jouer.IdSportif) > 5;
-->
