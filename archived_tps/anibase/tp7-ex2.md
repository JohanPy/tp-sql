---
layout: base.njk
title: "Exercice 2 : Partie II - Requêtes intermédiaires"
intitule: "TP 7 — Grand Cas de Synthèse (AniBase)"
base: "AniBase.sqlite"
tpNum: 7
exerciceNum: 2
titre: "Exercice 2 : Partie II - Requêtes intermédiaires"
permalink: "/tp7/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Partie II - Requêtes intermédiaires

## Questions (9 questions)

**1. Calculer le nombre d'animes terminés par membre**

Pour chaque membre inscrit, affichez son pseudo (`pseudo`) et le nombre d'animes marqués avec le statut 'Termine' sous l'alias `NbTermines` (en affichant 0 pour les membres n'ayant encore rien terminé).

<!-- expected-query: Q1
SELECT M.pseudo, COUNT(W.id_anime) AS NbTermines FROM MEMBRES M LEFT JOIN WATCHLIST W ON M.id_membre = W.id_membre AND W.statut = 'Termine' GROUP BY M.id_membre, M.pseudo;
-->

**2. Afficher les membres accompagnés du pseudo de leur parrain**

Pour tous les membres disposant d'un parrain officiel, affichez le pseudo du membre sous l'alias `Membre` ainsi que le pseudo de son parrain sous l'alias `Parrain`.

<!-- expected-query: Q2
SELECT Filleul.pseudo AS Membre, Parrain.pseudo AS Parrain FROM MEMBRES Filleul JOIN MEMBRES Parrain ON Filleul.id_parrain = Parrain.id_membre;
-->

**3. Dénombrer les réalisateurs distincts ayant collaboré avec chaque studio**

Pour chaque studio d'animation, affichez son nom (`nom_studio`) ainsi que le nombre de réalisateurs distincts ayant dirigé au moins une série chez eux, sous l'alias `NbRealisateurs` (en incluant les studios sans réalisateur avec la valeur 0).

<!-- expected-query: Q3
SELECT St.nom_studio, COUNT(DISTINCT C.id_personne) AS NbRealisateurs FROM STUDIOS St LEFT JOIN ANIMES A ON St.id_studio = A.id_studio LEFT JOIN CREDITS_ANIME C ON A.id_anime = C.id_anime AND C.role = 'Realisateur' GROUP BY St.id_studio, St.nom_studio;
-->

**4. Volume moyen d'épisodes et note moyenne par format**

Pour chaque format de production (`format`), affichez l'intitulé du format, la moyenne d'épisodes arrondie à 1 décimale sous l'alias `MoyenneEpisodes`, et la note moyenne arrondie à 2 décimales sous l'alias `NoteMoyenne`.

<!-- expected-query: Q4
SELECT format, ROUND(AVG(nb_episodes), 1) AS MoyenneEpisodes, ROUND(AVG(note_moyenne), 2) AS NoteMoyenne FROM ANIMES GROUP BY format;
-->

**5. Identifier les membres ayant suivi l'anime le mieux noté**

Déterminez l'anime disposant de la meilleure note moyenne de la base, puis affichez sans doublon le pseudo (`pseudo`) des membres qui l'ont inscrit dans leur Watchlist.

<details>
<summary>💡 Indice</summary>

Isolez l'anime star via une sous-requête avec `ORDER BY note_moyenne DESC LIMIT 1`.
</details>

<!-- expected-query: Q5
SELECT DISTINCT M.pseudo FROM MEMBRES M JOIN WATCHLIST W ON M.id_membre = W.id_membre WHERE W.id_anime = (SELECT id_anime FROM ANIMES WHERE note_moyenne IS NOT NULL ORDER BY note_moyenne DESC LIMIT 1);
-->

**6. Calculer la durée totale des séries produites par chaque studio**

Pour chaque studio ayant au moins une série répertoriée, calculez le volume horaire total cumulé de ses productions (somme de `nb_episodes * duree_episode_min` convertie en heures et arrondie à 1 décimale) sous l'alias `TotalHeures`.

<!-- expected-query: Q6
SELECT St.nom_studio, ROUND(SUM(A.nb_episodes * A.duree_episode_min) / 60.0, 1) AS TotalHeures FROM STUDIOS St JOIN ANIMES A ON St.id_studio = A.id_studio WHERE A.nb_episodes IS NOT NULL AND A.duree_episode_min IS NOT NULL GROUP BY St.id_studio, St.nom_studio;
-->

**7. Détecter les membres n'ayant jamais attribué de note**

Affichez l'identifiant (`id_membre`) et le pseudo (`pseudo`) des membres inscrits qui n'ont jamais renseigné de note personnelle (`note_perso IS NULL`) dans leur Watchlist.

<!-- expected-query: Q7
SELECT M.id_membre, M.pseudo FROM MEMBRES M WHERE NOT EXISTS (SELECT 1 FROM WATCHLIST W WHERE W.id_membre = M.id_membre AND W.note_perso IS NOT NULL);
-->

**8. Répartition des animes par saison de diffusion**

Affichez le nom de la saison sous l'alias `Saison` et le nombre total d'animes diffusés lors de cette saison sous l'alias `NbAnimes`, pour toutes les saisons renseignées.

<!-- expected-query: Q8
SELECT saison AS Saison, COUNT(*) AS NbAnimes FROM ANIMES WHERE saison IS NOT NULL GROUP BY saison;
-->

**9. Classifier les animes selon leur volume d'épisodes**

Pour les animes au format série télévisée (`format = 'TV'`), affichez le titre (`titre_romaji`), le nombre d'épisodes (`nb_episodes`) et une colonne sous l'alias `TypeSaison` affichant 'Court (1 cour)' si l'anime compte 13 épisodes ou moins, 'Moyen (2 cours)' s'il compte entre 14 et 26 épisodes, et 'Long fleuve' au-delà.

<!-- expected-query: Q9
SELECT titre_romaji, nb_episodes, CASE WHEN nb_episodes <= 13 THEN 'Court (1 cour)' WHEN nb_episodes <= 26 THEN 'Moyen (2 cours)' ELSE 'Long fleuve' END AS TypeSaison FROM ANIMES WHERE format = 'TV' AND nb_episodes IS NOT NULL;
-->
