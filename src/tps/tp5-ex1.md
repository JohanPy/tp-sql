---
layout: base.njk
title: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
intitule: "TP 5 — Grand Cas de Synthèse (NetflixStream)"
base: "NetflixStream.sqlite"
tpNum: 5
exerciceNum: 1
titre: "Exercice 1 : Partie I - Requêtes de base et jointures simples"
permalink: "/tp5/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Partie I - Requêtes de base et jointures simples

## Questions (15 questions)

**1. Afficher tous les abonnés de la plateforme**

À partir de la table `ABONNES`, affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et le pays (`pays`) de tous les abonnés.

<!-- expected-query: Q1
SELECT id_abonne, nom, prenom, pays FROM ABONNES;
-->

**2. Lister les genres cinématographiques disponibles**

À partir de la table `GENRES`, affichez l'identifiant (`id_genre`) et l'intitulé (`nom`) de l'ensemble des genres disponibles.

<!-- expected-query: Q2
SELECT id_genre, nom FROM GENRES;
-->

**3. Consulter les contenus d'un genre spécifique**

Pour le genre d'identifiant 3 (`id_genre = 3`), affichez le titre (`titre`), le format (`type_format`) et la durée en minutes (`duree_minutes`).

<!-- expected-query: Q3
SELECT titre, type_format, duree_minutes FROM CONTENUS WHERE id_genre = 3;
-->

**4. Croiser les contenus avec leur genre**

Pour chaque contenu du catalogue, affichez son titre (`titre`), son type (`type_format`) et le nom de son genre sous l'alias `Genre`.

<!-- expected-query: Q4
SELECT CONTENUS.titre, CONTENUS.type_format, GENRES.nom AS Genre FROM CONTENUS JOIN GENRES ON CONTENUS.id_genre = GENRES.id_genre;
-->

**5. Identifier les réalisateurs et les contenus qu'ils ont dirigés**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) des réalisateurs ainsi que le titre du contenu dirigé sous l'alias `TitreOeuvre` (`role = 'Realisateur'`).

<!-- expected-query: Q5
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CONTENUS.titre AS TitreOeuvre FROM PERSONNES JOIN PARTICIPATIONS ON PERSONNES.id_personne = PARTICIPATIONS.id_personne JOIN CONTENUS ON PARTICIPATIONS.id_contenu = CONTENUS.id_contenu WHERE PARTICIPATIONS.role = 'Realisateur';
-->

**6. Identifier les acteurs principaux des films**

Affichez sans doublon le nom (`nom`) et le prénom (`prenom`) des artistes tenant le rôle d'acteur principal (`role = 'Acteur principal'`) dans des œuvres au format film (`type_format = 'Film'`), ainsi que le titre du film sous l'alias `Film`.

<!-- expected-query: Q6
SELECT DISTINCT PERSONNES.nom, PERSONNES.prenom, CONTENUS.titre AS Film FROM PERSONNES JOIN PARTICIPATIONS ON PERSONNES.id_personne = PARTICIPATIONS.id_personne JOIN CONTENUS ON PARTICIPATIONS.id_contenu = CONTENUS.id_contenu WHERE PARTICIPATIONS.role = 'Acteur principal' AND CONTENUS.type_format = 'Film';
-->

**7. Historique des visionnages d'un abonné donné**

Pour l'abonné ayant l'identifiant 1 (`id_abonne = 1`), affichez le titre du contenu regardé (`titre`), la date de visionnage (`date_visionnage`) et la note attribuée (`note_avis`).

<!-- expected-query: Q7
SELECT CONTENUS.titre, VISIONNAGES.date_visionnage, VISIONNAGES.note_avis FROM VISIONNAGES JOIN CONTENUS ON VISIONNAGES.id_contenu = CONTENUS.id_contenu WHERE VISIONNAGES.id_abonne = 1;
-->

**8. Croiser les abonnés et leurs favoris**

Pour chaque favori enregistré, affichez le nom de l'abonné (`nom`), son prénom (`prenom`), le titre du contenu (`titre`) et le nom du genre sous l'alias `Genre`.

<!-- expected-query: Q8
SELECT DISTINCT ABONNES.nom, ABONNES.prenom, CONTENUS.titre, GENRES.nom AS Genre FROM FAVORIS JOIN ABONNES ON FAVORIS.id_abonne = ABONNES.id_abonne JOIN CONTENUS ON FAVORIS.id_contenu = CONTENUS.id_contenu JOIN GENRES ON CONTENUS.id_genre = GENRES.id_genre;
-->

**9. Compter les contenus disponibles par genre**

