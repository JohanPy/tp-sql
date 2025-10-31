---
layout: base.njk
category: interrogation
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

<details>
<summary>💡 Indice</summary>

Comptez les entrées dans `Jouer`, `Entrainer` et `Arbitrer` pour chaque NumLicence, puis sommez.
</details>

**2. Trouver les "clusters" : groupes de sportifs pratiquant exactement les mêmes sports**

Quels sportifs pratiquent la même combinaison de sports ?

<details>
<summary>💡 Indice</summary>

Calculez l'empreinte sportive de chaque sportif, puis cherchez les doublons.
</details>

**3. Analyser la "couverture pédagogique" : pour chaque sport, afficher les niveaux représentés**

<details>
<summary>💡 Indice</summary>

Groupez par sport, puis listez les niveaux distincts présents dans `Jouer`, `Entrainer`, `Arbitrer`.
</details>

**4. Identifier les "manques" : sports sans entraîneurs ou sans arbitres**

<details>
<summary>💡 Indice</summary>

Utilisez `LEFT JOIN` entre `Sport` et `Entrainer`/`Arbitrer`, puis filtrez où les jointures sont NULL.
</details>

**5. Créer une "matrice de compatibilité" : pour chaque paire entraîneur-sportif, vérifier la compatibilité**

Vérifiez si l'entraîneur entraîne un sport que le sportif pratique.

<details>
<summary>💡 Indice</summary>

Joignez tous les 3 sur la relation entraîneur-sport et pratiquant-sport.
</details>

**6. Calculer la "densité d'activité" par gymnase : ratio (séances) / (capacité totale)**

<details>
<summary>💡 Indice</summary>

Calculez SUM(MaxSportifs) et COUNT(séances) par gymnase.
</details>

**7. Trouver les sportifs "sur-engagés" : pratiquant 3+ sports ET entraînant 2+ sports ET arbitrant au moins 1**

<details>
<summary>💡 Indice</summary>

Comptez séparément pour chaque table, puis appliquez les conditions HAVING combinées.
</details>

**8. Analyser les "chaînes d'influence" : A entraîne B qui entraîne C (sur le même sport)**

<details>
<summary>💡 Indice</summary>

Utilisez une auto-jointure sur `Entrainer` pour trouver transitivité via le sport.
</details>

**9. Créer un "profil complet" pour chaque sportif : tous les rôles, sports, niveaux, et seances disponibles**

<details>
<summary>💡 Indice</summary>

Combinez les 3 tables de rôles et les 2 tables de contexte (Sport, Seance).
</details>

**10. Calculer la "stabilité" des niveaux : ratio (nombre de confirmés) / (nombre total de pratiquants) par sport**

<details>
<summary>💡 Indice</summary>

Divisez COUNT où Niveau = "Confirmé" par COUNT(*) total en groupant par sport.
</details>

**11. Identifier les sportifs "isolés" : ne pratiquant aucun sport disponible dans les séances programmées**

<details>
<summary>💡 Indice</summary>

Trouvez les sports en séance, puis les sportifs dont le sport n'est pas dans cette liste.
</details>

**12. Analyser les "déficits de capacité" : seances où le nombre de pratiquants potentiels dépasse MaxSportifs**

<details>
<summary>💡 Indice</summary>

Comptez les pratiquants du sport pour chaque séance et comparez avec MaxSportifs.
</details>

**13. Créer une "recommandation de doublons" : sportifs avec nom/prénom similaires qui pourraient être la même personne**

<details>
<summary>💡 Indice</summary>

Utilisez une auto-jointure sur `Sportif` et comparez les noms (LIKE ou ressemblance).
</details>

**14. Calculer la "distance sociale" : combien de degrés de séparation entre deux sportifs via l'entraînement/arbitrage?**

Exemple : A est entraîné par B, B entraîne C, donc distance(A,C) = 2.

<details>
<summary>💡 Indice</summary>

Utilisez les unions de tables `Entrainer` et `Arbitrer` pour construire le graphe de relations.
</details>
