---
layout: base.njk
title: "Exercice 3 : Partie III - Requêtes très avancées"
intitule: "TP 7 — Grand Cas de Synthèse (AniBase)"
base: "AniBase.sqlite"
tpNum: 7
exerciceNum: 3
titre: "Exercice 3 : Partie III - Requêtes très avancées"
permalink: "/tp7/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Partie III - Requêtes très avancées

## Questions (12 questions)

**1. Évaluer la polyvalence globale des professionnels du Staff**

Pour chaque membre du staff, affichez son nom (`nom`), son prénom (`prenom`) et le nombre total d'animes sur lesquels il est intervenu sous l'alias `TotalInterventions`. Triez par polyvalence décroissante.

<!-- expected-query: Q1
SELECT S.nom, S.prenom, COUNT(C.id_anime) AS TotalInterventions FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne GROUP BY S.id_personne, S.nom, S.prenom ORDER BY TotalInterventions DESC;
-->

**2. Membres ayant terminé un anime produit par le studio favori de leur parrain**

Identifiez les transmissions de passion : affichez sans doublon le pseudo du filleul sous l'alias `Membre`, le pseudo de son parrain sous l'alias `Parrain` et le titre de l'anime (`titre_romaji`), pour chaque cas où le membre a terminé une œuvre produite par un studio pour lequel son parrain a décerné une note de 9 ou 10.

<!-- expected-query: Q2
SELECT DISTINCT M.pseudo AS Membre, P.pseudo AS Parrain, A.titre_romaji FROM MEMBRES M JOIN MEMBRES P ON M.id_parrain = P.id_membre JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN ANIMES A ON W.id_anime = A.id_anime WHERE A.id_studio IN (SELECT A2.id_studio FROM WATCHLIST W2 JOIN ANIMES A2 ON W2.id_anime = A2.id_anime WHERE W2.id_membre = P.id_membre AND W2.note_perso >= 9);
-->

**3. Identifier le studio cumulant le plus grand nombre total d'épisodes**

Affichez le nom du studio (`nom_studio`) et le volume cumulé d'épisodes produits sous l'alias `TotalEpisodes` pour le studio le plus prolifique de la base.

<!-- expected-query: Q3
SELECT St.nom_studio, SUM(A.nb_episodes) AS TotalEpisodes FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio WHERE A.nb_episodes IS NOT NULL GROUP BY St.id_studio, St.nom_studio ORDER BY TotalEpisodes DESC LIMIT 1;
-->

**4. Identifier les membres du Staff cumulant au moins 3 casquettes professionnelles distinctes**

Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de rôles distincts sous l'alias `NbRolesDistincts` pour les créateurs polyvalents ayant exercé au moins 3 rôles différents sur la plateforme.

<!-- expected-query: Q4
SELECT S.nom, S.prenom, COUNT(DISTINCT C.role) AS NbRolesDistincts FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne GROUP BY S.id_personne, S.nom, S.prenom HAVING COUNT(DISTINCT C.role) >= 3;
-->

**5. Détecter les genres sans aucun anime d'excellence (score >= 8.5)**

Affichez le libellé (`libelle`) des genres pour lesquels aucun anime n'atteint une note moyenne supérieure ou égale à 8.5.

<!-- expected-query: Q5
SELECT G.libelle FROM GENRES G WHERE G.id_genre NOT IN (SELECT AG.id_genre FROM ANIME_GENRES AG JOIN ANIMES A ON AG.id_anime = A.id_anime WHERE A.note_moyenne >= 8.5);
-->

**6. Détecter les membres inscrits la même année avec le même pays d'origine**

Affichez les binômes de membres partageant la même nationalité (`pays`) et inscrits la même année : le pseudo du premier sous l'alias `Membre1`, celui du second sous l'alias `Membre2` et le pays. Éliminez les doublons symétriques avec `M1.id_membre < M2.id_membre`.

<!-- expected-query: Q6
SELECT M1.pseudo AS Membre1, M2.pseudo AS Membre2, M1.pays FROM MEMBRES M1 JOIN MEMBRES M2 ON M1.pays = M2.pays AND strftime('%Y', M1.date_inscription) = strftime('%Y', M2.date_inscription) AND M1.id_membre < M2.id_membre;
-->

**7. Studios ayant produit des animes en 2022 et 2023 mais aucun en 2024**

Affichez sans doublon le nom des studios (`nom_studio`) ayant sorti au moins une œuvre en 2022 ET au moins une œuvre en 2023, mais aucune en 2024.