Pour chaque genre, affichez son libellé (`nom`) et le nombre total de contenus associés sous l'alias `NbContenus`. Tous les genres doivent figurer dans le résultat (en affichant 0 pour ceux sans aucun contenu).

<!-- expected-query: Q9
SELECT GENRES.nom, COUNT(CONTENUS.id_contenu) AS NbContenus FROM GENRES LEFT JOIN CONTENUS ON GENRES.id_genre = CONTENUS.id_genre GROUP BY GENRES.id_genre, GENRES.nom;
-->

**10. Identifier les abonnés très actifs**

Affichez le nom (`nom`), le prénom (`prenom`) et le nombre de visionnages distincts sous l'alias `NbVisionnages` pour les abonnés ayant visionné strictement plus de 5 contenus.

<!-- expected-query: Q10
SELECT ABONNES.nom, ABONNES.prenom, COUNT(VISIONNAGES.id_visionnage) AS NbVisionnages FROM ABONNES JOIN VISIONNAGES ON ABONNES.id_abonne = VISIONNAGES.id_abonne GROUP BY ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom HAVING COUNT(VISIONNAGES.id_visionnage) > 5;
-->

**11. Mesurer la popularité des contenus par le nombre de visionnages**

Pour chaque contenu du catalogue, affichez son titre (`titre`) et son nombre total de visionnages sous l'alias `NbVues` (en incluant les contenus jamais regardés avec la valeur 0).

<!-- expected-query: Q11
SELECT CONTENUS.titre, COUNT(VISIONNAGES.id_visionnage) AS NbVues FROM CONTENUS LEFT JOIN VISIONNAGES ON CONTENUS.id_contenu = VISIONNAGES.id_contenu GROUP BY CONTENUS.id_contenu, CONTENUS.titre;
-->

**12. Artistes ayant été à la fois réalisateur et acteur principal sur la même œuvre**

Affichez sans doublon le nom (`nom`), le prénom (`prenom`) et le titre du contenu (`titre`) pour les artistes ayant cumulé les rôles de réalisateur et d'acteur principal sur un même contenu.

<details>
<summary>💡 Indice</summary>

Effectuez deux jointures sur la table `PARTICIPATIONS` avec des alias distincts liés sur le même `id_personne` et le même `id_contenu`.
</details>

<!-- expected-query: Q12
SELECT DISTINCT P.nom, P.prenom, C.titre FROM PERSONNES P JOIN PARTICIPATIONS P1 ON P.id_personne = P1.id_personne AND P1.role = 'Realisateur' JOIN PARTICIPATIONS P2 ON P.id_personne = P2.id_personne AND P2.role = 'Acteur principal' AND P1.id_contenu = P2.id_contenu JOIN CONTENUS C ON P1.id_contenu = C.id_contenu;
-->

**13. Filtrer les abonnés d'une tranche d'âge spécifique**

À partir de leur date de naissance (`date_naissance`), affichez l'identifiant (`id_abonne`), le nom (`nom`), le prénom (`prenom`) et la date de naissance des abonnés nés entre 2000 et 2005 inclus.

<!-- expected-query: Q13
SELECT id_abonne, nom, prenom, date_naissance FROM ABONNES WHERE strftime('%Y', date_naissance) BETWEEN '2000' AND '2005';
-->

**14. Associer chaque réalisateur aux abonnés ayant mis ses films en favoris**

Affichez sans doublon le nom du réalisateur sous l'alias `Realisateur`, le titre du film (`titre`) et le nom de l'abonné sous l'alias `Abonne` qui a placé cette œuvre dans ses favoris.

<!-- expected-query: Q14
SELECT DISTINCT P.nom AS Realisateur, C.titre, A.nom AS Abonne FROM PERSONNES P JOIN PARTICIPATIONS Part ON P.id_personne = Part.id_personne AND Part.role = 'Realisateur' JOIN CONTENUS C ON Part.id_contenu = C.id_contenu JOIN FAVORIS F ON C.id_contenu = F.id_contenu JOIN ABONNES A ON F.id_abonne = A.id_abonne;
-->

**15. Détecter les contenus orphelins sans aucun visionnage**

Identifiez les contenus orphelins : affichez l'identifiant (`id_contenu`) et le titre (`titre`) des contenus présents au catalogue qui n'ont fait l'objet d'aucun visionnage enregistré.

<!-- expected-query: Q15
SELECT CONTENUS.id_contenu, CONTENUS.titre FROM CONTENUS LEFT JOIN VISIONNAGES ON CONTENUS.id_contenu = VISIONNAGES.id_contenu WHERE VISIONNAGES.id_visionnage IS NULL;
-->
