---
layout: base.njk
title: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
intitule: "TP 6 — Révision & Entraînement Autonome (CineData)"
base: "CineData.sqlite"
tpNum: 6
exerciceNum: 1
titre: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
permalink: "/tp6/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Partie I - Requêtes de base et jointures simples

## Questions (15 questions)

**1. Lister tous les films disponibles**

À partir de la table `FILMS`, affichez l'identifiant (`id_film`), le titre (`titre`), la date de sortie (`date_sortie`) et la durée en minutes (`duree_minutes`).

<!-- expected-query: Q1
SELECT id_film, titre, date_sortie, duree_minutes FROM FILMS;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT id_film, titre, date_sortie, duree_minutes
FROM FILMS;
```
</details>


**2. Lister les genres cinématographiques**

À partir de la table `GENRES`, affichez l'identifiant (`id_genre`) et l'intitulé du genre (`nom_genre`).

<!-- expected-query: Q2
SELECT id_genre, nom_genre FROM GENRES;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT id_genre, nom_genre
FROM GENRES;
```
</details>


**3. Films d'une durée supérieure à 150 minutes**

Affichez le titre (`titre`), la durée (`duree_minutes`) et les recettes mondiales (`recettes`) des films d'une durée strictement supérieure à 150 minutes (2h30).

<!-- expected-query: Q3
SELECT titre, duree_minutes, recettes FROM FILMS WHERE duree_minutes > 150;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT titre, duree_minutes, recettes
FROM FILMS
WHERE duree_minutes > 150;
```
</details>


**4. Croiser chaque film avec ses genres**

Pour chaque film, affichez son titre (`titre`) et le libellé du genre associé sous l'alias `Genre`.

<!-- expected-query: Q4
SELECT FILMS.titre, GENRES.nom_genre AS Genre FROM FILMS JOIN FILM_GENRES ON FILMS.id_film = FILM_GENRES.id_film JOIN GENRES ON FILM_GENRES.id_genre = GENRES.id_genre;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT FILMS.titre, GENRES.nom_genre AS Genre
FROM FILMS
JOIN FILM_GENRES ON FILMS.id_film = FILM_GENRES.id_film
JOIN GENRES ON FILM_GENRES.id_genre = GENRES.id_genre;
```
</details>


**5. Identifier les réalisateurs et leurs films**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des cinéastes et le titre du film dirigé sous l'alias `TitreFilm` (`metier = 'Realisateur'`).

<!-- expected-query: Q5
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, FILMS.titre AS TitreFilm FROM PERSONNES JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne JOIN FILMS ON CASTINGS.id_film = FILMS.id_film WHERE CASTINGS.metier = 'Realisateur';
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, FILMS.titre AS TitreFilm
FROM PERSONNES
JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne
JOIN FILMS ON CASTINGS.id_film = FILMS.id_film
WHERE CASTINGS.metier = 'Realisateur';
```
</details>


**6. Lister les acteurs tenant le rôle principal d'affiche**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) de l'acteur, le nom du personnage sous l'alias `Personnage` (`personnage`) et le titre du film (`titre`) pour les comédiens figurant en tête d'affiche (`metier = 'Acteur'` et `ordre_importance = 1`).

<!-- expected-query: Q6
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CASTINGS.personnage AS Personnage, FILMS.titre FROM PERSONNES JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne JOIN FILMS ON CASTINGS.id_film = FILMS.id_film WHERE CASTINGS.metier = 'Acteur' AND CASTINGS.ordre_importance = 1;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CASTINGS.personnage AS Personnage, FILMS.titre
FROM PERSONNES
JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne
JOIN FILMS ON CASTINGS.id_film = FILMS.id_film
WHERE CASTINGS.metier = 'Acteur' AND CASTINGS.ordre_importance = 1;
```
</details>


**7. Consulter les avis rédigés par un cinéphile donné**

