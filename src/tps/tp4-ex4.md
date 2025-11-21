---
layout: base.njk
title: "Exercice 3 : Partie III - Requêtes très avancées"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 4
titre: "Exercice 3 : Partie III - Requêtes très avancées"
permalink: "/tp4/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Partie III - Requêtes très avancées

## Questions (12 questions)

**1. Créer un classement des sportifs par polyvalence (nombre total de rôles/activités)**

Affichez le nom du sportif et le nombre total d'activités (joueur + entraîneur + arbitre, avec les doublons).

**2. Trouver les sportifs qui jouent un sport arbitré par leur propre conseiller**

Combinez les informations de jeu, de conseil et d'arbitrage.

**3. Quel est le gymnase le plus occupé ? (Somme des durées des séances la plus élevée)**

Affichez le nom du gymnase et la durée totale.

<details>
<summary>💡 Indice</summary>
Utilisez un tri et une limite pour trouver le maximum.
</details>

**4. Identifier les "Super-Sportifs" : à la fois Joueur, Arbitre et Entraîneur**

Peu importe le sport, ils doivent avoir les trois rôles.

**5. Identifier les sports "fantômes" : pas de joueurs, pas d'arbitres, pas de séances**

Trouvez les sports qui existent dans la base mais ne sont utilisés nulle part.

**6. Trouver les sportifs ayant le même nom de famille mais des prénoms différents**

Détectez les potentielles familles de sportifs.

**7. Trouver les gymnases qui ont des séances le Lundi et le Mercredi, mais PAS le Mardi**

Analysez les "trous" dans l'emploi du temps des gymnases.

**8. Trouver les paires de sportifs du même âge**

Affichez les deux noms et l'âge.

<details>
<summary>💡 Indice</summary>
Utilisez une auto-jointure avec une condition d'inégalité sur les IDs pour éviter les doublons (A-B et B-A).
</details>

**9. Le sport le plus pratiqué (en nombre de joueurs) pour chaque gymnase**

Affichez le gymnase, le sport et le nombre de joueurs.

**10. Les sportifs qui ont un conseiller, mais qui ne pratiquent aucun des sports de ce conseiller**

Affichez le nom du sportif et le nom du conseiller.

**11. Les gymnases qui accueillent au moins 3 sports différents le même jour**

Affichez le gymnase et le jour concerné.

**12. Moyenne d'âge des sportifs par sport, uniquement pour les sports ayant plus de 5 pratiquants**

Affichez le sport et la moyenne d'âge.
