---
layout: base.njk
title: "Exercice 2 : Partie II - Requêtes intermédiaires"
intitule: "TP 6 — Révision & Entraînement Autonome (CineData)"
base: "CineData.sqlite"
tpNum: 6
exerciceNum: 2
titre: "Exercice 2 : Partie II - Requêtes intermédiaires"
permalink: "/tp6/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Partie II - Requêtes intermédiaires

## Questions (9 questions)

**1. Calculer la moyenne des notes données par chaque cinéphile**

Pour chaque cinéphile de la communauté, affichez son pseudo (`pseudo`), le nombre total d'avis sous l'alias `NbAvis` et sa note moyenne attribuée arrondie à 2 décimales sous l'alias `MoyenneNotes` (en affichant 0 pour les avis des membres inactifs).

<!-- expected-query: Q1
SELECT C.pseudo, COUNT(A.id_avis) AS NbAvis, ROUND(AVG(A.note_attribuee), 2) AS MoyenneNotes FROM CINEPHILES C LEFT JOIN AVIS A ON C.id_cinephile = A.id_cinephile GROUP BY C.id_cinephile, C.pseudo;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT C.pseudo, COUNT(A.id_avis) AS NbAvis, ROUND(AVG(A.note_attribuee), 2) AS MoyenneNotes
FROM CINEPHILES C
LEFT JOIN AVIS A ON C.id_cinephile = A.id_cinephile
GROUP BY C.id_cinephile, C.pseudo;
```
</details>


**2. Afficher les cinéphiles accompagnés du pseudo de leur parrain**

Pour tous les cinéphiles disposant d'un parrain officiel, affichez le pseudo du filleul sous l'alias `Cinephile` ainsi que le pseudo de son parrain sous l'alias `Parrain`.

<!-- expected-query: Q2
SELECT Filleul.pseudo AS Cinephile, Parrain.pseudo AS Parrain FROM CINEPHILES Filleul JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT Filleul.pseudo AS Cinephile, Parrain.pseudo AS Parrain
FROM CINEPHILES Filleul
JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile;
```

*💡 Remarque : L'auto-jointure externe LEFT JOIN permet d'afficher tous les cinéphiles, y compris ceux sans parrain (valeur NULL).*
</details>




**3. Dénombrer les acteurs distincts mobilisés par genre**

Pour chaque genre, affichez son libellé (`nom_genre`) ainsi que le nombre d'acteurs distincts ayant figuré dans au moins un film de ce genre sous l'alias `NbActeurs` (en incluant les genres sans acteur avec la valeur 0).

<!-- expected-query: Q3
SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbActeurs FROM GENRES G LEFT JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre LEFT JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Acteur' GROUP BY G.id_genre, G.nom_genre;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbActeurs
FROM GENRES G
LEFT JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre
LEFT JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Acteur'
GROUP BY G.id_genre, G.nom_genre;
```
</details>


**4. Calculer le ratio de rentabilité économique par film**

Pour chaque film disposant d'un budget et de recettes strictement positifs, calculez le ratio de rentabilité économique (recettes divisées par le budget), arrondi à 2 décimales sous l'alias `RatioRentabilite`. Affichez le titre (`titre`), le budget, les recettes et triez par rentabilité décroissante.

<!-- expected-query: Q4
SELECT titre, budget, recettes, ROUND(CAST(recettes AS FLOAT) / budget, 2) AS RatioRentabilite FROM FILMS WHERE budget > 0 AND recettes > 0 ORDER BY RatioRentabilite DESC;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT titre, budget, recettes, ROUND(CAST(recettes AS FLOAT) / budget, 2) AS RatioRentabilite
FROM FILMS
WHERE budget > 0 AND recettes > 0
ORDER BY RatioRentabilite DESC;
```

*💡 Remarque : La conversion CAST(... AS FLOAT) évite la troncature de la division entière en SQLite.*
</details>




**5. Cinéphiles ayant vu le film le plus rentable de la base**

Déterminez le film ayant généré le plus grand bénéfice net (`recettes - budget`), puis affichez sans doublon le pseudo (`pseudo`) des cinéphiles qui ont rédigé un avis sur ce long-métrage.

<details>
<summary>💡 Indice</summary>

Isolez l'identifiant du film le plus rentable à l'aide d'une sous-requête avec `ORDER BY (recettes - budget) DESC LIMIT 1`.
</details>

