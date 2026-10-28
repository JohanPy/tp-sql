#!/usr/bin/env python3
"""
Générateur automatisé des fichiers markdown pour TP8 : CineData.
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPS_DIR = os.path.join(BASE_DIR, "src", "tps")

TP8_INTRO = {
    "title": "TP 8 : CineData - Grand Cas de Synthèse",
    "intitule": "TP 8 — Grand Cas de Synthèse (CineData)",
    "base": "CineData.sqlite",
    "tpNum": 8,
    "exerciceNum": 0,
    "titre": "TP 8 : CineData - Grand Cas de Synthèse",
    "permalink": "/tp8/intro/",
    "content": """# TP 8 : CineData - Grand Cas de Synthèse

## Description

Ce TP de synthèse vous fait travailler sur la base **`CineData`**, modélisant l'industrie cinématographique mondiale, le box-office et les communautés cinéphiles. Les données réelles sont issues de l'API officielle TMDB (2022-2026), complétées par des données d'utilisateurs et de séances :

- **Films** : Longs-métrages récents avec budgets, recettes mondiales de box-office, dates et durées
- **Genres** : Genres cinématographiques normalisés (Action, Drame, Science-Fiction, Animation...)
- **Personnes & Castings** : Équipes de tournage (acteurs, têtes d'affiche, réalisateurs, producteurs, scénaristes)
- **Cinéphiles** : Membres d'une communauté de spectateurs avec parrainage hiérarchique
- **Avis** : Projections en salle de cinéma ou VOD avec horodatage exact, notes et commentaires

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec rentabilité, agrégats et conditions (9 questions)
- **Partie III** : Requêtes avancées, binômes d'acteurs, temporalité et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, collisions en salle et multi-statuts (8 questions)

## Schéma de la base de données

La base `CineData` contient :

### Tables principales

- **GENRES** (🔑 `id_genre`, `nom_genre`)
- **FILMS** (🔑 `id_film`, `titre`, `titre_original`, `date_sortie`, `duree_minutes`, `budget`, `recettes`, `note_tmdb`, `nb_votes`, `langue_originale`)
- **FILM_GENRES** (🔑🔗 `id_film`, 🔑🔗 `id_genre`)
- **PERSONNES** (🔑 `id_personne`, `nom`, `prenom`, `date_naissance`, `nationalite`)
- **CASTINGS** (🔑🔗 `id_film`, 🔑🔗 `id_personne`, 🔑 `metier`, `personnage`, `ordre_importance`)
- **CINEPHILES** (🔑 `id_cinephile`, `pseudo`, `nom`, `prenom`, `email`, `ville`, `date_naissance`, `date_inscription`, 🔗 `id_parrain`)
- **AVIS** (🔑 `id_avis`, 🔗 `id_cinephile`, 🔗 `id_film`, `date_seance`, `heure_seance`, `note_attribuee`, `vu_au_cinema`, `commentaire_court`)
"""
}

TP8_EX1 = [
    {
        "num": 1,
        "title": "Lister tous les films disponibles",
        "desc": "À partir de la table `FILMS`, affichez l'identifiant (`id_film`), le titre (`titre`), la date de sortie (`date_sortie`) et la durée en minutes (`duree_minutes`).",
        "query": "SELECT id_film, titre, date_sortie, duree_minutes FROM FILMS;"
    },
    {
        "num": 2,
        "title": "Lister les genres cinématographiques",
        "desc": "À partir de la table `GENRES`, affichez l'identifiant (`id_genre`) et l'intitulé du genre (`nom_genre`).",
        "query": "SELECT id_genre, nom_genre FROM GENRES;"
    },
    {
        "num": 3,
        "title": "Films d'une durée supérieure à 150 minutes",
        "desc": "Affichez le titre (`titre`), la durée (`duree_minutes`) et les recettes mondiales (`recettes`) des films d'une durée strictement supérieure à 150 minutes (2h30).",
        "query": "SELECT titre, duree_minutes, recettes FROM FILMS WHERE duree_minutes > 150;"
    },
    {
        "num": 4,
        "title": "Croiser chaque film avec ses genres",
        "desc": "Pour chaque film, affichez son titre (`titre`) et le libellé du genre associé sous l'alias `Genre`.",
        "query": "SELECT FILMS.titre, GENRES.nom_genre AS Genre FROM FILMS JOIN FILM_GENRES ON FILMS.id_film = FILM_GENRES.id_film JOIN GENRES ON FILM_GENRES.id_genre = GENRES.id_genre;"
    },
    {
        "num": 5,
        "title": "Identifier les réalisateurs et leurs films",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des cinéastes et le titre du film dirigé sous l'alias `TitreFilm` (`metier = 'Realisateur'`).",
        "query": "SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, FILMS.titre AS TitreFilm FROM PERSONNES JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne JOIN FILMS ON CASTINGS.id_film = FILMS.id_film WHERE CASTINGS.metier = 'Realisateur';"
    },
    {
        "num": 6,
        "title": "Lister les acteurs tenant le rôle principal d'affiche",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) de l'acteur, le nom du personnage sous l'alias `Personnage` (`personnage`) et le titre du film (`titre`) pour les comédiens figurant en tête d'affiche (`metier = 'Acteur'` et `ordre_importance = 1`).",
        "query": "SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CASTINGS.personnage AS Personnage, FILMS.titre FROM PERSONNES JOIN CASTINGS ON PERSONNES.id_personne = CASTINGS.id_personne JOIN FILMS ON CASTINGS.id_film = FILMS.id_film WHERE CASTINGS.metier = 'Acteur' AND CASTINGS.ordre_importance = 1;"
    },
    {
        "num": 7,
        "title": "Consulter les avis rédigés par un cinéphile donné",
        "desc": "Pour le cinéphile ayant l'identifiant 1 (`id_cinephile = 1`), affichez le titre du film (`titre`), la note attribuée (`note_attribuee`), le canal en salle (`vu_au_cinema`) et la date de la séance (`date_seance`).",
        "query": "SELECT FILMS.titre, AVIS.note_attribuee, AVIS.vu_au_cinema, AVIS.date_seance FROM AVIS JOIN FILMS ON AVIS.id_film = FILMS.id_film WHERE AVIS.id_cinephile = 1;"
    },
    {
        "num": 8,
        "title": "Croiser les cinéphiles et les films vus en salle de cinéma",
        "desc": "Pour chaque projection vue en salle (`vu_au_cinema = 1`), affichez sans doublon le pseudo du spectateur (`pseudo`), le titre du film (`titre`) et la date de la séance (`date_seance`).",
        "query": "SELECT DISTINCT CINEPHILES.pseudo, FILMS.titre, AVIS.date_seance FROM CINEPHILES JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile JOIN FILMS ON AVIS.id_film = FILMS.id_film WHERE AVIS.vu_au_cinema = 1;"
    },
    {
        "num": 9,
        "title": "Compter le nombre de films par genre",
        "desc": "Pour chaque genre, affichez son intitulé (`nom_genre`) et le nombre total de films associés sous l'alias `NbFilms`. Tous les genres doivent figurer dans le résultat (en affichant 0 pour les genres sans film répertorié).",
        "query": "SELECT GENRES.nom_genre, COUNT(FILM_GENRES.id_film) AS NbFilms FROM GENRES LEFT JOIN FILM_GENRES ON GENRES.id_genre = FILM_GENRES.id_genre GROUP BY GENRES.id_genre, GENRES.nom_genre;"
    },
    {
        "num": 10,
        "title": "Identifier les cinéphiles prolifiques",
        "desc": "Affichez le pseudo (`pseudo`) et le nombre total de critiques rédigées sous l'alias `NbAvis` pour les membres ayant enregistré strictement plus de 6 avis.",
        "query": "SELECT CINEPHILES.pseudo, COUNT(AVIS.id_avis) AS NbAvis FROM CINEPHILES JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile GROUP BY CINEPHILES.id_cinephile, CINEPHILES.pseudo HAVING COUNT(AVIS.id_avis) > 6;"
    },
    {
        "num": 11,
        "title": "Dénombrer les avis par film",
        "desc": "Pour chaque film de la base, affichez son titre (`titre`) et son nombre total d'avis enregistrés sous l'alias `TotalAvis` (en incluant les films sans avis avec la valeur 0).",
        "query": "SELECT FILMS.titre, COUNT(AVIS.id_avis) AS TotalAvis FROM FILMS LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film GROUP BY FILMS.id_film, FILMS.titre;"
    },
    {
        "num": 12,
        "title": "Personnes ayant cumulé les rôles d'acteur et de producteur sur le même film",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre du film (`titre`) pour les artistes ayant été à la fois acteur et producteur sur un même long-métrage.",
        "hint": "Effectuez deux jointures sur `CASTINGS` avec des alias distincts liés sur le même `id_personne` et `id_film`.",
        "query": "SELECT DISTINCT P.nom, P.prenom, F.titre FROM PERSONNES P JOIN CASTINGS C1 ON P.id_personne = C1.id_personne AND C1.metier = 'Acteur' JOIN CASTINGS C2 ON P.id_personne = C2.id_personne AND C2.metier = 'Producteur' AND C1.id_film = C2.id_film JOIN FILMS F ON C1.id_film = F.id_film;"
    },
    {
        "num": 13,
        "title": "Blockbusters de 2023 ayant dépassé 500 millions de recettes",
        "desc": "Affichez le titre (`titre`), la date de sortie (`date_sortie`) et les recettes mondiales (`recettes`) pour les films sortis en 2023 (`strftime('%Y', date_sortie) = '2023'`) ayant généré strictement plus de 500 millions de dollars.",
        "query": "SELECT titre, date_sortie, recettes FROM FILMS WHERE strftime('%Y', date_sortie) = '2023' AND recettes > 500000000;"
    },
    {
        "num": 14,
        "title": "Associer chaque réalisateur aux cinéphiles ayant mis la note maximale (5 étoiles)",
        "desc": "Affichez sans doublon le nom du cinéaste sous l'alias `Realisateur`, le titre du film (`titre`) et le pseudo du cinéphile sous l'alias `Cinephile` ayant accordé une note parfaite de 5.0 à cette œuvre.",
        "query": "SELECT DISTINCT P.nom AS Realisateur, F.titre, C.pseudo AS Cinephile FROM PERSONNES P JOIN CASTINGS Ct ON P.id_personne = Ct.id_personne AND Ct.metier = 'Realisateur' JOIN FILMS F ON Ct.id_film = F.id_film JOIN AVIS A ON F.id_film = A.id_film JOIN CINEPHILES C ON A.id_cinephile = C.id_cinephile WHERE A.note_attribuee = 5.0;"
    },
    {
        "num": 15,
        "title": "Détecter les films orphelins sans aucun avis enregistré",
        "desc": "Affichez l'identifiant (`id_film`) et le titre (`titre`) des films répertoriés au catalogue qui n'ont fait l'objet d'absolument aucun avis rédigé.",
        "query": "SELECT FILMS.id_film, FILMS.titre FROM FILMS LEFT JOIN AVIS ON FILMS.id_film = AVIS.id_film WHERE AVIS.id_avis IS NULL;"
    }
]

TP8_EX2 = [
    {
        "num": 1,
        "title": "Calculer la moyenne des notes données par chaque cinéphile",
        "desc": "Pour chaque cinéphile de la communauté, affichez son pseudo (`pseudo`), le nombre total d'avis sous l'alias `NbAvis` et sa note moyenne attribuée arrondie à 2 décimales sous l'alias `MoyenneNotes` (en affichant 0 pour les avis des membres inactifs).",
        "query": "SELECT C.pseudo, COUNT(A.id_avis) AS NbAvis, ROUND(AVG(A.note_attribuee), 2) AS MoyenneNotes FROM CINEPHILES C LEFT JOIN AVIS A ON C.id_cinephile = A.id_cinephile GROUP BY C.id_cinephile, C.pseudo;"
    },
    {
        "num": 2,
        "title": "Afficher les cinéphiles accompagnés du pseudo de leur parrain",
        "desc": "Pour tous les cinéphiles disposant d'un parrain officiel, affichez le pseudo du filleul sous l'alias `Cinephile` ainsi que le pseudo de son parrain sous l'alias `Parrain`.",
        "query": "SELECT Filleul.pseudo AS Cinephile, Parrain.pseudo AS Parrain FROM CINEPHILES Filleul JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile;"
    },
    {
        "num": 3,
        "title": "Dénombrer les acteurs distincts mobilisés par genre",
        "desc": "Pour chaque genre, affichez son libellé (`nom_genre`) ainsi que le nombre d'acteurs distincts ayant figuré dans au moins un film de ce genre sous l'alias `NbActeurs` (en incluant les genres sans acteur avec la valeur 0).",
        "query": "SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbActeurs FROM GENRES G LEFT JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre LEFT JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Acteur' GROUP BY G.id_genre, G.nom_genre;"
    },
    {
        "num": 4,
        "title": "Calculer le ratio de rentabilité économique par film",
        "desc": "Pour chaque film disposant d'un budget et de recettes strictement positifs, calculez le ratio de rentabilité économique (recettes divisées par le budget), arrondi à 2 décimales sous l'alias `RatioRentabilite`. Affichez le titre (`titre`), le budget, les recettes et triez par rentabilité décroissante.",
        "query": "SELECT titre, budget, recettes, ROUND(CAST(recettes AS FLOAT) / budget, 2) AS RatioRentabilite FROM FILMS WHERE budget > 0 AND recettes > 0 ORDER BY RatioRentabilite DESC;"
    },
    {
        "num": 5,
        "title": "Cinéphiles ayant vu le film le plus rentable de la base",
        "desc": "Déterminez le film ayant généré le plus grand bénéfice net (`recettes - budget`), puis affichez sans doublon le pseudo (`pseudo`) des cinéphiles qui ont rédigé un avis sur ce long-métrage.",
        "hint": "Isolez l'identifiant du film le plus rentable à l'aide d'une sous-requête avec `ORDER BY (recettes - budget) DESC LIMIT 1`.",
        "query": "SELECT DISTINCT C.pseudo FROM CINEPHILES C JOIN AVIS A ON C.id_cinephile = A.id_cinephile WHERE A.id_film = (SELECT id_film FROM FILMS WHERE budget > 0 ORDER BY (recettes - budget) DESC LIMIT 1);"
    },
    {
        "num": 6,
        "title": "Moyenne des budgets par genre cinématographique",
        "desc": "Pour chaque genre, affichez son libellé (`nom_genre`) et la moyenne des budgets exprimée en millions de dollars arrondie à 1 décimale sous l'alias `BudgetMoyenMillions` (pour les films dont le budget est renseigné).",
        "query": "SELECT G.nom_genre, ROUND(AVG(F.budget) / 1000000.0, 1) AS BudgetMoyenMillions FROM GENRES G JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre JOIN FILMS F ON FG.id_film = F.id_film WHERE F.budget > 0 GROUP BY G.id_genre, G.nom_genre;"
    },
    {
        "num": 7,
        "title": "Détecter les cinéphiles inscrits n'ayant jamais rédigé d'avis",
        "desc": "Affichez l'identifiant (`id_cinephile`) et le pseudo (`pseudo`) des membres inscrits qui n'ont encore jamais rédigé d'avis.",
        "query": "SELECT CINEPHILES.id_cinephile, CINEPHILES.pseudo FROM CINEPHILES LEFT JOIN AVIS ON CINEPHILES.id_cinephile = AVIS.id_cinephile WHERE AVIS.id_avis IS NULL;"
    },
    {
        "num": 8,
        "title": "Répartition des séances par jour de la semaine",
        "desc": "À partir de la date de séance (`date_seance`), affichez le numéro du jour de la semaine sous l'alias `JourSemaine` (`'0'` pour dimanche à `'6'` pour samedi) et le nombre total de projections enregistrées sous l'alias `NbSeances`, trié par jour.",
        "query": "SELECT strftime('%w', date_seance) AS JourSemaine, COUNT(*) AS NbSeances FROM AVIS GROUP BY JourSemaine ORDER BY JourSemaine;"
    },
    {
        "num": 9,
        "title": "Classifier les films selon leur bilan économique",
        "desc": "Pour les films dont le budget est strictement positif, affichez le titre (`titre`), le budget, les recettes et une colonne sous l'alias `BilanFinancier` affichant 'Méga Succès' si les recettes dépassent le triple du budget, 'Rentable' si les recettes couvrent au moins le budget, et 'Déficitaire' dans le cas contraire.",
        "query": "SELECT titre, budget, recettes, CASE WHEN recettes >= 3 * budget THEN 'Méga Succès' WHEN recettes >= budget THEN 'Rentable' ELSE 'Déficitaire' END AS BilanFinancier FROM FILMS WHERE budget > 0;"
    }
]

TP8_EX3 = [
    {
        "num": 1,
        "title": "Polyvalence des professionnels du cinéma",
        "desc": "Pour chaque personne de l'industrie, affichez son nom (`nom`), son prénom (`prenom`), le nombre de métiers distincts exercés sous l'alias `NbMetiers` et le total de films associés sous l'alias `TotalFilms`. Ne retenez que les professionnels polyvalents ayant exercé au moins 2 métiers différents.",
        "query": "SELECT P.nom, P.prenom, COUNT(DISTINCT C.metier) AS NbMetiers, COUNT(C.id_film) AS TotalFilms FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne GROUP BY P.id_personne, P.nom, P.prenom HAVING COUNT(DISTINCT C.metier) > 1 ORDER BY NbMetiers DESC, TotalFilms DESC;"
    },
    {
        "num": 2,
        "title": "Cinéphiles ayant noté un film dont leur propre parrain a rédigé la critique",
        "desc": "Identifiez les partages cinéphiles : affichez sans doublon le pseudo du filleul sous l'alias `Filleul`, le pseudo de son parrain sous l'alias `Parrain` et le titre du film (`titre`), pour chaque cas où le parrain et son filleul ont tous les deux rédigé un avis sur la même œuvre.",
        "query": "SELECT DISTINCT Filleul.pseudo AS Filleul, Parrain.pseudo AS Parrain, F.titre FROM CINEPHILES Filleul JOIN CINEPHILES Parrain ON Filleul.id_parrain = Parrain.id_cinephile JOIN AVIS A1 ON Filleul.id_cinephile = A1.id_cinephile JOIN AVIS A2 ON Parrain.id_cinephile = A2.id_cinephile AND A1.id_film = A2.id_film JOIN FILMS F ON A1.id_film = F.id_film;"
    },
    {
        "num": 3,
        "title": "Identifier le réalisateur au box-office cumulé le plus colossal",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`) et le total des recettes mondiales générées sous l'alias `BoxOfficeTotal` pour le cinéaste le plus rémunérateur de la base.",
        "query": "SELECT P.nom, P.prenom, SUM(F.recettes) AS BoxOfficeTotal FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN FILMS F ON C.id_film = F.id_film GROUP BY P.id_personne, P.nom, P.prenom ORDER BY BoxOfficeTotal DESC LIMIT 1;"
    },
    {
        "num": 4,
        "title": "Artistes cumulant la triple couronne : Acteur, Réalisateur et Producteur",
        "desc": "Affichez sans doublon l'identifiant (`id_personne`), le nom (`nom`) et le prénom (`prenom`) des artistes complets ayant exercé les trois fonctions majeures sur la base : acteur, réalisateur et producteur.",
        "hint": "Utilisez trois clauses `WHERE EXISTS (SELECT 1 FROM CASTINGS WHERE ...)` pour tester chaque métier séparément.",
        "query": "SELECT P.id_personne, P.nom, P.prenom FROM PERSONNES P WHERE EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Realisateur') AND EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Acteur') AND EXISTS (SELECT 1 FROM CASTINGS WHERE id_personne = P.id_personne AND metier = 'Producteur');"
    },
    {
        "num": 5,
        "title": "Genres sans aucun film ayant dépassé les 100 millions de recettes",
        "desc": "Affichez l'identifiant (`id_genre`) et le nom (`nom_genre`) des genres cinématographiques pour lesquels aucun film n'a atteint 100 millions de dollars de recettes.",
        "query": "SELECT G.id_genre, G.nom_genre FROM GENRES G WHERE G.id_genre NOT IN (SELECT FG.id_genre FROM FILM_GENRES FG JOIN FILMS F ON FG.id_film = F.id_film WHERE F.recettes >= 100000000);"
    },
    {
        "num": 6,
        "title": "Binômes d'acteurs ayant partagé l'affiche d'au moins 2 films différents",
        "desc": "Trouvez les duos d'acteurs récurrents : affichez le nom du premier sous l'alias `Acteur1`, le nom du second sous l'alias `Acteur2` et le nombre de collaborations sous l'alias `FilmsEnCommun`, pour tous les binômes ayant joué ensemble dans au moins 2 longs-métrages (`C1.id_personne < C2.id_personne`).",
        "query": "SELECT P1.nom AS Acteur1, P2.nom AS Acteur2, COUNT(DISTINCT C1.id_film) AS FilmsEnCommun FROM CASTINGS C1 JOIN CASTINGS C2 ON C1.id_film = C2.id_film AND C1.id_personne < C2.id_personne AND C1.metier = 'Acteur' AND C2.metier = 'Acteur' JOIN PERSONNES P1 ON C1.id_personne = P1.id_personne JOIN PERSONNES P2 ON C2.id_personne = P2.id_personne GROUP BY P1.id_personne, P2.id_personne, P1.nom, P2.nom HAVING COUNT(DISTINCT C1.id_film) >= 2;"
    },
    {
        "num": 7,
        "title": "Films ayant généré des avis en salle mais aucun avis en streaming",
        "desc": "Affichez sans doublon le titre des films (`titre`) qui ont été vus et notés en salle de cinéma (`vu_au_cinema = 1`) mais pour lesquels aucun avis en streaming (`vu_au_cinema = 0`) n'a été publié.",
        "query": "SELECT DISTINCT F.titre FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film WHERE A.vu_au_cinema = 1 AND F.id_film NOT IN (SELECT id_film FROM AVIS WHERE vu_au_cinema = 0);"
    },
    {
        "num": 8,
        "title": "Binômes de films sortis exactement à la même date",
        "desc": "Affichez les binômes d'œuvres ayant partagé la même date de sortie en salles : le titre du premier film sous l'alias `Film1`, le titre du second sous l'alias `Film2` et leur date commune (`date_sortie`). Évitez les doublons symétriques avec `F1.id_film < F2.id_film` et triez par date.",
        "query": "SELECT F1.titre AS Film1, F2.titre AS Film2, F1.date_sortie FROM FILMS F1 JOIN FILMS F2 ON F1.date_sortie = F2.date_sortie AND F1.id_film < F2.id_film ORDER BY F1.date_sortie;"
    },
    {
        "num": 9,
        "title": "Comparatif des notes attribuées selon le canal (Cinéma vs Streaming)",
        "desc": "Affichez le type de diffusion sous l'alias `Canal` ('En Salle' ou 'Streaming / VOD'), le nombre total d'avis sous l'alias `NbAvis` et la note moyenne décernée arrondie à 2 décimales sous l'alias `NoteMoyenne`.",
        "query": "SELECT CASE WHEN vu_au_cinema = 1 THEN 'En Salle' ELSE 'Streaming / VOD' END AS Canal, COUNT(*) AS NbAvis, ROUND(AVG(note_attribuee), 2) AS NoteMoyenne FROM AVIS GROUP BY vu_au_cinema;"
    },
    {
        "num": 10,
        "title": "Cinéphiles n'ayant vu aucun film en commun avec leur parrain",
        "desc": "Pour tous les membres parrainés, affichez le pseudo du filleul sous l'alias `Cinephile` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le cinéphile et son parrain n'ont absolument aucun film en commun dans leurs avis respectifs.",
        "query": "SELECT C.pseudo AS Cinephile, P.pseudo AS Parrain FROM CINEPHILES C JOIN CINEPHILES P ON C.id_parrain = P.id_cinephile WHERE NOT EXISTS (SELECT 1 FROM AVIS A1 JOIN AVIS A2 ON A1.id_film = A2.id_film WHERE A1.id_cinephile = C.id_cinephile AND A2.id_cinephile = P.id_cinephile);"
    },
    {
        "num": 11,
        "title": "Mois records : mois ayant enregistré la sortie d'au moins 3 blockbusters",
        "desc": "Affichez l'année et le mois de sortie sous l'alias `AnneeMois` (`strftime('%Y-%m', date_sortie)`) et le nombre d'œuvres majeures sous l'alias `NbFilmsSucces`, pour tous les mois civils où sont sortis au moins 3 films ayant généré 100 millions de recettes ou plus.",
        "query": "SELECT strftime('%Y-%m', date_sortie) AS AnneeMois, COUNT(*) AS NbFilmsSucces FROM FILMS WHERE recettes >= 100000000 GROUP BY AnneeMois HAVING COUNT(*) >= 3;"
    },
    {
        "num": 12,
        "title": "Division relationnelle : Cinéphiles ayant vu tous les films d'un réalisateur donné",
        "desc": "Problème de division relationnelle : affichez l'identifiant (`id_cinephile`) et le pseudo (`pseudo`) des cinéphiles qui ont vu et noté l'intégralité des films réalisés par le cinéaste d'identifiant 1 (`id_personne = 1`).",
        "hint": "Dans la clause `HAVING`, comparez le nombre de films distincts notés avec le total de films dirigés par cette personne via `(SELECT COUNT(DISTINCT id_film) FROM CASTINGS WHERE id_personne = 1 AND metier = 'Realisateur')`.",
        "query": "SELECT C.id_cinephile, C.pseudo FROM CINEPHILES C JOIN AVIS A ON C.id_cinephile = A.id_cinephile JOIN FILMS F ON A.id_film = F.id_film JOIN CASTINGS Ct ON F.id_film = Ct.id_film AND Ct.metier = 'Realisateur' WHERE Ct.id_personne = 1 GROUP BY C.id_cinephile, C.pseudo HAVING COUNT(DISTINCT F.id_film) = (SELECT COUNT(DISTINCT id_film) FROM CASTINGS WHERE id_personne = 1 AND metier = 'Realisateur');"
    }
]

TP8_EX4 = [
    {
        "num": 1,
        "title": "Cinéphiles cumulant les 4 statuts clés",
        "desc": "Trouvez les cinéphiles les plus actifs qui cumulent à la fois : avoir vu au moins un film en salle, avoir vu au moins un film en streaming, avoir attribué au moins une note parfaite de 5.0, et être le parrain d'au moins un autre membre. Affichez leur identifiant (`id_cinephile`) et leur pseudo (`pseudo`).",
        "query": "SELECT id_cinephile, pseudo FROM CINEPHILES WHERE id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE vu_au_cinema = 1) AND id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE vu_au_cinema = 0) AND id_cinephile IN (SELECT id_cinephile FROM AVIS WHERE note_attribuee = 5.0) AND id_cinephile IN (SELECT DISTINCT id_parrain FROM CINEPHILES WHERE id_parrain IS NOT NULL);"
    },
    {
        "num": 2,
        "title": "Conflit d'horaire physique : même cinéphile noté à 2 séances en salle à la même heure",
        "desc": "Détectez les incohérences ou fraudes de réservation : identifiez les cinéphiles enregistrés sur deux séances en salle (`vu_au_cinema = 1`) distinctes ayant lieu exactement à la même date et à la même heure. Affichez l'identifiant du membre (`id_cinephile`), son pseudo (`pseudo`), la date (`date_seance`), l'horaire (`heure_seance`), le titre du premier film sous l'alias `Film1` et du second sous l'alias `Film2` (`A1.id_film < A2.id_film`).",
        "query": "SELECT A1.id_cinephile, C.pseudo, A1.date_seance, A1.heure_seance, F1.titre AS Film1, F2.titre AS Film2 FROM AVIS A1 JOIN AVIS A2 ON A1.id_cinephile = A2.id_cinephile AND A1.date_seance = A2.date_seance AND A1.heure_seance = A2.heure_seance AND A1.id_film < A2.id_film AND A1.vu_au_cinema = 1 AND A2.vu_au_cinema = 1 JOIN CINEPHILES C ON A1.id_cinephile = C.id_cinephile JOIN FILMS F1 ON A1.id_film = F1.id_film JOIN FILMS F2 ON A2.id_film = F2.id_film;"
    },
    {
        "num": 3,
        "title": "Reconstituer la chaîne de parrainage cinéphile à trois niveaux",
        "desc": "Identifiez les lignées de mentorat cinéphile à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le pseudo du parrain initial sous l'alias `GrandParrain`, celui du parrain intermédiaire sous l'alias `Parrain`, et celui du protégé final sous l'alias `Filleul`.",
        "query": "SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM CINEPHILES F JOIN CINEPHILES P ON F.id_parrain = P.id_cinephile JOIN CINEPHILES GP ON P.id_parrain = GP.id_cinephile;"
    },
    {
        "num": 4,
        "title": "Calculer le délai moyen entre la sortie d'un film et son visionnage",
        "desc": "Pour chaque film ayant reçu des avis postérieurs à sa date de sortie, calculez le délai moyen en jours écoulé avant la projection (`date_seance - date_sortie`), arrondi à 1 décimale sous l'alias `DelaiMoyenJours`. Affichez le titre du film (`titre`) et sa date de sortie (`date_sortie`).",
        "query": "SELECT F.titre, F.date_sortie, ROUND(AVG(CAST(JULIANDAY(A.date_seance) - JULIANDAY(F.date_sortie) AS INT)), 1) AS DelaiMoyenJours FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film WHERE A.date_seance >= F.date_sortie GROUP BY F.id_film, F.titre, F.date_sortie;"
    },
    {
        "num": 5,
        "title": "Rendement financier par minute de film",
        "desc": "Pour chaque long-métrage dont le budget et les recettes sont strictement positifs, calculez la recette brute générée par minute de projection (`recettes / duree_minutes`), arrondie à l'entier le plus proche sous l'alias `RecettesParMinute`. Affichez le titre (`titre`), les recettes, la durée et triez par rendement décroissant.",
        "query": "SELECT titre, recettes, duree_minutes, ROUND(recettes / CAST(duree_minutes AS FLOAT), 0) AS RecettesParMinute FROM FILMS WHERE duree_minutes > 0 AND recettes > 0 ORDER BY RecettesParMinute DESC;"
    },
    {
        "num": 6,
        "title": "Films vus uniquement par des parrains et jamais par aucun filleul",
        "desc": "Identifiez les films appréciés par les anciens mais boudés par leurs protégés : affichez sans doublon le titre des films (`titre`) vus par au moins un membre ayant le statut de parrain, mais n'ayant été visionnés par absolument aucun membre parrainé.",
        "query": "SELECT DISTINCT F.titre FROM FILMS F JOIN AVIS A ON F.id_film = A.id_film JOIN CINEPHILES P ON A.id_cinephile = P.id_cinephile WHERE P.id_cinephile IN (SELECT DISTINCT id_parrain FROM CINEPHILES WHERE id_parrain IS NOT NULL) AND F.id_film NOT IN (SELECT A2.id_film FROM AVIS A2 JOIN CINEPHILES Filleul ON A2.id_cinephile = Filleul.id_cinephile WHERE Filleul.id_parrain IS NOT NULL);"
    },
    {
        "num": 7,
        "title": "Réalisateurs dont tous les films répertoriés sont hautement rentables",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de films sous l'alias `NbFilms` pour les réalisateurs ayant dirigé au moins 2 films dans la base et dont chaque film a généré des recettes au moins deux fois supérieures à son budget (`recettes >= 2 * budget`).",
        "query": "SELECT P.nom, P.prenom, COUNT(F.id_film) AS NbFilms FROM PERSONNES P JOIN CASTINGS C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN FILMS F ON C.id_film = F.id_film WHERE F.budget > 0 GROUP BY P.id_personne, P.nom, P.prenom HAVING MIN(CAST(F.recettes AS FLOAT) / F.budget) >= 2.0 AND COUNT(F.id_film) >= 2;"
    },
    {
        "num": 8,
        "title": "Genres sous la responsabilité d'un seul réalisateur répertorié",
        "desc": "Affichez le libellé du genre (`nom_genre`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls genres cinématographiques dont l'intégralité des films répertoriés dans la base a été dirigée par un seul et même cinéaste.",
        "query": "SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM GENRES G JOIN FILM_GENRES FG ON G.id_genre = FG.id_genre JOIN CASTINGS C ON FG.id_film = C.id_film AND C.metier = 'Realisateur' GROUP BY G.id_genre, G.nom_genre HAVING COUNT(DISTINCT C.id_personne) = 1;"
    }
]

# Helper builders
def build_markdown_file(filepath, meta, exercises):
    frontmatter = f"""---
layout: base.njk
title: "{meta['title']}"
intitule: "{meta['intitule']}"
base: "{meta['base']}"
tpNum: {meta['tpNum']}
exerciceNum: {meta['exerciceNum']}
titre: "{meta['titre']}"
permalink: "{meta['permalink']}"
tags: tp
show_load_db: false
show_save_db: false
---

# {meta['titre']}

## Questions ({len(exercises)} questions)

"""
    body = []
    for ex in exercises:
        q_text = f"**{ex['num']}. {ex['title']}**\n\n{ex['desc']}\n"
        if "hint" in ex:
            q_text += f"\n<details>\n<summary>💡 Indice</summary>\n\n{ex['hint']}\n</details>\n"
        q_text += f"\n<!-- expected-query: Q{ex['num']}\n{ex['query']}\n-->\n"
        body.append(q_text)
    
    full_content = frontmatter + "\n".join(body)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_content)
    print(f"Generated {filepath}")

def build_intro_file(filepath, meta):
    frontmatter = f"""---
layout: base.njk
title: "{meta['title']}"
intitule: "{meta['intitule']}"
base: "{meta['base']}"
tpNum: {meta['tpNum']}
exerciceNum: {meta['exerciceNum']}
titre: "{meta['titre']}"
permalink: "{meta['permalink']}"
tags: tp
show_load_db: false
show_save_db: false
---

{meta['content']}
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter)
    print(f"Generated {filepath}")

