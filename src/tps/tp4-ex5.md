---
layout: base.njk
title: "Exercice 4 : Bonus - Défis Gymnase2000"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 5
titre: "Exercice 4 : Bonus - Défis Gymnase2000"
permalink: "/tp4/exercice5/"
tags: tp
---

# Exercice 4 : Bonus - Défis Gymnase2000

## Questions bonus

Combinez tous les concepts pour résoudre des problèmes complexes sur Gymnase2000. À faire uniquement si vous avez le temps !

**1. Créer une "hiérarchie de compétence" : lister qui peut enseigner à qui**

Affichez les paires (entraîneur, apprenant) si l'entraîneur a un niveau supérieur au apprenant dans un sport.

<details>
<summary>💡 Indice</summary>

Joignez `Entrainer` (entraîneurs) avec `Jouer` (apprenants) sur le sport, puis comparez les niveaux.
</details>

**2. Identifier les "super-athlètes" : sportifs ayant tous les niveaux dans au moins un sport**

<details>
<summary>💡 Indice</summary>

Groupez par sportif et sport, comptez les niveaux distincts (Jouer, Entrainer, Arbitrer), cherchez où COUNT = 3.
</details>

**3. Analyser la "santé" du gymnase : quelle capacité reste disponible par jour?**

Calculez la somme des MaxSportifs par jour, comparez avec les inscriptions réelles.

<details>
<summary>💡 Indice</summary>

Vous aurez besoin du jour de la séance (Horaire). Calculez SUM(MaxSportifs) vs COUNT(sportifs inscrits).
</details>

**4. Détecter les "singletons" : sportifs de jour et entraîneurs de nuit (ou vice-versa)**

<details>
<summary>💡 Indice</summary>

Analysez l'Horaire des séances où le sportif participe vs entraîne, cherchez les conflits.
</details>

**5. Créer une "force de frappe" : pour chaque sport, évaluer le ratio entraîneurs/participants**

<details>
<summary>💡 Indice</summary>

Comptez les entraîneurs et les pratiquants par sport, puis divisez.
</details>

**6. Identifier les "apprentissages croisés" : sportifs entraînés par un peer (de même niveau) plutôt que par un supérieur**

<details>
<summary>💡 Indice</summary>

Comparez les niveaux de Jouer et Entrainer pour les mêmes pairs (NumLicence entraîneur/apprenant, NumSport).
</details>

**7. Analyser les "trous" : quelles séances ont une participation très faible?**

Affichez les séances avec moins de 20% de leur capacité utilisée.

<details>
<summary>💡 Indice</summary>

Comptez les participants réels vs MaxSportifs, calculez le ratio.
</details>

**8. Créer un "tournoi imaginaire" : équipes par niveau + sport + gymnase pour favoriser les matchs équitables**

<details>
<summary>💡 Indice</summary>

Groupez les sportifs par (Sport, Niveau, Gymnase), comptez les participants, affichez les groupes >= 2.
</details>

**9. Identifier les "maîtres": sportifs entraînant le plus de pairs (transitifs) dans la même discipline**

Utilisez une transitivité d'entraînement (graphe d'influence).

<details>
<summary>💡 Indice</summary>

Utilisez l'auto-jointure sur `Entrainer` pour tracer les relations indirectes.
</details>

**10. Analyser les "spécialisations cachées" : sportifs pratiquant plusieurs sports mais excelle dans un seul**

Quelqu'un qui joue 5 sports mais arbitre et entraîne seulement 1 = spécialiste caché.

<details>
<summary>💡 Indice</summary>

Comptez séparément les rôles par sport pour chaque sportif, trouvez les écarts.
</details>