<!-- expected-query: Q7
SELECT DISTINCT St.nom_studio FROM STUDIOS St JOIN ANIMES A1 ON St.id_studio = A1.id_studio AND A1.annee_diffusion = 2022 JOIN ANIMES A2 ON St.id_studio = A2.id_studio AND A2.annee_diffusion = 2023 WHERE St.id_studio NOT IN (SELECT id_studio FROM ANIMES WHERE annee_diffusion = 2024 AND id_studio IS NOT NULL);
-->

**8. Associer les animes ayant exactement la même note et le même nombre d'épisodes**

Affichez les binômes d'animes partageant le même score et la même longueur : le titre du premier sous l'alias `Anime1`, le titre du second sous l'alias `Anime2`, leur note (`note_moyenne`) et leur nombre d'épisodes (`nb_episodes`). Évitez les doublons symétriques et triez par note décroissante.

<!-- expected-query: Q8
SELECT A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2, A1.note_moyenne, A1.nb_episodes FROM ANIMES A1 JOIN ANIMES A2 ON A1.note_moyenne = A2.note_moyenne AND A1.nb_episodes = A2.nb_episodes AND A1.id_anime < A2.id_anime WHERE A1.nb_episodes IS NOT NULL AND A1.note_moyenne IS NOT NULL ORDER BY A1.note_moyenne DESC;
-->

**9. Mesurer l'audience des genres par pays de membres**

Pour chaque pays d'abonnés et chaque genre d'anime, affichez le pays (`pays`), le genre (`libelle`) et le nombre total d'animes suivis sous l'alias `NbSuivis`. Triez par pays puis par nombre de suivis décroissant.

<!-- expected-query: Q9
SELECT M.pays, G.libelle AS Genre, COUNT(W.id_anime) AS NbSuivis FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre JOIN ANIMES A ON W.id_anime = A.id_anime JOIN ANIME_GENRES AG ON A.id_anime = AG.id_anime JOIN GENRES G ON AG.id_genre = G.id_genre GROUP BY M.pays, G.id_genre, G.libelle ORDER BY M.pays, NbSuivis DESC;
-->

**10. Membres ne partageant aucun anime dans leur Watchlist avec leur parrain**

Pour tous les membres parrainés, affichez le pseudo du filleul sous l'alias `Membre` et celui de son parrain sous l'alias `Parrain`, pour les seuls cas où le membre et son parrain n'ont absolument aucun anime en commun dans leur Watchlist.

<!-- expected-query: Q10
SELECT M.pseudo AS Membre, P.pseudo AS Parrain FROM MEMBRES M JOIN MEMBRES P ON M.id_parrain = P.id_membre WHERE NOT EXISTS (SELECT 1 FROM WATCHLIST W1 JOIN WATCHLIST W2 ON W1.id_anime = W2.id_anime WHERE W1.id_membre = M.id_membre AND W2.id_membre = P.id_membre);
-->

**11. Détecter les saisons à forte concentration de chefs-d'œuvre**

Affichez l'année (`annee_diffusion`), la saison (`saison`) et le nombre d'animes majeurs sous l'alias `NbMasterpieces`, pour toutes les saisons de diffusion ayant compté au moins 4 animes notés 8.2 ou plus.

<!-- expected-query: Q11
SELECT annee_diffusion, saison, COUNT(*) AS NbMasterpieces FROM ANIMES WHERE note_moyenne >= 8.2 AND saison IS NOT NULL GROUP BY annee_diffusion, saison HAVING COUNT(*) >= 4;
-->

**12. Division relationnelle : Membres ayant vu tous les animes d'un studio donné**

Problème de division relationnelle : affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`) des membres ayant complété (`statut = 'Termine'`) l'intégralité des productions du studio d'identifiant 1 (`id_studio = 1`).

<details>
<summary>💡 Indice</summary>

Dans `HAVING`, comparez le nombre de productions distinctes complétées avec `(SELECT COUNT(*) FROM ANIMES WHERE id_studio = 1)`.
</details>

<!-- expected-query: Q12
SELECT M.id_membre, M.pseudo FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' JOIN ANIMES A ON W.id_anime = A.id_anime WHERE A.id_studio = 1 GROUP BY M.id_membre, M.pseudo HAVING COUNT(DISTINCT A.id_anime) = (SELECT COUNT(*) FROM ANIMES WHERE id_studio = 1);
-->
