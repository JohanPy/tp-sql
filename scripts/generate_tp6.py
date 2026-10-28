#!/usr/bin/env python3
"""
Générateur automatisé des fichiers markdown pour TP6, TP7 et TP8.
Vérifie chaque requête attendue sur la base SQLite correspondante avant écriture.
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPS_DIR = os.path.join(BASE_DIR, "src", "tps")
BASES_DIR = os.path.join(BASE_DIR, "bases")

# ==============================================================================
# DONNÉES DU TP 6 : NETFLIXSTREAM
# ==============================================================================
TP6_INTRO = {
    "title": "TP 6 : NetflixStream - Grand Cas de Synthèse",
    "intitule": "TP 6 — Grand Cas de Synthèse (NetflixStream)",
    "base": "NetflixStream.sqlite",
    "tpNum": 6,
    "exerciceNum": 0,
    "titre": "TP 6 : NetflixStream - Grand Cas de Synthèse",
    "permalink": "/tp6/intro/",
    "content": """# TP 6 : NetflixStream - Grand Cas de Synthèse

## Description

Ce TP de synthèse vous fait travailler sur la base **`NetflixStream`**, modélisant une plateforme mondiale de streaming vidéo. Les contenus proviennent des rapports officiels d'audience Netflix (2023-2026), complétés par des historiques d'abonnés et de visionnages :

- **Contenus** : Films et séries du catalogue avec dates de sortie, durées et audiences
- **Genres** : Catégories cinématographiques (Action, Comédie, Sci-Fi...)
- **Personnes & Participations** : Réalisateurs, acteurs principaux et scénaristes
- **Abonnés** : Utilisateurs abonnés avec formule tarifaire et parrainage hiérarchique
- **Visionnages** : Historique des sessions de lecture avec date, heure, durée et notes
- **Favoris** : Liste des œuvres sauvegardées par chaque abonné

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec agrégats, orphelins et conditions (9 questions)
- **Partie III** : Requêtes avancées, auto-jointures, dates et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, détection de fraudes et hiérarchies (8 questions)

## Schéma de la base de données

La base `NetflixStream` contient :

### Tables principales

