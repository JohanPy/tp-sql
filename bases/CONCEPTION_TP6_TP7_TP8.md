# Conception détaillée des TP 6, TP 7 et TP 8 (Grands Cas de Synthèse et Révision)

Ce document formalise la conception pédagogique complète des **TP 6, TP 7 et TP 8**, bâtis en stricte équivalence didactique avec le **TP 5 (`Gymnase2000`)**.

Chaque TP constitue un **grand cas de synthèse** couvrant l'ensemble des compétences du semestre en croisant et complexifiant les notions :
- Projections, restrictions, fonctions scalaires et arithmétique.
- Jointures internes multi-tables ($2$ à $4$ tables).
- Jointures externes (`LEFT JOIN`) et détection d'orphelins (`IS NULL`).
- Agrégats (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`), groupements (`GROUP BY`) et filtres de groupes (`HAVING`).
- Conditions multiples, expressions conditionnelles (`CASE WHEN ... THEN ... ELSE ... END`).
- Vrai travail sur les dates réelles (`YEAR`, `MONTH`, `DAYNAME`, `DATEDIFF`, comparaisons temporelles).
- Auto-jointures (mentors/parrains, homonymes/paires symétriques, détection de collisions/conflits d'horaires).
- Sous-requêtes dans le `WHERE`, dans le `SELECT` et corrélées (`EXISTS`, `NOT EXISTS`, `IN`, `NOT IN`).
- Division relationnelle ("pour tous", couverture complète d'un ensemble).

---

## Matrice d'équivalence conceptuelle (TP 5 vs TP 6 vs TP 7 vs TP 8)

| Concept didactique | TP 5 (`Gymnase2000`) | TP 6 (`NetflixStream`) | TP 7 (`AniBase`) | TP 8 (`CineData`) |
| :--- | :--- | :--- | :--- | :--- |
| **Base & Schéma** | 7 tables (Sportifs, Sports, Gymnases, Jouer...) | 6 tables (Contenus, Genres, Abonnes, Visionnages, Participations, Favoris) | 6 tables (Animes, Studios, Genres, Anime_Genres, Membres, Watchlist, Staff) | 6 tables (Films, Genres, Film_Genres, Personnes, Castings, Cinephiles, Avis) |
| **Auto-jointure 1 (Hiérarchie)** | Conseiller (`IdSportifConseiller`) | Parrainage (`id_parrain`) | Parrainage (`id_parrain`) | Parrainage (`id_parrain`) |
| **Auto-jointure 2 (Conflit temporel)** | Entraîneur dans 2 gymnases même jour/heure | Double visionnage simultané même heure/jour | Studio/Réalisateur avec 2 animes la même saison | Cinéphile en salle à 2 séances au même horaire |
| **Auto-jointure 3 (Paires symétriques)** | Homonymes / Sportifs de même âge (`S1.id < S2.id`) | Abonnés nés la même année dans la même ville | Doubleurs incarnant 2 rôles dans le même anime | Acteurs ayant tourné ensemble dans le même film |
| **Jointure externe (Orphelins)** | Sports sans séance / Gymnases vides / Sportifs sans sport | Contenus jamais vus / Abonnés inactifs / Genres orphelins | Animes sans spectateur / Studios inactifs / Genres vides | Films sans avis / Personnes sans casting / Genres orphelins |
| **Dates & Temporalité** | Limité à `Jour` texte et `Horaire` entier | `date_sortie`, `date_inscription`, `date_visionnage`, `DATEDIFF` | `annee_diffusion`, `saison`, `date_inscription`, `date_maj` | `date_sortie`, `date_seance`, `date_inscription`, rentabilité |
| **Division relationnelle** | Pratiquer TOUS les sports du complexe | Avoir vu TOUS les contenus d'un genre donné | Avoir vu TOUS les animes d'un studio donné | Avoir vu TOUS les films d'un réalisateur donné |
| **Cumul de rôles (Multi-statuts)** | Joueur + Entraîneur + Arbitre + Conseiller | Réalisateur + Acteur + Scénariste / Modérateur | Réalisateur + Scénariste + Doubleur | Réalisateur + Acteur principal + Producteur |

---

# TP 6 : `NetflixStream` — Grand Cas de Synthèse Streaming Vidéo

Base de données : `NetflixStream.sqlite` (Top contenus réels Netflix 2023-2026 + Abonnés et Visionnages synthétiques).

### Exercice 1 : Requêtes de base et jointures simples (15 questions)

1. **Lister tous les abonnés de la plateforme**
   - Énoncé : Affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et le pays (`pays`) de tous les abonnés.
   - Requête : `SELECT id_abonne, nom, prenom, pays FROM Abonnes;`
2. **Lister les genres cinématographiques disponibles**
   - Énoncé : Affichez l'identifiant (`id_genre`) et l'intitulé (`nom`) de l'ensemble des genres.
   - Requête : `SELECT id_genre, nom FROM Genres;`
3. **Consulter les contenus d'un genre spécifique**
   - Énoncé : Pour le genre 'Science-Fiction' (`id_genre = 3`), affichez le titre (`titre`), le format (`type_format`) et la durée (`duree_minutes`).
   - Requête : `SELECT titre, type_format, duree_minutes FROM Contenus WHERE id_genre = 3;`
4. **Croiser les contenus avec leur genre**
   - Énoncé : Pour chaque contenu du catalogue, affichez son titre (`titre`), son type (`type_format`) et le nom de son genre sous l'alias `Genre`.
   - Requête : `SELECT Contenus.titre, Contenus.type_format, Genres.nom AS Genre FROM Contenus JOIN Genres ON Contenus.id_genre = Genres.id_genre;`
5. **Identifier les réalisateurs et les contenus qu'ils ont dirigés**
   - Énoncé : Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des réalisateurs ainsi que le titre du contenu dirigé sous l'alias `TitreOeuvre`.
   - Requête : `SELECT DISTINCT Personnes.nom, Personnes.prenom, Contenus.titre AS TitreOeuvre FROM Personnes JOIN Participations ON Personnes.id_personne = Participations.id_personne JOIN Contenus ON Participations.id_contenu = Contenus.id_contenu WHERE Participations.role = 'Realisateur';`
6. **Identifier les acteurs principaux et leurs films**
   - Énoncé : Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des artistes et le titre du film dans lequel ils tiennent un rôle d'acteur principal (`role = 'Acteur principal'`).
   - Requête : `SELECT DISTINCT Personnes.nom, Personnes.prenom, Contenus.titre AS Film FROM Personnes JOIN Participations ON Personnes.id_personne = Participations.id_personne JOIN Contenus ON Participations.id_contenu = Contenus.id_contenu WHERE Participations.role = 'Acteur principal' AND Contenus.type_format = 'Film';`
7. **Historique des visionnages d'un abonné donné**
   - Énoncé : Pour l'abonné n°1 (`id_abonne = 1`), affichez le titre du contenu regardé (`titre`), la date de visionnage (`date_visionnage`) et la note attribuée (`note_avis`).
   - Requête : `SELECT Contenus.titre, Visionnages.date_visionnage, Visionnages.note_avis FROM Visionnages JOIN Contenus ON Visionnages.id_contenu = Contenus.id_contenu WHERE Visionnages.id_abonne = 1;`
8. **Croiser les abonnés et les contenus qu'ils ont enregistrés en favoris**
   - Énoncé : Pour chaque favori enregistré, affichez le nom de l'abonné (`nom`), son prénom (`prenom`), le titre du contenu (`titre`) et le genre du contenu sous l'alias `Genre`.
   - Requête : `SELECT DISTINCT Abonnes.nom, Abonnes.prenom, Contenus.titre, Genres.nom AS Genre FROM Favoris JOIN Abonnes ON Favoris.id_abonne = Abonnes.id_abonne JOIN Contenus ON Favoris.id_contenu = Contenus.id_contenu JOIN Genres ON Contenus.id_genre = Genres.id_genre;`
9. **Compter les contenus disponibles par genre (en incluant les genres vides)**
   - Énoncé : Pour chaque genre, affichez son libellé (`libelle`) et le nombre de contenus associés sous l'alias `NbContenus` (les genres sans contenu doivent afficher 0).
   - Requête : `SELECT Genres.nom, COUNT(Contenus.id_contenu) AS NbContenus FROM Genres LEFT JOIN Contenus ON Genres.id_genre = Contenus.id_genre GROUP BY Genres.id_genre, Genres.nom;`
10. **Identifier les abonnés très actifs ayant visionné plus de 5 contenus**
    - Énoncé : Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de visionnages distincts sous l'alias `NbVisionnages` pour les abonnés ayant plus de 5 visionnages.
    - Requête : `SELECT Abonnes.nom, Abonnes.prenom, COUNT(Visionnages.id_visionnage) AS NbVisionnages FROM Abonnes JOIN Visionnages ON Abonnes.id_abonne = Visionnages.id_abonne GROUP BY Abonnes.id_abonne, Abonnes.nom, Abonnes.prenom HAVING COUNT(Visionnages.id_visionnage) > 5;`
11. **Mesurer la popularité des contenus par le nombre de visionnages**
    - Énoncé : Pour chaque contenu du catalogue, affichez son titre (`titre`) et son nombre total de visionnages sous l'alias `NbVues` (en affichant 0 pour les contenus jamais vus).
    - Requête : `SELECT Contenus.titre, COUNT(Visionnages.id_visionnage) AS NbVues FROM Contenus LEFT JOIN Visionnages ON Contenus.id_contenu = Visionnages.id_contenu GROUP BY Contenus.id_contenu, Contenus.titre;`
12. **Trouver les artistes à double casquette acteur et réalisateur sur le même contenu**
    - Énoncé : Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre du contenu (`titre`) pour les artistes ayant été à la fois réalisateur et acteur principal sur la même œuvre.
    - Requête : `SELECT DISTINCT P.nom, P.prenom, C.titre FROM Personnes P JOIN Participations P1 ON P.id_personne = P1.id_personne AND P1.role = 'Realisateur' JOIN Participations P2 ON P.id_personne = P2.id_personne AND P2.role = 'Acteur principal' AND P1.id_contenu = P2.id_contenu JOIN Contenus C ON P1.id_contenu = C.id_contenu;`
13. **Filtrer les abonnés d'une tranche d'âge spécifique**
    - Énoncé : À partir de la date de naissance des abonnés, affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et la date de naissance (`date_naissance`) des abonnés nés entre 2000 et 2005 inclus.
    - Requête : `SELECT id_abonne, nom, prenom, date_naissance FROM Abonnes WHERE strftime('%Y', date_naissance) BETWEEN '2000' AND '2005';`
14. **Associer chaque réalisateur aux abonnés ayant mis ses films en favoris**
    - Énoncé : Affichez sans doublon le nom du réalisateur sous l'alias `Realisateur`, le titre du film (`titre`) et le nom de l'abonné sous l'alias `Abonne` qui a mis ce film en favori.
    - Requête : `SELECT DISTINCT P.nom AS Realisateur, C.titre, A.nom AS Abonne FROM Personnes P JOIN Participations Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN Contenus C ON Part.id_contenu = C.id_contenu JOIN Favoris F ON C.id_contenu = F.id_contenu JOIN Abonnes A ON F.id_abonne = A.id_abonne;`
15. **Détecter les contenus orphelins sans aucun visionnage enregistré**
    - Énoncé : Affichez l'identifiant (`id_contenu`) et le titre (`titre`) des contenus présents au catalogue qui n'ont fait l'objet d'absolument aucun visionnage.
    - Requête : `SELECT Contenus.id_contenu, Contenus.titre FROM Contenus LEFT JOIN Visionnages ON Contenus.id_contenu = Visionnages.id_contenu WHERE Visionnages.id_visionnage IS NULL;`

---

### Exercice 2 : Requêtes intermédiaires (9 questions)

1. **Calculer le nombre total de favoris par abonné (avec zéros)**
   - Requête : `SELECT Abonnes.nom, Abonnes.prenom, COUNT(Favoris.id_contenu) AS NbFavoris FROM Abonnes LEFT JOIN Favoris ON Abonnes.id_abonne = Favoris.id_abonne GROUP BY Abonnes.id_abonne, Abonnes.nom, Abonnes.prenom;`
2. **Afficher les abonnés accompagnés du nom de leur parrain**
   - Requête : `SELECT Filleul.nom AS Abonne, Parrain.nom AS Parrain FROM Abonnes Filleul JOIN Abonnes Parrain ON Filleul.id_parrain = Parrain.id_abonne;`
3. **Dénombrer les réalisateurs distincts ayant officié par genre**
   - Requête : `SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM Genres G LEFT JOIN Contenus C ON G.id_genre = C.id_genre LEFT JOIN Participations Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom;`
4. **Synthèse d'activité par genre : volume horaire et note moyenne**
   - Requête : `SELECT G.nom, COUNT(DISTINCT C.id_contenu) AS NbContenus, ROUND(AVG(V.note_avis), 2) AS NoteMoyenne FROM Genres G JOIN Contenus C ON G.id_genre = C.id_genre LEFT JOIN Visionnages V ON C.id_contenu = V.id_contenu GROUP BY G.id_genre, G.nom;`
5. **Identifier les abonnés ayant visionné le contenu le plus regardé de la plateforme**
   - Requête : `SELECT DISTINCT A.nom, A.prenom FROM Abonnes A JOIN Visionnages V ON A.id_abonne = V.id_abonne WHERE V.id_contenu = (SELECT id_contenu FROM Visionnages GROUP BY id_contenu ORDER BY COUNT(*) DESC LIMIT 1);`
6. **Calculer la durée moyenne de visionnage par format**
   - Requête : `SELECT C.type_format, ROUND(AVG(V.duree_regardee_min), 1) AS DureeMoyenne FROM Contenus C JOIN Visionnages V ON C.id_contenu = V.id_contenu GROUP BY C.type_format;`
7. **Détecter les abonnés inactifs n'ayant jamais rien regardé**
   - Requête : `SELECT Abonnes.id_abonne, Abonnes.nom, Abonnes.prenom FROM Abonnes LEFT JOIN Visionnages ON Abonnes.id_abonne = Visionnages.id_abonne WHERE Visionnages.id_visionnage IS NULL;`
8. **Répartition des visionnages par mois de l'année**
   - Requête : `SELECT strftime('%m', date_visionnage) AS Mois, COUNT(*) AS NbVisionnages FROM Visionnages GROUP BY Mois ORDER BY Mois;`
9. **Classifier les abonnés selon leur formule tarifaire (CASE WHEN)**
   - Requête : `SELECT nom, prenom, formule, CASE WHEN formule = 'Premium' THEN 'Haut de gamme' WHEN formule = 'Standard' THEN 'Intermédiaire' ELSE 'Économique' END AS Segment FROM Abonnes;`

---

### Exercice 3 : Requêtes très avancées (12 questions)

1. **Évaluer l'engagement global d'un abonné (Favoris + Visionnages + Évaluations)**
   - Requête : `SELECT A.nom, A.prenom, (SELECT COUNT(*) FROM Visionnages V WHERE V.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM Favoris F WHERE F.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM Visionnages V2 WHERE V2.id_abonne = A.id_abonne AND V2.note_avis IS NOT NULL) AS ScoreEngagement FROM Abonnes A ORDER BY ScoreEngagement DESC;`
2. **Abonnés ayant noté un film réalisé par leur propre parrain**
   - Requête : `SELECT DISTINCT A.nom AS Filleul, P.nom AS Parrain, C.titre FROM Abonnes A JOIN Abonnes P ON A.id_parrain = P.id_abonne JOIN Visionnages V ON A.id_abonne = V.id_abonne JOIN Contenus C ON V.id_contenu = C.id_contenu JOIN Participations Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' WHERE Part.id_personne = P.id_abonne AND V.note_avis IS NOT NULL;`
3. **Identifier le contenu ayant cumulé le plus grand temps total de visionnage**
   - Requête : `SELECT C.titre, SUM(V.duree_regardee_min) AS TotalMinutes FROM Contenus C JOIN Visionnages V ON C.id_contenu = V.id_contenu GROUP BY C.id_contenu, C.titre ORDER BY TotalMinutes DESC LIMIT 1;`
4. **Identifier les artistes ayant cumulé les 3 rôles (Réalisateur, Acteur, Scénariste)**
   - Requête : `SELECT P.id_personne, P.nom, P.prenom FROM Personnes P WHERE EXISTS (SELECT 1 FROM Participations WHERE id_personne = P.id_personne AND role = 'Realisateur') AND EXISTS (SELECT 1 FROM Participations WHERE id_personne = P.id_personne AND role = 'Acteur principal') AND EXISTS (SELECT 1 FROM Participations WHERE id_personne = P.id_personne AND role = 'Scenariste');`
5. **Genres totalement inactifs (aucun contenu, aucun favori, aucun visionnage)**
   - Requête : `SELECT G.id_genre, G.nom FROM Genres G WHERE G.id_genre NOT IN (SELECT id_genre FROM Contenus) AND G.id_genre NOT IN (SELECT DISTINCT C.id_genre FROM Contenus C JOIN Visionnages V ON C.id_contenu = V.id_contenu);`
6. **Homonymes parmi les abonnés**
   - Requête : `SELECT A1.nom, A1.prenom AS Prenom1, A2.prenom AS Prenom2 FROM Abonnes A1 JOIN Abonnes A2 ON A1.nom = A2.nom AND A1.id_abonne < A2.id_abonne;`
7. **Contenus visionnés en semaine mais jamais le week-end**
   - Requête : `SELECT DISTINCT C.titre FROM Contenus C JOIN Visionnages V ON C.id_contenu = V.id_contenu WHERE strftime('%w', V.date_visionnage) BETWEEN '1' AND '5' AND C.id_contenu NOT IN (SELECT id_contenu FROM Visionnages WHERE strftime('%w', date_visionnage) IN ('0', '6'));`
8. **Binômes d'abonnés inscrits exactement le même jour**
   - Requête : `SELECT A1.nom AS Abonne1, A2.nom AS Abonne2, A1.date_inscription FROM Abonnes A1 JOIN Abonnes A2 ON A1.date_inscription = A2.date_inscription AND A1.id_abonne < A2.id_abonne ORDER BY A1.date_inscription;`
9. **Mesurer l'audimat par genre et par formule d'abonnement**
   - Requête : `SELECT G.nom AS Genre, A.formule, COUNT(V.id_visionnage) AS TotalVues FROM Genres G JOIN Contenus C ON G.id_genre = C.id_genre JOIN Visionnages V ON C.id_contenu = V.id_contenu JOIN Abonnes A ON V.id_abonne = A.id_abonne GROUP BY G.id_genre, G.nom, A.formule ORDER BY Genre, TotalVues DESC;`
10. **Abonnés n'ayant aucun genre favori en commun avec leur parrain**
    - Requête : `SELECT A.nom AS Filleul, P.nom AS Parrain FROM Abonnes A JOIN Abonnes P ON A.id_parrain = P.id_abonne WHERE NOT EXISTS (SELECT 1 FROM Favoris F1 JOIN Contenus C1 ON F1.id_contenu = C1.id_contenu JOIN Favoris F2 ON F2.id_abonne = P.id_abonne JOIN Contenus C2 ON F2.id_contenu = C2.id_contenu WHERE F1.id_abonne = A.id_abonne AND C1.id_genre = C2.id_genre);`
11. **Jours à forte diversité de visionnage (au moins 4 genres distincts regardés)**
    - Requête : `SELECT V.date_visionnage, COUNT(DISTINCT C.id_genre) AS NbGenresVus FROM Visionnages V JOIN Contenus C ON V.id_contenu = C.id_contenu GROUP BY V.date_visionnage HAVING COUNT(DISTINCT C.id_genre) >= 4;`
12. **Division relationnelle : Abonnés ayant vu l'intégralité des films d'animation**
    - Requête : `SELECT A.id_abonne, A.nom, A.prenom FROM Abonnes A JOIN Visionnages V ON A.id_abonne = V.id_abonne JOIN Contenus C ON V.id_contenu = C.id_contenu WHERE C.id_genre = (SELECT id_genre FROM Genres WHERE libelle = 'Animation') AND C.type_format = 'Film' GROUP BY A.id_abonne, A.nom, A.prenom HAVING COUNT(DISTINCT C.id_contenu) = (SELECT COUNT(*) FROM Contenus WHERE id_genre = (SELECT id_genre FROM Genres WHERE libelle = 'Animation') AND type_format = 'Film');`

---

### Exercice 4 : Bonus - Défis complexes (8 questions)

1. **Abonnés cumulant les 4 statuts clés de la plateforme**
   - Requête : `SELECT id_abonne, nom, prenom FROM Abonnes WHERE id_abonne IN (SELECT id_abonne FROM Visionnages) AND id_abonne IN (SELECT id_abonne FROM Favoris) AND id_abonne IN (SELECT id_abonne FROM Visionnages WHERE note_avis IS NOT NULL) AND id_abonne IN (SELECT DISTINCT id_parrain FROM Abonnes WHERE id_parrain IS NOT NULL);`
2. **Détecter les fraudes de compte : double visionnage simultané à la même heure**
   - Requête : `SELECT V1.id_abonne, A.nom, V1.date_visionnage, V1.heure_debut, C1.titre AS Film1, C2.titre AS Film2 FROM Visionnages V1 JOIN Visionnages V2 ON V1.id_abonne = V2.id_abonne AND V1.date_visionnage = V2.date_visionnage AND V1.heure_debut = V2.heure_debut AND V1.id_contenu < V2.id_contenu JOIN Abonnes A ON V1.id_abonne = A.id_abonne JOIN Contenus C1 ON V1.id_contenu = C1.id_contenu JOIN Contenus C2 ON V2.id_contenu = C2.id_contenu;`
3. **Reconstituer la chaîne de parrainage à trois niveaux (Grand-Parrain, Parrain, Filleul)**
   - Requête : `SELECT GP.nom AS GrandParrain, P.nom AS Parrain, F.nom AS Filleul FROM Abonnes F JOIN Abonnes P ON F.id_parrain = P.id_abonne JOIN Abonnes GP ON P.id_parrain = GP.id_abonne;`
4. **Calculer le taux de rétention / délai moyen avant premier visionnage**
   - Requête : `SELECT A.id_abonne, A.nom, CAST(JULIANDAY(MIN(V.date_visionnage)) - JULIANDAY(A.date_inscription) AS INT) AS JoursAvantPremierVisionnage FROM Abonnes A JOIN Visionnages V ON A.id_abonne = V.id_abonne GROUP BY A.id_abonne, A.nom;`
5. **Calculer le ratio de complétion moyen par contenu**
   - Requête : `SELECT C.titre, C.duree_minutes, ROUND(AVG(CAST(V.duree_regardee_min AS FLOAT) / C.duree_minutes) * 100, 1) AS TauxCompletionPourcent FROM Contenus C JOIN Visionnages V ON C.id_contenu = V.id_contenu WHERE C.duree_minutes > 0 GROUP BY C.id_contenu, C.titre, C.duree_minutes ORDER BY TauxCompletionPourcent DESC;`
6. **Contenus mis en favoris par des abonnés mais JAMAIS lancés par ceux-ci**
   - Requête : `SELECT DISTINCT A.nom AS Abonne, C.titre FROM Favoris F JOIN Abonnes A ON F.id_abonne = A.id_abonne JOIN Contenus C ON F.id_contenu = C.id_contenu WHERE NOT EXISTS (SELECT 1 FROM Visionnages V WHERE V.id_abonne = F.id_abonne AND V.id_contenu = F.id_contenu);`
7. **Réalisateurs dont tous les contenus produits ont reçu une note moyenne > 4**
   - Requête : `SELECT P.nom, P.prenom, COUNT(DISTINCT C.id_contenu) AS NbOeuvres, ROUND(AVG(V.note_avis), 2) AS NoteMoyenneGlobale FROM Personnes P JOIN Participations Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN Contenus C ON Part.id_contenu = C.id_contenu JOIN Visionnages V ON C.id_contenu = V.id_contenu WHERE V.note_avis IS NOT NULL GROUP BY P.id_personne, P.nom, P.prenom HAVING MIN(V.note_avis) >= 3 AND AVG(V.note_avis) >= 4.0;`
8. **Genres exclusifs à un seul et unique réalisateur au catalogue**
   - Requête : `SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM Genres G JOIN Contenus C ON G.id_genre = C.id_genre JOIN Participations Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom HAVING COUNT(DISTINCT Part.id_personne) = 1;`

---

# TP 7 : `AniBase` — Grand Cas de Synthèse Anime & Pop-Culture

Base de données : `AniBase.sqlite` (Top animes récents AniList GraphQL 2020-2026 + Studios + Membres synthétiques).

### Exercice 1 : Requêtes de base et jointures simples (15 questions)

1. **Lister tous les animes répertoriés**
   - Requête : `SELECT id_anime, titre_romaji, format, annee_diffusion FROM Animes;`
2. **Lister les studios d'animation**
   - Requête : `SELECT id_studio, nom_studio, pays FROM Studios;`
3. **Animes produits par un studio donné**
   - Requête : `SELECT titre_romaji, format, nb_episodes FROM Animes WHERE id_studio = 1;`
4. **Croiser chaque anime avec son studio de production**
   - Requête : `SELECT Animes.titre_romaji, Studios.nom_studio, Animes.annee_diffusion FROM Animes JOIN Studios ON Animes.id_studio = Studios.id_studio;`
5. **Identifier les réalisateurs et les animes qu'ils ont dirigés**
   - Requête : `SELECT DISTINCT S.nom, S.prenom, A.titre_romaji FROM Staff S JOIN Credits_Anime C ON S.id_personne = C.id_personne JOIN Animes A ON C.id_anime = A.id_anime WHERE C.role = 'Realisateur';`
6. **Lister les doubleurs et leurs personnages associés**
   - Requête : `SELECT S.nom, S.prenom, C.personnage_nom, A.titre_romaji FROM Staff S JOIN Credits_Anime C ON S.id_personne = C.id_personne JOIN Animes A ON C.id_anime = A.id_anime WHERE C.role = 'Doubleur';`
7. **Watchlist d'un membre donné**
   - Requête : `SELECT A.titre_romaji, W.statut, W.note_perso FROM Watchlist W JOIN Animes A ON W.id_anime = A.id_anime WHERE W.id_membre = 1;`
8. **Croiser les membres avec les animes qu'ils ont terminés**
   - Requête : `SELECT DISTINCT M.pseudo, A.titre_romaji, W.note_perso FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre JOIN Animes A ON W.id_anime = A.id_anime WHERE W.statut = 'Termine';`
9. **Compter les animes par studio (en incluant les studios sans production)**
   - Requête : `SELECT Studios.nom_studio, COUNT(Animes.id_anime) AS NbAnimes FROM Studios LEFT JOIN Animes ON Studios.id_studio = Animes.id_studio GROUP BY Studios.id_studio, Studios.nom_studio;`
10. **Identifier les membres très investis ayant plus de 8 animes dans leur liste**
    - Requête : `SELECT M.pseudo, COUNT(W.id_anime) AS TotalSuivis FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre GROUP BY M.id_membre, M.pseudo HAVING COUNT(W.id_anime) > 8;`
11. **Dénombrer les membres suivant chaque anime**
    - Requête : `SELECT Animes.titre_romaji, COUNT(Watchlist.id_membre) AS NbAbonnes FROM Animes LEFT JOIN Watchlist ON Animes.id_anime = Watchlist.id_anime GROUP BY Animes.id_anime, Animes.titre_romaji;`
12. **Doubleurs ayant également un rôle de réalisateur ou scénariste sur le même anime**
    - Requête : `SELECT DISTINCT S.nom, S.prenom, A.titre_romaji FROM Staff S JOIN Credits_Anime C1 ON S.id_personne = C1.id_personne AND C1.role = 'Doubleur' JOIN Credits_Anime C2 ON S.id_personne = C2.id_personne AND C2.role IN ('Realisateur', 'Scenariste') AND C1.id_anime = C2.id_anime JOIN Animes A ON C1.id_anime = A.id_anime;`
13. **Filtrer les animes par fourchette de note moyenne (entre 8.0 et 9.0)**
    - Requête : `SELECT titre_romaji, score_moyen, format FROM Animes WHERE score_moyen BETWEEN 8.0 AND 9.0;`
14. **Associer chaque réalisateur aux membres qui ont noté 10/10 un de ses animes**
    - Requête : `SELECT DISTINCT S.nom AS Realisateur, A.titre_romaji, M.pseudo AS Fan FROM Staff S JOIN Credits_Anime C ON S.id_personne = C.id_personne AND C.role = 'Realisateur' JOIN Animes A ON C.id_anime = A.id_anime JOIN Watchlist W ON A.id_anime = W.id_anime JOIN Membres M ON W.id_membre = M.id_membre WHERE W.note_perso = 10;`
15. **Détecter les studios sans aucune production enregistrée dans la sélection**
    - Requête : `SELECT Studios.id_studio, Studios.nom_studio FROM Studios LEFT JOIN Animes ON Studios.id_studio = Animes.id_studio WHERE Animes.id_anime IS NULL;`

---

### Exercice 2 : Requêtes intermédiaires (9 questions)

1. **Calculer le nombre d'animes terminés par membre**
   - Requête : `SELECT M.pseudo, COUNT(W.id_anime) AS NbTermines FROM Membres M LEFT JOIN Watchlist W ON M.id_membre = W.id_membre AND W.statut = 'Termine' GROUP BY M.id_membre, M.pseudo;`
2. **Afficher les membres accompagnés du pseudo de leur parrain**
   - Requête : `SELECT Filleul.pseudo AS Membre, Parrain.pseudo AS Parrain FROM Membres Filleul JOIN Membres Parrain ON Filleul.id_parrain = Parrain.id_membre;`
3. **Dénombrer les réalisateurs différents par studio**
   - Requête : `SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM Studios St LEFT JOIN Animes A ON St.id_studio = A.id_studio LEFT JOIN Credits_Anime C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio;`
4. **Volume moyen d'épisodes et note moyenne par format (TV vs Film)**
   - Requête : `SELECT format, ROUND(AVG(nb_episodes), 1) AS MoyenneEpisodes, ROUND(AVG(score_moyen), 2) AS NoteMoyenne FROM Animes GROUP BY format;`
5. **Membres ayant regardé l'anime ayant la meilleure note moyenne de la base**
   - Requête : `SELECT DISTINCT M.pseudo FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre WHERE W.id_anime = (SELECT id_anime FROM Animes ORDER BY score_moyen DESC LIMIT 1);`
6. **Durée totale en heures des séries d'un studio donné**
   - Requête : `SELECT St.nom_studio, ROUND(SUM(A.nb_episodes * A.duree_episode_min) / 60.0, 1) AS TotalHeures FROM Studios St JOIN Animes A ON St.id_studio = A.id_studio GROUP BY St.id_studio, St.nom_studio;`
7. **Détecter les membres n'ayant jamais noté aucun anime**
   - Requête : `SELECT M.id_membre, M.pseudo FROM Membres M LEFT JOIN Watchlist W ON M.id_membre = W.id_membre AND W.note_perso IS NOT NULL WHERE W.id_anime IS NULL;`
8. **Répartition des animes par saison de diffusion**
   - Requête : `SELECT saison, COUNT(*) AS NbAnimes FROM Animes WHERE saison IS NOT NULL GROUP BY saison;`
9. **Catégoriser la longueur des animes (Court, Standard, Long)**
   - Requête : `SELECT titre_romaji, nb_episodes, CASE WHEN nb_episodes <= 13 THEN 'Court (1 cour)' WHEN nb_episodes <= 26 THEN 'Moyen (2 cours)' ELSE 'Long fleuve' END AS CategorieFormat FROM Animes WHERE format = 'TV';`

---

### Exercice 3 : Requêtes très avancées (12 questions)

1. **Polyvalence du Staff (Total des interventions en tant que doubleur, réalisateur et scénariste)**
   - Requête : `SELECT S.nom, S.prenom, COUNT(C.id_anime) AS TotalInterventions FROM Staff S JOIN Credits_Anime C ON S.id_personne = C.id_personne GROUP BY S.id_personne, S.nom, S.prenom ORDER BY TotalInterventions DESC;`
2. **Membres ayant terminé un anime produit par le studio préféré de leur parrain**
   - Requête : `SELECT DISTINCT M.pseudo AS Membre, P.pseudo AS Parrain, A.titre_romaji FROM Membres M JOIN Membres P ON M.id_parrain = P.id_membre JOIN Watchlist W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN Animes A ON W.id_anime = A.id_anime WHERE A.id_studio IN (SELECT A2.id_studio FROM Watchlist W2 JOIN Animes A2 ON W2.id_anime = A2.id_anime WHERE W2.id_membre = P.id_membre AND W2.note_perso >= 9);`
3. **Identifier le studio cumulant le plus grand nombre d'épisodes diffusés**
   - Requête : `SELECT St.nom_studio, SUM(A.nb_episodes) AS TotalEpisodes FROM Studios St JOIN Animes A ON St.id_studio = A.id_studio GROUP BY St.id_studio, St.nom_studio ORDER BY TotalEpisodes DESC LIMIT 1;`
4. **Personnes du Staff cumulant au moins 3 rôles différents sur l'ensemble de la base**
   - Requête : `SELECT S.id_personne, S.nom, S.prenom FROM Staff S WHERE (SELECT COUNT(DISTINCT role) FROM Credits_Anime WHERE id_personne = S.id_personne) >= 3;`
5. **Genres sans aucun anime répertorié au-dessus de 8.0 de moyenne**
   - Requête : `SELECT G.id_genre, G.libelle FROM Genres G WHERE G.id_genre NOT IN (SELECT AG.id_genre FROM Anime_Genres AG JOIN Animes A ON AG.id_anime = A.id_anime WHERE A.score_moyen >= 8.0);`
6. **Membres ayant choisi le même pseudo ou préfixe (Homonymes / Similarités)**
   - Requête : `SELECT M1.pseudo AS Membre1, M2.pseudo AS Membre2, M1.pays FROM Membres M1 JOIN Membres M2 ON M1.pays = M2.pays AND M1.date_inscription = M2.date_inscription AND M1.id_membre < M2.id_membre;`
7. **Studios ayant produit des animes en 2023 ET 2024 mais aucun en 2025**
   - Requête : `SELECT DISTINCT St.nom_studio FROM Studios St JOIN Animes A1 ON St.id_studio = A1.id_studio AND A1.annee_diffusion = 2023 JOIN Animes A2 ON St.id_studio = A2.id_studio AND A2.annee_diffusion = 2024 WHERE St.id_studio NOT IN (SELECT id_studio FROM Animes WHERE annee_diffusion = 2025);`
8. **Binômes d'animes ayant exactement la même note et le même nombre d'épisodes**
   - Requête : `SELECT A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2, A1.score_moyen, A1.nb_episodes FROM Animes A1 JOIN Animes A2 ON A1.score_moyen = A2.score_moyen AND A1.nb_episodes = A2.nb_episodes AND A1.id_anime < A2.id_anime;`
9. **Fréquentation des genres par pays de membre**
   - Requête : `SELECT M.pays, G.libelle AS Genre, COUNT(W.id_anime) AS NbVues FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre JOIN Animes A ON W.id_anime = A.id_anime JOIN Anime_Genres AG ON A.id_anime = AG.id_anime JOIN Genres G ON AG.id_genre = G.id_genre GROUP BY M.pays, G.id_genre, G.libelle ORDER BY M.pays, NbVues DESC;`
10. **Membres ne partageant aucun anime en commun dans leur watchlist avec leur parrain**
    - Requête : `SELECT M.pseudo AS Membre, P.pseudo AS Parrain FROM Membres M JOIN Membres P ON M.id_parrain = P.id_membre WHERE NOT EXISTS (SELECT 1 FROM Watchlist W1 JOIN Watchlist W2 ON W1.id_anime = W2.id_anime WHERE W1.id_membre = M.id_membre AND W2.id_membre = P.id_membre);`
11. **Saisons fastes : Saisons comptant au moins 5 animes notés plus de 8.5**
    - Requête : `SELECT annee_diffusion, saison, COUNT(*) AS NbMasterpieces FROM Animes WHERE score_moyen >= 8.5 GROUP BY annee_diffusion, saison HAVING COUNT(*) >= 5;`
12. **Division relationnelle : Membres ayant vu l'intégralité des animes du Studio Ghibli**
    - Requête : `SELECT M.id_membre, M.pseudo FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN Animes A ON W.id_anime = A.id_anime WHERE A.id_studio = (SELECT id_studio FROM Studios WHERE nom_studio = 'Studio Ghibli') GROUP BY M.id_membre, M.pseudo HAVING COUNT(DISTINCT A.id_anime) = (SELECT COUNT(*) FROM Animes WHERE id_studio = (SELECT id_studio FROM Studios WHERE nom_studio = 'Studio Ghibli'));`

---

### Exercice 4 : Bonus - Défis complexes (8 questions)

1. **Membres cumulant les 4 statuts clés de la communauté**
   - Requête : `SELECT id_membre, pseudo FROM Membres WHERE id_membre IN (SELECT id_membre FROM Watchlist WHERE statut = 'Termine') AND id_membre IN (SELECT id_membre FROM Watchlist WHERE statut = 'En cours') AND id_membre IN (SELECT id_membre FROM Watchlist WHERE note_perso = 10) AND id_membre IN (SELECT DISTINCT id_parrain FROM Membres WHERE id_parrain IS NOT NULL);`
2. **Conflit de production : Même réalisateur supervisant deux animes diffusés lors de la même saison**
   - Requête : `SELECT C1.id_personne, S.nom, S.prenom, A1.annee_diffusion, A1.saison, A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2 FROM Credits_Anime C1 JOIN Credits_Anime C2 ON C1.id_personne = C2.id_personne AND C1.role = 'Realisateur' AND C2.role = 'Realisateur' AND C1.id_anime < C2.id_anime JOIN Animes A1 ON C1.id_anime = A1.id_anime JOIN Animes A2 ON C2.id_anime = A2.id_anime AND A1.annee_diffusion = A2.annee_diffusion AND A1.saison = A2.saison JOIN Staff S ON C1.id_personne = S.id_personne;`
3. **Chaîne de parrainage otaku à 3 niveaux**
   - Requête : `SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM Membres F JOIN Membres P ON F.id_parrain = P.id_membre JOIN Membres GP ON P.id_parrain = GP.id_membre;`
4. **Calculer la vitesse de visionnage : délai moyen entre début et fin d'une série**
   - Requête : `SELECT M.id_membre, M.pseudo, ROUND(AVG(CAST(JULIANDAY(W.date_fin) - JULIANDAY(W.date_debut) AS INT)), 1) AS DelaiMoyenJours FROM Membres M JOIN Watchlist W ON M.id_membre = W.id_membre WHERE W.date_fin IS NOT NULL AND W.date_debut IS NOT NULL GROUP BY M.id_membre, M.pseudo;`
5. **Densité de qualité d'un studio (ratio animes au-dessus de 8.5 sur total)**
   - Requête : `SELECT St.nom_studio, COUNT(A.id_anime) AS TotalAnimes, SUM(CASE WHEN A.score_moyen >= 8.5 THEN 1 ELSE 0 END) AS NbSucces, ROUND(CAST(SUM(CASE WHEN A.score_moyen >= 8.5 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(A.id_anime) * 100, 1) AS TauxSuccesPourcent FROM Studios St JOIN Animes A ON St.id_studio = A.id_studio GROUP BY St.id_studio, St.nom_studio HAVING COUNT(A.id_anime) >= 3 ORDER BY TauxSuccesPourcent DESC;`
6. **Animes orphelins : Animes sans aucun membre les ayant inscrits en watchlist**
   - Requête : `SELECT Animes.id_anime, Animes.titre_romaji FROM Animes LEFT JOIN Watchlist ON Animes.id_anime = Watchlist.id_anime WHERE Watchlist.id_membre IS NULL;`
7. **Doubleurs monopolisant les premiers rôles d'un même studio**
   - Requête : `SELECT St.nom_studio, S.nom, S.prenom, COUNT(DISTINCT A.id_anime) AS NbRolesPrincipaux FROM Studios St JOIN Animes A ON St.id_studio = A.id_studio JOIN Credits_Anime C ON A.id_anime = C.id_anime AND C.role = 'Doubleur' JOIN Staff S ON C.id_personne = S.id_personne GROUP BY St.id_studio, St.nom_studio, S.id_personne, S.nom, S.prenom HAVING COUNT(DISTINCT A.id_anime) >= 3;`
8. **Studios dépendants d'un unique réalisateur vedette**
   - Requête : `SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM Studios St JOIN Animes A ON St.id_studio = A.id_studio JOIN Credits_Anime C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio HAVING COUNT(DISTINCT C.id_personne) = 1 AND COUNT(A.id_anime) >= 2;`

---

# TP 8 : `CineData` — Grand Cas de Synthèse Cinéma, Box-Office & Castings

Base de données : `CineData.sqlite` (Top films 2022-2026 TMDB API + Castings réels + Cinéphiles synthétiques).

### Exercice 1 : Requêtes de base et jointures simples (15 questions)

1. **Lister tous les films disponibles**
   - Requête : `SELECT id_film, titre, date_sortie, duree_minutes FROM Films;`
2. **Lister les genres officiels**
   - Requête : `SELECT id_genre, nom_genre FROM Genres;`
3. **Films d'une durée supérieure à 150 minutes (blockbusters longs)**
   - Requête : `SELECT titre, duree_minutes, recettes FROM Films WHERE duree_minutes > 150;`
4. **Croiser chaque film avec ses genres**
   - Requête : `SELECT Films.titre, Genres.nom_genre FROM Films JOIN Film_Genres ON Films.id_film = Film_Genres.id_film JOIN Genres ON Film_Genres.id_genre = Genres.id_genre;`
5. **Identifier les réalisateurs et leurs films**
   - Requête : `SELECT DISTINCT P.nom, P.prenom, F.titre FROM Personnes P JOIN Castings C ON P.id_personne = C.id_personne JOIN Films F ON C.id_film = F.id_film WHERE C.metier = 'Realisateur';`
6. **Lister les acteurs ayant le rôle d'affiche (ordre d'importance = 1)**
   - Requête : `SELECT P.nom, P.prenom, C.personnage, F.titre FROM Personnes P JOIN Castings C ON P.id_personne = C.id_personne JOIN Films F ON C.id_film = F.id_film WHERE C.metier = 'Acteur' AND C.ordre_importance = 1;`
