---
layout: base.njk
title: "Exercice 4 : Bonus - Défis complexes"
intitule: "TP 6 — Révision & Entraînement Autonome (CineData)"
base: "CineData.sqlite"
tpNum: 6
exerciceNum: 4
titre: "Exercice 4 : Bonus - Défis complexes"
permalink: "/tp6/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Défis complexes

## Questions (8 questions)

**1. Cinéphiles cumulant les 4 statuts clés**

Trouvez les cinéphiles les plus actifs qui cumulent à la fois : avoir vu au moins un film en salle, avoir vu au moins un film en streaming, avoir attribué au moins une note parfaite de 5.0, et être le parrain d'au moins un autre membre. Affichez leur identifiant (`id_cinephile`) et leur pseudo (`pseudo`).

<!-- expected-query: Q1
SELECT id_cinephile, pseudo FROM CINEPHILES WHERE id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE vu_au_cinema = 1) AND id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE vu_au_cinema = 0) AND id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE note_attribuee = 5.0) AND id_cinephile IN (SELECT DISTINCT id_parrain FROM CINEPHILES WHERE id_parrain IS NOT NULL);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT id_cinephile, pseudo
FROM CINEPHILES
WHERE id_cinephile IN (SELECT id_cinephile
FROM AVIS
WHERE vu_au_cinema = 1) AND id_cinephile IN (SELECT id_cinephile
FROM AVIS
WHERE vu_au_cinema = 0) AND id_cinephile IN (SELECT id_cinephile
FROM AVIS
WHERE note_attribuee = 5.0) AND id_cinephile IN (SELECT DISTINCT id_parrain
FROM CINEPHILES
WHERE id_parrain IS NOT NULL);
```
</details>


**2. Conflit d'horaire physique : même cinéphile noté à 2 séances en salle à la même heure**

Détectez les incohérences ou fraudes de réservation : identifiez les cinéphiles enregistrés sur deux séances en salle (`vu_au_cinema = 1`) distinctes ayant lieu exactement à la même date et à la même heure. Affichez l'identifiant du membre (`id_cinephile`), son pseudo (`pseudo`), la date (`date_seance`), l'horaire (`heure_seance`), le titre du premier film sous l'alias `Film1` et du second sous l'alias `Film2` (`A1.id_film < A2.id_film`).

<!-- expected-query: Q2
SELECT A1.id_cinephile, C.pseudo, A1.date_seance, A1.heure_seance, F1.titre AS Film1, F2.titre AS Film2 FROM AVIS A1 JOIN AVIS A2 ON A1.id_cinephile = A2.id_cinephile AND A1.date_seance = A2.date_seance AND A1.heure_seance = A2.heure_seance AND A1.id_film < A2.id_film AND A1.vu_au_cinema = 1 AND A2.vu_au_cinema = 1 JOIN CINEPHILES C ON A1.id_cinephile = C.id_cinephile JOIN FILMS F1 ON A1.id_film = F1.id_film JOIN FILMS F2 ON A2.id_film = F2.id_film;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT A1.id_cinephile, C.pseudo, A1.date_seance, A1.heure_seance, F1.titre AS Film1, F2.titre AS Film2
FROM AVIS A1
JOIN AVIS A2 ON A1.id_cinephile = A2.id_cinephile AND A1.date_seance = A2.date_seance AND A1.heure_seance = A2.heure_seance AND A1.id_film < A2.id_film AND A1.vu_au_cinema = 1 AND A2.vu_au_cinema = 1
JOIN CINEPHILES C ON A1.id_cinephile = C.id_cinephile
JOIN FILMS F1 ON A1.id_film = F1.id_film
JOIN FILMS F2 ON A2.id_film = F2.id_film;
```

*💡 Remarque : L'auto-jointure sur id_cinephile, date_seance et heure_seance détecte les séances simultanées pour un même utilisateur.*
</details>




**3. Reconstituer la chaîne de parrainage cinéphile à trois niveaux**

Identifiez les lignées de mentorat cinéphile à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le pseudo du parrain initial sous l'alias `GrandParrain`, celui du parrain intermédiaire sous l'alias `Parrain`, et celui du protégé final sous l'alias `Filleul`.

<!-- expected-query: Q3
SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM CINEPHILES F JOIN CINEPHILES P ON F.id_parrain = P.id_cinephile JOIN CINEPHILES GP ON P.id_parrain = GP.id_cinephile;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul
FROM CINEPHILES F
JOIN CINEPHILES P ON F.id_parrain = P.id_cinephile
JOIN CINEPHILES GP ON P.id_parrain = GP.id_cinephile;
```

*💡 Remarque : Double auto-jointure sur CINEPHILES pour relier Filleul -> Parrain -> Grand-Parrain.*
</details>




**4. Calculer le délai moyen entre la sortie d'un film et son visionnage**

Pour chaque film ayant reçu des avis postérieurs à sa date de sortie, calculez le délai moyen en jours écoulé avant la projection (`date_seance - date_sortie`), arrondi à 1 décimale sous l'alias `DelaiMoyenJours`. Affichez le titre du film (`titre`) et sa date de sortie (`date_sortie`).

<!-- expected-query: Q4
SELECT F.titre, F.date_sortie, ROUND(AVG(CAST(JULIANDAY(A.date_seance) - JULIANDAY(F.date_sortie) AS INT)), 1) AS DelaiMoyenJours FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film WHERE A.date_seance >= F.date_sortie GROUP BY F.id_film, F.titre, F.date_sortie;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT F.titre, F.date_sortie, ROUND(AVG(CAST(JULIANDAY(A.date_seance) - JULIANDAY(F.date_sortie) AS INT)), 1) AS DelaiMoyenJours
FROM FILMS F
JOIN AVIS A ON F.id_film = A.id_film
WHERE A.date_seance >= F.date_sortie
GROUP BY F.id_film, F.titre, F.date_sortie;
```

