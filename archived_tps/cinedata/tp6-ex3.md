---
layout: base.njk
title: "Exercice 3 : Partie III - Requêtes très avancées"
intitule: "TP 6 — Révision & Entraînement Autonome (CineData)"
base: "CineData.sqlite"
tpNum: 6
exerciceNum: 3
titre: "Exercice 3 : Partie III - Requêtes très avancées"
permalink: "/tp6/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Partie III - Requêtes très avancées

## Questions (12 questions)

**1. Polyvalence des professionnels du cinéma**

Pour chaque personne de l'industrie, affichez son nom (`nom`), son prénom (`prenom`), le nombre de métiers distincts exercés sous l'alias `NbMetiers` et le total de films associés sous l'alias `TotalFilms`. Ne retenez que les professionnels polyvalents ayant exercé au moins 2 métiers différents.

<!-- expected-query: Q1
SELECT P.nom, P.prenom, COUNT(DISTINCT C.metier) AS NbMetiers, COUNT(C.id_film) AS TotalFilms FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne GROUP BY P.id_personne, P.nom, P.prenom HAVING COUNT(DISTINCT C.metier) > 1 ORDER BY NbMetiers DESC, TotalFilms DESC;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT P.nom, P.prenom, COUNT(DISTINCT C.metier) AS NbMetiers, COUNT(C.id_film) AS TotalFilms
FROM PERSONNES P
JOIN CASTINGS C ON P.id_personne = C.id_personne
GROUP BY P.id_personne, P.nom, P.prenom
HAVING COUNT(DISTINCT C.metier) > 1
ORDER BY NbMetiers DESC, TotalFilms DESC;
```
</details>


**2. Cinéphiles ayant noté un film dont leur propre parrain a rédigé la critique**

Identifiez les partages cinéphiles : affichez sans doublon le pseudo du filleul sous l'alias `Filleul`, le pseudo de son parrain sous l'alias `Parrain` et le titre du film (`titre`), pour chaque cas où le parrain et son filleul ont tous les deux rédigé un avis sur la même œuvre.

<!-- expected-query: Q2
SELECT DISTINCT Filleul.pseudo AS Filleul, Parrain.pseudo AS Parrain, F.titre FROM CINEPHILES Filleul JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile JOIN AVIS A1 ON Filleul.id_cinephile = A1.id_cinephile JOIN AVIS A2 ON Parrain.id_cinephile = A2.id_cinephile AND A1.id_film = A2.id_film JOIN FILMS F ON A1.id_film = F.id_film;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT Filleul.pseudo AS Filleul, Parrain.pseudo AS Parrain, F.titre
FROM CINEPHILES Filleul
JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile
JOIN AVIS A1 ON Filleul.id_cinephile = A1.id_cinephile
JOIN AVIS A2 ON Parrain.id_cinephile = A2.id_cinephile AND A1.id_film = A2.id_film
JOIN FILMS F ON A1.id_film = F.id_film;
```

*💡 Remarque : L'auto-jointure croisée relie le filleul et son parrain sur un même id_film noté par chacun.*
</details>




**3. Identifier le réalisateur au box-office cumulé le plus colossal**

Affichez le nom (`nom`), le prénom (`prenom`) et le total des recettes mondiales générées sous l'alias `BoxOfficeTotal` pour le cinéaste le plus rémunérateur de la base.

<!-- expected-query: Q3
SELECT P.nom, P.prenom, SUM(F.recettes) AS BoxOfficeTotal FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN FILMS F ON C.id_film = F.id_film GROUP BY P.id_personne, P.nom, P.prenom ORDER BY BoxOfficeTotal DESC LIMIT 1;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT P.nom, P.prenom, SUM(F.recettes) AS BoxOfficeTotal
FROM PERSONNES P
JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur'
JOIN FILMS F ON C.id_film = F.id_film
GROUP BY P.id_personne, P.nom, P.prenom
ORDER BY BoxOfficeTotal DESC
LIMIT 1;
```
</details>


**4. Artistes cumulant la triple couronne : Acteur, Réalisateur et Producteur**

Affichez sans doublon l'identifiant (`id_personne`), le nom (`nom`) et le prénom (`prenom`) des artistes complets ayant exercé les trois fonctions majeures sur la base : acteur, réalisateur et producteur.

<details>
<summary>💡 Indice</summary>

Utilisez trois clauses `WHERE EXISTS (SELECT 1 FROM CASTINGS WHERE ...)` pour tester chaque métier séparément.
</details>

<!-- expected-query: Q4
SELECT P.id_personne, P.nom, P.prenom FROM PERSONNES P WHERE EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Realisateur') AND EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Acteur') AND EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Producteur');
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT P.id_personne, P.nom, P.prenom
FROM PERSONNES P
WHERE EXISTS (SELECT 1
FROM CASTINGS
WHERE id_personne = P.id_personne AND metier = 'Realisateur') AND EXISTS (SELECT 1
FROM CASTINGS
WHERE id_personne = P.id_personne AND metier = 'Acteur') AND EXISTS (SELECT 1
FROM CASTINGS
WHERE id_personne = P.id_personne AND metier = 'Producteur');
```