7. **Consulter les avis rédigés par un cinéphile donné**
   - Requête : `SELECT F.titre, A.note_attribuee, A.vu_au_cinema, A.date_seance FROM Avis A JOIN Films F ON A.id_film = F.id_film WHERE A.id_cinephile = 1;`
8. **Croiser les cinéphiles avec les films qu'ils ont vus en salle de cinéma**
   - Requête : `SELECT DISTINCT C.pseudo, F.titre, A.date_seance FROM Cinephiles C JOIN Avis A ON C.id_cinephile = A.id_cinephile JOIN Films F ON A.id_film = F.id_film WHERE A.vu_au_cinema = 1;`
9. **Compter le nombre de films par genre (avec les genres sans film)**
   - Requête : `SELECT Genres.nom_genre, COUNT(Film_Genres.id_film) AS NbFilms FROM Genres LEFT JOIN Film_Genres ON Genres.id_genre = Film_Genres.id_genre GROUP BY Genres.id_genre, Genres.nom_genre;`
10. **Cinéphiles ayant rédigé plus de 6 avis**
    - Requête : `SELECT C.pseudo, COUNT(A.id_avis) AS NbAvis FROM Cinephiles C JOIN Avis A ON C.id_cinephile = A.id_cinephile GROUP BY C.id_cinephile, C.pseudo HAVING COUNT(A.id_avis) > 6;`
