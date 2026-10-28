---
layout: base.njk
title: "Exercice 4 : Bonus - Défis complexes"
intitule: "TP 5 — Grand Cas de Synthèse (NetflixStream)"
base: "NetflixStream.sqlite"
tpNum: 5
exerciceNum: 4
titre: "Exercice 4 : Bonus - Défis complexes"
permalink: "/tp5/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Défis complexes

## Questions (8 questions)

**1. Abonnés cumulant les 4 statuts clés**

Trouvez les abonnés les plus engagés sur la plateforme, cumulant à la fois : avoir effectué au moins un visionnage, avoir au moins un contenu en favori, avoir attribué au moins une note d'avis, et être parrain d'au moins un autre membre. Affichez leur identifiant (`id_abonne`), leur nom (`nom`) et leur prénom (`prenom`).

<!-- expected-query: Q1
SELECT id_abonne, nom, prenom FROM ABONNES WHERE id_abonne IN (SELECT id_abonne FROM VISIONNAGES) AND id_abonne IN (SELECT id_abonne FROM FAVORIS) AND id_abonne IN (SELECT id_abonne FROM VISIONNAGES WHERE note_avis IS NOT NULL) AND id_abonne IN (SELECT DISTINCT id_parrain FROM ABONNES WHERE id_parrain IS NOT NULL);
-->

**2. Détecter les fraudes de compte : double visionnage simultané à la même heure**

Détectez les partages de compte suspects : identifiez les abonnés enregistrés sur deux visionnages distincts ayant lieu le même jour et à la même heure de début. Affichez l'identifiant de l'abonné (`id_abonne`), son nom (`nom`), la date (`date_visionnage`), l'horaire (`heure_debut`), le titre du premier contenu sous l'alias `Film1` et celui du second sous l'alias `Film2`. Veillez à éliminer les paires symétriques avec `V1.id_contenu < V2.id_contenu`.

<details>
<summary>💡 Indice</summary>

Une auto-jointure sur `VISIONNAGES` (`V1.id_abonne = V2.id_abonne AND V1.date_visionnage = V2.date_visionnage AND V1.heure_debut = V2.heure_debut`) permet d'isoler les collisions temporelles exactes.
</details>

<!-- expected-query: Q2
SELECT V1.id_abonne, A.nom, V1.date_visionnage, V1.heure_debut, C1.titre AS Film1, C2.titre AS Film2 FROM VISIONNAGES V1 JOIN VISIONNAGES V2 ON V1.id_abonne = V2.id_abonne AND V1.date_visionnage = V2.date_visionnage AND V1.heure_debut = V2.heure_debut AND V1.id_contenu < V2.id_contenu JOIN ABONNES A ON V1.id_abonne = A.id_abonne JOIN CONTENUS C1 ON V1.id_contenu = C1.id_contenu JOIN CONTENUS C2 ON V2.id_contenu = C2.id_contenu;
-->

**3. Reconstituer la chaîne hiérarchique de parrainage à trois niveaux**

Identifiez les lignées de parrainage à 3 échelons successifs (le membre A parraine le membre B qui parraine le membre C) : affichez le nom du parrain initial sous l'alias `GrandParrain`, le nom du parrain intermédiaire sous l'alias `Parrain`, et le nom du protégé final sous l'alias `Filleul`.

<!-- expected-query: Q3
SELECT GP.nom AS GrandParrain, P.nom AS Parrain, F.nom AS Filleul FROM ABONNES F JOIN ABONNES P ON F.id_parrain = P.id_abonne JOIN ABONNES GP ON P.id_parrain = GP.id_abonne;
-->

**4. Calculer le délai d'activation avant le premier visionnage**

Pour chaque abonné ayant regardé au moins un contenu, calculez le nombre de jours écoulés entre sa date d'inscription (`date_inscription`) et son tout premier visionnage (`MIN(date_visionnage)`). Affichez son identifiant (`id_abonne`), son nom (`nom`) et le délai en jours sous l'alias `JoursAvantPremierVisionnage`.

