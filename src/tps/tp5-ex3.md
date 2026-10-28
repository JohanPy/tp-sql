---
layout: base.njk
title: "Exercice 3 : Partie III - Requêtes très avancées"
intitule: "TP 5 — Grand Cas de Synthèse (NetflixStream)"
base: "NetflixStream.sqlite"
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

**1. Évaluer l'engagement global d'un abonné**

Pour chaque abonné, affichez son nom (`nom`), son prénom (`prenom`) et le cumul de son engagement (somme de ses visionnages, de ses favoris et de ses avis notés) sous l'alias `ScoreEngagement`. Triez par score décroissant.

<details>
<summary>💡 Indice</summary>

Vous pouvez additionner directement des sous-requêtes scalaires `(SELECT COUNT(*) FROM ...)` dans la clause `SELECT`.
</details>

<!-- expected-query: Q1
SELECT A.nom, A.prenom, (SELECT COUNT(*) FROM VISIONNAGES V WHERE V.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM FAVORIS F WHERE F.id_abonne = A.id_abonne) + (SELECT COUNT(*) FROM VISIONNAGES V2 WHERE V2.id_abonne = A.id_abonne AND V2.note_avis IS NOT NULL) AS ScoreEngagement FROM ABONNES A ORDER BY ScoreEngagement DESC;
-->

**2. Abonnés ayant noté une œuvre réalisée par leur propre parrain**

Identifiez les situations croisées : affichez sans doublon le nom du filleul sous l'alias `Filleul`, le nom de son parrain sous l'alias `Parrain` et le titre du contenu (`titre`), pour chaque cas où l'abonné a noté une œuvre dirigée par son parrain.

<!-- expected-query: Q2
SELECT DISTINCT A.nom AS Filleul, P.nom AS Parrain, C.titre FROM ABONNES A JOIN ABONNES P ON A.id_parrain = P.id_abonne JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne JOIN CONTENUS C ON V.id_contenu = C.id_contenu JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' WHERE Part.id_personne = P.id_abonne AND V.note_avis IS NOT NULL;
-->

**3. Identifier le contenu au temps total de visionnage le plus élevé**

Affichez le titre du contenu (`titre`) et le volume cumulé des minutes regardées sous l'alias `TotalMinutes` pour l'œuvre qui totalise le plus grand temps de lecture sur la plateforme.

<!-- expected-query: Q3
SELECT C.titre, SUM(V.duree_regardee_min) AS TotalMinutes FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY C.id_contenu, C.titre ORDER BY TotalMinutes DESC LIMIT 1;
-->

**4. Identifier les artistes cumulant les 3 rôles clés**

Affichez sans doublon l'identifiant (`id_personne`), le nom (`nom`) et le prénom (`prenom`) des artistes polyvalents qui interviennent dans les trois rôles sur la plateforme : réalisateur, acteur principal et scénariste.

<details>
<summary>💡 Indice</summary>

Combinez trois clauses `WHERE EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE ...)` pour éviter de démultiplier les lignes par jointures.
</details>

<!-- expected-query: Q4
SELECT P.id_personne, P.nom, P.prenom FROM PERSONNES P WHERE EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Realisateur') AND EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Acteur principal') AND EXISTS (SELECT 1 FROM PARTICIPATIONS WHERE id_personne = P.id_personne AND role = 'Scenariste');
-->

**5. Détecter les genres totalement inactifs**

Affichez l'identifiant (`id_genre`) et l'intitulé (`nom`) des genres qui n'ont aucun contenu au catalogue ou dont aucun contenu n'a fait l'objet d'un visionnage.

<!-- expected-query: Q5
SELECT G.id_genre, G.nom FROM GENRES G WHERE G.id_genre NOT IN (SELECT id_genre FROM CONTENUS WHERE id_genre IS NOT NULL) OR G.id_genre NOT IN (SELECT DISTINCT C.id_genre FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE C.id_genre IS NOT NULL);
-->

**6. Détecter les homonymes parmi les abonnés**

Trouvez les abonnés partageant le même nom de famille : affichez le nom commun (`nom`), le prénom du premier sous l'alias `Prenom1` et le prénom du second sous l'alias `Prenom2`. Éliminez les auto-associations et doublons symétriques avec `A1.id_abonne < A2.id_abonne`.

<!-- expected-query: Q6
SELECT A1.nom, A1.prenom AS Prenom1, A2.prenom AS Prenom2 FROM ABONNES A1 JOIN ABONNES A2 ON A1.nom = A2.nom AND A1.id_abonne < A2.id_abonne;
-->

**7. Contenus visionnés en semaine mais jamais le week-end**