11. **Dénombrer les avis par film (en affichant 0 pour les films sans avis)**
    - Requête : `SELECT Films.titre, COUNT(Avis.id_avis) AS TotalAvis FROM Films LEFT JOIN Avis ON Films.id_film = Avis.id_film GROUP BY Films.id_film, Films.titre;`
12. **Personnes ayant été à la fois acteur et producteur sur le même film**
    - Requête : `SELECT DISTINCT P.nom, P.prenom, F.titre FROM Personnes P JOIN Castings C1 ON P.id_personne = C1.id_personne AND C1.metier = 'Acteur' JOIN Castings C2 ON P.id_personne = C2.id_personne AND C2.metier = 'Producteur' AND C1.id_film = C2.id_film JOIN Films F ON C1.id_film = F.id_film;`
13. **Films sortis en 2023 ayant dépassé 500 millions de dollars de recettes**
    - Requête : `SELECT titre, date_sortie, recettes FROM Films WHERE strftime('%Y', date_sortie) = '2023' AND recettes > 500000000;`
14. **Associer chaque réalisateur aux cinéphiles ayant mis 5 étoiles à un de ses films**
    - Requête : `SELECT DISTINCT P.nom AS Realisateur, F.titre, C.pseudo AS Cinephile FROM Personnes P JOIN Castings Ct ON P.id_personne = Ct.id_personne AND Ct.metier = 'Realisateur' JOIN Films F ON Ct.id_film = F.id_film JOIN Avis A ON F.id_film = A.id_film JOIN Cinephiles C ON A.id_cinephile = C.id_cinephile WHERE A.note_attribuee = 5.0;`
