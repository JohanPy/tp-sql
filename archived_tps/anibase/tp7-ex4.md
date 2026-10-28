---
layout: base.njk
title: "Exercice 4 : Bonus - Défis complexes"
intitule: "TP 7 — Grand Cas de Synthèse (AniBase)"
base: "AniBase.sqlite"
tpNum: 7
exerciceNum: 4
titre: "Exercice 4 : Bonus - Défis complexes"
permalink: "/tp7/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Défis complexes

## Questions (8 questions)

**1. Membres cumulant les 4 statuts clés de la communauté**

Trouvez les membres les plus investis qui cumulent à la fois : avoir au moins un anime en cours, avoir au moins un anime terminé, avoir décerné au moins une note de 10/10, et être le parrain d'au moins un autre membre. Affichez leur identifiant (`id_membre`) et leur pseudo (`pseudo`).

<!-- expected-query: Q1
SELECT id_membre, pseudo FROM MEMBRES WHERE id_membre IN (SELECT id_membre FROM WATCHLIST WHERE statut = 'En cours') AND id_membre IN (SELECT id_membre FROM WATCHLIST WHERE statut = 'Termine') AND id_membre IN (SELECT id_membre FROM WATCHLIST WHERE note_perso = 10) AND id_membre IN (SELECT DISTINCT id_parrain FROM MEMBRES WHERE id_parrain IS NOT NULL);
-->

**2. Conflit de production : réalisateur supervisant deux animes la même saison**

Détectez les surcharges de production : identifiez les réalisateurs crédités sur deux animes différents diffusés au cours de la même année et de la même saison. Affichez l'identifiant du réalisateur (`id_personne`), son nom (`nom`), son prénom (`prenom`), l'année (`annee_diffusion`), la saison (`saison`), le titre du premier anime sous l'alias `Anime1` et du second sous l'alias `Anime2` (`C1.id_anime < C2.id_anime`).

<!-- expected-query: Q2
SELECT C1.id_personne, S.nom, S.prenom, A1.annee_diffusion, A1.saison, A1.titre_romaji AS Anime1, A2.titre_romaji AS Anime2 FROM CREDITS_ANIME C1 JOIN CREDITS_ANIME C2 ON C1.id_personne = C2.id_personne AND C1.role = 'Realisateur' AND C2.role = 'Realisateur' AND C1.id_anime < C2.id_anime JOIN ANIMES A1 ON C1.id_anime = A1.id_anime JOIN ANIMES A2 ON C2.id_anime = A2.id_anime AND A1.annee_diffusion = A2.annee_diffusion AND A1.saison = A2.saison JOIN STAFF S ON C1.id_personne = S.id_personne;
-->

**3. Reconstituer la chaîne de parrainage communautaire à trois niveaux**

Identifiez les lignées de mentorat à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le pseudo du parrain initial sous l'alias `GrandParrain`, celui du parrain intermédiaire sous l'alias `Parrain`, et celui du protégé final sous l'alias `Filleul`.

<!-- expected-query: Q3
SELECT GP.pseudo AS GrandParrain, P.pseudo AS Parrain, F.pseudo AS Filleul FROM MEMBRES F JOIN MEMBRES P ON F.id_parrain = P.id_membre JOIN MEMBRES GP ON P.id_parrain = GP.id_membre;
-->

**4. Calculer la durée moyenne d'achèvement d'une série**

Pour chaque membre ayant complété au moins un anime avec dates renseignées, calculez la durée moyenne d'achèvement en jours (`date_fin - date_ajout`), arrondie à 1 décimale sous l'alias `DelaiMoyenJours`. Affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`).

<!-- expected-query: Q4
SELECT M.id_membre, M.pseudo, ROUND(AVG(CAST(JULIANDAY(W.date_fin) - JULIANDAY(W.date_ajout) AS INT)), 1) AS DelaiMoyenJours FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre WHERE W.date_fin IS NOT NULL AND W.date_ajout IS NOT NULL AND W.statut = 'Termine' GROUP BY M.id_membre, M.pseudo;
-->

**5. Calculer le taux d'excellence d'un studio**

Pour chaque studio ayant produit au moins 3 animes, calculez le pourcentage d'œuvres ayant obtenu un score moyen supérieur ou égal à 8.0, arrondi à 1 décimale sous l'alias `TauxExcellencePourcent`. Affichez le nom du studio (`nom_studio`) et le nombre total d'œuvres sous l'alias `TotalAnimes`.

<!-- expected-query: Q5
SELECT St.nom_studio, COUNT(A.id_anime) AS TotalAnimes, ROUND(CAST(SUM(CASE WHEN A.note_moyenne >= 8.0 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(A.id_anime) * 100, 1) AS TauxExcellencePourcent FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio GROUP BY St.id_studio, St.nom_studio HAVING COUNT(A.id_anime) >= 3 ORDER BY TauxExcellencePourcent DESC;
-->

**6. Animes orphelins : animes sans aucun spectateur**

Affichez l'identifiant (`id_anime`) et le titre (`titre_romaji`) des animes répertoriés dans le catalogue général qui ne figurent dans la Watchlist d'absolument aucun membre.

<!-- expected-query: Q6
SELECT ANIMES.id_anime, ANIMES.titre_romaji FROM ANIMES LEFT JOIN WATCHLIST ON ANIMES.id_anime = WATCHLIST.id_anime WHERE WATCHLIST.id_membre IS NULL;
-->

**7. Doubleurs omniprésents : artistes incarnant au moins 3 rôles différents**

Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de personnages interprétés sous l'alias `NbPersonnages` pour les doubleurs professionnels ayant prêté leur voix à au moins 3 personnages distincts.

<!-- expected-query: Q7
SELECT S.nom, S.prenom, COUNT(DISTINCT C.personnage_nom) AS NbPersonnages FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne AND C.role = 'Doubleur' GROUP BY S.id_personne, S.nom, S.prenom HAVING COUNT(DISTINCT C.personnage_nom) >= 3 ORDER BY NbPersonnages DESC;
-->

**8. Studios sous la responsabilité d'un seul et unique réalisateur**

Affichez le nom du studio (`nom_studio`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls studios d'animation dont l'intégralité des productions a été confiée à un seul et même réalisateur.

<!-- expected-query: Q8
SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio JOIN CREDITS_ANIME C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio HAVING COUNT(DISTINCT C.id_personne) = 1;
-->