*💡 Remarque : julianday(d2) - julianday(d1) calcule l'écart exact en nombre de jours entre deux dates.*
</details>




**5. Rendement financier par minute de film**

Pour chaque long-métrage dont le budget et les recettes sont strictement positifs, calculez la recette brute générée par minute de projection (`recettes / duree_minutes`), arrondie à l'entier le plus proche sous l'alias `RecettesParMinute`. Affichez le titre (`titre`), les recettes, la durée et triez par rendement décroissant.

<!-- expected-query: Q5
SELECT titre, recettes, duree_minutes, ROUND(recettes / CAST(duree_minutes AS FLOAT), 0) AS RecettesParMinute FROM FILMS WHERE duree_minutes > 0 AND recettes > 0 ORDER BY RecettesParMinute DESC;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT titre, recettes, duree_minutes, ROUND(recettes / CAST(duree_minutes AS FLOAT), 0) AS RecettesParMinute
FROM FILMS
WHERE duree_minutes > 0 AND recettes > 0
ORDER BY RecettesParMinute DESC;
```
</details>


**6. Films vus uniquement par des parrains et jamais par aucun filleul**

Identifiez les films appréciés par les anciens mais boudés par leurs protégés : affichez sans doublon le titre des films (`titre`) vus par au moins un membre ayant le statut de parrain, mais n'ayant été visionnés par absolument aucun membre parrainé.

<!-- expected-query: Q6
SELECT DISTINCT F.titre FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film JOIN CINEPHILES P ON A.id_cinephile = P.id_cinephile WHERE P.id_cinephile IN (SELECT DISTINCT id_parrain FROM CINEPHILES WHERE id_parrain IS NOT NULL) AND F.id_film NOT IN (SELECT A2.id_film FROM AVIS A2 JOIN CINEPHILES Filleul ON A2.id_cinephile = Filleul.id_cinephile WHERE Filleul.id_parrain IS NOT NULL);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT F.titre
FROM FILMS F
JOIN AVIS A ON F.id_film = A.id_film
JOIN CINEPHILES P ON A.id_cinephile = P.id_cinephile
WHERE P.id_cinephile IN (SELECT DISTINCT id_parrain
FROM CINEPHILES
WHERE id_parrain IS NOT NULL) AND F.id_film NOT IN (SELECT A2.id_film
FROM AVIS A2
JOIN CINEPHILES Filleul ON A2.id_cinephile = Filleul.id_cinephile
WHERE Filleul.id_parrain IS NOT NULL);
```
</details>


**7. Réalisateurs dont tous les films répertoriés sont hautement rentables**

Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de films sous l'alias `NbFilms` pour les réalisateurs ayant dirigé au moins 2 films dans la base et dont chaque film a généré des recettes au moins deux fois supérieures à son budget (`recettes >= 2 * budget`).

<!-- expected-query: Q7
SELECT P.nom, P.prenom, COUNT(F.id_film) AS NbFilms FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN FILMS F ON C.id_film = F.id_film WHERE F.budget > 0 GROUP BY P.id_personne, P.nom, P.prenom HAVING MIN(CAST(F.recettes AS FLOAT) / F.budget) >= 2.0 AND COUNT(F.id_film) >= 2;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT P.nom, P.prenom, COUNT(F.id_film) AS NbFilms
FROM PERSONNES P
JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur'
JOIN FILMS F ON C.id_film = F.id_film
WHERE F.budget > 0
GROUP BY P.id_personne, P.nom, P.prenom
HAVING MIN(CAST(F.recettes AS FLOAT) / F.budget) >= 2.0 AND COUNT(F.id_film) >= 2;
```

*💡 Remarque : La condition HAVING MIN(...) >= 2.0 garantit que chaque film réalisé atteint au moins le seuil de rentabilité fixé.*
</details>




**8. Genres sous la responsabilité d'un seul réalisateur répertorié**

Affichez le libellé du genre (`nom_genre`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls genres cinématographiques dont l'intégralité des films répertoriés dans la base a été dirigée par un seul et même cinéaste.

<!-- expected-query: Q8
SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM GENRES G JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Realisateur' GROUP BY G.id_genre, G.nom_genre HAVING COUNT(DISTINCT C.id_personne) = 1;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbRealisateurs
FROM GENRES G
JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre
JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Realisateur'
GROUP BY G.id_genre, G.nom_genre
HAVING COUNT(DISTINCT C.id_personne) = 1;
```

*💡 Remarque : HAVING COUNT(DISTINCT ...) = 1 isole les genres dont l'ensemble des films a été confié à un seul et même réalisateur.*
</details>