15. **Détecter les films sans aucun avis enregistré**
    - Requête : `SELECT Films.id_film, Films.titre FROM Films LEFT JOIN Avis ON Films.id_film = Avis.id_film WHERE Avis.id_avis IS NULL;`

---

### Exercice 2 : Requêtes intermédiaires (9 questions)

1. **Calculer la moyenne des notes données par chaque cinéphile**
   - Requête : `SELECT C.pseudo, COUNT(A.id_avis) AS NbAvis, ROUND(AVG(A.note_attribuee), 2) AS MoyenneNotes FROM Cinephiles C LEFT JOIN Avis A ON C.id_cinephile = A.id_cinephile GROUP BY C.id_cinephile, C.pseudo;`
2. **Afficher les cinéphiles accompagnés du pseudo de leur parrain**
   - Requête : `SELECT Filleul.pseudo AS Cinephile, Parrain.pseudo AS Parrain FROM Cinephiles Filleul JOIN Cinephiles Parrain ON Filleul.id_parrain = Parrain.id_cinephile;`
3. **Dénombrer les acteurs distincts mobilisés par genre**
   - Requête : `SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbActeurs FROM Genres G LEFT JOIN Film_Genres FG ON G.id_genre = FG.id_genre LEFT JOIN Castings C ON FG.id_film = C.id_film AND C.metier = 'Acteur' GROUP BY G.id_genre, G.nom_genre;`
