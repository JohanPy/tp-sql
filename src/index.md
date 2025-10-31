---
layout: home.njk
title: "Accueil - SQL TP"
permalink: "/"
---

<div class="home-grid">
  <!-- Section Cours SQL -->
  <div class="home-card home-card-cours">
    <div class="card-icon">📚</div>
    <h2>Cours SQL</h2>
    <p class="card-description">
      Apprenez les concepts fondamentaux du SQL avec des explications claires et des exemples interactifs que vous pouvez tester en temps réel.
    </p>
    
    <div class="card-features">
      <div class="feature">
        <span class="feature-icon">✨</span>
        <span>Explications détaillées</span>
      </div>
      <div class="feature">
        <span class="feature-icon">💻</span>
        <span>Exemples interactifs</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📖</span>
        <span>6 chapitres progressifs</span>
      </div>
    </div>

    <div class="card-categories">
      <a href="/cours/interrogation/" class="category-link">
        <span class="category-icon">🔍</span>
        <div class="category-info">
          <strong>Interrogation de données</strong>
          <small>SELECT, WHERE, JOIN, sous-requêtes...</small>
        </div>
      </a>
      
      <div class="category-link category-disabled">
        <span class="category-icon">🔧</span>
        <div class="category-info">
          <strong>Création de bases</strong>
          <small>À venir prochainement</small>
        </div>
      </div>
    </div>

    <a href="/cours/" class="card-cta">
      Accéder aux cours
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  </div>

  <!-- Section Travaux Pratiques -->
  <div class="home-card home-card-tps">
    <div class="card-icon">🎯</div>
    <h2>Travaux Pratiques</h2>
    <p class="card-description">
      Mettez en pratique vos connaissances avec des exercices progressifs sur des bases de données réelles. Console SQL intégrée et correction automatique.
    </p>
    
    <div class="card-features">
      <div class="feature">
        <span class="feature-icon">🗄️</span>
        <span>Bases de données réelles</span>
      </div>
      <div class="feature">
        <span class="feature-icon">⚡</span>
        <span>Exécution instantanée</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📊</span>
        <span>18 exercices pratiques</span>
      </div>
    </div>

    <div class="card-categories">
      <a href="/tps/interrogation/" class="category-link">
        <span class="category-icon">🔍</span>
        <div class="category-info">
          <strong>Interrogation de données</strong>
          <small>4 TPs • 18 exercices progressifs</small>
        </div>
      </a>
      
      <div class="category-link category-disabled">
        <span class="category-icon">🔧</span>
        <div class="category-info">
          <strong>Création de bases</strong>
          <small>À venir prochainement</small>
        </div>
      </div>
    </div>

    <a href="/tps/" class="card-cta">
      Accéder aux TPs
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  </div>
</div>

## 💡 Comment utiliser cette plateforme ?

<div class="info-grid">
  <div class="info-box">
    <span class="info-number">1</span>
    <h3>Choisissez votre parcours</h3>
    <p>Commencez par les cours pour apprendre ou allez directement aux TPs si vous êtes à l'aise.</p>
  </div>
  
  <div class="info-box">
    <span class="info-number">2</span>
    <h3>Suivez la progression</h3>
    <p>Les chapitres et exercices sont organisés du plus simple au plus complexe.</p>
  </div>
  
  <div class="info-box">
    <span class="info-number">3</span>
    <h3>Pratiquez en temps réel</h3>
    <p>Testez vos requêtes SQL directement dans le navigateur, sans installation.</p>
  </div>
  
  <div class="info-box">
    <span class="info-number">4</span>
    <h3>Consultez le schéma</h3>
    <p>Visualisez la structure des tables pour mieux comprendre les relations entre les données.</p>
  </div>
</div>

## � Fonctionnalités

- ✅ **Exécution SQL en temps réel** dans le navigateur (aucune installation requise)
- ✅ **Bases de données pré-chargées** pour chaque exercice
- ✅ **Éditeur avec coloration syntaxique** (CodeMirror)
- ✅ **Historique des requêtes** pour retrouver vos essais précédents
- ✅ **Visualisation du schéma** avec clés primaires et étrangères
- ✅ **Sauvegarde et chargement** de bases de données personnalisées

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
