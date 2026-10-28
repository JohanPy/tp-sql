---
layout: base.njk
title: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
intitule: "TP 7 — Grand Cas de Synthèse (AniBase)"
base: "AniBase.sqlite"
tpNum: 7
exerciceNum: 1
titre: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
permalink: "/tp7/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Partie I - Requêtes de base et jointures simples

## Questions (15 questions)

**1. Lister tous les animes répertoriés**

À partir de la table `ANIMES`, affichez l'identifiant (`id_anime`), le titre romaji (`titre_romaji`), le format (`format`) et l'année de diffusion (`annee_diffusion`).

<!-- expected-query: Q1
SELECT id_anime, titre_romaji, format, annee_diffusion FROM ANIMES;
-->

**2. Lister les studios d'animation**

À partir de la table `STUDIOS`, affichez l'identifiant (`id_studio`), le nom du studio (`nom_studio`) et son pays d'origine (`pays`).

<!-- expected-query: Q2
SELECT id_studio, nom_studio, pays FROM STUDIOS;
-->

**3. Animes produits par un studio donné**

Pour le studio d'animation ayant l'identifiant 1 (`id_studio = 1`), affichez le titre (`titre_romaji`), le format (`format`) et le nombre d'épisodes (`nb_episodes`).

<!-- expected-query: Q3
SELECT titre_romaji, format, nb_episodes FROM ANIMES WHERE id_studio = 1;
-->

**4. Croiser chaque anime avec son studio de production**

Pour chaque anime disposant d'un studio répertorié, affichez son titre (`titre_romaji`), le nom du studio sous l'alias `NomStudio` et son année de diffusion (`annee_diffusion`).

<!-- expected-query: Q4
SELECT ANIMES.titre_romaji, STUDIOS.nom_studio AS NomStudio, ANIMES.annee_diffusion FROM ANIMES JOIN STUDIOS ON ANIMES.id_studio = STUDIOS.id_studio;
-->

**5. Identifier les réalisateurs et les animes qu'ils ont dirigés**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des membres du staff et le titre de l'anime dirigé sous l'alias `TitreAnime` (`role = 'Realisateur'`).

<!-- expected-query: Q5
SELECT DISTINCT STAFF.nom, STAFF.prenom, ANIMES.titre_romaji AS TitreAnime FROM STAFF JOIN CREDITS_ANIME ON STAFF.id_personne = CREDITS_ANIME.id_personne JOIN ANIMES ON CREDITS_ANIME.id_anime = ANIMES.id_anime WHERE CREDITS_ANIME.role = 'Realisateur';
-->

**6. Lister les doubleurs et leurs personnages associés**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) du doubleur, le nom du personnage sous l'alias `Personnage` (`personnage_nom`) et le titre de l'anime (`titre_romaji`) pour toutes les participations de doublage (`role = 'Doubleur'`).

<!-- expected-query: Q6
SELECT DISTINCT STAFF.nom, STAFF.prenom, CREDITS_ANIME.personnage_nom AS Personnage, ANIMES.titre_romaji FROM STAFF JOIN CREDITS_ANIME ON STAFF.id_personne = CREDITS_ANIME.id_personne JOIN ANIMES ON CREDITS_ANIME.id_anime = ANIMES.id_anime WHERE CREDITS_ANIME.role = 'Doubleur';
-->

**7. Consulter la Watchlist d'un membre donné**

Pour le membre d'identifiant 1 (`id_membre = 1`), affichez le titre de l'anime (`titre_romaji`), son statut de visionnage (`statut`) et la note personnelle attribuée (`note_perso`).

<!-- expected-query: Q7
SELECT ANIMES.titre_romaji, WATCHLIST.statut, WATCHLIST.note_perso FROM WATCHLIST JOIN ANIMES ON WATCHLIST.id_anime = ANIMES.id_anime WHERE WATCHLIST.id_membre = 1;
-->

**8. Croiser les membres avec les animes qu'ils ont terminés**

Pour chaque anime complété, affichez sans doublon le pseudo du membre (`pseudo`), le titre de l'anime (`titre_romaji`) et la note attribuée (`note_perso`) pour les seules œuvres marquées comme 'Termine'.

<!-- expected-query: Q8
SELECT DISTINCT MEMBRES.pseudo, ANIMES.titre_romaji, WATCHLIST.note_perso FROM MEMBRES JOIN WATCHLIST ON MEMBRES.id_membre = WATCHLIST.id_membre JOIN ANIMES ON WATCHLIST.id_anime = ANIMES.id_anime WHERE WATCHLIST.statut = 'Termine';
-->

**9. Compter les animes par studio**