4. **Calculer le ratio de rentabilité économique par film (recettes / budget)**
   - Requête : `SELECT titre, budget, recettes, ROUND(CAST(recettes AS FLOAT) / budget, 2) AS RatioRentabilite FROM Films WHERE budget > 0 AND recettes > 0 ORDER BY RatioRentabilite DESC;`
5. **Cinéphiles ayant vu le film le plus rentable de l'histoire de la base**
   - Requête : `SELECT DISTINCT C.pseudo FROM Cinephiles C JOIN Avis A ON C.id_cinephile = A.id_cinephile WHERE A.id_film = (SELECT id_film FROM Films WHERE budget > 0 ORDER BY (recettes - budget) DESC LIMIT 1);`
6. **Moyenne des budgets par genre cinématographique**
   - Requête : `SELECT G.nom_genre, ROUND(AVG(F.budget) / 1000000.0, 1) AS BudgetMoyenMillions FROM Genres G JOIN Film_Genres FG ON G.id_genre = FG.id_genre JOIN Films F ON FG.id_film = F.id_film WHERE F.budget > 0 GROUP BY G.id_genre, G.nom_genre;`
7. **Détecter les cinéphiles inscrits n'ayant jamais rédigé d'avis**
   - Requête : `SELECT Cinephiles.id_cinephile, Cinephiles.pseudo FROM Cinephiles LEFT JOIN Avis ON Cinephiles.id_cinephile = Avis.id_cinephile WHERE Avis.id_avis IS NULL;`