# Generate TP8
build_intro_file(os.path.join(TPS_DIR, "tp8-00-intro.md"), TP8_INTRO)

build_markdown_file(os.path.join(TPS_DIR, "tp8-ex1.md"), {
    "title": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "intitule": "TP 8 — Grand Cas de Synthèse (CineData)",
    "base": "CineData.sqlite",
    "tpNum": 8,
    "exerciceNum": 1,
    "titre": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "permalink": "/tp8/exercice1/"
}, TP8_EX1)

build_markdown_file(os.path.join(TPS_DIR, "tp8-ex2.md"), {
    "title": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "intitule": "TP 8 — Grand Cas de Synthèse (CineData)",
    "base": "CineData.sqlite",
    "tpNum": 8,
    "exerciceNum": 2,
    "titre": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "permalink": "/tp8/exercice2/"
}, TP8_EX2)

build_markdown_file(os.path.join(TPS_DIR, "tp8-ex3.md"), {
    "title": "Exercice 3 : Partie III - Requêtes très avancées",
    "intitule": "TP 8 — Grand Cas de Synthèse (CineData)",
    "base": "CineData.sqlite",
    "tpNum": 8,
    "exerciceNum": 3,
    "titre": "Exercice 3 : Partie III - Requêtes très avancées",
    "permalink": "/tp8/exercice3/"
}, TP8_EX3)

build_markdown_file(os.path.join(TPS_DIR, "tp8-ex4.md"), {
    "title": "Exercice 4 : Bonus - Défis complexes",
    "intitule": "TP 8 — Grand Cas de Synthèse (CineData)",
    "base": "CineData.sqlite",
    "tpNum": 8,
    "exerciceNum": 4,
    "titre": "Exercice 4 : Bonus - Défis complexes",
    "permalink": "/tp8/exercice4/"
}, TP8_EX4)

print("TP8 generated successfully.")
