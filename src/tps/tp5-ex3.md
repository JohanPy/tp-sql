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

**1. Créer un classement des sportifs par polyvalence (nombre total de rôles/activités)**

Affichez le nom du sportif et le nombre total d'activités (joueur + entraîneur + arbitre, avec les doublons).

<!-- expected-query: Q1
SELECT S.Nom, S.Prenom, (SELECT COUNT(*) FROM Jouer J WHERE J.IdSportif = S.IdSportif) + (SELECT COUNT(*) FROM Entrainer E WHERE E.IdSportifEntraineur = S.IdSportif) + (SELECT COUNT(*) FROM Arbitrer A WHERE A.IdSportif = S.IdSportif) AS TotalActivites FROM Sportifs S ORDER BY TotalActivites DESC;
-->

**2. Trouver les sportifs qui jouent un sport arbitré par leur propre conseiller**

Combinez les informations de jeu, de conseil et d'arbitrage.

<!-- expected-query: Q2
SELECT DISTINCT S.Nom AS Sportif, Conseiller.Nom AS Conseiller, Sports.Libelle AS Sport FROM Sportifs S JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif JOIN Jouer ON S.IdSportif = Jouer.IdSportif JOIN Arbitrer ON Conseiller.IdSportif = Arbitrer.IdSportif AND Jouer.IdSport = Arbitrer.IdSport JOIN Sports ON Jouer.IdSport = Sports.IdSport;
-->

**3. Quel est le gymnase le plus occupé ? (Somme des durées des séances la plus élevée)**

Affichez le nom du gymnase et la durée totale.

<details>
<summary>💡 Indice</summary>
Utilisez un tri et une limite pour trouver le maximum.
</details>

<!-- expected-query: Q3
SELECT Gymnases.NomGymnase, SUM(Seances.Duree) AS DureeTotale FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase ORDER BY DureeTotale DESC LIMIT 1;
-->

**4. Identifier les "Super-Sportifs" : à la fois Joueur, Arbitre et Entraîneur**

Peu importe le sport, ils doivent avoir les trois rôles.

<!-- expected-query: Q4
SELECT DISTINCT S.IdSportif, S.Nom, S.Prenom FROM Sportifs S WHERE EXISTS (SELECT 1 FROM Jouer WHERE IdSportif = S.IdSportif) AND EXISTS (SELECT 1 FROM Entrainer WHERE IdSportifEntraineur = S.IdSportif) AND EXISTS (SELECT 1 FROM Arbitrer WHERE IdSportif = S.IdSportif);
-->

**5. Identifier les sports "fantômes" : pas de joueurs, pas d'arbitres, pas de séances**

Trouvez les sports qui existent dans la base mais ne sont utilisés nulle part.

<!-- expected-query: Q5
SELECT Sports.IdSport, Sports.Libelle FROM Sports WHERE IdSport NOT IN (SELECT IdSport FROM Jouer) AND IdSport NOT IN (SELECT IdSport FROM Arbitrer) AND IdSport NOT IN (SELECT IdSport FROM Seances);
-->

**6. Trouver les sportifs ayant le même nom de famille mais des prénoms différents**

Détectez les potentielles familles de sportifs.

<!-- expected-query: Q6
SELECT S1.Nom, S1.Prenom AS Prenom1, S2.Prenom AS Prenom2 FROM Sportifs S1 JOIN Sportifs S2 ON S1.Nom = S2.Nom AND S1.IdSportif < S2.IdSportif;
-->

**7. Trouver les gymnases qui ont des séances le Lundi et le Mercredi, mais PAS le Mardi**

Analysez les "trous" dans l'emploi du temps des gymnases.

<!-- expected-query: Q7
SELECT DISTINCT G.NomGymnase FROM Gymnases G JOIN Seances S1 ON G.IdGymnase = S1.IdGymnase AND S1.Jour = 'Lundi' JOIN Seances S2 ON G.IdGymnase = S2.IdGymnase AND S2.Jour = 'Mercredi' WHERE G.IdGymnase NOT IN (SELECT IdGymnase FROM Seances WHERE Jour = 'Mardi');
-->

**8. Trouver les paires de sportifs du même âge**

Affichez les deux noms et l'âge.

<details>
<summary>💡 Indice</summary>
Utilisez une auto-jointure avec une condition d'inégalité sur les IDs pour éviter les doublons (A-B et B-A).
</details>

<!-- expected-query: Q8
SELECT S1.Nom AS Sportif1, S2.Nom AS Sportif2, S1.Age FROM Sportifs S1 JOIN Sportifs S2 ON S1.Age = S2.Age AND S1.IdSportif < S2.IdSportif ORDER BY S1.Age;
-->

**9. Le sport le plus pratiqué (en nombre de joueurs) pour chaque gymnase**

Affichez le gymnase, le sport et le nombre de joueurs.

<!-- expected-query: Q9
SELECT G.NomGymnase, S.Libelle AS Sport, COUNT(DISTINCT J.IdSportif) AS NbJoueurs FROM Gymnases G JOIN Seances Se ON G.IdGymnase = Se.IdGymnase JOIN Sports S ON Se.IdSport = S.IdSport JOIN Jouer J ON S.IdSport = J.IdSport GROUP BY G.IdGymnase, G.NomGymnase, S.IdSport, S.Libelle ORDER BY G.NomGymnase, NbJoueurs DESC;
-->

**10. Les sportifs qui ont un conseiller, mais qui ne pratiquent aucun des sports de ce conseiller**

Affichez le nom du sportif et le nom du conseiller.

<!-- expected-query: Q10
SELECT S.Nom AS Sportif, Conseiller.Nom AS Conseiller FROM Sportifs S JOIN Sportifs Conseiller ON S.IdSportifConseiller = Conseiller.IdSportif WHERE NOT EXISTS (SELECT 1 FROM Jouer J1 JOIN Jouer J2 ON J1.IdSport = J2.IdSport WHERE J1.IdSportif = S.IdSportif AND J2.IdSportif = Conseiller.IdSportif);
-->

**11. Les gymnases qui accueillent au moins 3 sports différents le même jour**

Affichez le gymnase et le jour concerné.

<!-- expected-query: Q11
SELECT Gymnases.NomGymnase, Seances.Jour, COUNT(DISTINCT Seances.IdSport) AS NbSportsDistincts FROM Gymnases JOIN Seances ON Gymnases.IdGymnase = Seances.IdGymnase GROUP BY Gymnases.IdGymnase, Gymnases.NomGymnase, Seances.Jour HAVING COUNT(DISTINCT Seances.IdSport) >= 3;
-->

**12. Moyenne d'âge des sportifs par sport, uniquement pour les sports ayant plus de 5 pratiquants**

Affichez le sport et la moyenne d'âge.

<!-- expected-query: Q12
SELECT Sports.Libelle, ROUND(AVG(Sportifs.Age), 1) AS AgeMoyen, COUNT(Jouer.IdSportif) AS NbPratiquants FROM Sports JOIN Jouer ON Sports.IdSport = Jouer.IdSport JOIN Sportifs ON Jouer.IdSportif = Sportifs.IdSportif GROUP BY Sports.IdSport, Sports.Libelle HAVING COUNT(Jouer.IdSportif) > 5;
-->