8. **Répartition des projections par jour de la semaine**
   - Requête : `SELECT strftime('%w', date_seance) AS JourSemaine, COUNT(*) AS NbSeances FROM Avis GROUP BY JourSemaine ORDER BY JourSemaine;`
9. **Classifier les films selon leur succès commercial (Blockbuster, Succès, Déficitaire)**
   - Requête : `SELECT titre, budget, recettes, CASE WHEN recettes >= 3 * budget THEN 'Méga Succès' WHEN recettes >= budget THEN 'Rentable' ELSE 'Déficitaire' END AS BilanFinancier FROM Films WHERE budget > 0;`

---

### Exercice 3 : Requêtes très avancées (12 questions)

1. **Polyvalence des artistes : nombre total de casquettes exercées**
   - Requête : `SELECT P.nom, P.prenom, COUNT(DISTINCT C.metier) AS NbMetiers, COUNT(C.id_film) AS TotalFilms FROM Personnes P JOIN Castings C ON P.id_personne = C.id_personne GROUP BY P.id_personne, P.nom, P.prenom HAVING COUNT(DISTINCT C.metier) > 1 ORDER BY NbMetiers DESC, TotalFilms DESC;`
2. **Cinéphiles ayant noté un film dont leur propre parrain a également rédigé la critique**
   - Requête : `SELECT DISTINCT Filleul.pseudo AS Filleul, Parrain.pseudo AS Parrain, F.titre FROM Cinephiles Filleul JOIN Cinephiles Parrain ON Filleul.id_parrain = Parrain.id_cinephile JOIN Avis A1 ON Filleul.id_cinephile = A1.id_cinephile JOIN Avis A2 ON Parrain.id_cinephile = A2.id_cinephile AND A1.id_film = A2.id_film JOIN Films F ON A1.id_film = F.id_film;`