<!-- expected-query: Q5
SELECT DISTINCT C.pseudo FROM CINEPHILES C JOIN AVIS A ON C.id_cinephile = A.id_cinephile WHERE A.id_film = (SELECT id_film FROM FILMS WHERE budget > 0 ORDER BY (recettes - budget) DESC LIMIT 1);
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT DISTINCT C.pseudo
FROM CINEPHILES C
JOIN AVIS A ON C.id_cinephile = A.id_cinephile
WHERE A.id_film = (SELECT id_film
FROM FILMS
WHERE budget > 0
ORDER BY (recettes - budget) DESC
LIMIT 1);
```

*💡 Remarque : La sous-requête scalaire dans le WHERE détermine dynamiquement l'identifiant du film le plus rentable.*
</details>




**6. Moyenne des budgets par genre cinématographique**

Pour chaque genre, affichez son libellé (`nom_genre`) et la moyenne des budgets exprimée en millions de dollars arrondie à 1 décimale sous l'alias `BudgetMoyenMillions` (pour les films dont le budget est renseigné).

<!-- expected-query: Q6
SELECT G.nom_genre, ROUND(AVG(F.budget) / 1000000.0, 1) AS BudgetMoyenMillions FROM GENRES G JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre JOIN FILMS F ON FG.id_film = F.id_film WHERE F.budget > 0 GROUP BY G.id_genre, G.nom_genre;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT G.nom_genre, ROUND(AVG(F.budget) / 1000000.0, 1) AS BudgetMoyenMillions
FROM GENRES G
JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre
JOIN FILMS F ON FG.id_film = F.id_film
WHERE F.budget > 0
GROUP BY G.id_genre, G.nom_genre;
```
</details>


**7. Détecter les cinéphiles inscrits n'ayant jamais rédigé d'avis**

Affichez l'identifiant (`id_cinephile`) et le pseudo (`pseudo`) des membres inscrits qui n'ont encore jamais rédigé d'avis.

<!-- expected-query: Q7
SELECT CINEPHILES.id_cinephile, CINEPHILES.pseudo FROM CINEPHILES LEFT JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile WHERE AVIS.id_avis IS NULL;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT CINEPHILES.id_cinephile, CINEPHILES.pseudo
FROM CINEPHILES
LEFT JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile
WHERE AVIS.id_avis IS NULL;
```
</details>


**8. Répartition des séances par jour de la semaine**

À partir de la date de séance (`date_seance`), affichez le numéro du jour de la semaine sous l'alias `JourSemaine` (`'0'` pour dimanche à `'6'` pour samedi) et le nombre total de projections enregistrées sous l'alias `NbSeances`, trié par jour.

<!-- expected-query: Q8
SELECT strftime('%w', date_seance) AS JourSemaine, COUNT(*) AS NbSeances FROM AVIS GROUP BY JourSemaine ORDER BY JourSemaine;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT strftime('%w', date_seance) AS JourSemaine, COUNT(*) AS NbSeances
FROM AVIS
GROUP BY JourSemaine
ORDER BY JourSemaine;
```

*💡 Remarque : strftime('%w', date) renvoie le jour de la semaine (0 pour Dimanche, 1 pour Lundi...).*
</details>




**9. Classifier les films selon leur bilan économique**

Pour les films dont le budget est strictement positif, affichez le titre (`titre`), le budget, les recettes et une colonne sous l'alias `BilanFinancier` affichant 'Méga Succès' si les recettes dépassent le triple du budget, 'Rentable' si les recettes couvrent au moins le budget, et 'Déficitaire' dans le cas contraire.

<!-- expected-query: Q9
SELECT titre, budget, recettes, CASE WHEN recettes >= 3 * budget THEN 'Méga Succès' WHEN recettes >= budget THEN 'Rentable' ELSE 'Déficitaire' END AS BilanFinancier FROM FILMS WHERE budget > 0;
-->

<details>
<summary>💡 Solution</summary>

```sql
SELECT titre, budget, recettes, CASE WHEN recettes >= 3 * budget THEN 'Méga Succès' WHEN recettes >= budget THEN 'Rentable' ELSE 'Déficitaire' END AS BilanFinancier
FROM FILMS
WHERE budget > 0;
```
</details>