*💡 Remarque : Trois clauses WHERE EXISTS indépendantes évitent les jointures multiples qui démultiplieraient inutilement les lignes.*
</details>




**5. Genres sans aucun film ayant dépassé les 100 millions de recettes**

Affichez l'identifiant (`id_genre`) et le nom (`nom_genre`) des genres cinématographiques pour lesquels aucun film n'a atteint 100 millions de dollars de recettes.

<!-- expected-query: Q5
SELECT G.id_genre, G.nom_genre FROM GENRES G WHERE G.id_genre NOT IN (SELECT FG.id_genre FROM FILM_GENRES FG JOIN FILMS F ON FG.id_film = F.id_film WHERE F.recettes >= 100000000);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT G.id_genre, G.nom_genre
FROM GENRES G
WHERE G.id_genre NOT IN (SELECT FG.id_genre
FROM FILM_GENRES FG
JOIN FILMS F ON FG.id_film = F.id_film
WHERE F.recettes >= 100000000);
```
</details>


**6. Binômes d'acteurs ayant partagé l'affiche d'au moins 2 films différents**

Trouvez les duos d'acteurs récurrents : affichez le nom du premier sous l'alias `Acteur1`, le nom du second sous l'alias `Acteur2` et le nombre de collaborations sous l'alias `FilmsEnCommun`, pour tous les binômes ayant joué ensemble dans au moins 2 longs-métrages (`C1.id_personne < C2.id_personne`).

<!-- expected-query: Q6
SELECT P1.nom AS Acteur1, P2.nom AS Acteur2, COUNT(DISTINCT C1.id_film) AS FilmsEnCommun FROM CASTINGS C1 JOIN CASTINGS C2 ON C1.id_film = C2.id_film AND C1.id_personne < C2.id_personne AND C1.metier = 'Acteur' AND C2.metier = 'Acteur' JOIN PERSONNES P1 ON C1.id_personne = P1.id_personne JOIN PERSONNES P2 ON C2.id_personne = P2.id_personne GROUP BY P1.id_personne, P2.id_personne, P1.nom, P2.nom HAVING COUNT(DISTINCT C1.id_film) >= 2;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT P1.nom AS Acteur1, P2.nom AS Acteur2, COUNT(DISTINCT C1.id_film) AS FilmsEnCommun
FROM CASTINGS C1
JOIN CASTINGS C2 ON C1.id_film = C2.id_film AND C1.id_personne < C2.id_personne AND C1.metier = 'Acteur' AND C2.metier = 'Acteur'
JOIN PERSONNES P1 ON C1.id_personne = P1.id_personne
JOIN PERSONNES P2 ON C2.id_personne = P2.id_personne
GROUP BY P1.id_personne, P2.id_personne, P1.nom, P2.nom
HAVING COUNT(DISTINCT C1.id_film) >= 2;
```

*💡 Remarque : La condition C1.id_personne < C2.id_personne évite les doublons inversés (A-B et B-A) et élimine les auto-associations (A-A).*
</details>




**7. Films ayant généré des avis en salle mais aucun avis en streaming**

Affichez sans doublon le titre des films (`titre`) qui ont été vus et notés en salle de cinéma (`vu_au_cinema = 1`) mais pour lesquels aucun avis en streaming (`vu_au_cinema = 0`) n'a été publié.

<!-- expected-query: Q7
SELECT DISTINCT F.titre FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film WHERE A.vu_au_cinema = 1 AND F.id_film NOT IN (SELECT id_film FROM AVIS WHERE vu_au_cinema = 0);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT F.titre
FROM FILMS F
JOIN AVIS A ON F.id_film = A.id_film
WHERE A.vu_au_cinema = 1 AND F.id_film NOT IN (SELECT id_film
FROM AVIS
WHERE vu_au_cinema = 0);
```

*💡 Remarque : NOT EXISTS garantit l'absence totale d'avis en streaming pour les films retenus.*
</details>




**8. Binômes de films sortis exactement à la même date**

Affichez les binômes d'œuvres ayant partagé la même date de sortie en salles : le titre du premier film sous l'alias `Film1`, le titre du second sous l'alias `Film2` et leur date commune (`date_sortie`). Évitez les doublons symétriques avec `F1.id_film < F2.id_film` et triez par date.

<!-- expected-query: Q8
SELECT F1.titre AS Film1, F2.titre AS Film2, F1.date_sortie FROM FILMS F1 JOIN FILMS F2 ON F1.date_sortie = F2.date_sortie AND F1.id_film < F2.id_film ORDER BY F1.date_sortie;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT F1.titre AS Film1, F2.titre AS Film2, F1.date_sortie
FROM FILMS F1
JOIN FILMS F2 ON F1.date_sortie = F2.date_sortie AND F1.id_film < F2.id_film
ORDER BY F1.date_sortie;
```
</details>


**9. Comparatif des notes attribuées selon le canal (Cinéma vs Streaming)**

Affichez le type de diffusion sous l'alias `Canal` ('En Salle' ou 'Streaming / VOD'), le nombre total d'avis sous l'alias `NbAvis` et la note moyenne décernée arrondie à 2 décimales sous l'alias `NoteMoyenne`.

