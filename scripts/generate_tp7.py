#!/usr/bin/env python3
"""
Générateur automatisé des fichiers markdown pour TP7 : AniBase.
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPS_DIR = os.path.join(BASE_DIR, "src", "tps")

TP7_INTRO = {
    "title": "TP 7 : AniBase - Grand Cas de Synthèse",
    "intitule": "TP 7 — Grand Cas de Synthèse (AniBase)",
    "base": "AniBase.sqlite",
    "tpNum": 7,
    "exerciceNum": 0,
    "titre": "TP 7 : AniBase - Grand Cas de Synthèse",
    "permalink": "/tp7/intro/",
    "content": """# TP 7 : AniBase - Grand Cas de Synthèse

## Description

Ce TP de synthèse vous fait travailler sur la base **`AniBase`**, modélisant l'écosystème de l'animation japonaise et de ses communautés de fans. Les données sont issues de l'API GraphQL AniList (2020-2026), complétées par des membres et leurs listes de suivi (Watchlist) :

- **Animes** : Séries, films et ONA avec formats, durées d'épisodes, saisons et scores moyens
- **Studios** : Studios d'animation historiques et contemporains (Mappa, Ufotable, Wit Studio, Toei, Ghibli...)
- **Genres** : Catégories et thématiques (Action, Shonen, Fantasy, Romance, Sci-Fi...)
- **Staff & Crédits** : Réalisateurs, mangakas/auteurs, doubleurs (seiyū) et directeurs d'animation
- **Membres** : Utilisateurs de la plateforme communautaire avec parrainage hiérarchique
- **Watchlist** : Suivi individuel des visionnages (statut, épisodes vus, dates et notes personnelles)

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec agrégats, orphelins et conditions (9 questions)
- **Partie III** : Requêtes avancées, auto-jointures, temporalité et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, conflits de production et hiérarchies (8 questions)

## Schéma de la base de données

La base `AniBase` contient :

### Tables principales