- **GENRES** (🔑 `id_genre`, `nom`)
- **CONTENUS** (🔑 `id_contenu`, `titre`, `type_format`, `date_sortie`, `duree_minutes`, `classification`, `disponible_monde`, `heures_vues_officielles`, 🔗 `id_genre`)
- **PERSONNES** (🔑 `id_personne`, `nom`, `prenom`, `date_naissance`, `nationalite`)
- **PARTICIPATIONS** (🔑🔗 `id_contenu`, 🔑🔗 `id_personne`, 🔑 `role`)
- **ABONNES** (🔑 `id_abonne`, `nom`, `prenom`, `email`, `pays`, `ville`, `date_naissance`, `date_inscription`, `formule`, 🔗 `id_parrain`)
- **VISIONNAGES** (🔑 `id_visionnage`, 🔗 `id_abonne`, 🔗 `id_contenu`, `date_visionnage`, `heure_debut`, `duree_regardee_min`, `note_avis`)
- **FAVORIS** (🔑🔗 `id_abonne`, 🔑🔗 `id_contenu`, `date_ajout`)
"""
}

TP6_EX1 = [
    {
        "num": 1,
        "title": "Afficher tous les abonnés de la plateforme",
        "desc": "À partir de la table `ABONNES`, affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et le pays (`pays`) de tous les abonnés.",
        "query": "SELECT id_abonne, nom, prenom, pays FROM ABONNES;"
    },
    {
        "num": 2,
        "title": "Lister les genres cinématographiques disponibles",
        "desc": "À partir de la table `GENRES`, affichez l'identifiant (`id_genre`) et l'intitulé (`nom`) de l'ensemble des genres disponibles.",
        "query": "SELECT id_genre, nom FROM GENRES;"
    },
    {
        "num": 3,
        "title": "Consulter les contenus d'un genre spécifique",
        "desc": "Pour le genre d'identifiant 3 (`id_genre = 3`), affichez le titre (`titre`), le format (`type_format`) et la durée en minutes (`duree_minutes`).",
        "query": "SELECT titre, type_format, duree_minutes FROM CONTENUS WHERE id_genre = 3;"
    },
    {
        "num": 4,
        "title": "Croiser les contenus avec leur genre",
        "desc": "Pour chaque contenu du catalogue, affichez son titre (`titre`), son type (`type_format`) et le nom de son genre sous l'alias `Genre`.",
        "query": "SELECT CONTENUS.titre, CONTENUS.type_format, GENRES.nom AS Genre FROM CONTENUS JOIN GENRES ON CONTENUS.id_genre = GENRES.id_genre;"
    },
    {
        "num": 5,
        "title": "Identifier les réalisateurs et les contenus qu'ils ont dirigés",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des réalisateurs ainsi que le titre du contenu dirigé sous l'alias `TitreOeuvre` (`role = 'Realisateur'`).",
        "query": "SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CONTENUS.titre AS TitreOeuvre FROM PERSONNES JOIN PARTICIPATIONS ON PERSONNES.id_personne = PARTICIPATIONS.id_personne JOIN CONTENUS ON PARTICIPATIONS.id_contenu = CONTENUS.id_contenu WHERE PARTICIPATIONS.role = 'Realisateur';"
    },
    {
        "num": 6,
        "title": "Identifier les acteurs principaux des films",
        "desc": "Affichez sans doublon le nom (`nom`) et le prénom (`prenom`) des artistes tenant le rôle d'acteur principal (`role = 'Acteur principal'`) dans des œuvres au format film (`type_format = 'Film'`), ainsi que le titre du film sous l'alias `Film`.",
        "query": "SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CONTENUS.titre AS Film FROM PERSONNES JOIN PARTICIPATIONS ON PERSONNES.id_personne = PARTICIPATIONS.id_personne JOIN CONTENUS ON PARTICIPATIONS.id_contenu = CONTENUS.id_contenu WHERE PARTICIPATIONS.role = 'Acteur principal' AND CONTENUS.type_format = 'Film';"
    },
    {
        "num": 7,
        "title": "Historique des visionnages d'un abonné donné",
        "desc": "Pour l'abonné ayant l'identifiant 1 (`id_abonne = 1`), affichez le titre du contenu regardé (`titre`), la date de visionnage (`date_visionnage`) et la note attribuée (`note_avis`).",
        "query": "SELECT CONTENUS.titre, VISIONNAGES.date_visionnage, VISIONNAGES.note_avis FROM VISIONNAGES JOIN CONTENUS ON VISIONNAGES.id_contenu = CONTENUS.id_contenu WHERE VISIONNAGES.id_abonne = 1;"
    },
    {
        "num": 8,
        "title": "Croiser les abonnés et leurs favoris",
        "desc": "Pour chaque favori enregistré, affichez le nom de l'abonné (`nom`), son prénom (`prenom`), le titre du contenu (`titre`) et le nom du genre sous l'alias `Genre`.",
        "query": "SELECT DISTINCT ABONNES.nom, ABONNES.prenom, CONTENUS.titre, GENRES.nom AS Genre FROM FAVORIS JOIN ABONNES ON FAVORIS.id_abonne = ABONNES.id_abonne JOIN CONTENUS ON FAVORIS.id_contenu = CONTENUS.id_contenu JOIN GENRES ON CONTENUS.id_genre = GENRES.id_genre;"
    },
    {
        "num": 9,
        "title": "Compter les contenus disponibles par genre",
        "desc": "Pour chaque genre, affichez son libellé (`nom`) et le nombre total de contenus associés sous l'alias `NbContenus`. Tous les genres doivent figurer dans le résultat (en affichant 0 pour ceux sans aucun contenu).",
        "query": "SELECT GENRES.nom, COUNT(CONTENUS.id_contenu) AS NbContenus FROM GENRES LEFT JOIN CONTENUS ON GENRES.id_genre = CONTENUS.id_genre GROUP BY GENRES.id_genre, GENRES.nom;"
    },
    {
        "num": 10,
        "title": "Identifier les abonnés très actifs",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de visionnages distincts sous l'alias `NbVisionnages` pour les abonnés ayant visionné strictement plus de 5 contenus.",
        "query": "SELECT ABONNES.nom, ABONNES.prenom, COUNT(VISIONNAGES.id_visionnage) AS NbVisionnages FROM ABONNES JOIN VISIONNAGES ON ABONNES.id_abonne = VISIONNAGES.id_abonne GROUP BY ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom HAVING COUNT(VISIONNAGES.id_visionnage) > 5;"
    },
    {
        "num": 11,
        "title": "Mesurer la popularité des contenus par le nombre de visionnages",
        "desc": "Pour chaque contenu du catalogue, affichez son titre (`titre`) et son nombre total de visionnages sous l'alias `NbVues` (en incluant les contenus jamais regardés avec la valeur 0).",
        "query": "SELECT CONTENUS.titre, COUNT(VISIONNAGES.id_visionnage) AS NbVues FROM CONTENUS LEFT JOIN VISIONNAGES ON CONTENUS.id_contenu = VISIONNAGES.id_contenu GROUP BY CONTENUS.id_contenu, CONTENUS.titre;"
    },
    {
        "num": 12,
        "title": "Artistes ayant été à la fois réalisateur et acteur principal sur la même œuvre",
        "desc": "Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre du contenu (`titre`) pour les artistes ayant cumulé les rôles de réalisateur et d'acteur principal sur un même contenu.",
        "hint": "Effectuez deux jointures sur la table `PARTICIPATIONS` avec des alias distincts liés sur le même `id_personne` et le même `id_contenu`.",
        "query": "SELECT DISTINCT P.nom, P.prenom, C.titre FROM PERSONNES P JOIN PARTICIPATIONS P1 ON P.id_personne = P1.id_personne AND P1.role = 'Realisateur' JOIN PARTICIPATIONS P2 ON P.id_personne = P2.id_personne AND P2.role = 'Acteur principal' AND P1.id_contenu = P2.id_contenu JOIN CONTENUS C ON P1.id_contenu = C.id_contenu;"
    },
    {
        "num": 13,
        "title": "Filtrer les abonnés d'une tranche d'âge spécifique",
        "desc": "À partir de leur date de naissance (`date_naissance`), affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et la date de naissance des abonnés nés entre 2000 et 2005 inclus.",
        "query": "SELECT id_abonne, nom, prenom, date_naissance FROM ABONNES WHERE strftime('%Y', date_naissance) BETWEEN '2000' AND '2005';"
    },
    {
        "num": 14,
        "title": "Associer chaque réalisateur aux abonnés ayant mis ses films en favoris",
        "desc": "Affichez sans doublon le nom du réalisateur sous l'alias `Realisateur`, le titre du film (`titre`) et le nom de l'abonné sous l'alias `Abonne` qui a placé cette œuvre dans ses favoris.",
        "query": "SELECT DISTINCT P.nom AS Realisateur, C.titre, A.nom AS Abonne FROM PERSONNES P JOIN PARTICIPATIONS Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN CONTENUS C ON Part.id_contenu = C.id_contenu JOIN FAVORIS F ON C.id_contenu = F.id_contenu JOIN ABONNES A ON F.id_abonne = A.id_abonne;"
    },
    {
        "num": 15,
        "title": "Détecter les contenus orphelins sans aucun visionnage",
        "desc": "Identifiez les contenus orphelins : affichez l'identifiant (`id_contenu`) et le titre (`titre`) des contenus présents au catalogue qui n'ont fait l'objet d'aucun visionnage enregistré.",
        "query": "SELECT CONTENUS.id_contenu, CONTENUS.titre FROM CONTENUS LEFT JOIN VISIONNAGES ON CONTENUS.id_contenu = VISIONNAGES.id_contenu WHERE VISIONNAGES.id_visionnage IS NULL;"
    }
]

TP6_EX2 = [
    {
        "num": 1,
        "title": "Calculer le nombre total de favoris par abonné",
        "desc": "Pour chaque abonné de la plateforme, affichez son nom (`nom`), son prénom (`prenom`) et le nombre total de contenus en favoris sous l'alias `NbFavoris` (en affichant 0 pour les abonnés sans aucun favori).",
        "hint": "Utilisez `LEFT JOIN` et comptez un attribut de la table de droite (ex: `COUNT(FAVORIS.id_contenu)`) pour éviter que `COUNT(*)` ne compte 1 ligne pour les nuls.",
        "query": "SELECT ABONNES.nom, ABONNES.prenom, COUNT(FAVORIS.id_contenu) AS NbFavoris FROM ABONNES LEFT JOIN FAVORIS ON ABONNES.id_abonne = FAVORIS.id_abonne GROUP BY ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom;"
    },
    {
        "num": 2,
        "title": "Afficher les abonnés accompagnés du nom de leur parrain",
        "desc": "Pour tous les abonnés disposant d'un parrain officiel, affichez le nom du filleul sous l'alias `Abonne` ainsi que le nom de famille de son parrain sous l'alias `Parrain`.",
        "query": "SELECT Filleul.nom AS Abonne, Parrain.nom AS Parrain FROM ABONNES Filleul JOIN ABONNES Parrain ON Filleul.id_parrain = Parrain.id_abonne;"
    },
    {
        "num": 3,
        "title": "Dénombrer les réalisateurs distincts ayant officié par genre",
        "desc": "Pour chaque genre du catalogue, affichez son intitulé (`nom`) ainsi que le nombre de réalisateurs distincts ayant dirigé au moins une œuvre dans ce genre, sous l'alias `NbRealisateurs` (en incluant les genres sans réalisateur avec la valeur 0).",
        "query": "SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM GENRES G LEFT JOIN CONTENUS C ON G.id_genre = C.id_genre LEFT JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom;"
    },
    {
        "num": 4,
        "title": "Synthèse d'activité par genre : volume de contenus et note moyenne",
        "desc": "Pour chaque genre, affichez son libellé (`nom`), le nombre total d'œuvres sous l'alias `NbContenus`, ainsi que la note moyenne attribuée par les utilisateurs arrondie à 2 décimales sous l'alias `NoteMoyenne`.",
        "query": "SELECT G.nom, COUNT(DISTINCT C.id_contenu) AS NbContenus, ROUND(AVG(V.note_avis), 2) AS NoteMoyenne FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre LEFT JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY G.id_genre, G.nom;"
    },
    {
        "num": 5,
        "title": "Identifier les abonnés ayant visionné le contenu le plus regardé",
        "desc": "Déterminez le contenu ayant cumulé le plus grand nombre de sessions de visionnage sur la plateforme, puis affichez sans doublon le nom (`nom`) et le prénom (`prenom`) des abonnés qui l'ont regardé.",
        "hint": "Isolez l'identifiant du contenu le plus populaire à l'aide d'une sous-requête avec `GROUP BY ... ORDER BY COUNT(*) DESC LIMIT 1`.",
        "query": "SELECT DISTINCT A.nom, A.prenom FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne WHERE V.id_contenu = (SELECT id_contenu FROM VISIONNAGES GROUP BY id_contenu ORDER BY COUNT(*) DESC LIMIT 1);"
    },
    {
        "num": 6,
        "title": "Calculer la durée moyenne de visionnage par format",
        "desc": "Pour chaque format de contenu (`type_format`), affichez l'intitulé du format et la durée moyenne de visionnage en minutes (arrondie à 1 décimale) sous l'alias `DureeMoyenne`.",
        "query": "SELECT C.type_format, ROUND(AVG(V.duree_regardee_min), 1) AS DureeMoyenne FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY C.type_format;"
    },
    {
        "num": 7,
        "title": "Détecter les abonnés inactifs n'ayant jamais rien regardé",
        "desc": "Affichez l'identifiant (`id_abonne`), le nom (`nom`) et le prénom (`prenom`) des abonnés inscrits sur la plateforme qui n'ont effectué aucun visionnage.",
        "query": "SELECT ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom FROM ABONNES LEFT JOIN VISIONNAGES ON ABONNES.id_abonne = VISIONNAGES.id_abonne WHERE VISIONNAGES.id_visionnage IS NULL;"
    },
    {
        "num": 8,
        "title": "Répartition des visionnages par mois de l'année",
        "desc": "À partir de la date de visionnage (`date_visionnage`), affichez le numéro du mois sur deux chiffres sous l'alias `Mois` et le nombre total de visionnages enregistrés sous l'alias `NbVisionnages`, trié par ordre chronologique.",
        "query": "SELECT strftime('%m', date_visionnage) AS Mois, COUNT(*) AS NbVisionnages FROM VISIONNAGES GROUP BY Mois ORDER BY Mois;"
    },
    {
        "num": 9,
        "title": "Classifier les abonnés selon leur formule tarifaire",
        "desc": "À partir de la table `ABONNES`, affichez le nom (`nom`), le prénom (`prenom`), la formule (`formule`) et une colonne sous l'alias `Segment` affichant 'Haut de gamme' si la formule est 'Premium', 'Intermédiaire' si la formule est 'Standard', et 'Économique' dans le cas contraire.",
        "query": "SELECT nom, prenom, formule, CASE WHEN formule = 'Premium' THEN 'Haut de gamme' WHEN formule = 'Standard' THEN 'Intermédiaire' ELSE 'Économique' END AS Segment FROM ABONNES;"
    }
]

TP6_EX3 = [
    {
        "num": 1,
        "title": "Évaluer l'engagement global d'un abonné",
        "desc": "Pour chaque abonné, affichez son nom (`nom`), son prénom (`prenom`) et le cumul de son engagement (somme de ses visionnages, de ses favoris et de ses avis notés) sous l'alias `ScoreEngagement`. Triez par score décroissant.",
        "hint": "Vous pouvez additionner directement des sous-requêtes scalaires `(SELECT COUNT(*) FROM ...)` dans la clause `SELECT`.",
        "query": "SELECT A.nom, A.prenom, (SELECT COUNT(*) FROM VISIONNAGES V WHERE V.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM FAVORIS F WHERE F.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM VISIONNAGES V2 WHERE V2.id_abonne = A.id_abonne AND V2.note_avis IS NOT NULL) AS ScoreEngagement FROM ABONNES A ORDER BY ScoreEngagement DESC;"
    },
    {
        "num": 2,
        "title": "Abonnés ayant noté une œuvre réalisée par leur propre parrain",
        "desc": "Identifiez les situations croisées : affichez sans doublon le nom du filleul sous l'alias `Filleul`, le nom de son parrain sous l'alias `Parrain` et le titre du contenu (`titre`), pour chaque cas où l'abonné a noté une œuvre dirigée par son parrain.",
        "query": "SELECT DISTINCT A.nom AS Filleul, P.nom AS Parrain, C.titre FROM ABONNES A JOIN ABONNES P ON A.id_parrain = P.id_abonne JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne JOIN CONTENUS C ON V.id_contenu = C.id_contenu JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' WHERE Part.id_personne = P.id_abonne AND V.note_avis IS NOT NULL;"
    },
    {
        "num": 3,
        "title": "Identifier le contenu au temps total de visionnage le plus élevé",
        "desc": "Affichez le titre du contenu (`titre`) et le volume cumulé des minutes regardées sous l'alias `TotalMinutes` pour l'œuvre qui totalise le plus grand temps de lecture sur la plateforme.",
        "query": "SELECT C.titre, SUM(V.duree_regardee_min) AS TotalMinutes FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY C.id_contenu, C.titre ORDER BY TotalMinutes DESC LIMIT 1;"
    },
    {
        "num": 4,
        "title": "Identifier les artistes cumulant les 3 rôles clés",
        "desc": "Affichez sans doublon l'identifiant (`id_personne`), le nom (`nom`) et le prénom (`prenom`) des artistes polyvalents qui interviennent dans les trois rôles sur la plateforme : réalisateur, acteur principal et scénariste.",
        "hint": "Combinez trois clauses `WHERE EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE ...)` pour éviter de démultiplier les lignes par jointures.",
        "query": "SELECT P.id_personne, P.nom, P.prenom FROM PERSONNES P WHERE EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Realisateur') AND EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Acteur principal') AND EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Scenariste');"
    },
    {
        "num": 5,
        "title": "Détecter les genres totalement inactifs",
        "desc": "Affichez l'identifiant (`id_genre`) et l'intitulé (`nom`) des genres qui n'ont aucun contenu au catalogue ou dont aucun contenu n'a fait l'objet d'un visionnage.",
        "query": "SELECT G.id_genre, G.nom FROM GENRES G WHERE G.id_genre NOT IN (SELECT id_genre FROM CONTENUS WHERE id_genre IS NOT NULL) OR G.id_genre NOT IN (SELECT DISTINCT C.id_genre FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE C.id_genre IS NOT NULL);"
    },
    {
        "num": 6,
        "title": "Détecter les homonymes parmi les abonnés",
        "desc": "Trouvez les abonnés partageant le même nom de famille : affichez le nom commun (`nom`), le prénom du premier sous l'alias `Prenom1` et le prénom du second sous l'alias `Prenom2`. Éliminez les auto-associations et doublons symétriques avec `A1.id_abonne < A2.id_abonne`.",
        "query": "SELECT A1.nom, A1.prenom AS Prenom1, A2.prenom AS Prenom2 FROM ABONNES A1 JOIN ABONNES A2 ON A1.nom = A2.nom AND A1.id_abonne < A2.id_abonne;"
    },
    {
        "num": 7,
        "title": "Contenus visionnés en semaine mais jamais le week-end",
        "desc": "Affichez sans doublon le titre des contenus (`titre`) qui ont été visionnés du lundi au vendredi (`strftime('%w', ...) BETWEEN '1' AND '5'`) mais dont aucune séance n'a été enregistrée le samedi ou le dimanche (`'0'` ou `'6'`).",
        "query": "SELECT DISTINCT C.titre FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE strftime('%w', V.date_visionnage) BETWEEN '1' AND '5' AND C.id_contenu NOT IN (SELECT id_contenu FROM VISIONNAGES WHERE strftime('%w', date_visionnage) IN ('0', '6'));"
    },
    {
        "num": 8,
        "title": "Associer les abonnés inscrits exactement le même jour",
        "desc": "Affichez les binômes d'abonnés s'étant inscrits à la même date : le nom du premier sous l'alias `Abonne1`, le nom du second sous l'alias `Abonne2` et la date commune (`date_inscription`). Évitez les doublons symétriques et triez par date croissante.",
        "query": "SELECT A1.nom AS Abonne1, A2.nom AS Abonne2, A1.date_inscription FROM ABONNES A1 JOIN ABONNES A2 ON A1.date_inscription = A2.date_inscription AND A1.id_abonne < A2.id_abonne ORDER BY A1.date_inscription;"
    },
    {
        "num": 9,
        "title": "Mesurer l'audimat par genre et par formule d'abonnement",
        "desc": "Pour chaque genre et chaque formule d'abonnement, affichez le libellé du genre (`nom`), la formule (`formule`) et le nombre total de visionnages sous l'alias `TotalVues`. Triez par genre puis par volume de vues décroissant.",
        "query": "SELECT G.nom AS Genre, A.formule, COUNT(V.id_visionnage) AS TotalVues FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu JOIN ABONNES A ON V.id_abonne = A.id_abonne GROUP BY G.id_genre, G.nom, A.formule ORDER BY Genre, TotalVues DESC;"
    },
    {
        "num": 10,
        "title": "Abonnés n'ayant aucun genre favori en commun avec leur parrain",
        "desc": "Pour tous les abonnés ayant un parrain, affichez le nom du filleul sous l'alias `Filleul` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le filleul et son parrain n'ont aucun genre d'œuvres en commun dans leurs listes de favoris.",
        "hint": "Utilisez `WHERE NOT EXISTS` en reliant les favoris du filleul à ceux du parrain sur la table `CONTENUS` via `id_genre`.",
        "query": "SELECT A.nom AS Filleul, P.nom AS Parrain FROM ABONNES A JOIN ABONNES P ON A.id_parrain = P.id_abonne WHERE NOT EXISTS (SELECT 1 FROM FAVORIS F1 JOIN CONTENUS C1 ON F1.id_contenu = C1.id_contenu JOIN FAVORIS F2 ON F2.id_abonne = P.id_abonne JOIN CONTENUS C2 ON F2.id_contenu = C2.id_contenu WHERE F1.id_abonne = A.id_abonne AND C1.id_genre = C2.id_genre);"
    },
    {
        "num": 11,
        "title": "Jours à forte diversité de visionnage",
        "desc": "Affichez la date de visionnage (`date_visionnage`) et le nombre de genres différents consultés sous l'alias `NbGenresVus`, pour toutes les journées où les abonnés ont regardé au moins 4 genres distincts.",
        "query": "SELECT V.date_visionnage, COUNT(DISTINCT C.id_genre) AS NbGenresVus FROM VISIONNAGES V JOIN CONTENUS C ON V.id_contenu = C.id_contenu GROUP BY V.date_visionnage HAVING COUNT(DISTINCT C.id_genre) >= 4;"
    },
    {
        "num": 12,
        "title": "Division relationnelle : Abonnés ayant vu tous les films d'un genre donné",
        "desc": "Problème de division relationnelle : affichez l'identifiant (`id_abonne`), le nom (`nom`) et le prénom (`prenom`) des abonnés qui ont visionné l'intégralité de tous les films du genre d'identifiant 1 (`id_genre = 1`).",
        "hint": "Dans la clause `HAVING`, comparez le nombre de contenus distincts visionnés par l'abonné au nombre total de films du genre via `(SELECT COUNT(*) FROM CONTENUS WHERE id_genre = 1 AND type_format = 'Film')`.",
        "query": "SELECT A.id_abonne, A.nom, A.prenom FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne JOIN CONTENUS C ON V.id_contenu = C.id_contenu WHERE C.id_genre = 1 AND C.type_format = 'Film' GROUP BY A.id_abonne, A.nom, A.prenom HAVING COUNT(DISTINCT C.id_contenu) = (SELECT COUNT(*) FROM CONTENUS WHERE id_genre = 1 AND type_format = 'Film');"
    }
]

TP6_EX4 = [
    {
        "num": 1,
        "title": "Abonnés cumulant les 4 statuts clés",
        "desc": "Trouvez les abonnés les plus engagés sur la plateforme, cumulant à la fois : avoir effectué au moins un visionnage, avoir au moins un contenu en favori, avoir attribué au moins une note d'avis, et être parrain d'au moins un autre membre. Affichez leur identifiant (`id_abonne`), leur nom (`nom`) et leur prénom (`prenom`).",
        "query": "SELECT id_abonne, nom, prenom FROM ABONNES WHERE id_abonne IN (SELECT id_abonne FROM VISIONNAGES) AND id_abonne IN (SELECT id_abonne FROM FAVORIS) AND id_abonne IN (SELECT id_abonne FROM VISIONNAGES WHERE note_avis IS NOT NULL) AND id_abonne IN (SELECT DISTINCT id_parrain FROM ABONNES WHERE id_parrain IS NOT NULL);"
    },
    {
        "num": 2,
        "title": "Détecter les fraudes de compte : double visionnage simultané à la même heure",
        "desc": "Détectez les partages de compte suspects : identifiez les abonnés enregistrés sur deux visionnages distincts ayant lieu le même jour et à la même heure de début. Affichez l'identifiant de l'abonné (`id_abonne`), son nom (`nom`), la date (`date_visionnage`), l'horaire (`heure_debut`), le titre du premier contenu sous l'alias `Film1` et celui du second sous l'alias `Film2`. Veillez à éliminer les paires symétriques avec `V1.id_contenu < V2.id_contenu`.",
        "hint": "Une auto-jointure sur `VISIONNAGES` (`V1.id_abonne = V2.id_abonne AND V1.date_visionnage = V2.date_visionnage AND V1.heure_debut = V2.heure_debut`) permet d'isoler les collisions temporelles exactes.",
        "query": "SELECT V1.id_abonne, A.nom, V1.date_visionnage, V1.heure_debut, C1.titre AS Film1, C2.titre AS Film2 FROM VISIONNAGES V1 JOIN VISIONNAGES V2 ON V1.id_abonne = V2.id_abonne AND V1.date_visionnage = V2.date_visionnage AND V1.heure_debut = V2.heure_debut AND V1.id_contenu < V2.id_contenu JOIN ABONNES A ON V1.id_abonne = A.id_abonne JOIN CONTENUS C1 ON V1.id_contenu = C1.id_contenu JOIN CONTENUS C2 ON V2.id_contenu = C2.id_contenu;"
    },
    {
        "num": 3,
        "title": "Reconstituer la chaîne hiérarchique de parrainage à trois niveaux",
        "desc": "Identifiez les lignées de parrainage à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le nom du parrain initial sous l'alias `GrandParrain`, le nom du parrain intermédiaire sous l'alias `Parrain`, et le nom du protégé final sous l'alias `Filleul`.",
        "query": "SELECT GP.nom AS GrandParrain, P.nom AS Parrain, F.nom AS Filleul FROM ABONNES F JOIN ABONNES P ON F.id_parrain = P.id_abonne JOIN ABONNES GP ON P.id_parrain = GP.id_abonne;"
    },
    {
        "num": 4,
        "title": "Calculer le délai d'activation avant le premier visionnage",
        "desc": "Pour chaque abonné ayant regardé au moins un contenu, calculez le nombre de jours écoulés entre sa date d'inscription (`date_inscription`) et son tout premier visionnage (`MIN(date_visionnage)`). Affichez son identifiant (`id_abonne`), son nom (`nom`) et le délai en jours sous l'alias `JoursAvantPremierVisionnage`.",
        "hint": "Utilisez `CAST(JULIANDAY(MIN(V.date_visionnage)) - JULIANDAY(A.date_inscription) AS INT)` pour soustraire deux dates au format ISO.",
        "query": "SELECT A.id_abonne, A.nom, CAST(JULIANDAY(MIN(V.date_visionnage)) - JULIANDAY(A.date_inscription) AS INT) AS JoursAvantPremierVisionnage FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne GROUP BY A.id_abonne, A.nom;"
    },
    {
        "num": 5,
        "title": "Calculer le taux de complétion moyen par contenu",
        "desc": "Pour chaque contenu d'une durée strictement positive, calculez le ratio de complétion moyen (durée visionnée divisée par la durée totale de l'œuvre), exprimé en pourcentage et arrondi à 1 décimale sous l'alias `TauxCompletionPourcent`. Affichez le titre (`titre`), la durée (`duree_minutes`) et triez par taux décroissant.",
        "query": "SELECT C.titre, C.duree_minutes, ROUND(AVG(CAST(V.duree_regardee_min AS FLOAT) / C.duree_minutes) * 100, 1) AS TauxCompletionPourcent FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE C.duree_minutes > 0 GROUP BY C.id_contenu, C.titre, C.duree_minutes ORDER BY TauxCompletionPourcent DESC;"
    },
    {
        "num": 6,
        "title": "Contenus mis en favoris par des abonnés mais jamais lancés par ceux-ci",
        "desc": "Identifiez les envies non concrétisées : affichez sans doublon le nom de l'abonné sous l'alias `Abonne` et le titre de l'œuvre (`titre`) pour les contenus que l'abonné a ajoutés dans ses favoris mais qu'il n'a encore jamais visionnés.",
        "hint": "Utilisez `WHERE NOT EXISTS (SELECT 1 FROM VISIONNAGES WHERE ...)` reliant le même abonné et le même contenu.",
        "query": "SELECT DISTINCT A.nom AS Abonne, C.titre FROM FAVORIS F JOIN ABONNES A ON F.id_abonne = A.id_abonne JOIN CONTENUS C ON F.id_contenu = C.id_contenu WHERE NOT EXISTS (SELECT 1 FROM VISIONNAGES V WHERE V.id_abonne = F.id_abonne AND V.id_contenu = F.id_contenu);"
    },
    {
        "num": 7,
        "title": "Réalisateurs dont tous les contenus notés ont obtenu une moyenne supérieure à 4",
        "desc": "Affichez le nom (`nom`), le prénom (`prenom`), le nombre d'œuvres sous l'alias `NbOeuvres` et la note moyenne globale arrondie à 2 décimales sous l'alias `NoteMoyenneGlobale`, pour les réalisateurs dont l'ensemble des contenus ayant reçu des avis enregistrent une note moyenne strictement supérieure ou égale à 4.0.",
        "query": "SELECT P.nom, P.prenom, COUNT(DISTINCT C.id_contenu) AS NbOeuvres, ROUND(AVG(V.note_avis), 2) AS NoteMoyenneGlobale FROM PERSONNES P JOIN PARTICIPATIONS Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN CONTENUS C ON Part.id_contenu = C.id_contenu JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE V.note_avis IS NOT NULL GROUP BY P.id_personne, P.nom, P.prenom HAVING AVG(V.note_avis) >= 4.0;"
    },
    {
        "num": 8,
        "title": "Genres sous la responsabilité exclusive d'un seul réalisateur",
        "desc": "Affichez le libellé du genre (`nom`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls genres cinématographiques dont l'ensemble des œuvres présentes au catalogue a été dirigé par un seul et unique réalisateur.",
        "query": "SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom HAVING COUNT(DISTINCT Part.id_personne) = 1;"
    }
]

# Write TP6 files
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

# Generate TP6
build_intro_file(os.path.join(TPS_DIR, "tp6-00-intro.md"), TP6_INTRO)

build_markdown_file(os.path.join(TPS_DIR, "tp6-ex1.md"), {
    "title": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "intitule": "TP 6 — Grand Cas de Synthèse (NetflixStream)",
    "base": "NetflixStream.sqlite",
    "tpNum": 6,
    "exerciceNum": 1,
    "titre": "Exercice 1 : Partie I - Requêtes de base et jointures simples",
    "permalink": "/tp6/exercice1/"
}, TP6_EX1)

build_markdown_file(os.path.join(TPS_DIR, "tp6-ex2.md"), {
    "title": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "intitule": "TP 6 — Grand Cas de Synthèse (NetflixStream)",
    "base": "NetflixStream.sqlite",
    "tpNum": 6,
    "exerciceNum": 2,
    "titre": "Exercice 2 : Partie II - Requêtes intermédiaires",
    "permalink": "/tp6/exercice2/"
}, TP6_EX2)

build_markdown_file(os.path.join(TPS_DIR, "tp6-ex3.md"), {
    "title": "Exercice 3 : Partie III - Requêtes très avancées",
    "intitule": "TP 6 — Grand Cas de Synthèse (NetflixStream)",
    "base": "NetflixStream.sqlite",
    "tpNum": 6,
    "exerciceNum": 3,
    "titre": "Exercice 3 : Partie III - Requêtes très avancées",
    "permalink": "/tp6/exercice3/"
}, TP6_EX3)

build_markdown_file(os.path.join(TPS_DIR, "tp6-ex4.md"), {
    "title": "Exercice 4 : Bonus - Défis complexes",
    "intitule": "TP 6 — Grand Cas de Synthèse (NetflixStream)",
    "base": "NetflixStream.sqlite",
    "tpNum": 6,
    "exerciceNum": 4,
    "titre": "Exercice 4 : Bonus - Défis complexes",
    "permalink": "/tp6/exercice4/"
}, TP6_EX4)

print("TP6 generated successfully.")

