/**
 * Système de progression localStorage
 * Track les chapitres de cours et exercices TP consultés
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'sql-tp-progression';

  /**
   * Récupère les données de progression depuis localStorage
   */
  function getProgression() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {
        cours: [],      // IDs des chapitres consultés
        tps: [],        // IDs des TPs consultés
        lastVisit: null // Dernière page visitée
      };
    } catch (e) {
      console.error('Erreur lecture progression:', e);
      return { cours: [], tps: [], lastVisit: null };
    }
  }

  /**
   * Sauvegarde les données de progression
   */
  function saveProgression(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erreur sauvegarde progression:', e);
    }
  }

  /**
   * Marque un item comme consulté
   */
  function markAsVisited(type, id) {
    const prog = getProgression();
    
    if (type === 'cours') {
      if (!prog.cours.includes(id)) {
        prog.cours.push(id);
      }
    } else if (type === 'tp') {
      if (!prog.tps.includes(id)) {
        prog.tps.push(id);
      }
    }
    
    prog.lastVisit = {
      type: type,
      id: id,
      timestamp: Date.now()
    };
    
    saveProgression(prog);
  }

  /**
   * Vérifie si un item a été consulté
   */
  function isVisited(type, id) {
    const prog = getProgression();
    return type === 'cours' 
      ? prog.cours.includes(id)
      : prog.tps.includes(id);
  }

  /**
   * Obtient les statistiques de progression
   */
  function getStats() {
    const prog = getProgression();
    return {
      coursVisited: prog.cours.length,
      tpsVisited: prog.tps.length,
      totalVisited: prog.cours.length + prog.tps.length,
      lastVisit: prog.lastVisit
    };
  }

  /**
   * Réinitialise la progression
   */
  function resetProgression() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Progression réinitialisée');
  }

  /**
   * Ajoute des badges visuels aux items consultés
   */
  function addVisitedBadges() {
    const prog = getProgression();
    
    // Badge pour les chapitres de cours
    document.querySelectorAll('[data-cours-id]').forEach(el => {
      const id = el.getAttribute('data-cours-id');
      if (prog.cours.includes(id)) {
        el.classList.add('visited');
        const badge = document.createElement('span');
        badge.className = 'visited-badge';
        badge.textContent = '✓';
        badge.title = 'Déjà consulté';
        if (!el.querySelector('.visited-badge')) {
          el.appendChild(badge);
        }
      }
    });
    
    // Badge pour les TPs
    document.querySelectorAll('[data-tp-id]').forEach(el => {
      const id = el.getAttribute('data-tp-id');
      if (prog.tps.includes(id)) {
        el.classList.add('visited');
        const badge = document.createElement('span');
        badge.className = 'visited-badge';
        badge.textContent = '✓';
        badge.title = 'Déjà consulté';
        if (!el.querySelector('.visited-badge')) {
          el.appendChild(badge);
        }
      }
    });
  }

  /**
   * Affiche les statistiques dans un élément
   */
  function displayStats(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const stats = getStats();
    container.innerHTML = `
      <div class="progression-stats">
        <div class="stat-item">
          <span class="stat-number">${stats.coursVisited}</span>
          <span class="stat-label">Chapitres consultés</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${stats.tpsVisited}</span>
          <span class="stat-label">Exercices consultés</span>
        </div>
      </div>
    `;
  }

  // Auto-track la page courante
  window.addEventListener('DOMContentLoaded', function() {
    // Détecter si on est sur une page cours
    const coursMatch = window.location.pathname.match(/\/cours\/[^\/]+\/chapitre-(\d+)/);
    if (coursMatch) {
      const chapNum = parseInt(coursMatch[1]);
      markAsVisited('cours', `chap-${chapNum}`);
    }
    
    // Détecter si on est sur une page TP
    const tpMatch = window.location.pathname.match(/\/tp(\d+)\/exercice(\d+)/);
    if (tpMatch) {
      const tpNum = parseInt(tpMatch[1]);
      const exNum = parseInt(tpMatch[2]);
      markAsVisited('tp', `tp${tpNum}-ex${exNum}`);
    }
    
    // Ajouter les badges
    addVisitedBadges();
  });

  // Exposer l'API publique
  window.SQLProgression = {
    mark: markAsVisited,
    isVisited: isVisited,
    getStats: getStats,
    reset: resetProgression,
    displayStats: displayStats,
    addBadges: addVisitedBadges
  };

})();