<!-- expected-query: Q9
SELECT CASE WHEN vu_au_cinema = 1 THEN 'En Salle' ELSE 'Streaming / VOD' END AS Canal, COUNT(*) AS NbAvis, ROUND(AVG(note_attribuee), 2) AS NoteMoyenne FROM AVIS GROUP BY vu_au_cinema;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT CASE WHEN vu_au_cinema = 1 THEN 'En Salle' ELSE 'Streaming / VOD' END AS Canal, COUNT(*) AS NbAvis, ROUND(AVG(note_attribuee), 2) AS NoteMoyenne
FROM AVIS
GROUP BY vu_au_cinema;
```
</details>


**10. Cinéphiles n'ayant vu aucun film en commun avec leur parrain**

Pour tous les membres parrainés, affichez le pseudo du filleul sous l'alias `Cinephile` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le cinéphile et son parrain n'ont absolument aucun film en commun dans leurs avis respectifs.

<!-- expected-query: Q10
SELECT C.pseudo AS Cinephile, P.pseudo AS Parrain FROM CINEPHILES C JOIN CINEPHILES P ON C.id_parrain = P.id_cinephile WHERE NOT EXISTS (SELECT 1 FROM AVIS A1 JOIN AVIS A2 ON A1.id_film = A2.id_film WHERE A1.id_cinephile = C.id_cinephile AND A2.id_cinephile = P.id_cinephile);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT C.pseudo AS Cinephile, P.pseudo AS Parrain
FROM CINEPHILES C
JOIN CINEPHILES P ON C.id_parrain = P.id_cinephile
WHERE NOT EXISTS (SELECT 1
FROM AVIS A1
JOIN AVIS A2 ON A1.id_film = A2.id_film
WHERE A1.id_cinephile = C.id_cinephile AND A2.id_cinephile = P.id_cinephile);
```

*💡 Remarque : NOT EXISTS vérifie qu'aucun film noté par le filleul ne figure parmi les films notés par son parrain.*
</details>




**11. Mois records : mois ayant enregistré la sortie d'au moins 3 blockbusters**

Affichez l'année et le mois de sortie sous l'alias `AnneeMois` (`strftime('%Y-%m', date_sortie)`) et le nombre d'œuvres majeures sous l'alias `NbFilmsSucces`, pour tous les mois civils où sont sortis au moins 3 films ayant généré 100 millions de recettes ou plus.

<!-- expected-query: Q11
SELECT strftime('%Y-%m', date_sortie) AS AnneeMois, COUNT(*) AS NbFilmsSucces FROM FILMS WHERE recettes >= 100000000 GROUP BY AnneeMois HAVING COUNT(*) >= 3;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT strftime('%Y-%m', date_sortie) AS AnneeMois, COUNT(*) AS NbFilmsSucces
FROM FILMS
WHERE recettes >= 100000000
GROUP BY AnneeMois
HAVING COUNT(*) >= 3;
```
</details>


**12. Division relationnelle : Cinéphiles ayant vu tous les films d'un réalisateur donné**

Problème de division relationnelle : affichez l'identifiant (`id_cinephile`) et le pseudo (`pseudo`) des cinéphiles qui ont vu et noté l'intégralité des films réalisés par le cinéaste d'identifiant 1 (`id_personne = 1`).

<details>
<summary>💡 Indice</summary>

Dans la clause `HAVING`, comparez le nombre de films distincts notés avec le total de films dirigés par cette personne via `(SELECT COUNT(DISTINCT id_film) FROM CASTINGS WHERE id_personne = 1 AND metier = 'Realisateur')`.
</details>

<!-- expected-query: Q12
SELECT C.id_cinephile, C.pseudo FROM CINEPHILES C JOIN AVIS A ON C.id_cinephile = A.id_cinephile JOIN FILMS F ON A.id_film = F.id_film JOIN CASTINGS Ct ON F.id_film = Ct.id_film AND Ct.metier = 'Realisateur' WHERE Ct.id_personne = 1 GROUP BY C.id_cinephile, C.pseudo HAVING COUNT(DISTINCT F.id_film) = (SELECT COUNT(DISTINCT id_film) FROM CASTINGS WHERE id_personne = 1 AND metier = 'Realisateur');
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT C.id_cinephile, C.pseudo
FROM CINEPHILES C
JOIN AVIS A ON C.id_cinephile = A.id_cinephile
JOIN FILMS F ON A.id_film = F.id_film
JOIN CASTINGS Ct ON F.id_film = Ct.id_film AND Ct.metier = 'Realisateur'
WHERE Ct.id_personne = 1
GROUP BY C.id_cinephile, C.pseudo
HAVING COUNT(DISTINCT F.id_film) = (SELECT COUNT(DISTINCT id_film)
FROM CASTINGS
WHERE id_personne = 1 AND metier = 'Realisateur');
```

*💡 Remarque : Division relationnelle : on compare dans le HAVING le nombre de films distincts notés avec le total réalisé par cette personne.*
</details>




