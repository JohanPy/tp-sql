---
layout: base.njk
title: "Exercice 2 : Partie II - Requêtes intermédiaires"
intitule: "TP 5 — Grand Cas de Synthèse (NetflixStream)"
base: "NetflixStream.sqlite"
tpNum: 5
exerciceNum: 2
titre: "Exercice 2 : Partie II - Requêtes intermédiaires"
permalink: "/tp5/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Partie II - Requêtes intermédiaires

## Questions (9 questions)

**1. Calculer le nombre total de favoris par abonné**

Pour chaque abonné de la plateforme, affichez son nom (`nom`), son prénom (`prenom`) et le nombre total de contenus en favoris sous l'alias `NbFavoris` (en affichant 0 pour les abonnés sans aucun favori).

<details>
<summary>💡 Indice</summary>

Utilisez `LEFT JOIN` et comptez un attribut de la table de droite (ex: `COUNT(FAVORIS.id_contenu)`) pour éviter que `COUNT(*)` ne compte 1 ligne pour les nuls.
</details>

<!-- expected-query: Q1
SELECT ABONNES.nom, ABONNES.prenom, COUNT(FAVORIS.id_contenu) AS NbFavoris FROM ABONNES LEFT JOIN FAVORIS ON ABONNES.id_abonne = FAVORIS.id_abonne GROUP BY ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom;
-->

**2. Afficher les abonnés accompagnés du nom de leur parrain**

Pour tous les abonnés disposant d'un parrain officiel, affichez le nom du filleul sous l'alias `Abonne` ainsi que le nom de famille de son parrain sous l'alias `Parrain`.

<!-- expected-query: Q2
SELECT Filleul.nom AS Abonne, Parrain.nom AS Parrain FROM ABONNES Filleul JOIN ABONNES Parrain ON Filleul.id_parrain = Parrain.id_abonne;
-->

**3. Dénombrer les réalisateurs distincts ayant officié par genre**

Pour chaque genre du catalogue, affichez son intitulé (`nom`) ainsi que le nombre de réalisateurs distincts ayant dirigé au moins une œuvre dans ce genre, sous l'alias `NbRealisateurs` (en incluant les genres sans réalisateur avec la valeur 0).

<!-- expected-query: Q3
SELECT G.nom, COUNT(DISTINCT Part.id_personne) AS NbRealisateurs FROM GENRES G LEFT JOIN CONTENUS C ON G.id_genre = C.id_genre LEFT JOIN PARTICIPATIONS Part ON C.id_contenu = Part.id_contenu AND Part.role = 'Realisateur' GROUP BY G.id_genre, G.nom;
-->

**4. Synthèse d'activité par genre : volume de contenus et note moyenne**

Pour chaque genre, affichez son libellé (`nom`), le nombre total d'œuvres sous l'alias `NbContenus`, ainsi que la note moyenne attribuée par les utilisateurs arrondie à 2 décimales sous l'alias `NoteMoyenne`.

<!-- expected-query: Q4
SELECT G.nom, COUNT(DISTINCT C.id_contenu) AS NbContenus, ROUND(AVG(V.note_avis), 2) AS NoteMoyenne FROM GENRES G JOIN CONTENUS C ON G.id_genre = C.id_genre LEFT JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY G.id_genre, G.nom;
-->

**5. Identifier les abonnés ayant visionné le contenu le plus regardé**

Déterminez le contenu ayant cumulé le plus grand nombre de sessions de visionnage sur la plateforme, puis affichez sans doublon le nom (`nom`) et le prénom (`prenom`) des abonnés qui l'ont regardé.

<details>
<summary>💡 Indice</summary>

Isolez l'identifiant du contenu le plus populaire à l'aide d'une sous-requête avec `GROUP BY ... ORDER BY COUNT(*) DESC LIMIT 1`.
</details>

<!-- expected-query: Q5
SELECT DISTINCT A.nom, A.prenom FROM ABONNES A JOIN VISIONNAGES V ON A.id_abonne = V.id_abonne WHERE V.id_contenu = (SELECT id_contenu FROM VISIONNAGES GROUP BY id_contenu ORDER BY COUNT(*) DESC LIMIT 1);
-->

**6. Calculer la durée moyenne de visionnage par format**

Pour chaque format de contenu (`type_format`), affichez l'intitulé du format et la durée moyenne de visionnage en minutes (arrondie à 1 décimale) sous l'alias `DureeMoyenne`.

<!-- expected-query: Q6
SELECT C.type_format, ROUND(AVG(V.duree_regardee_min), 1) AS DureeMoyenne FROM CONTENUS C JOIN VISIONNAGES V ON C.id_contenu = V.id_contenu GROUP BY C.type_format;
-->

**7. Détecter les abonnés inactifs n'ayant jamais rien regardé**

Affichez l'identifiant (`id_abonne`), le nom (`nom`) et le prénom (`prenom`) des abonnés inscrits sur la plateforme qui n'ont effectué aucun visionnage.

<!-- expected-query: Q7
SELECT ABONNES.id_abonne, ABONNES.nom, ABONNES.prenom FROM ABONNES LEFT JOIN VISIONNAGES ON ABONNES.id_abonne = VISIONNAGES.id_abonne WHERE VISIONNAGES.id_visionnage IS NULL;
-->

**8. Répartition des visionnages par mois de l'année**

À partir de la date de visionnage (`date_visionnage`), affichez le numéro du mois sur deux chiffres sous l'alias `Mois` et le nombre total de visionnages enregistrés sous l'alias `NbVisionnages`, trié par ordre chronologique.

<!-- expected-query: Q8
SELECT strftime('%m', date_visionnage) AS Mois, COUNT(*) AS NbVisionnages FROM VISIONNAGES GROUP BY Mois ORDER BY Mois;
-->

**9. Classifier les abonnés selon leur formule tarifaire**

À partir de la table `ABONNES`, affichez le nom (`nom`), le prénom (`prenom`), la formule (`formule`) et une colonne sous l'alias `Segment` affichant 'Haut de gamme' si la formule est 'Premium', 'Intermédiaire' si la formule est 'Standard', et 'Économique' dans le cas contraire.

<!-- expected-query: Q9
SELECT nom, prenom, formule, CASE WHEN formule = 'Premium' THEN 'Haut de gamme' WHEN formule = 'Standard' THEN 'Intermédiaire' ELSE 'Économique' END AS Segment FROM ABONNES;
-->
