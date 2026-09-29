/**
 * tour.js - Visite guidée et Guide didactique interactif
 * Plateforme d'apprentissage TP SQL - IUT Pau Pays de l'Adour
 */

(function () {
	'use strict';

	// Séquence des étapes didactiques de la visite
	const TOUR_STEPS = [
		{
			id: 'welcome',
			title: 'Environnement de travail SQL',
			target: 'header',
			placement: 'bottom',
			text: 'Cette interface intègre le moteur relationnel SQLite exécuté localement dans le navigateur (WebAssembly). Les requêtes sont interprétées sans dépendance serveur.',
			tip: 'Chaque exercice initialise la base de données relationnelle associée (ex. Comptoir2000 ou Gymnase2000).',
			badge: 'Architecture'
		},
		{
			id: 'sql-inject',
			title: 'Transfert de requête depuis l\'énoncé (▶)',
			target: 'pre.sql-clickable, .exercise-content pre',
			fallbackTarget: '.exercise-content',
			placement: 'right',
			text: 'Les blocs d\'exemples SQL insérés dans l\'énoncé ou les rappels de cours comportent une icône triangle <strong>▶</strong>. Un clic sur le bloc ou sur l\'icône charge directement l\'instruction dans la console SQL.',
			tip: 'Ce mécanisme évite la copie manuelle et permet de tester ou modifier immédiatement une requête type.',
			badge: 'Consigne & Rappel'
		},
		{
			id: 'expected-result',
			title: 'Contrôle par résultat attendu',
			target: '.btn-expected-result, .expected-action-wrapper',
			fallbackTarget: '.exercise-content',
			placement: 'right',
			text: 'Le bouton <strong>« Résultat attendu (Q...) »</strong> exécute la requête de référence du sujet et affiche sa table dans un onglet dédié. Il permet de confronter la projection des attributs, le nombre de tuples et les tris demandés.',
			tip: 'Le code SQL de référence demeure masqué afin de préserver l\'autonomie de résolution de l\'étudiant.',
			badge: 'Auto-évaluation'
		},
		{
			id: 'console-autocomplete',
			title: 'Console SQL et autocomplétion',
			target: '.CodeMirror, .console-panel .panel-content',
			fallbackTarget: '.console-panel',
			placement: 'left',
			text: 'L\'éditeur prend en charge la coloration syntaxique et l\'analyse lexicale. Le raccourci <kbd>Ctrl</kbd>+<kbd>Espace</kbd> ou la saisie des premières lettres ouvre l\'autocomplétion contextuelle (clauses SQL, tables et colonnes de la base active).',
			tip: 'Sélectionnez une suggestion avec les flèches <kbd>↑</kbd> <kbd>↓</kbd> puis validez par <kbd>Entrée</kbd> ou <kbd>Tab</kbd>.',
			badge: 'Éditeur SQL'
		},
		{
			id: 'execute',
			title: 'Exécution et diagnostics',
			target: '#execute',
			placement: 'bottom',
			text: 'Le bouton <strong>« Exécuter »</strong> ou la combinaison de touches <kbd>Ctrl</kbd>+<kbd>Entrée</kbd> (<kbd>Cmd</kbd>+<kbd>Entrée</kbd> sous macOS) soumet la requête à l\'interpréteur. La barre d\'état indique la cardinalité retournée et la durée d\'exécution.',
			tip: 'En cas d\'erreur de syntaxe ou de violation de contrainte, le message du parseur SQLite précise la nature et la localisation de l\'anomalie.',
			badge: 'Exécution'
		},
		{
			id: 'results-tabs',
			title: 'Résultats et schéma relationnel',
			target: '#resultsTabs, .results-area',
			placement: 'top',
			text: 'Les résultats s\'affichent sous forme tabulaire. L\'onglet <strong>« Schéma »</strong> liste les relations avec leurs clés primaires (🔑), clés étrangères (🔗) et le lien vers le schéma relationnel complet. Le bouton <strong>« + »</strong> ouvre de nouveaux onglets pour comparer plusieurs requêtes.',
			tip: 'Conserver plusieurs onglets actifs permet de vérifier des calculs intermédiaires sans écraser les affichages précédents.',
			badge: 'Schéma & Tables'
		},
		{
			id: 'history',
			title: 'Historique et export de session',
			target: '#openHistory',
			placement: 'bottom',
			text: 'L\'ensemble des requêtes soumises est consigné chronologiquement. Vous pouvez recharger une instruction antérieure dans l\'éditeur, copier un extrait ou exporter l\'ensemble au format script <code>.sql</code> pour le compte-rendu de TP.',
			tip: 'L\'historique est conservé localement dans le navigateur pour toute la durée de la séance.',
			badge: 'Rendu de TP'
		},
		{
			id: 'finish',
			title: 'Navigation et ressources',
			target: '#startTourBtn, header',
			placement: 'bottom',
			text: 'Naviguez entre les exercices avec les commandes Précédent/Suivant ou revenez au sommaire via l\'icône Accueil. La visite guidée et la fiche didactique restent accessibles via ce bouton ou la touche <kbd>?</kbd>.',
			tip: 'Raccourcis essentiels : <kbd>Ctrl</kbd>+<kbd>Entrée</kbd> (exécuter), <kbd>Ctrl</kbd>+<kbd>Espace</kbd> (compléter), <kbd>?</kbd> (aide).',
			badge: 'Synthèse'
		}
	];

	// État interne du tour
	const tourState = {
		isActive: false,
		currentStepIndex: 0,
		overlayElm: null,
		spotlightElm: null,
		popoverElm: null,
		modalElm: null
	};

	/**
	 * Détermine si la page courante dispose de tous les éléments d'exercice (bloc code SQL et bouton attendu)
	 */
	function isExercisePageWithRequiredElements() {
		const hasExpectedResult = document.querySelector('.btn-expected-result') !== null;
		const hasClickableSql = document.querySelector('pre.sql-clickable, .exercise-content pre') !== null;
		return hasExpectedResult && hasClickableSql;
	}

	/**
	 * Récupère l'URL d'un exercice complet pour la démonstration
	 */
	function getDemoExerciseUrl() {
		const basePath = window.TP_CONFIG?.basePath || '';
		return `${basePath}/tp3/exercice2/?tour=1`;
	}

	/**
	 * Initialisation au chargement du DOM
	 */
	document.addEventListener('DOMContentLoaded', function () {
		createGuideModal();
		createTourElements();
		bindGlobalEvents();
		checkFirstVisit();
		checkUrlTourParam();
	});

	/**
	 * Déclenche automatiquement le tour si l'URL contient ?tour=1
	 */
	function checkUrlTourParam() {
		try {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('tour') === '1') {
				// Nettoie l'URL sans recharger la page
				const cleanUrl = window.location.pathname;
				window.history.replaceState({}, document.title, cleanUrl);

				// Laisse le temps aux composants (CodeMirror, worker SQLite, Prism) de se charger
				setTimeout(function () {
					startInteractiveTour();
				}, 600);
			}
		} catch (e) {
			console.warn('Erreur vérification paramètre tour:', e);
		}
	}

	/**
	 * Vérifie s'il s'agit d'une première visite pour afficher un badge discret
	 */
	function checkFirstVisit() {
		try {
			const hasSeenTour = localStorage.getItem('tpSqlTourSeen');
			const tourBtn = document.getElementById('startTourBtn');
			if (!hasSeenTour && tourBtn) {
				tourBtn.classList.add('has-pulse');
			}
		} catch (e) {
			console.warn('localStorage indisponible:', e);
		}
	}

	/**
	 * Marque la visite comme consultée
	 */
	function markTourAsSeen() {
		try {
			localStorage.setItem('tpSqlTourSeen', 'true');
			const tourBtn = document.getElementById('startTourBtn');
			if (tourBtn) {
				tourBtn.classList.remove('has-pulse');
			}
		} catch (e) {
			// Ignore
		}
	}

	/**
	 * Déclenchement de la visite guidée :
	 * - Si on est sur un exercice complet : démarre le tour in situ.
	 * - Si on est sur l'accueil ou une page incomplète : redirige vers l'exercice exemple.
	 */
	function triggerTourOrRedirect() {
		markTourAsSeen();
		if (isExercisePageWithRequiredElements()) {
			startInteractiveTour();
		} else {
			window.location.href = getDemoExerciseUrl();
		}
	}

	/**
	 * Liaison des événements globaux
	 */
	function bindGlobalEvents() {
		// Bouton dans la barre d'outils du header
		const tourBtn = document.getElementById('startTourBtn');
		if (tourBtn) {
			tourBtn.addEventListener('click', function (e) {
				e.preventDefault();
				triggerTourOrRedirect();
			});
		}

		// Raccourci clavier '?' pour ouvrir la fiche documentaire
		document.addEventListener('keydown', function (e) {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.closest('.CodeMirror')) {
				return;
			}

			if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
				e.preventDefault();
				markTourAsSeen();
				if (tourState.isActive) {
					closeInteractiveTour();
				} else {
					openGuideModal();
				}
			}
		});

		// Bouton d'aide sur la page d'accueil
		const homeHelpGuideBtn = document.getElementById('homeTourTrigger');
		if (homeHelpGuideBtn) {
			homeHelpGuideBtn.addEventListener('click', function (e) {
				e.preventDefault();
				openGuideModal();
			});
		}
	}

	/**
	 * Création des éléments DOM du tour interactif (overlay, spotlight, popover)
	 * TOUS masqués par défaut (display: none)
	 */
	function createTourElements() {
		// Overlay
		const overlay = document.createElement('div');
		overlay.className = 'tour-overlay';
		overlay.id = 'tourOverlay';
		overlay.style.display = 'none';
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) {
				closeInteractiveTour();
			}
		});
		document.body.appendChild(overlay);
		tourState.overlayElm = overlay;

		// Boîte Spotlight
		const spotlight = document.createElement('div');
		spotlight.className = 'tour-spotlight-box';
		spotlight.id = 'tourSpotlight';
		spotlight.style.display = 'none';
		document.body.appendChild(spotlight);
		tourState.spotlightElm = spotlight;

		// Popover
		const popover = document.createElement('div');
		popover.className = 'tour-popover';
		popover.id = 'tourPopover';
		popover.style.display = 'none';
		popover.setAttribute('role', 'dialog');
		popover.setAttribute('aria-modal', 'true');
		popover.innerHTML = `
			<div class="tour-popover-arrow"></div>
			<div class="tour-popover-header">
				<span class="tour-step-badge" id="tourStepBadge">Étape 1/8</span>
				<button type="button" class="tour-close-btn" id="tourCloseBtn" title="Fermer la visite (Échap)">&times;</button>
			</div>
			<div class="tour-popover-body">
				<h3 class="tour-popover-title" id="tourTitle">Titre de l'étape</h3>
				<p class="tour-popover-text" id="tourText">Texte explicatif...</p>
				<div class="tour-tip-box" id="tourTipBox">
					<span class="tip-icon">ℹ️</span>
					<span class="tip-content" id="tourTip">Précision didactique</span>
				</div>
			</div>
			<div class="tour-popover-footer">
				<div class="tour-dots" id="tourDots"></div>
				<div class="tour-actions">
					<button type="button" class="tour-btn tour-btn-memo" id="tourOpenMemoBtn" title="Consulter la fiche didactique synthétique">
						Fiche mémo
					</button>
					<button type="button" class="tour-btn tour-btn-ghost" id="tourPrevBtn">Précédent</button>
					<button type="button" class="tour-btn tour-btn-primary" id="tourNextBtn">Suivant</button>
				</div>
			</div>
		`;
		document.body.appendChild(popover);
		tourState.popoverElm = popover;

		// Événements des contrôles
		document.getElementById('tourCloseBtn').addEventListener('click', closeInteractiveTour);
		document.getElementById('tourPrevBtn').addEventListener('click', prevStep);
		document.getElementById('tourNextBtn').addEventListener('click', nextStep);
		document.getElementById('tourOpenMemoBtn').addEventListener('click', function () {
			closeInteractiveTour();
			openGuideModal();
		});

		// Clavier interactif pendant le tour
		window.addEventListener('keydown', function (e) {
			if (!tourState.isActive) return;

			if (e.key === 'Escape') {
				e.preventDefault();
				closeInteractiveTour();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextStep();
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevStep();
			}
		});

		// Repositionnement dynamique
		window.addEventListener('resize', function () {
			if (tourState.isActive) {
				renderCurrentStep();
			}
		});

		// Repositionnement dynamique lors du défilement de n'importe quel conteneur (énoncé, résultats)
		window.addEventListener('scroll', function () {
			if (!tourState.isActive) return;
			const step = TOUR_STEPS[tourState.currentStepIndex];
			if (!step) return;
			let targetElm = document.querySelector(step.target);
			if (!targetElm && step.fallbackTarget) targetElm = document.querySelector(step.fallbackTarget);
			if (targetElm) {
				positionSpotlight(targetElm);
				positionPopover(targetElm, step.placement || 'bottom');
			}
		}, true);
	}

	/**
	 * Création de la modal Fiche Didactique
	 */
	function createGuideModal() {
		const modal = document.createElement('div');
		modal.className = 'modal';
		modal.id = 'guideModal';
		modal.innerHTML = `
			<div class="modal-content tour-modal-content">
				<div class="modal-header tour-modal-header">
					<div class="tour-modal-title-group">
						<h2>
							<span style="font-size: 1.3rem;">📋</span> 
							Guide didactique et fonctionnement de l'interface SQL
						</h2>
						<p class="tour-modal-subtitle">Manuel des fonctionnalités interactives et des outils de contrôle didactique</p>
					</div>
					<button class="modal-close" id="closeGuideModalBtn" title="Fermer le guide">&times;</button>
				</div>
				<div class="modal-body tour-modal-body">
					<div class="guide-features-grid">
						
						<!-- 1. Envoi direct via triangle -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-blue">▶</div>
								<div>
									<h4 class="guide-card-title">Transfert de code depuis l'énoncé</h4>
									<span class="guide-card-badge badge-click">Action directe</span>
								</div>
							</div>
							<p class="guide-card-desc">
								Dans les énoncés et rappels, un clic sur l'icône <strong>▶</strong> ou sur le bloc de code charge directement l'instruction SQL dans la console d'édition sans manipulation intermédiaire.
							</p>
							<div class="guide-card-example">
								<span>SELECT NomProd FROM Produit;</span>
								<span style="color:#4fbeff;">▶ Transférer</span>
							</div>
						</div>

						<!-- 2. Autocomplétion -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-purple">⌨️</div>
								<div>
									<h4 class="guide-card-title">Autocomplétion lexicale et schéma</h4>
									<span class="guide-card-badge badge-shortcut">Ctrl + Espace</span>
								</div>
							</div>
							<p class="guide-card-desc">
								Assistance à la saisie active à la frappe ou via <kbd>Ctrl</kbd>+<kbd>Espace</kbd>. Elle propose la syntaxe SQL ANSI ainsi que les noms de relations et d'attributs de la base chargée.
							</p>
							<div class="guide-card-example">
								<span>SEL... &rarr; SELECT</span>
								<span style="color:#c4b5fd;">Tables &amp; Attributs</span>
							</div>
						</div>

						<!-- 3. Exécution & Diagnostics -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-green">⚙️</div>
								<div>
									<h4 class="guide-card-title">Exécution et métriques</h4>
									<span class="guide-card-badge badge-shortcut">Ctrl + Entrée</span>
								</div>
							</div>
							<p class="guide-card-desc">
								La commande <kbd>Ctrl</kbd>+<kbd>Entrée</kbd> (<kbd>Cmd</kbd>+<kbd>Entrée</kbd> sur macOS) soumet la requête à l'interpréteur SQLite. La barre d'état affiche le temps de calcul et le décompte des tuples.
							</p>
							<div class="guide-card-example">
								<span>Ctrl+Entrée &rarr; 42 lignes</span>
								<span style="color:#6ee7b7;">Temps: &sim; 3 ms</span>
							</div>
						</div>

						<!-- 4. Résultats attendus -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-purple">🎯</div>
								<div>
									<h4 class="guide-card-title">Contrôle par résultat attendu</h4>
									<span class="guide-card-badge badge-auto">Validation</span>
								</div>
							</div>
							<p class="guide-card-desc">
								Sous chaque question, le bouton <strong>« Résultat attendu (Q...) »</strong> calcule la solution de référence dans un onglet dédié afin de vérifier colonnes, cardinalité et ordonnancement.
							</p>
							<div class="guide-card-example">
								<span>Attendu (Q1)</span>
								<span style="color:#c4b5fd;">Code masqué</span>
							</div>
						</div>

						<!-- 5. Multi-onglets & Schéma BDD -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-amber">📑</div>
								<div>
									<h4 class="guide-card-title">Schéma relationnel &amp; Multi-onglets</h4>
									<span class="guide-card-badge badge-click">Clés 🔑 &amp; 🔗</span>
								</div>
							</div>
							<p class="guide-card-desc">
								L'onglet <strong>Schéma</strong> détaille la structure des tables, clés primaires (🔑), clés étrangères (🔗) et diagramme. Le bouton <strong>« + »</strong> permet d'isoler plusieurs résultats de requêtes.
							</p>
							<div class="guide-card-example">
								<span>Schéma | Résultat 1 | +</span>
								<span style="color:#fcd34d;">Relations PK/FK</span>
							</div>
						</div>

						<!-- 6. Historique & Rendu de TP -->
						<div class="guide-feature-card">
							<div class="guide-card-header">
								<div class="guide-card-icon icon-blue">📁</div>
								<div>
									<h4 class="guide-card-title">Historique de session et export SQL</h4>
									<span class="guide-card-badge badge-auto">Traçabilité</span>
								</div>
							</div>
							<p class="guide-card-desc">
								Archivage automatique des instructions de la séance. Les requêtes peuvent être rechargées en un clic ou exportées sous forme de script <code>.sql</code> horodaté pour restitution de TP.
							</p>
							<div class="guide-card-example">
								<span>Export .sql</span>
								<span style="color:#4fbeff;">Fichier de rendu</span>
							</div>
						</div>

					</div>
				</div>
				<div class="tour-modal-footer">
					<div class="tour-footer-help">
						Rappel : Ouvrez cette fiche à tout moment avec la touche <kbd>?</kbd>.
					</div>
					<button type="button" class="tour-start-walkthrough-btn" id="startWalkthroughFromModalBtn">
						<span>Démarrer la visite guidée interactive</span>
					</button>
				</div>
			</div>
		`;

		document.body.appendChild(modal);
		tourState.modalElm = modal;

		// Événements
		document.getElementById('closeGuideModalBtn').addEventListener('click', closeGuideModal);
		modal.addEventListener('click', function (e) {
			if (e.target === modal) {
				closeGuideModal();
			}
		});

		document.getElementById('startWalkthroughFromModalBtn').addEventListener('click', function () {
			closeGuideModal();
			if (isExercisePageWithRequiredElements()) {
				setTimeout(startInteractiveTour, 200);
			} else {
				window.location.href = getDemoExerciseUrl();
			}
		});
	}

	/**
	 * Ouvre la modal documentaire
	 */
	function openGuideModal() {
		if (tourState.modalElm) {
			tourState.modalElm.classList.add('show');
		}
	}

	/**
	 * Ferme la modal documentaire
	 */
	function closeGuideModal() {
		if (tourState.modalElm) {
			tourState.modalElm.classList.remove('show');
		}
	}

	/**
	 * Démarre le tour interactif in situ
	 */
	function startInteractiveTour() {
		closeGuideModal();
		tourState.isActive = true;
		tourState.currentStepIndex = 0;

		if (tourState.overlayElm) {
			tourState.overlayElm.classList.add('tour-active');
			tourState.overlayElm.style.display = 'block';
		}

		if (tourState.spotlightElm) {
			tourState.spotlightElm.classList.add('tour-active');
			tourState.spotlightElm.style.display = 'block';
		}

		if (tourState.popoverElm) {
			tourState.popoverElm.style.display = 'flex';
			setTimeout(() => {
				tourState.popoverElm.classList.add('tour-popover-visible');
			}, 50);
		}

		renderCurrentStep();
	}

	/**
	 * Clôture du tour interactif
	 */
	function closeInteractiveTour() {
		tourState.isActive = false;

		document.querySelectorAll('.tour-target-highlight').forEach(el => {
			el.classList.remove('tour-target-highlight');
		});

		document.querySelectorAll('.tour-ancestor-elevated').forEach(el => {
			el.classList.remove('tour-ancestor-elevated');
		});

		if (tourState.overlayElm) {
			tourState.overlayElm.classList.remove('tour-active');
			setTimeout(() => {
				if (!tourState.isActive) tourState.overlayElm.style.display = 'none';
			}, 250);
		}

		if (tourState.spotlightElm) {
			tourState.spotlightElm.classList.remove('tour-active');
			tourState.spotlightElm.style.display = 'none';
		}

		if (tourState.popoverElm) {
			tourState.popoverElm.classList.remove('tour-popover-visible');
			setTimeout(() => {
				if (!tourState.isActive) tourState.popoverElm.style.display = 'none';
			}, 200);
		}
	}

	/**
	 * Étape suivante
	 */
	function nextStep() {
		if (tourState.currentStepIndex < TOUR_STEPS.length - 1) {
			tourState.currentStepIndex++;
			renderCurrentStep();
		} else {
			closeInteractiveTour();
		}
	}

	/**
	 * Étape précédente
	 */
	function prevStep() {
		if (tourState.currentStepIndex > 0) {
			tourState.currentStepIndex--;
			renderCurrentStep();
		}
	}

	/**
	 * Rendu de l'étape courante
	 */
	function renderCurrentStep() {
		const step = TOUR_STEPS[tourState.currentStepIndex];
		if (!step) return;

		// Sélection de l'élément cible
		let targetElm = document.querySelector(step.target);
		if (!targetElm && step.fallbackTarget) {
			targetElm = document.querySelector(step.fallbackTarget);
		}
		if (!targetElm) {
			targetElm = document.body;
		}

		// Réinitialisation des surbrillances et élévations précédentes
		document.querySelectorAll('.tour-target-highlight').forEach(el => {
			el.classList.remove('tour-target-highlight');
		});
		document.querySelectorAll('.tour-ancestor-elevated').forEach(el => {
			el.classList.remove('tour-ancestor-elevated');
		});

		// Si l'élément cible est dans le header, élever le header au-dessus du spotlight
		const headerEl = targetElm.closest('header');
		if (headerEl) {
			headerEl.classList.add('tour-ancestor-elevated');
		}

		// Défilement contextuel immédiat (auto) pour que getBoundingClientRect soit parfaitement exact
		if (targetElm !== document.body && !headerEl) {
			try {
				targetElm.scrollIntoView({ behavior: 'auto', block: 'center' });
			} catch (e) {
				// Ignore
			}
		}

		if (targetElm !== document.body) {
			targetElm.classList.add('tour-target-highlight');
		}

		// Positionnement du spotlight
		positionSpotlight(targetElm);

		// S'assurer que le popover existe
		if (!tourState.popoverElm || !document.getElementById('tourStepBadge')) {
			createTourElements();
		}

		// Mise à jour textuelle du popover
		const badgeEl = document.getElementById('tourStepBadge');
		const titleEl = document.getElementById('tourTitle');
		const textEl = document.getElementById('tourText');
		const tipEl = document.getElementById('tourTip');

		if (badgeEl) badgeEl.textContent = `Étape ${tourState.currentStepIndex + 1}/${TOUR_STEPS.length} • ${step.badge || ''}`;
		if (titleEl) titleEl.textContent = step.title;
		if (textEl) textEl.innerHTML = step.text;
		if (tipEl) tipEl.innerHTML = step.tip;

		// Contrôles de navigation
		const prevBtn = document.getElementById('tourPrevBtn');
		const nextBtn = document.getElementById('tourNextBtn');

		if (prevBtn) prevBtn.style.display = tourState.currentStepIndex === 0 ? 'none' : 'block';
		if (nextBtn) {
			if (tourState.currentStepIndex === TOUR_STEPS.length - 1) {
				nextBtn.textContent = 'Terminer';
				nextBtn.classList.add('tour-btn-finish');
			} else {
				nextBtn.textContent = 'Suivant ›';
				nextBtn.classList.remove('tour-btn-finish');
			}
		}

		renderDots();
		positionPopover(targetElm, step.placement || 'bottom');
	}

	/**
	 * Points de progression
	 */
	function renderDots() {
		const dotsContainer = document.getElementById('tourDots');
		if (!dotsContainer) return;

		dotsContainer.innerHTML = '';
		TOUR_STEPS.forEach((_, idx) => {
			const dot = document.createElement('div');
			dot.className = `tour-dot ${idx === tourState.currentStepIndex ? 'active' : ''}`;
			dot.title = `Accéder à l'étape ${idx + 1}`;
			dot.addEventListener('click', () => {
				tourState.currentStepIndex = idx;
				renderCurrentStep();
			});
			dotsContainer.appendChild(dot);
		});
	}

	/**
	 * Ajuste la boîte de découpe spotlight sur l'élément cible
	 */
	function positionSpotlight(targetElm) {
		const spotlight = tourState.spotlightElm;
		if (!spotlight) return;

		if (!targetElm || targetElm === document.body) {
			spotlight.style.display = 'none';
			return;
		}

		spotlight.style.display = 'block';
		const rect = targetElm.getBoundingClientRect();
		const padding = 6;

		const top = Math.max(0, rect.top - padding);
		const left = Math.max(0, rect.left - padding);
		const width = Math.min(window.innerWidth - left, rect.width + padding * 2);
		const height = Math.min(window.innerHeight - top, rect.height + padding * 2);

		spotlight.style.top = `${top}px`;
		spotlight.style.left = `${left}px`;
		spotlight.style.width = `${width}px`;
		spotlight.style.height = `${height}px`;
	}

	/**
	 * Positionne le popover par rapport à l'élément cible
	 */
	function positionPopover(targetElm, preferredPlacement) {
		const popover = tourState.popoverElm;
		if (!popover) return;

		if (!targetElm || targetElm === document.body) {
			popover.removeAttribute('data-placement');
			popover.style.top = '50%';
			popover.style.left = '50%';
			popover.style.transform = 'translate(-50%, -50%)';
			return;
		}

		const rect = targetElm.getBoundingClientRect();
		const popoverRect = popover.getBoundingClientRect();
		const popoverWidth = popoverRect.width || 380;
		const popoverHeight = popoverRect.height || 280;
		const margin = 16;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		let placement = preferredPlacement;
		let top = 0;
		let left = 0;

		// Inversion si dépassement d'écran
		if (placement === 'bottom' && rect.bottom + popoverHeight + margin > windowHeight) {
			placement = 'top';
		} else if (placement === 'top' && rect.top - popoverHeight - margin < 0) {
			placement = 'bottom';
		} else if (placement === 'right' && rect.right + popoverWidth + margin > windowWidth) {
			placement = 'left';
		} else if (placement === 'left' && rect.left - popoverWidth - margin < 0) {
			placement = 'right';
		}

		// Format mobile
		if (windowWidth <= 640) {
			popover.removeAttribute('data-placement');
			popover.style.top = '';
			popover.style.left = '12px';
			popover.style.bottom = '12px';
			popover.style.transform = 'none';
			return;
		}

		popover.setAttribute('data-placement', placement);

		switch (placement) {
			case 'bottom':
				top = rect.bottom + margin;
				left = rect.left + (rect.width / 2) - (popoverWidth / 2);
				break;
			case 'top':
				top = rect.top - popoverHeight - margin;
				left = rect.left + (rect.width / 2) - (popoverWidth / 2);
				break;
			case 'left':
				top = Math.max(16, rect.top);
				left = rect.left - popoverWidth - margin;
				break;
			case 'right':
				top = Math.max(16, rect.top);
				left = rect.right + margin;
				break;
		}

		if (left < 16) left = 16;
		if (left + popoverWidth > windowWidth - 16) {
			left = windowWidth - popoverWidth - 16;
		}

		if (top < 16) top = 16;
		if (top + popoverHeight > windowHeight - 16) {
			top = windowHeight - popoverHeight - 16;
		}

		popover.style.top = `${Math.round(top)}px`;
		popover.style.left = `${Math.round(left)}px`;
		popover.style.bottom = '';
		popover.style.transform = 'none';
	}

	// API globale
	window.SQL_TOUR = {
		start: startInteractiveTour,
		trigger: triggerTourOrRedirect,
		close: closeInteractiveTour,
		openGuide: openGuideModal
	};

})();