3. **Identifier le réalisateur dont les films cumulent le plus gros box-office total**
   - Requête : `SELECT P.nom, P.prenom, SUM(F.recettes) AS BoxOfficeTotal FROM Personnes P JOIN Castings C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN Films F ON C.id_film = F.id_film GROUP BY P.id_personne, P.nom, P.prenom ORDER BY BoxOfficeTotal DESC LIMIT 1;`
4. **Artistes cumulant les 3 rôles majeurs : Réalisateur, Acteur et Producteur**
   - Requête : `SELECT P.id_personne, P.nom, P.prenom FROM Personnes P WHERE EXISTS (SELECT 1 FROM Castings WHERE id_personne = P.id_personne AND metier = 'Realisateur') AND EXISTS (SELECT 1 FROM Castings WHERE id_personne = P.id_personne AND metier = 'Acteur') AND EXISTS (SELECT 1 FROM Castings WHERE id_personne = P.id_personne AND metier = 'Producteur');`
5. **Genres sans aucun film ayant généré plus de 100 millions de recettes**
   - Requête : `SELECT G.id_genre, G.nom_genre FROM Genres G WHERE G.id_genre NOT IN (SELECT FG.id_genre FROM Film_Genres FG JOIN Films F ON FG.id_film = F.id_film WHERE F.recettes >= 100000000);`
6. **Binômes d'acteurs ayant partagé l'affiche d'au moins 2 films différents**
   - Requête : `SELECT P1.nom AS Acteur1, P2.nom AS Acteur2, COUNT(DISTINCT C1.id_film) AS FilmsEnCommun FROM Castings C1 JOIN Castings C2 ON C1.id_film = C2.id_film AND C1.id_personne < C2.id_personne AND C1.metier = 'Acteur' AND C2.metier = 'Acteur' JOIN Personnes P1 ON C1.id_personne = P1.id_personne JOIN Personnes P2 ON C2.id_personne = P2.id_personne GROUP BY P1.id_personne, P2.id_personne, P1.nom, P2.nom HAVING COUNT(DISTINCT C1.id_film) >= 2;`
7. **Films ayant généré des avis en salle mais aucun avis en streaming**
   - Requête : `SELECT DISTINCT F.titre FROM Films F JOIN Avis A ON F.id_film = A.id_film WHERE A.vu_au_cinema = 1 AND F.id_film NOT IN (SELECT id_film FROM Avis WHERE vu_au_cinema = 0);`
8. **Binômes de films sortis exactement à la même date**
   - Requête : `SELECT F1.titre AS Film1, F2.titre AS Film2, F1.date_sortie FROM Films F1 JOIN Films F2 ON F1.date_sortie = F2.date_sortie AND F1.id_film < F2.id_film ORDER BY F1.date_sortie;`