- **STUDIOS** (🔑 `id_studio`, `nom_studio`, `pays`, `annee_creation`)
- **ANIMES** (🔑 `id_anime`, `titre_romaji`, `titre_francais`, `format`, `nb_episodes`, `duree_episode_min`, `annee_diffusion`, `saison`, `note_moyenne`, 🔗 `id_studio`)
- **GENRES** (🔑 `id_genre`, `libelle`)
- **ANIME_GENRES** (🔑🔗 `id_anime`, 🔑🔗 `id_genre`)
- **STAFF** (🔑 `id_personne`, `nom`, `prenom`, `nationalite`)
- **CREDITS_ANIME** (🔑🔗 `id_anime`, 🔑🔗 `id_personne`, 🔑 `role`, `personnage_nom`)
- **MEMBRES** (🔑 `id_membre`, `pseudo`, `email`, `date_inscription`, `pays`, `annee_naissance`, 🔗 `id_parrain`)
- **WATCHLIST** (🔑🔗 `id_membre`, 🔑🔗 `id_anime`, `statut`, `note_perso`, `episodes_vus`, `date_ajout`, `date_fin`)
"""
}

TP7_EX1 = [
    {
        "num": 1,
        "title": "Lister tous les animes répertoriés",
        "desc": "À partir de la table `ANIMES`, affichez l'identifiant (`id_anime`), le titre romaji (`titre_romaji`), le format (`format`) et l'année de diffusion (`annee_diffusion`).",
        "query": "SELECT id_anime, titre_romaji, format, annee_diffusion FROM ANIMES;"
    },
    {
        "num": 2,
        "title": "Lister les studios d'animation",
        "desc": "À partir de la table `STUDIOS`, affichez l'identifiant (`id_studio`), le nom du studio (`nom_studio`) et son pays d'origine (`pays`).",
        "query": "SELECT id_studio, nom_studio, pays FROM STUDIOS;"
    },
    {
        "num": 3,
        "title": "Animes produits par un studio donné",
        "desc": "Pour le studio d'animation ayant l'identifiant 1 (`id_studio = 1`), affichez le titre (`titre_romaji`), le format (`format`) et le nombre d'épisodes (`nb_episodes`).",
        "query": "SELECT titre_romaji, format, nb_episodes FROM ANIMES WHERE id_studio = 1;"
    },
    {
        "num": 4,
        "title": "Croiser chaque anime avec son studio de production",
        "desc": "Pour chaque anime disposant d'un studio répertorié, affichez son titre (`titre_romaji`), le nom du studio sous l'alias `NomStudio` et son année de diffusion (`annee_diffusion`).",
        "query": "SELECT ANIMES.titre_romaji, STUDIOS.nom_studio AS NomStudio, ANIMES.annee_diffusion FROM ANIMES JOIN STUDIOS ON ANIMES.id_studio = STUDIOS.id_studio;"
    },
    {
        "num": 5,
        "title": "Identifier les réalisateurs et les animes qu'ils ont dirigés",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des membres du staff et le titre de l'anime dirigé sous l'alias `TitreAnime` (`role = 'Realisateur'`).",
        "query": "SELECT DISTINCT STAFF.nom, STAFF.prenom, ANIMES.titre_romaji AS TitreAnime FROM STAFF JOIN CREDITS_ANIME ON STAFF.id_personne = CREDITS_ANIME.id_personne JOIN ANIMES ON CREDITS_ANIME.id_anime = ANIMES.id_anime WHERE CREDITS_ANIME.role = 'Realisateur';"
    },
    {
        "num": 6,
        "title": "Lister les doubleurs et leurs personnages associés",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) du doubleur, le nom du personnage sous l'alias `Personnage` (`personnage_nom`) et le titre de l'anime (`titre_romaji`) pour toutes les participations de doublage (`role = 'Doubleur'`).",
        "query": "SELECT DISTINCT STAFF.nom, STAFF.prenom, CREDITS_ANIME.personnage_nom AS Personnage, ANIMES.titre_romaji FROM STAFF JOIN CREDITS_ANIME ON STAFF.id_personne = CREDITS_ANIME.id_personne JOIN ANIMES ON CREDITS_ANIME.id_anime = ANIMES.id_anime WHERE CREDITS_ANIME.role = 'Doubleur';"
    },
    {
        "num": 7,
        "title": "Consulter la Watchlist d'un membre donné",
        "desc": "Pour le membre d'identifiant 1 (`id_membre = 1`), affichez le titre de l'anime (`titre_romaji`), son statut de visionnage (`statut`) et la note personnelle attribuée (`note_perso`).",
        "query": "SELECT ANIMES.titre_romaji, WATCHLIST.statut, WATCHLIST.note_perso FROM WATCHLIST JOIN ANIMES ON WATCHLIST.id_anime = ANIMES.id_anime WHERE WATCHLIST.id_membre = 1;"
    },
    {
        "num": 8,
        "title": "Croiser les membres avec les animes qu'ils ont terminés",
        "desc": "Pour chaque anime complété, affichez sans doublon le pseudo du membre (`pseudo`), le titre de l'anime (`titre_romaji`) et la note attribuée (`note_perso`) pour les seules œuvres marquées comme 'Termine'.",
        "query": "SELECT DISTINCT MEMBRES.pseudo, ANIMES.titre_romaji, WATCHLIST.note_perso FROM MEMBRES JOIN WATCHLIST ON MEMBRES.id_membre = WATCHLIST.id_membre JOIN ANIMES ON WATCHLIST.id_anime = ANIMES.id_anime WHERE WATCHLIST.statut = 'Termine';"
    },
    {
        "num": 9,
        "title": "Compter les animes par studio",
        "desc": "Pour chaque studio d'animation, affichez son nom (`nom_studio`) et le nombre total d'animes produits sous l'alias `NbAnimes`. Tous les studios doivent figurer dans le résultat (en affichant 0 pour les studios sans production répertoriée).",
        "query": "SELECT STUDIOS.nom_studio, COUNT(ANIMES.id_anime) AS NbAnimes FROM STUDIOS LEFT JOIN ANIMES ON STUDIOS.id_studio = ANIMES.id_studio GROUP BY STUDIOS.id_studio, STUDIOS.nom_studio;"
    },
    {
        "num": 10,
        "title": "Identifier les membres très investis",
        "desc": "Affichez le pseudo (`pseudo`) et le nombre total d'animes suivis sous l'alias `TotalSuivis` pour les membres ayant strictement plus de 8 animes inscrits dans leur Watchlist.",
        "query": "SELECT MEMBRES.pseudo, COUNT(WATCHLIST.id_anime) AS TotalSuivis FROM MEMBRES JOIN WATCHLIST ON MEMBRES.id_membre = WATCHLIST.id_membre GROUP BY MEMBRES.id_membre, MEMBRES.pseudo HAVING COUNT(WATCHLIST.id_anime) > 8;"
    },
    {
        "num": 11,
        "title": "Dénombrer les membres suivant chaque anime",
        "desc": "Pour chaque anime de la base, affichez son titre (`titre_romaji`) et le nombre total de membres qui le suivent sous l'alias `NbAbonnes` (en incluant les animes orphelins avec la valeur 0).",
        "query": "SELECT ANIMES.titre_romaji, COUNT(WATCHLIST.id_membre) AS NbAbonnes FROM ANIMES LEFT JOIN WATCHLIST ON ANIMES.id_anime = WATCHLIST.id_anime GROUP BY ANIMES.id_anime, ANIMES.titre_romaji;"
    },
    {
        "num": 12,
        "title": "Artistes polyvalents cumulant doublage et réalisation sur le même anime",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre de l'anime (`titre_romaji`) pour les artistes ayant exercé à la fois un rôle de doubleur et un rôle d'auteur/réalisateur/scénariste sur la même œuvre.",
        "hint": "Effectuez deux jointures sur `CREDITS_ANIME` avec des alias distincts liés sur le même `id_personne` et `id_anime`.",
        "query": "SELECT DISTINCT S.nom, S.prenom, A.titre_romaji FROM STAFF S JOIN CREDITS_ANIME C1 ON S.id_personne = C1.id_personne AND C1.role = 'Doubleur' JOIN CREDITS_ANIME C2 ON S.id_personne = C2.id_personne AND C2.role IN ('Realisateur', 'Scenariste', 'Auteur Original') AND C1.id_anime = C2.id_anime JOIN ANIMES A ON C1.id_anime = A.id_anime;"
    },
    {
        "num": 13,
        "title": "Filtrer les animes par fourchette de score",
        "desc": "À partir de la table `ANIMES`, affichez le titre (`titre_romaji`), le score moyen (`note_moyenne`) et le format (`format`) des animes dont la note moyenne est comprise entre 8.0 et 9.0 inclus.",
        "query": "SELECT titre_romaji, note_moyenne, format FROM ANIMES WHERE note_moyenne BETWEEN 8.0 AND 9.0;"
    },
    {
        "num": 14,
        "title": "Associer chaque réalisateur aux membres ayant attribué la note maximale (10/10)",
        "desc": "Affichez sans doublon le nom du réalisateur sous l'alias `Realisateur`, le titre de l'anime (`titre_romaji`) et le pseudo du membre sous l'alias `Fan` ayant décerné la note 10/10 à cette œuvre.",
        "query": "SELECT DISTINCT S.nom AS Realisateur, A.titre_romaji, M.pseudo AS Fan FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne AND C.role = 'Realisateur' JOIN ANIMES A ON C.id_anime = A.id_anime JOIN WATCHLIST W ON A.id_anime = W.id_anime JOIN MEMBRES M ON W.id_membre = M.id_membre WHERE W.note_perso = 10;"
    },
    {
        "num": 15,
        "title": "Détecter les studios sans aucune production enregistrée",
        "desc": "Identifiez les studios inactifs : affichez l'identifiant (`id_studio`) et le nom du studio (`nom_studio`) pour lesquels aucune production n'est enregistrée dans la base.",
        "query": "SELECT STUDIOS.id_studio, STUDIOS.nom_studio FROM STUDIOS LEFT JOIN ANIMES ON STUDIOS.id_studio = ANIMES.id_studio WHERE ANIMES.id_anime IS NULL;"
    }
]

TP7_EX2 = [
    {
        "num": 1,
        "title": "Calculer le nombre d'animes terminés par membre",
        "desc": "Pour chaque membre inscrit, affichez son pseudo (`pseudo`) et le nombre d'animes marqués avec le statut 'Termine' sous l'alias `NbTermines` (en affichant 0 pour les membres n'ayant encore rien terminé).",
        "query": "SELECT M.pseudo, COUNT(W.id_anime) AS NbTermines FROM MEMBRES M LEFT JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' GROUP BY M.id_membre, M.pseudo;"
    },
    {
        "num": 2,
        "title": "Afficher les membres accompagnés du pseudo de leur parrain",
        "desc": "Pour tous les membres disposant d'un parrain officiel, affichez le pseudo du membre sous l'alias `Membre` ainsi que le pseudo de son parrain sous l'alias `Parrain`.",
        "query": "SELECT Filleul.pseudo AS Membre, Parrain.pseudo AS Parrain FROM MEMBRES Filleul JOIN MEMBRES Parrain ON Filleul.id_parrain = Parrain.id_membre;"
    },
    {
        "num": 3,
        "title": "Dénombrer les réalisateurs distincts ayant collaboré avec chaque studio",
        "desc": "Pour chaque studio d'animation, affichez son nom (`nom_studio`) ainsi que le nombre de réalisateurs distincts ayant dirigé au moins une série chez eux, sous l'alias `NbRealisateurs` (en incluant les studios sans réalisateur avec la valeur 0).",
        "query": "SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM STUDIOS St LEFT JOIN ANIMES A ON St.id_studio = A.id_studio LEFT JOIN CREDITS_ANIME C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio;"
    },
    {
        "num": 4,
        "title": "Volume moyen d'épisodes et note moyenne par format",
        "desc": "Pour chaque format de production (`format`), affichez l'intitulé du format, la moyenne d'épisodes arrondie à 1 décimale sous l'alias `MoyenneEpisodes`, et la note moyenne arrondie à 2 décimales sous l'alias `NoteMoyenne`.",
        "query": "SELECT format, ROUND(AVG(nb_episodes), 1) AS MoyenneEpisodes, ROUND(AVG(note_moyenne), 2) AS NoteMoyenne FROM ANIMES GROUP BY format;"
    },
    {
        "num": 5,
        "title": "Identifier les membres ayant suivi l'anime le mieux noté",
        "desc": "Déterminez l'anime disposant de la meilleure note moyenne de la base, puis affichez sans doublon le pseudo (`pseudo`) des membres qui l'ont inscrit dans leur Watchlist.",
        "hint": "Isolez l'anime star via une sous-requête avec `ORDER BY note_moyenne DESC LIMIT 1`.",
        "query": "SELECT DISTINCT M.pseudo FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre WHERE W.id_anime = (SELECT id_anime FROM ANIMES WHERE note_moyenne IS NOT NULL ORDER BY note_moyenne DESC LIMIT 1);"
    },
    {
        "num": 6,
        "title": "Calculer la durée totale des séries produites par chaque studio",
        "desc": "Pour chaque studio ayant au moins une série répertoriée, calculez le volume horaire total cumulé de ses productions (somme de `nb_episodes * duree_episode_min` convertie en heures et arrondie à 1 décimale) sous l'alias `TotalHeures`.",
        "query": "SELECT St.nom_studio, ROUND(SUM(A.nb_episodes * A.duree_episode_min) / 60.0, 1) AS TotalHeures FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio WHERE A.nb_episodes IS NOT NULL AND A.duree_episode_min IS NOT NULL GROUP BY St.id_studio, St.nom_studio;"
    },
    {
        "num": 7,
        "title": "Détecter les membres n'ayant jamais attribué de note",
        "desc": "Affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`) des membres inscrits qui n'ont jamais renseigné de note personnelle (`note_perso IS NULL`) dans leur Watchlist.",
        "query": "SELECT M.id_membre, M.pseudo FROM MEMBRES M WHERE NOT EXISTS (SELECT 1 FROM WATCHLIST W WHERE W.id_membre = M.id_membre AND W.note_perso IS NOT NULL);"
    },
    {
        "num": 8,
        "title": "Répartition des animes par saison de diffusion",
        "desc": "Affichez le nom de la saison sous l'alias `Saison` et le nombre total d'animes diffusés lors de cette saison sous l'alias `NbAnimes`, pour toutes les saisons renseignées.",
        "query": "SELECT saison AS Saison, COUNT(*) AS NbAnimes FROM ANIMES WHERE saison IS NOT NULL GROUP BY saison;"
    },
    {
        "num": 9,
        "title": "Classifier les animes selon leur volume d'épisodes",
        "desc": "Pour les animes au format série télévisée (`format = 'TV'`), affichez le titre (`titre_romaji`), le nombre d'épisodes (`nb_episodes`) et une colonne sous l'alias `TypeSaison` affichant 'Court (1 cour)' si l'anime compte 13 épisodes ou moins, 'Moyen (2 cours)' s'il compte entre 14 et 26 épisodes, et 'Long fleuve' au-delà.",
        "query": "SELECT titre_romaji, nb_episodes, CASE WHEN nb_episodes <= 13 THEN 'Court (1 cour)' WHEN nb_episodes <= 26 THEN 'Moyen (2 cours)' ELSE 'Long fleuve' END AS TypeSaison FROM ANIMES WHERE format = 'TV' AND nb_episodes IS NOT NULL;"
    }
]

TP7_EX3 = [
    {
        "num": 1,
        "title": "Évaluer la polyvalence globale des professionnels du Staff",
        "desc": "Pour chaque membre du staff, affichez son nom (`nom`), son prénom (`prenom`) et le nombre total d'animes sur lesquels il est intervenu sous l'alias `TotalInterventions`. Triez par polyvalence décroissante.",
        "query": "SELECT S.nom, S.prenom, COUNT(C.id_anime) AS TotalInterventions FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne GROUP BY S.id_personne, S.nom, S.prenom ORDER BY TotalInterventions DESC;"
    },
    {
        "num": 2,
        "title": "Membres ayant terminé un anime produit par le studio favori de leur parrain",
        "desc": "Identifiez les transmissions de passion : affichez sans doublon le pseudo du filleul sous l'alias `Membre`, le pseudo de son parrain sous l'alias `Parrain` et le titre de l'anime (`titre_romaji`), pour chaque cas où le membre a terminé une œuvre produite par un studio pour lequel son parrain a décerné une note de 9 ou 10.",
        "query": "SELECT DISTINCT M.pseudo AS Membre, P.pseudo AS Parrain, A.titre_romaji FROM MEMBRES M JOIN MEMBRES P ON M.id_parrain = P.id_membre JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN ANIMES A ON W.id_anime = A.id_anime WHERE A.id_studio IN (SELECT A2.id_studio FROM WATCHLIST W2 JOIN ANIMES A2 ON W2.id_anime = A2.id_anime WHERE W2.id_membre = P.id_membre AND W2.note_perso >= 9);"
    },
    {
        "num": 3,
        "title": "Identifier le studio cumulant le plus grand nombre total d'épisodes",
        "desc": "Affichez le nom du studio (`nom_studio`) et le volume cumulé d'épisodes produits sous l'alias `TotalEpisodes` pour le studio le plus prolifique de la base.",
        "query": "SELECT St.nom_studio, SUM(A.nb_episodes) AS TotalEpisodes FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio WHERE A.nb_episodes IS NOT NULL GROUP BY St.id_studio, St.nom_studio ORDER BY TotalEpisodes DESC LIMIT 1;"
    },
    {
        "num": 4,
        "title": "Identifier les membres du Staff cumulant au moins 3 casquettes professionnelles distinctes",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de rôles distincts sous l'alias `NbRolesDistincts` pour les créateurs polyvalents ayant exercé au moins 3 rôles différents sur la plateforme.",
        "query": "SELECT S.nom, S.prenom, COUNT(DISTINCT C.role) AS NbRolesDistincts FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne GROUP BY S.id_personne, S.nom, S.prenom HAVING COUNT(DISTINCT C.role) >= 3;"
    },
    {
        "num": 5,
        "title": "Détecter les genres sans aucun anime d'excellence (score >= 8.5)",
        "desc": "Affichez le libellé (`libelle`) des genres pour lesquels aucun anime n'atteint une note moyenne supérieure ou égale à 8.5.",
        "query": "SELECT G.libelle FROM GENRES G WHERE G.id_genre NOT IN (SELECT AG.id_genre FROM ANIME_GENRES AG JOIN ANIMES A ON AG.id_anime = A.id_anime WHERE A.note_moyenne >= 8.5);"
    },
    {
        "num": 6,
        "title": "Détecter les membres inscrits la même année avec le même pays d'origine",
        "desc": "Affichez les binômes de membres partageant la même nationalité (`pays`) et inscrits la même année : le pseudo du premier sous l'alias `Membre1`, celui du second sous l'alias `Membre2` et le pays. Éliminez les doublons symétriques avec `M1.id_membre < M2.id_membre`.",
        "query": "SELECT M1.pseudo AS Membre1, M2.pseudo AS Membre2, M1.pays FROM MEMBRES M1 JOIN MEMBRES M2 ON M1.pays = M2.pays AND strftime('%Y', M1.date_inscription) = strftime('%Y', M2.date_inscription) AND M1.id_membre < M2.id_membre;"
    },
    {
        "num": 7,
        "title": "Studios ayant produit des animes en 2022 et 2023 mais aucun en 2024",
        "desc": "Affichez sans doublon le nom des studios (`nom_studio`) ayant sorti au moins une œuvre en 2022 ET au moins une œuvre en 2023, mais aucune en 2024.",
        "query": "SELECT DISTINCT St.nom_studio FROM STUDIOS St JOIN ANIMES A1 ON St.id_studio = A1.id_studio AND A1.annee_diffusion = 2022 JOIN ANIMES A2 ON St.id_studio = A2.id_studio AND A2.annee_diffusion = 2023 WHERE St.id_studio NOT IN (SELECT id_studio FROM ANIMES WHERE annee_diffusion = 2024 AND id_studio IS NOT NULL);"
    },
    {
        "num": 8,
        "title": "Associer les animes ayant exactement la même note et le même nombre d'épisodes",
        "desc": "Affichez les binômes d'animes partageant le même score et la même longueur : le titre du premier sous l'alias `Anime1`, le titre du second sous l'alias `Anime2`, leur note (`note_moyenne`) et leur nombre d'épisodes (`nb_episodes`). Évitez les doublons symétriques et triez par note décroissante.",
        "query": "SELECT A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2, A1.note_moyenne, A1.nb_episodes FROM ANIMES A1 JOIN ANIMES A2 ON A1.note_moyenne = A2.note_moyenne AND A1.nb_episodes = A2.nb_episodes AND A1.id_anime < A2.id_anime WHERE A1.nb_episodes IS NOT NULL AND A1.note_moyenne IS NOT NULL ORDER BY A1.note_moyenne DESC;"
    },
    {
        "num": 9,
        "title": "Mesurer l'audience des genres par pays de membres",
        "desc": "Pour chaque pays d'abonnés et chaque genre d'anime, affichez le pays (`pays`), le genre (`libelle`) et le nombre total d'animes suivis sous l'alias `NbSuivis`. Triez par pays puis par nombre de suivis décroissant.",
        "query": "SELECT M.pays, G.libelle AS Genre, COUNT(W.id_anime) AS NbSuivis FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre JOIN ANIMES A ON W.id_anime = A.id_anime JOIN ANIME_GENRES AG ON A.id_anime = AG.id_anime JOIN GENRES G ON AG.id_genre = G.id_genre GROUP BY M.pays, G.id_genre, G.libelle ORDER BY M.pays, NbSuivis DESC;"
    },
    {
        "num": 10,
        "title": "Membres ne partageant aucun anime dans leur Watchlist avec leur parrain",
        "desc": "Pour tous les membres parrainés, affichez le pseudo du filleul sous l'alias `Membre` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le membre et son parrain n'ont absolument aucun anime en commun dans leur Watchlist.",
        "query": "SELECT M.pseudo AS Membre, P.pseudo AS Parrain FROM MEMBRES M JOIN MEMBRES P ON M.id_parrain = P.id_membre WHERE NOT EXISTS (SELECT 1 FROM WATCHLIST W1 JOIN WATCHLIST W2 ON W1.id_anime = W2.id_anime WHERE W1.id_membre = M.id_membre AND W2.id_membre = P.id_membre);"
    },
    {
        "num": 11,
        "title": "Détecter les saisons à forte concentration de chefs-d'œuvre",
        "desc": "Affichez l'année (`annee_diffusion`), la saison (`saison`) et le nombre d'animes majeurs sous l'alias `NbMasterpieces`, pour toutes les saisons de diffusion ayant compté au moins 4 animes notés 8.2 ou plus.",
        "query": "SELECT annee_diffusion, saison, COUNT(*) AS NbMasterpieces FROM ANIMES WHERE note_moyenne >= 8.2 AND saison IS NOT NULL GROUP BY annee_diffusion, saison HAVING COUNT(*) >= 4;"
    },
    {
        "num": 12,
        "title": "Division relationnelle : Membres ayant vu tous les animes d'un studio donné",
        "desc": "Problème de division relationnelle : affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`) des membres ayant complété (`statut = 'Termine'`) l'intégralité des productions du studio d'identifiant 1 (`id_studio = 1`).",
        "hint": "Dans `HAVING`, comparez le nombre de productions distinctes complétées avec `(SELECT COUNT(*) FROM ANIMES WHERE id_studio = 1)`.",
        "query": "SELECT M.id_membre, M.pseudo FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN ANIMES A ON W.id_anime = A.id_anime WHERE A.id_studio = 1 GROUP BY M.id_membre, M.pseudo HAVING COUNT(DISTINCT A.id_anime) = (SELECT COUNT(*) FROM ANIMES WHERE id_studio = 1);"
    }
]

TP7_EX4 = [
    {
        "num": 1,
        "title": "Membres cumulant les 4 statuts clés de la communauté",
        "desc": "Trouvez les membres les plus investis qui cumulent à la fois : avoir au moins un anime en cours, avoir au moins un anime terminé, avoir décerné au moins une note de 10/10, et être le parrain d'au moins un autre membre. Affichez leur identifiant (`id_membre`) et leur pseudo (`pseudo`).",
        "query": "SELECT id_membre, pseudo FROM MEMBRES WHERE id_membre IN (SELECT id_membre FROM WATCHLIST WHERE statut = 'En cours') AND id_membre IN (SELECT id_membre FROM WATCHLIST WHERE statut = 'Termine') AND id_membre IN (SELECT id_membre FROM WATCHLIST WHERE note_perso = 10) AND id_membre IN (SELECT DISTINCT id_parrain FROM MEMBRES WHERE id_parrain IS NOT NULL);"
    },
    {
        "num": 2,
        "title": "Conflit de production : réalisateur supervisant deux animes la même saison",
        "desc": "Détectez les surcharges de production : identifiez les réalisateurs crédités sur deux animes différents diffusés au cours de la même année et de la même saison. Affichez l'identifiant du réalisateur (`id_personne`), son nom (`nom`), son prénom (`prenom`), l'année (`annee_diffusion`), la saison (`saison`), le titre du premier anime sous l'alias `Anime1` et du second sous l'alias `Anime2` (`C1.id_anime < C2.id_anime`).",
        "query": "SELECT C1.id_personne, S.nom, S.prenom, A1.annee_diffusion, A1.saison, A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2 FROM CREDITS_ANIME C1 JOIN CREDITS_ANIME C2 ON C1.id_personne = C2.id_personne AND C1.role = 'Realisateur' AND C2.role = 'Realisateur' AND C1.id_anime < C2.id_anime JOIN ANIMES A1 ON C1.id_anime = A1.id_anime JOIN ANIMES A2 ON C2.id_anime = A2.id_anime AND A1.annee_diffusion = A2.annee_diffusion AND A1.saison = A2.saison JOIN STAFF S ON C1.id_personne = S.id_personne;"
    },
    {
        "num": 3,
        "title": "Reconstituer la chaîne de parrainage communautaire à trois niveaux",
        "desc": "Identifiez les lignées de mentorat à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le pseudo du parrain initial sous l'alias `GrandParrain`, celui du parrain intermédiaire sous l'alias `Parrain`, et celui du protégé final sous l'alias `Filleul`.",
        "query": "SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM MEMBRES F JOIN MEMBRES P ON F.id_parrain = P.id_membre JOIN MEMBRES GP ON P.id_parrain = GP.id_membre;"
    },
    {
        "num": 4,
        "title": "Calculer la durée moyenne d'achèvement d'une série",
        "desc": "Pour chaque membre ayant complété au moins un anime avec dates renseignées, calculez la durée moyenne d'achèvement en jours (`date_fin - date_ajout`), arrondie à 1 décimale sous l'alias `DelaiMoyenJours`. Affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`).",
        "query": "SELECT M.id_membre, M.pseudo, ROUND(AVG(CAST(JULIANDAY(W.date_fin) - JULIANDAY(W.date_ajout) AS INT)), 1) AS DelaiMoyenJours FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre WHERE W.date_fin IS NOT NULL AND W.date_ajout IS NOT NULL AND W.statut = 'Termine' GROUP BY M.id_membre, M.pseudo;"
    },
    {
        "num": 5,
        "title": "Calculer le taux d'excellence d'un studio",
        "desc": "Pour chaque studio ayant produit au moins 3 animes, calculez le pourcentage d'œuvres ayant obtenu un score moyen supérieur ou égal à 8.0, arrondi à 1 décimale sous l'alias `TauxExcellencePourcent`. Affichez le nom du studio (`nom_studio`) et le nombre total d'œuvres sous l'alias `TotalAnimes`.",
        "query": "SELECT St.nom_studio, COUNT(A.id_anime) AS TotalAnimes, ROUND(CAST(SUM(CASE WHEN A.note_moyenne >= 8.0 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(A.id_anime) * 100, 1) AS TauxExcellencePourcent FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio GROUP BY St.id_studio, St.nom_studio HAVING COUNT(A.id_anime) >= 3 ORDER BY TauxExcellencePourcent DESC;"
    },
    {
        "num": 6,
        "title": "Animes orphelins : animes sans aucun spectateur",
        "desc": "Affichez l'identifiant (`id_anime`) et le titre (`titre_romaji`) des animes répertoriés dans le catalogue général qui ne figurent dans la Watchlist d'absolument aucun membre.",
        "query": "SELECT ANIMES.id_anime, ANIMES.titre_romaji FROM ANIMES LEFT JOIN WATCHLIST ON ANIMES.id_anime = WATCHLIST.id_anime WHERE WATCHLIST.id_membre IS NULL;"
    },
    {
        "num": 7,
        "title": "Doubleurs omniprésents : artistes incarnant au moins 3 rôles différents",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de personnages interprétés sous l'alias `NbPersonnages` pour les doubleurs professionnels ayant prêté leur voix à au moins 3 personnages distincts.",
        "query": "SELECT S.nom, S.prenom, COUNT(DISTINCT C.personnage_nom) AS NbPersonnages FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne AND C.role = 'Doubleur' GROUP BY S.id_personne, S.nom, S.prenom HAVING COUNT(DISTINCT C.personnage_nom) >= 3 ORDER BY NbPersonnages DESC;"
    },
    {
        "num": 8,
        "title": "Studios sous la responsabilité d'un seul et unique réalisateur",
        "desc": "Affichez le nom du studio (`nom_studio`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls studios d'animation dont l'intégralité des productions a été confiée à un seul et même réalisateur.",
        "query": "SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio JOIN CREDITS_ANIME C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio HAVING COUNT(DISTINCT C.id_personne) = 1;"
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

# Generate TP7
build_intro_file(os.path.join(TPS_DIR, "tp7-00-intro.md"), TP7_INTRO)

build_markdown_file(os.path.join(TPS_DIR, "tp7-ex1.md"), {
    "title": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "intitule": "TP 7 — Grand Cas de Synthèse (AniBase)",
    "base": "AniBase.sqlite",
    "tpNum": 7,
    "exerciceNum": 1,
    "titre": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "permalink": "/tp7/exercice1/"
}, TP7_EX1)

build_markdown_file(os.path.join(TPS_DIR, "tp7-ex2.md"), {
    "title": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "intitule": "TP 7 — Grand Cas de Synthèse (AniBase)",
    "base": "AniBase.sqlite",
    "tpNum": 7,
    "exerciceNum": 2,
    "titre": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "permalink": "/tp7/exercice2/"
}, TP7_EX2)

build_markdown_file(os.path.join(TPS_DIR, "tp7-ex3.md"), {
    "title": "Exercice 3 : Partie III - Requêtes très avancées",
    "intitule": "TP 7 — Grand Cas de Synthèse (AniBase)",
    "base": "AniBase.sqlite",
    "tpNum": 7,
    "exerciceNum": 3,
    "titre": "Exercice 3 : Partie III - Requêtes très avancées",
    "permalink": "/tp7/exercice3/"
}, TP7_EX3)

build_markdown_file(os.path.join(TPS_DIR, "tp7-ex4.md"), {
    "title": "Exercice 4 : Bonus - Défis complexes",
    "intitule": "TP 7 — Grand Cas de Synthèse (AniBase)",
    "base": "AniBase.sqlite",
    "tpNum": 7,
    "exerciceNum": 4,
    "titre": "Exercice 4 : Bonus - Défis complexes",
    "permalink": "/tp7/exercice4/"
}, TP7_EX4)

print("TP7 generated successfully.")