<details>
<summary>💡 Indice</summary>

Utilisez `CAST(JULIANDAY(MIN(V.date_visionnage)) - JULIANDAY(A.date_inscription) AS INT)` pour soustraire deux dates au format ISO.
</details>

<!-- expected-query: Q4
SELECT A.id_abonne, A.nom, CAST(JULIANDAY(MIN(V.date_visionnage)) - JULIANDAY(A.date_inscription) AS INT) AS JoursAvantPremierVisionnage FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne GROUP BY A.id_abonne, A.nom;
-->

**5. Calculer le taux de complétion moyen par contenu**

Pour chaque contenu d'une durée strictement positive, calculez le ratio de complétion moyen (durée visionnée divisée par la durée totale de l'œuvre), exprimé en pourcentage et arrondi à 1 décimale sous l'alias `TauxCompletionPourcent`. Affichez le titre (`titre`), la durée (`duree_minutes`) et triez par taux décroissant.

<!-- expected-query: Q5
SELECT C.titre, C.duree_minutes, ROUND(AVG(CAST(V.duree_regardee_min AS FLOAT) / C.duree_minutes) * 100, 1) AS TauxCompletionPourcent FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE C.duree_minutes > 0 GROUP BY C.id_contenu, C.titre, C.duree_minutes ORDER BY TauxCompletionPourcent DESC;
-->

**6. Contenus mis en favoris par des abonnés mais jamais lancés par ceux-ci**

Identifiez les envies non concrétisées : affichez sans doublon le nom de l'abonné sous l'alias `Abonne` et le titre de l'œuvre (`titre`) pour les contenus que l'abonné a ajoutés dans ses favoris mais qu'il n'a encore jamais visionnés.

<details>
<summary>💡 Indice</summary>

Utilisez `WHERE NOT EXISTS (SELECT 1 FROM VISIONNAGES WHERE ...)` reliant le même abonné et le même contenu.
</details>

<!-- expected-query: Q6
SELECT DISTINCT A.nom AS Abonne, C.titre FROM FAVORIS F JOIN ABONNES A ON F.id_abonne = A.id_abonne JOIN CONTENUS C ON F.id_contenu = C.id_contenu WHERE NOT EXISTS (SELECT 1 FROM VISIONNAGES V WHERE V.id_abonne = F.id_abonne AND V.id_contenu = F.id_contenu);
-->

**7. Réalisateurs dont tous les contenus notés ont obtenu une moyenne supérieure à 4**

Affichez le nom (`nom`), le prénom (`prenom`), le nombre d'œuvres sous l'alias `NbOeuvres` et la note moyenne globale arrondie à 2 décimales sous l'alias `NoteMoyenneGlobale`, pour les réalisateurs dont l'ensemble des contenus ayant reçu des avis enregistrent une note moyenne strictement supérieure ou égale à 4.0.

<!-- expected-query: Q7
SELECT P.nom, P.prenom, COUNT(DISTINCT C.id_contenu) AS NbOeuvres, ROUND(AVG(V.note_avis), 2) AS NoteMoyenneGlobale FROM PERSONNES P JOIN PARTICIPATIONS Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN CONTENUS C ON Part.id_contenu = C.id_contenu JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu WHERE V.note_avis IS NOT NULL GROUP BY P.id_personne, P.nom, P.prenom HAVING AVG(V.note_avis) >= 4.0;
-->

**8. Genres sous la responsabilité exclusive d'un seul réalisateur**

Affichez le libellé du genre (`nom`) et le nombre de réalisateurs sous l'alias `NbRealisateurs`, pour les seuls genres cinématographiques dont l'ensemble des œuvres présentes au catalogue a été dirigé par un seul et unique réalisateur.

<!-- expected-query: Q8
SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom HAVING COUNT(DISTINCT Part.id_personne) = 1;
-->
