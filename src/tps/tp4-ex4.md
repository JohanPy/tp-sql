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
---

# Exercice 3 : Partie III - Requêtes très avancées

## Questions (14 questions)

**1. Créer un classement des sportifs par polyvalence (nombre total de rôles/activités)**

Affichez le nom du sportif et le nombre total d'activités (joueur + entraîneur + arbitre, avec les doublons).

**2. Trouver les "clusters" : groupes de sportifs pratiquant exactement les mêmes sports**

Quels sportifs pratiquent la même combinaison de sports ?

**3. Analyser la "couverture pédagogique" : pour chaque sport, afficher les niveaux représentés**

Évaluez la diversité des niveaux disponibles.

**4. Identifier les "manques" : sports sans entraîneurs ou sans arbitres**

Trouvez les lacunes dans l'encadrement sportif.

**5. Créer une "matrice de compatibilité" : pour chaque paire entraîneur-sportif, vérifier la compatibilité**

Vérifiez si l'entraîneur entraîne un sport que le sportif pratique.

**6. Calculer la "densité d'activité" par gymnase : ratio (séances) / (capacité totale)**

Analysez l'utilisation des installations.

**7. Trouver les sportifs "sur-engagés" : pratiquant 3+ sports ET entraînant 2+ sports ET arbitrant au moins 1**

Identifiez les sportifs très actifs.

**8. Analyser les "chaînes d'influence" : A entraîne B qui entraîne C (sur le même sport)**

Tracez les relations transitives d'entraînement.

**9. Créer un "profil complet" pour chaque sportif : tous les rôles, sports, niveaux, et seances disponibles**

Consolidez toutes les informations d'un sportif.

**10. Calculer la "stabilité" des niveaux : ratio (nombre de confirmés) / (nombre total de pratiquants) par sport**

Évaluez la maturité de chaque discipline.

**11. Identifier les sportifs "isolés" : ne pratiquant aucun sport disponible dans les séances programmées**

Trouvez les sportifs sans séances compatibles.

**12. Analyser les "déficits de capacité" : seances où le nombre de pratiquants potentiels dépasse MaxSportifs**

Identifiez les surcharges potentielles.

**13. Créer une "recommandation de doublons" : sportifs avec nom/prénom similaires qui pourraient être la même personne**

Détectez les entrées potentiellement dupliquées.

**14. Calculer la "distance sociale" : combien de degrés de séparation entre deux sportifs via l'entraînement/arbitrage?**

Exemple : A est entraîné par B, B entraîne C, donc distance(A,C) = 2.