Pour le cinéphile ayant l'identifiant 1 (`id_cinephile = 1`), affichez le titre du film (`titre`), la note attribuée (`note_attribuee`), le canal en salle (`vu_au_cinema`) et la date de la séance (`date_seance`).

<!-- expected-query: Q7
SELECT FILMS.titre, AVIS.note_attribuee, AVIS.vu_au_cinema, AVIS.date_seance FROM AVIS JOIN FILMS ON AVIS.id_film = FILMS.id_film WHERE AVIS.id_cinephile = 1;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT FILMS.titre, AVIS.note_attribuee, AVIS.vu_au_cinema, AVIS.date_seance
FROM AVIS
JOIN FILMS ON AVIS.id_film = FILMS.id_film
WHERE AVIS.id_cinephile = 1;
```
</details>


**8. Croiser les cinéphiles et les films vus en salle de cinéma**

Pour chaque projection vue en salle (`vu_au_cinema = 1`), affichez sans doublon le pseudo du spectateur (`pseudo`), le titre du film (`titre`) et la date de la séance (`date_seance`).

<!-- expected-query: Q8
SELECT DISTINCT CINEPHILES.pseudo, FILMS.titre, AVIS.date_seance FROM CINEPHILES JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile JOIN FILMS ON AVIS.id_film = FILMS.id_film WHERE AVIS.vu_au_cinema = 1;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT CINEPHILES.pseudo, FILMS.titre, AVIS.date_seance
FROM CINEPHILES
JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile
JOIN FILMS ON AVIS.id_film = FILMS.id_film
WHERE AVIS.vu_au_cinema = 1;
```
</details>


**9. Compter le nombre de films par genre**

Pour chaque genre, affichez son intitulé (`nom_genre`) et le nombre total de films associés sous l'alias `NbFilms`. Tous les genres doivent figurer dans le résultat (en affichant 0 pour les genres sans film répertorié).

<!-- expected-query: Q9
SELECT GENRES.nom_genre, COUNT(FILM_GENRES.id_film) AS NbFilms FROM GENRES LEFT JOIN FILM_GENRES ON GENRES.id_genre = FILM_GENRES.id_genre GROUP BY GENRES.id_genre, GENRES.nom_genre;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT GENRES.nom_genre, COUNT(FILM_GENRES.id_film) AS NbFilms
FROM GENRES
LEFT JOIN FILM_GENRES ON GENRES.id_genre = FILM_GENRES.id_genre
GROUP BY GENRES.id_genre, GENRES.nom_genre;
```
</details>


**10. Identifier les cinéphiles prolifiques**

Affichez le pseudo (`pseudo`) et le nombre total de critiques rédigées sous l'alias `NbAvis` pour les membres ayant enregistré strictement plus de 6 avis.

<!-- expected-query: Q10
SELECT CINEPHILES.pseudo, COUNT(AVIS.id_avis) AS NbAvis FROM CINEPHILES JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile GROUP BY CINEPHILES.id_cinephile, CINEPHILES.pseudo HAVING COUNT(AVIS.id_avis) > 6;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT CINEPHILES.pseudo, COUNT(AVIS.id_avis) AS NbAvis
FROM CINEPHILES
JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile
GROUP BY CINEPHILES.id_cinephile, CINEPHILES.pseudo
HAVING COUNT(AVIS.id_avis) > 6;
```
</details>


**11. Dénombrer les avis par film**

Pour chaque film de la base, affichez son titre (`titre`) et son nombre total d'avis enregistrés sous l'alias `TotalAvis` (en incluant les films sans avis avec la valeur 0).

