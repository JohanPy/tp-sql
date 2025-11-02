---
layout: base.njk
title: "Accueil - SQL TP"
intitule: "SQL TP - Travaux Pratiques"
permalink: "/"
---

# Bienvenue sur la plateforme SQL TP

Cette plateforme vous permet de vous entraîner au SQL directement dans votre navigateur. Chaque exercice charge automatiquement la base de données appropriée.

## Comment utiliser cette plateforme ?

1. **Sélectionnez un TP** dans le menu de navigation à gauche
2. **Lisez les consignes** affichées au centre
3. **Écrivez votre requête SQL** dans la console à droite
4. **Exécutez** votre requête avec le bouton "Exécuter" ou `Ctrl+Enter`
5. **Consultez les résultats** en bas de la page

## TPs disponibles

{% for tpNumber, tpExercices in collections.tpsByNumber %}
<div class="tp-card">
  <h3>TP {{ tpNumber }} - {{ tpExercices[0].data.intitule }}</h3>
  <p><strong>Base de données :</strong> <code>{{ tpExercices[0].data.base }}</code></p>
  <p><strong>{{ tpExercices.length }} exercices disponibles</strong></p>
  <ul>
    {% for exercise in tpExercices %}
    <li>
      <a href="{{ exercise.url }}">{{ exercise.data.titre }}</a>
    </li>
    {% endfor %}
  </ul>
</div>
{% endfor %}

## Fonctionnalités

- ✅ **Exécution SQL en temps réel** dans le navigateur (aucune installation requise)
- ✅ **Bases de données pré-chargées** pour chaque TP
- ✅ **Éditeur avec coloration syntaxique et autocomplétion**
- ✅ **Historique des requêtes**
- ✅ **Résultats formatés en tableaux**
- ✅ **Sauvegarde et chargement de bases de données**

## 🚀 Démarrer maintenant

Choisissez un TP dans le menu de gauche pour commencer !

---

<style>
.tp-card {
  background: rgba(79, 190, 255, 0.05);
  border: 1px solid rgba(79, 190, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.tp-card h3 {
  color: var(--accent-blue);
  margin-top: 0;
}

.tp-card ul {
  margin-top: 10px;
}

.tp-card li {
  margin: 8px 0;
}

.tp-card a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.tp-card a:hover {
  color: var(--accent-blue);
}
</style>