9. **Moyenne des notes attribuées selon le canal (Cinéma vs VOD)**
   - Requête : `SELECT CASE WHEN vu_au_cinema = 1 THEN 'En Salle' ELSE 'Streaming / VOD' END AS Canal, COUNT(*) AS NbAvis, ROUND(AVG(note_attribuee), 2) AS NoteMoyenne FROM Avis GROUP BY vu_au_cinema;`
10. **Cinéphiles n'ayant vu aucun film en commun avec leur parrain**
    - Requête : `SELECT C.pseudo AS Cinephile, P.pseudo AS Parrain FROM Cinephiles C JOIN Cinephiles P ON C.id_parrain = P.id_cinephile WHERE NOT EXISTS (SELECT 1 FROM Avis A1 JOIN Avis A2 ON A1.id_film = A2.id_film WHERE A1.id_cinephile = C.id_cinephile AND A2.id_cinephile = P.id_cinephile);`
11. **Mois records : Mois ayant enregistré la sortie d'au moins 3 films millionnaires**
    - Requête : `SELECT strftime('%Y-%m', date_sortie) AS AnneeMois, COUNT(*) AS NbFilmsSucces FROM Films WHERE recettes >= 100000000 GROUP BY AnneeMois HAVING COUNT(*) >= 3;`
12. **Division relationnelle : Cinéphiles ayant vu TOUS les films réalisés par Christopher Nolan**
    - Requête : `SELECT C.id_cinephile, C.pseudo FROM Cinephiles C JOIN Avis A ON C.id_cinephile = A.id_cinephile JOIN Films F ON A.id_film = F.id_film JOIN Castings Ct ON F.id_film = Ct.id_film AND Ct.metier = 'Realisateur' WHERE Ct.id_personne = (SELECT id_personne FROM Personnes WHERE nom = 'Nolan' AND prenom = 'Christopher') GROUP BY C.id_cinephile, C.pseudo HAVING COUNT(DISTINCT F.id_film) = (SELECT COUNT(DISTINCT id_film) FROM Castings WHERE id_personne = (SELECT id_personne FROM Personnes WHERE nom = 'Nolan' AND prenom = 'Christopher') AND metier = 'Realisateur');`

---

### Exercice 4 : Bonus - Défis complexes (8 questions)

1. **Cinéphiles cumulant les 4 statuts clés**
   - Requête : `SELECT id_cinephile, pseudo FROM Cinephiles WHERE id_cinephile IN (SELECT id_cinephile FROM Avis WHERE vu_au_cinema = 1) AND id_cinephile IN (SELECT id_cinephile FROM Avis WHERE vu_au_cinema = 0) AND id_cinephile IN (SELECT id_cinephile FROM Avis WHERE note_attribuee = 5.0) AND id_cinephile IN (SELECT DISTINCT id_parrain FROM Cinephiles WHERE id_parrain IS NOT NULL);`
2. **Conflit temporel : Détecter un même cinéphile noté à 2 séances en salle à la même date et même heure**
   - Requête : `SELECT A1.id_cinephile, C.pseudo, A1.date_seance, A1.heure_seance, F1.titre AS Film1, F2.titre AS Film2 FROM Avis A1 JOIN Avis A2 ON A1.id_cinephile = A2.id_cinephile AND A1.date_seance = A2.date_seance AND A1.heure_seance = A2.heure_seance AND A1.id_film < A2.id_film AND A1.vu_au_cinema = 1 AND A2.vu_au_cinema = 1 JOIN Cinephiles C ON A1.id_cinephile = C.id_cinephile JOIN Films F1 ON A1.id_film = F1.id_film JOIN Films F2 ON A2.id_film = F2.id_film;`
3. **Reconstituer la chaîne de parrainage cinéphile à 3 niveaux**
   - Requête : `SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM Cinephiles F JOIN Cinephiles P ON F.id_parrain = P.id_cinephile JOIN Cinephiles GP ON P.id_parrain = GP.id_cinephile;`
4. **Calculer le délai moyen entre la sortie d'un film et le visionnage par les abonnés**
   - Requête : `SELECT F.titre, F.date_sortie, ROUND(AVG(CAST(JULIANDAY(A.date_seance) - JULIANDAY(F.date_sortie) AS INT)), 1) AS DelaiMoyenJours FROM Films F JOIN Avis A ON F.id_film = A.id_film WHERE A.date_seance >= F.date_sortie GROUP BY F.id_film, F.titre, F.date_sortie;`
5. **Rendement financier par minute de film (recettes / durée)**
   - Requête : `SELECT titre, recettes, duree_minutes, ROUND(recettes / CAST(duree_minutes AS FLOAT), 0) AS RecettesParMinute FROM Films WHERE duree_minutes > 0 AND recettes > 0 ORDER BY RecettesParMinute DESC;`
6. **Films vus uniquement par les parrains et jamais par aucun filleul**
   - Requête : `SELECT DISTINCT F.titre FROM Films F JOIN Avis A ON F.id_film = A.id_film JOIN Cinephiles P ON A.id_cinephile = P.id_cinephile WHERE P.id_cinephile IN (SELECT DISTINCT id_parrain FROM Cinephiles WHERE id_parrain IS NOT NULL) AND F.id_film NOT IN (SELECT A2.id_film FROM Avis A2 JOIN Cinephiles Filleul ON A2.id_cinephile = Filleul.id_cinephile WHERE Filleul.id_parrain IS NOT NULL);`
7. **Réalisateurs dont tous les films répertoriés sont rentables (recettes >= 2 * budget)**
   - Requête : `SELECT P.nom, P.prenom, COUNT(F.id_film) AS NbFilms FROM Personnes P JOIN Castings C ON P.id_personne = C.id_personne AND C.metier = 'Realisateur' JOIN Films F ON C.id_film = F.id_film WHERE F.budget > 0 GROUP BY P.id_personne, P.nom, P.prenom HAVING MIN(CAST(F.recettes AS FLOAT) / F.budget) >= 2.0 AND COUNT(F.id_film) >= 2;`
8. **Genres exclusifs à un seul et unique réalisateur répertorié**
   - Requête : `SELECT G.nom_genre, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM Genres G JOIN Film_Genres FG ON G.id_genre = FG.id_genre JOIN Castings C ON FG.id_film = C.id_film AND C.metier = 'Realisateur' GROUP BY G.id_genre, G.nom_genre HAVING COUNT(DISTINCT C.id_personne) = 1;`

---

## Vérification et Conformité Technique

1. **Compatibilité SQL** :
   - Toutes les fonctions utilisées (`COUNT`, `SUM`, `AVG`, `ROUND`, `strftime`, `JULIANDAY`, `CASE`, `EXISTS`, sous-requêtes scalaires) sont 100% compatibles avec SQLite sous `sql.js` et respectent l'émulateur MariaDB (`mariadb-emulation.js`).
2. **Équivalence didactique** :
   - Chaque TP compte exactement **44 questions** réparties selon la même courbe de progression que TP 5 :
     - Exercice 1 (15 questions) : Prise en main, jointures simples, filtres.
     - Exercice 2 (9 questions) : Jointures externes, agrégats, groupements, CASE.
     - Exercice 3 (12 questions) : Sous-requêtes avancées, auto-jointures, dates, division.
     - Exercice 4 (8 questions) : Défis de synthèse complexes, collisions, chaînes hiérarchiques.
3. **Autonomie et étanchéité** :
   - Chaque TP est totalement indépendant et peut être utilisé comme TP de révision alternatif selon la sensibilité de la promotion d'étudiants (Cinéma, Séries ou Anime).