Pour chaque studio d'animation, affichez son nom (`nom_studio`) et le nombre total d'animes produits sous l'alias `NbAnimes`. Tous les studios doivent figurer dans le résultat (en affichant 0 pour les studios sans production répertoriée).

<!-- expected-query: Q9
SELECT STUDIOS.nom_studio, COUNT(ANIMES.id_anime) AS NbAnimes FROM STUDIOS LEFT JOIN ANIMES ON STUDIOS.id_studio = ANIMES.id_studio GROUP BY STUDIOS.id_studio, STUDIOS.nom_studio;
-->

**10. Identifier les membres très investis**

Affichez le pseudo (`pseudo`) et le nombre total d'animes suivis sous l'alias `TotalSuivis` pour les membres ayant strictement plus de 8 animes inscrits dans leur Watchlist.

<!-- expected-query: Q10
SELECT MEMBRES.pseudo, COUNT(WATCHLIST.id_anime) AS TotalSuivis FROM MEMBRES JOIN WATCHLIST ON MEMBRES.id_membre = WATCHLIST.id_membre GROUP BY MEMBRES.id_membre, MEMBRES.pseudo HAVING COUNT(WATCHLIST.id_anime) > 8;
-->

**11. Dénombrer les membres suivant chaque anime**

Pour chaque anime de la base, affichez son titre (`titre_romaji`) et le nombre total de membres qui le suivent sous l'alias `NbAbonnes` (en incluant les animes orphelins avec la valeur 0).

<!-- expected-query: Q11
SELECT ANIMES.titre_romaji, COUNT(WATCHLIST.id_membre) AS NbAbonnes FROM ANIMES LEFT JOIN WATCHLIST ON ANIMES.id_anime = WATCHLIST.id_anime GROUP BY ANIMES.id_anime, ANIMES.titre_romaji;
-->

**12. Artistes polyvalents cumulant doublage et réalisation sur le même anime**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre de l'anime (`titre_romaji`) pour les artistes ayant exercé à la fois un rôle de doubleur et un rôle d'auteur/réalisateur/scénariste sur la même œuvre.

<details>
<summary>💡 Indice</summary>

Effectuez deux jointures sur `CREDITS_ANIME` avec des alias distincts liés sur le même `id_personne` et `id_anime`.
</details>

<!-- expected-query: Q12
SELECT DISTINCT S.nom, S.prenom, A.titre_romaji FROM STAFF S JOIN CREDITS_ANIME C1 ON S.id_personne = C1.id_personne AND C1.role = 'Doubleur' JOIN CREDITS_ANIME C2 ON S.id_personne = C2.id_personne AND C2.role IN ('Realisateur', 'Scenariste', 'Auteur Original') AND C1.id_anime = C2.id_anime JOIN ANIMES A ON C1.id_anime = A.id_anime;
-->

**13. Filtrer les animes par fourchette de score**

À partir de la table `ANIMES`, affichez le titre (`titre_romaji`), le score moyen (`note_moyenne`) et le format (`format`) des animes dont la note moyenne est comprise entre 8.0 et 9.0 inclus.

<!-- expected-query: Q13
SELECT titre_romaji, note_moyenne, format FROM ANIMES WHERE note_moyenne BETWEEN 8.0 AND 9.0;
-->

**14. Associer chaque réalisateur aux membres ayant attribué la note maximale (10/10)**

Affichez sans doublon le nom du réalisateur sous l'alias `Realisateur`, le titre de l'anime (`titre_romaji`) et le pseudo du membre sous l'alias `Fan` ayant décerné la note 10/10 à cette œuvre.

<!-- expected-query: Q14
SELECT DISTINCT S.nom AS Realisateur, A.titre_romaji, M.pseudo AS Fan FROM STAFF S JOIN CREDITS_ANIME C ON S.id_personne = C.id_personne AND C.role = 'Realisateur' JOIN ANIMES A ON C.id_anime = A.id_anime JOIN WATCHLIST W ON A.id_anime = W.id_anime JOIN MEMBRES M ON W.id_membre = M.id_membre WHERE W.note_perso = 10;
-->

**15. Détecter les studios sans aucune production enregistrée**

Identifiez les studios inactifs : affichez l'identifiant (`id_studio`) et le nom du studio (`nom_studio`) pour lesquels aucune production n'est enregistrée dans la base.

<!-- expected-query: Q15
SELECT STUDIOS.id_studio, STUDIOS.nom_studio FROM STUDIOS LEFT JOIN ANIMES ON STUDIOS.id_studio = ANIMES.id_studio WHERE ANIMES.id_anime IS NULL;
-->