Affichez sans doublon le titre des contenus (`titre`) qui ont été visionnés du lundi au vendredi (`strftime('%w', ...) BETWEEN '1' AND '5'`) mais dont aucune séance n'a été enregistrée le samedi ou le dimanche (`'0'` ou `'6'`).

<!-- expected-query: Q7
SELECT DISTINCT C.titre FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE strftime('%w', V.date_visionnage) BETWEEN '1' AND '5' AND C.id_contenu NOT IN (SELECT id_contenu FROM VISIONNAGES WHERE strftime('%w', date_visionnage) IN ('0', '6'));
-->

**8. Associer les abonnés inscrits exactement le même jour**

Affichez les binômes d'abonnés s'étant inscrits à la même date : le nom du premier sous l'alias `Abonne1`, le nom du second sous l'alias `Abonne2` et la date commune (`date_inscription`). Évitez les doublons symétriques et triez par date croissante.

<!-- expected-query: Q8
SELECT A1.nom AS Abonne1, A2.nom AS Abonne2, A1.date_inscription FROM ABONNES A1 JOIN ABONNES A2 ON A1.date_inscription = A2.date_inscription AND A1.id_abonne < A2.id_abonne ORDER BY A1.date_inscription;
-->

**9. Mesurer l'audimat par genre et par formule d'abonnement**

Pour chaque genre et chaque formule d'abonnement, affichez le libellé du genre (`nom`), la formule (`formule`) et le nombre total de visionnages sous l'alias `TotalVues`. Triez par genre puis par volume de vues décroissant.

<!-- expected-query: Q9
SELECT G.nom AS Genre, A.formule, COUNT(V.id_visionnage) AS TotalVues FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu JOIN ABONNES A ON V.id_abonne = A.id_abonne GROUP BY G.id_genre, G.nom, A.formule ORDER BY Genre, TotalVues DESC;
-->

**10. Abonnés n'ayant aucun genre favori en commun avec leur parrain**

Pour tous les abonnés ayant un parrain, affichez le nom du filleul sous l'alias `Filleul` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le filleul et son parrain n'ont aucun genre d'œuvres en commun dans leurs listes de favoris.

<details>
<summary>💡 Indice</summary>

Utilisez `WHERE NOT EXISTS` en reliant les favoris du filleul à ceux du parrain sur la table `CONTENUS` via `id_genre`.
</details>

<!-- expected-query: Q10
SELECT A.nom AS Filleul, P.nom AS Parrain FROM ABONNES A JOIN ABONNES P ON A.id_parrain = P.id_abonne WHERE NOT EXISTS (SELECT 1 FROM FAVORIS F1 JOIN CONTENUS C1 ON F1.id_contenu = C1.id_contenu JOIN FAVORIS F2 ON F2.id_abonne = P.id_abonne JOIN CONTENUS C2 ON F2.id_contenu = C2.id_contenu WHERE F1.id_abonne = A.id_abonne AND C1.id_genre = C2.id_genre);
-->

**11. Jours à forte diversité de visionnage**

Affichez la date de visionnage (`date_visionnage`) et le nombre de genres différents consultés sous l'alias `NbGenresVus`, pour toutes les journées où les abonnés ont regardé au moins 4 genres distincts.

<!-- expected-query: Q11
SELECT V.date_visionnage, COUNT(DISTINCT C.id_genre) AS NbGenresVus FROM VISIONNAGES V JOIN CONTENUS C ON V.id_contenu = C.id_contenu GROUP BY V.date_visionnage HAVING COUNT(DISTINCT C.id_genre) >= 4;
-->

**12. Division relationnelle : Abonnés ayant vu tous les films d'un genre donné**

Problème de division relationnelle : affichez l'identifiant (`id_abonne`), le nom (`nom`) et le prénom (`prenom`) des abonnés qui ont visionné l'intégralité de tous les films du genre d'identifiant 1 (`id_genre = 1`).

<details>
<summary>💡 Indice</summary>

Dans la clause `HAVING`, comparez le nombre de contenus distincts visionnés par l'abonné au nombre total de films du genre via `(SELECT COUNT(*) FROM CONTENUS WHERE id_genre = 1 AND type_format = 'Film')`.
</details>

<!-- expected-query: Q12
SELECT A.id_abonne, A.nom, A.prenom FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne JOIN CONTENUS C ON V.id_contenu = C.id_contenu WHERE C.id_genre = 1 AND C.type_format = 'Film' GROUP BY A.id_abonne, A.nom, A.prenom HAVING COUNT(DISTINCT C.id_contenu) = (SELECT COUNT(*) FROM CONTENUS WHERE id_genre = 1 AND type_format = 'Film');
-->