<!-- expected-query: Q11
SELECT FILMS.titre, COUNT(AVIS.id_avis) AS TotalAvis FROM FILMS LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film GROUP BY FILMS.id_film, FILMS.titre;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT FILMS.titre, COUNT(AVIS.id_avis) AS TotalAvis
FROM FILMS
LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film
GROUP BY FILMS.id_film, FILMS.titre;
```
</details>


**12. Personnes ayant cumulé les rôles d'acteur et de producteur sur le même film**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre du film (`titre`) pour les artistes ayant été à la fois acteur et producteur sur un même long-métrage.

<details>
<summary>💡 Indice</summary>

Effectuez deux jointures sur `CASTINGS` avec des alias distincts liés sur le même `id_personne` et `id_film`.
</details>

<!-- expected-query: Q12
SELECT DISTINCT P.nom, P.prenom, F.titre FROM PERSONNES P JOIN CASTINGS C1 ON P.id_personne = C1.id_personne AND C1.metier = 'Acteur' JOIN CASTINGS C2 ON P.id_personne = C2.id_personne AND C2.metier = 'Producteur' AND C1.id_film = C2.id_film JOIN FILMS F ON C1.id_film = F.id_film;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT P.nom, P.prenom, F.titre
FROM PERSONNES P
JOIN CASTINGS C1 ON P.id_personne = C1.id_personne AND C1.metier = 'Acteur'
JOIN CASTINGS C2 ON P.id_personne = C2.id_personne AND C2.metier = 'Producteur' AND C1.id_film = C2.id_film
JOIN FILMS F ON C1.id_film = F.id_film;
```

*💡 Remarque : L'auto-jointure sur CASTINGS relie la même personne au même film pour deux métiers distincts.*
</details>




**13. Blockbusters de 2023 ayant dépassé 500 millions de recettes**

Affichez le titre (`titre`), la date de sortie (`date_sortie`) et les recettes mondiales (`recettes`) pour les films sortis en 2023 (`strftime('%Y', date_sortie) = '2023'`) ayant généré strictement plus de 500 millions de dollars.

<!-- expected-query: Q13
SELECT titre, date_sortie, recettes FROM FILMS WHERE strftime('%Y', date_sortie) = '2023' AND recettes > 500000000;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT titre, date_sortie, recettes
FROM FILMS
WHERE strftime('%Y', date_sortie) = '2023' AND recettes > 500000000;
```
</details>


**14. Associer chaque réalisateur aux cinéphiles ayant mis la note maximale (5 étoiles)**

Affichez sans doublon le nom du cinéaste sous l'alias `Realisateur`, le titre du film (`titre`) et le pseudo du cinéphile sous l'alias `Cinephile` ayant accordé une note parfaite de 5.0 à cette œuvre.

<!-- expected-query: Q14
SELECT DISTINCT P.nom AS Realisateur, F.titre, C.pseudo AS Cinephile FROM PERSONNES P JOIN CASTINGS Ct ON P.id_personne = Ct.id_personne AND Ct.metier = 'Realisateur' JOIN FILMS F ON Ct.id_film = F.id_film JOIN AVIS A ON F.id_film = A.id_film JOIN CINEPHILES C ON A.id_cinephile = C.id_cinephile WHERE A.note_attribuee = 5.0;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT P.nom AS Realisateur, F.titre, C.pseudo AS Cinephile
FROM PERSONNES P
JOIN CASTINGS Ct ON P.id_personne = Ct.id_personne AND Ct.metier = 'Realisateur'
JOIN FILMS F ON Ct.id_film = F.id_film
JOIN AVIS A ON F.id_film = A.id_film
JOIN CINEPHILES C ON A.id_cinephile = C.id_cinephile
WHERE A.note_attribuee = 5.0;
```
</details>


**15. Détecter les films orphelins sans aucun avis enregistré**

Affichez l'identifiant (`id_film`) et le titre (`titre`) des films répertoriés au catalogue qui n'ont fait l'objet d'absolument aucun avis rédigé.

<!-- expected-query: Q15
SELECT FILMS.id_film, FILMS.titre FROM FILMS LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film WHERE AVIS.id_avis IS NULL;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT FILMS.id_film, FILMS.titre
FROM FILMS
LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film
WHERE AVIS.id_avis IS NULL;
```

*💡 Remarque : Le LEFT JOIN associé à WHERE clé IS NULL isole les lignes de la table de gauche sans correspondance à droite.*
</details>




