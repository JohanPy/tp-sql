// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

// Récupérer le basePath depuis la configuration
const basePath = window.TP_CONFIG?.basePath || '';

// Fonction utilitaire pour construire les chemins d'assets
function assetPath(path) {
	return basePath + path;
}

// DOM Elements
const elements = {
	execBtn: document.getElementById("execute"),
	outputElm: document.getElementById('output'),
	errorElm: document.getElementById('error'),
	commandsElm: document.getElementById('commands'),
	dbFileElm: document.getElementById('dbfile'),
	savedbElm: document.getElementById('savedb'),
	editorStatusElm: document.getElementById('editorStatus'),
	resultsStatusElm: document.getElementById('resultsStatus'),
	queryTimeElm: document.getElementById('queryTime'),
	panelResizerElm: document.getElementById('panelResizer'),
	historyModal: document.getElementById('historyModal'),
	historyList: document.getElementById('historyList'),
	openHistoryBtn: document.getElementById('openHistory'),
	closeHistoryBtn: document.getElementById('closeHistoryModal'),
	copyAllHistoryBtn: document.getElementById('copyAllHistory'),
	exportHistoryBtn: document.getElementById('exportHistory'),
	clearHistoryBtn: document.getElementById('clearHistory'),
	resultsTabs: document.getElementById('resultsTabs'),
	newTabBtn: document.getElementById('newTabBtn')
};

// State
const state = {
	currentTabId: 'tab1',
	tabCounter: 1,
	queryHistory: [],
	isResizing: false,
	lastExecutionTime: 0
};

// SQL Snippets
const sqlSnippets = {
	'basic-demo': {
		name: 'Basic Demo',
		sql: "-- Basic SQL Demo\n-- Create a simple employees table\nDROP TABLE IF EXISTS employees;\nCREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  department TEXT,\n  salary NUMERIC,\n  hire_date DATE\n);\n\n-- Insert sample data\nINSERT INTO employees (name, department, salary, hire_date) VALUES\n  ('Alice Smith', 'Engineering', 85000, '2020-01-15'),\n  ('Bob Johnson', 'Marketing', 72000, '2019-03-20'),\n  ('Carol Williams', 'Engineering', 92000, '2018-11-07'),\n  ('Dave Brown', 'Finance', 115000, '2017-05-12'),\n  ('Eve Davis', 'Engineering', 110000, '2021-08-30');\n\n-- Query the data\nSELECT \n  department, \n  COUNT(*) as employee_count,\n  ROUND(AVG(salary), 2) as avg_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;"
	},
	'schema': {
		name: 'Show Schema',
		sql: "-- Show all tables in the database\nSELECT name, sql\nFROM sqlite_master\nWHERE type='table';"
	},
	'blog-app': {
		name: 'Blog App Schema',
		sql: "-- Complete Blog Application Schema\n\n-- Users table\nDROP TABLE IF EXISTS users;\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  username TEXT NOT NULL UNIQUE,\n  email TEXT UNIQUE,\n  password_hash TEXT NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Insert sample users\nINSERT INTO users (username, email, password_hash, created_at) VALUES\n  ('alice', 'alice@example.com', 'hash1', '2022-01-10'),\n  ('bob', 'bob@example.com', 'hash2', '2022-01-15'),\n  ('carol', 'carol@example.com', 'hash3', '2022-02-20');\n\n-- Posts table\nDROP TABLE IF EXISTS posts;\nCREATE TABLE posts (\n  id INTEGER PRIMARY KEY,\n  user_id INTEGER NOT NULL,\n  title TEXT NOT NULL,\n  content TEXT NOT NULL,\n  published BOOLEAN DEFAULT 0,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\n-- Insert sample posts\nINSERT INTO posts (user_id, title, content, published, created_at) VALUES\n  (1, 'First Post', 'This is my first post content', 1, '2022-01-12'),\n  (1, 'Second Post', 'This is another post by Alice', 1, '2022-01-18'),\n  (2, 'Hello World', 'Bob''s first post content', 1, '2022-01-20'),\n  (3, 'Introduction', 'Hello from Carol', 1, '2022-02-25'),\n  (2, 'Draft Post', 'This is a draft', 0, '2022-02-28');\n\n-- Comments table\nDROP TABLE IF EXISTS comments;\nCREATE TABLE comments (\n  id INTEGER PRIMARY KEY,\n  post_id INTEGER NOT NULL,\n  user_id INTEGER NOT NULL,\n  content TEXT NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\n-- Insert sample comments\nINSERT INTO comments (post_id, user_id, content, created_at) VALUES\n  (1, 2, 'Great post!', '2022-01-13'),\n  (1, 3, 'I agree with Bob', '2022-01-14'),\n  (3, 1, 'Welcome Bob!', '2022-01-21'),\n  (4, 2, 'Nice to meet you Carol', '2022-02-26');\n\n-- Query: Show posts with comment counts\nSELECT \n  p.id, \n  p.title, \n  u.username as author,\n  COUNT(c.id) as comment_count\nFROM posts p\nJOIN users u ON p.user_id = u.id\nLEFT JOIN comments c ON c.post_id = p.id\nWHERE p.published = 1\nGROUP BY p.id\nORDER BY p.created_at DESC;"
	},
	'recursive-query': {
		name: 'Recursive Query',
		sql: "-- Employee Hierarchy with Recursive CTE\n\n-- Create employees table with manager relationship\nDROP TABLE IF EXISTS employees;\nCREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  title TEXT NOT NULL,\n  manager_id INTEGER,\n  salary NUMERIC,\n  FOREIGN KEY (manager_id) REFERENCES employees(id)\n);\n\n-- Insert sample hierarchical data\nINSERT INTO employees (id, name, title, manager_id, salary) VALUES\n  (1, 'Mark Johnson', 'CEO', NULL, 250000),\n  (2, 'Sarah Williams', 'CTO', 1, 180000),\n  (3, 'Michael Brown', 'CFO', 1, 175000),\n  (4, 'Patricia Davis', 'Engineering Director', 2, 150000),\n  (5, 'Robert Wilson', 'Finance Director', 3, 145000),\n  (6, 'Linda Miller', 'Senior Developer', 4, 120000),\n  (7, 'James Taylor', 'Senior Developer', 4, 120000),\n  (8, 'Elizabeth Anderson', 'Accountant', 5, 95000),\n  (9, 'David Thomas', 'Junior Developer', 6, 85000),\n  (10, 'Jennifer Jackson', 'Junior Developer', 7, 85000);\n\n-- Recursive query to show employee hierarchy\nWITH RECURSIVE employee_hierarchy AS (\n  -- Base case: top-level employees (no manager)\n  SELECT \n    id, \n    name, \n    title, \n    manager_id, \n    salary,\n    0 AS level,\n    name AS path\n  FROM employees\n  WHERE manager_id IS NULL\n  \n  UNION ALL\n  \n  -- Recursive case: employees with managers\n  SELECT \n    e.id, \n    e.name, \n    e.title, \n    e.manager_id, \n    e.salary,\n    eh.level + 1 AS level,\n    eh.path || ' > ' || e.name AS path\n  FROM employees e\n  JOIN employee_hierarchy eh ON e.manager_id = eh.id\n)\n\n-- Query the hierarchy\nSELECT \n  id,\n  printf('%.' || (level * 4) || 's%s', '', name) AS employee,\n  title,\n  level,\n  salary,\n  path\nFROM employee_hierarchy\nORDER BY path;"
	},
	'window-functions': {
		name: 'Window Functions',
		sql: "-- Window Functions Example\n\n-- Create sales table\nDROP TABLE IF EXISTS sales;\nCREATE TABLE sales (\n  id INTEGER PRIMARY KEY,\n  salesperson TEXT NOT NULL,\n  region TEXT NOT NULL,\n  amount NUMERIC NOT NULL,\n  sale_date DATE NOT NULL\n);\n\n-- Insert sample data\nINSERT INTO sales (salesperson, region, amount, sale_date) VALUES\n  ('Alice', 'North', 12500, '2023-01-05'),\n  ('Bob', 'South', 8700, '2023-01-10'),\n  ('Carol', 'East', 15200, '2023-01-12'),\n  ('Dave', 'West', 7300, '2023-01-15'),\n  ('Alice', 'North', 9800, '2023-02-03'),\n  ('Bob', 'South', 11600, '2023-02-08'),\n  ('Carol', 'East', 14100, '2023-02-15'),\n  ('Dave', 'West', 9200, '2023-02-20'),\n  ('Alice', 'North', 16700, '2023-03-05'),\n  ('Bob', 'South', 10300, '2023-03-12'),\n  ('Carol', 'East', 12800, '2023-03-18'),\n  ('Dave', 'West', 8500, '2023-03-25');\n\n-- Window function queries\n\n-- 1. Running total of sales by salesperson\nSELECT\n  salesperson,\n  region,\n  sale_date,\n  amount,\n  SUM(amount) OVER (\n    PARTITION BY salesperson \n    ORDER BY sale_date\n  ) AS running_total\nFROM sales\nORDER BY salesperson, sale_date;"
	}
};

// Start the worker in which sql.js will run
const worker = new Worker(assetPath("/assets/sql.js/worker.sql-wasm.js"));
worker.onerror = handleError;

// Open a database - check if we need to load a specific database
const dbConfig = window.TP_CONFIG || {};
if (dbConfig.base && dbConfig.base !== '') {
	// Load the specified database
	const dbPath = assetPath(`/assets/bases/${dbConfig.base}`);
	fetch(dbPath)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to load database: ${dbConfig.base}`);
			}
			return response.arrayBuffer();
		})
		.then(buffer => {
			worker.postMessage({ 
				action: 'open', 
				buffer: buffer 
			});
			console.log(`Database ${dbConfig.base} loaded successfully`);
			updateStatus('ready', `Base de données ${dbConfig.base} chargée`);
			
			// Load database schema for the Schema tab
			loadDatabaseSchema(dbConfig);
			
			// Mettre à jour les métadonnées pour l'autocomplétion après un court délai
			setTimeout(() => {
				refreshDatabaseMetadata();
			}, 500);
		})
		.catch(error => {
			console.error('Error loading database:', error);
			updateStatus('error', `Erreur lors du chargement de la base de données: ${error.message}`);
			// Open empty database as fallback
			worker.postMessage({ action: 'open' });
		});
} else {
	// Open empty database (for Semester 2)
	worker.postMessage({ action: 'open' });
	updateStatus('ready', 'Base de données vide prête');
}

// Initialize UI components
if (elements.panelResizerElm) initResizer();
initTabs();
initKeyboardShortcuts();
initHistoryModal();
initNavToggle();

// Initialize navigation toggle
function initNavToggle() {
	const toggleBtn = document.getElementById('toggleNav');
	const navPanel = document.getElementById('navPanel');
	const mainLayout = document.querySelector('.main-layout');
	
	if (toggleBtn && navPanel && mainLayout) {
		// Charger l'état depuis localStorage
		const isCollapsed = localStorage.getItem('navPanelCollapsed') === 'true';
		if (isCollapsed) {
			navPanel.classList.add('collapsed');
			mainLayout.classList.add('nav-collapsed');
		}
		
		toggleBtn.addEventListener('click', () => {
			navPanel.classList.toggle('collapsed');
			mainLayout.classList.toggle('nav-collapsed');
			
			// Sauvegarder l'état
			const isNowCollapsed = navPanel.classList.contains('collapsed');
			localStorage.setItem('navPanelCollapsed', isNowCollapsed);
		});
	}
}

// Error handling
function handleError(e) {
	console.log(e);
	elements.errorElm.style.height = 'auto';
	elements.errorElm.textContent = e.message;
	elements.errorElm.style.opacity = 1;
	
	updateStatus('error', `Error: ${e.message}`);
	
	showErrorInCurrentTab(e.message);
	
	setTimeout(() => {
		elements.errorElm.style.opacity = 0;
		setTimeout(() => {
			elements.errorElm.style.height = '0';
		}, 300);
	}, 5000);
}

function showErrorInCurrentTab(errorMessage) {
	const tabOutputElm = document.querySelector(`#${state.currentTabId} .results-content`);
	if (!tabOutputElm) return;
	
	tabOutputElm.innerHTML = '';
	
	const errorTemplate = document.getElementById('error-template');
	if (!errorTemplate) return;
	
	const errorClone = errorTemplate.content.cloneNode(true);
	const errorDiv = errorClone.querySelector('.error-result');
	if (!errorDiv) return;
	
	const errorMessageSpan = document.createElement('span');
	errorMessageSpan.slot = 'error-message';
	errorMessageSpan.textContent = `Query failed: ${errorMessage}`;
	errorDiv.appendChild(errorMessageSpan);
	
	tabOutputElm.appendChild(errorDiv);
}

function clearError() {
	if (elements.errorElm) {
		elements.errorElm.style.height = '0';
		elements.errorElm.style.opacity = 0;
	}
}

// Status updates
function updateStatus(type, message) {
	const createStatusSpan = (className, text) => {
		const span = document.createElement('span');
		span.className = className;
		span.textContent = text;
		return span;
	};

	const statusMap = {
		'executing': {
			editorStatus: createStatusSpan('status-info', 'Exécution de la requête...'),
			resultsStatus: createStatusSpan('status-info', 'Exécution de la requête...')
		},
		'success': {
			editorStatus: createStatusSpan('status-success', 'Requête exécutée avec succès'),
			resultsStatus: createStatusSpan('status-success', message)
		},
		'error': {
			editorStatus: createStatusSpan('status-error', 'Erreur lors de la requête'),
			resultsStatus: createStatusSpan('status-error', message)
		},
		'info': {
			editorStatus: createStatusSpan('status-info', message),
			resultsStatus: createStatusSpan('status-info', message)
		}
	};

	if (statusMap[type]) {
		if (elements.editorStatusElm) {
			elements.editorStatusElm.innerHTML = '';
			elements.editorStatusElm.appendChild(statusMap[type].editorStatus);
		}
		
		if (elements.resultsStatusElm) {
			elements.resultsStatusElm.innerHTML = '';
			elements.resultsStatusElm.appendChild(statusMap[type].resultsStatus);
		}
	} else {
		if (elements.editorStatusElm) {
			elements.editorStatusElm.textContent = message;
		}
	}
}

function updateQueryTime(time) {
	if (elements.queryTimeElm) {
		elements.queryTimeElm.textContent = `Temps d'exécution : ${time.toFixed(2)}ms`;
	}
	state.lastExecutionTime = time;
}

// Run a command in the database
function execute(commands, tabId = state.currentTabId) {
	tic();
	updateStatus('executing');
	
	const tabToUse = determineTabForResults(tabId);
	const tabOutputElm = document.querySelector(`#${tabToUse} .results-content`);
	if (!tabOutputElm) return;
	
	showLoadingIndicator(tabOutputElm);
	addToHistory(commands);
	
	worker.onmessage = function (event) {
		handleQueryResults(event, tabOutputElm);
	};
	
	worker.postMessage({ action: 'exec', sql: commands });
	worker.onerror = handleError;
}

function determineTabForResults(tabId) {
	const currentTabPanel = document.getElementById(state.currentTabId);
	const isInitialUnusedTab = state.currentTabId === 'tab1' && 
		currentTabPanel && 
		currentTabPanel.querySelector('.results-content').innerHTML.includes('Les résultats s\'afficheront ici');
	
	return isInitialUnusedTab ? state.currentTabId : createNewTab();
}

function showLoadingIndicator(outputElement) {
	outputElement.innerHTML = '';
	const loadingTemplate = document.getElementById('loading-template');
	const loadingClone = loadingTemplate.content.cloneNode(true);
	outputElement.appendChild(loadingClone);
}

function handleQueryResults(event, outputElement) {
	const results = event.data.results;
	const executionTime = toc("Executing SQL");
	
	if (!results) {
		handleError({message: event.data.error || "Une erreur inconnue s'est produite"});
		return;
	}

	tic();
	outputElement.innerHTML = "";
	
	if (results.length === 0) {
		displayNoResults(outputElement);
		return;
	}
	
	displayResultSets(results, outputElement);
	
	const displayTime = toc("Displaying results");
	updateQueryTime(executionTime + displayTime);
	updateStatus('success', `${results.length} ensemble${results.length !== 1 ? 's' : ''} de résultat${results.length !== 1 ? 's' : ''} retourné${results.length !== 1 ? 's' : ''}`);
}

function displayNoResults(outputElement) {
	const noResultsDiv = document.createElement('div');
	noResultsDiv.className = 'no-results';
	noResultsDiv.textContent = 'Requête exécutée sans résultats.';
	outputElement.appendChild(noResultsDiv);
	updateStatus('success', 'Requête exécutée sans résultats');
}

function displayResultSets(results, outputElement) {
	results.forEach(result => {
		outputElement.appendChild(createResultTable(result.columns, result.values));
	});
}

// Create an HTML table for results
function createResultTable(columns, values) {
	const tableTemplate = document.getElementById('table-template');
	const tableClone = tableTemplate.content.cloneNode(true);
	const wrapper = tableClone.querySelector('.table-wrapper');
	const table = tableClone.querySelector('table');
	
	updateTableMetadata(wrapper, columns.length, values.length);
	createTableHeader(table, columns);
	createTableBody(table, columns, values);
	
	return wrapper;
}

function updateTableMetadata(wrapper, columnCount, rowCount) {
	wrapper.querySelector('.row-count').textContent = `${rowCount} ligne${rowCount !== 1 ? 's' : ''}`;
	wrapper.querySelector('.column-count').textContent = `${columnCount} colonne${columnCount !== 1 ? 's' : ''}`;
}

function createTableHeader(table, columns) {
	const thead = table.querySelector('thead tr');
	thead.innerHTML = '';
	
	columns.forEach(column => {
		const th = document.createElement('th');
		th.textContent = column;
		thead.appendChild(th);
	});
}

function createTableBody(table, columns, values) {
	const tbody = table.querySelector('tbody');
	tbody.innerHTML = '';
	
	if (values.length === 0) {
		createEmptyResultRow(tbody, columns.length);
	} else {
		values.forEach(rowData => {
			createTableRow(tbody, rowData);
		});
	}
}

function createEmptyResultRow(tbody, columnCount) {
	const emptyRow = document.createElement('tr');
	const emptyCell = document.createElement('td');
	emptyCell.className = 'no-results';
	emptyCell.textContent = 'Aucun résultat';
	emptyCell.colSpan = columnCount;
	emptyRow.appendChild(emptyCell);
	tbody.appendChild(emptyRow);
}

function createTableRow(tbody, rowData) {
	const row = document.createElement('tr');
	rowData.forEach(cellData => {
		const cell = document.createElement('td');
		cell.textContent = cellData;
		row.appendChild(cell);
	});
	tbody.appendChild(row);
}

// Execute the commands when the button is clicked
function execEditorContents() {
	clearError();
	
	try {
		execute(editor.getValue() + ';');
	} catch (e) {
		handleError(e);
	}
	
	addButtonClickFeedback(elements.execBtn);
}
// Event listener will be added after CodeMirror is initialized

function addButtonClickFeedback(button) {
	button.classList.add('active');
	setTimeout(() => {
		button.classList.remove('active');
	}, 200);
}

// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
	var dt = performance.now() - tictime;
	console.log((msg || 'toc') + ": " + dt + "ms");
	return dt;
}

// Add syntax highlighting to the textarea
var editor = CodeMirror.fromTextArea(elements.commandsElm, {
	mode: 'text/x-mysql',
	viewportMargin: Infinity,
	indentWithTabs: true,
	smartIndent: true,
	lineNumbers: true,
	matchBrackets: true,
	autofocus: true,
	theme: 'nord',
	extraKeys: {
		"Ctrl-Enter": execEditorContents,
		"Cmd-Enter": execEditorContents,
		"Ctrl-S": savedb,
		"Cmd-S": savedb,
		"Ctrl-Space": "autocomplete",
	},
	hintOptions: {
		hint: getSQLHints,
		completeSingle: false,
		alignWithWord: true,
		closeCharacters: /[\s()\[\]{};:>,]/,
		closeOnUnfocus: false
	}
});

// Configuration de l'autocomplétion automatique intelligente
let hintTimer = null;
let lastHintPos = null;

editor.on('inputRead', function(cm, change) {
	// Ne pas déclencher l'autocomplétion pour certaines actions
	if (change.origin === 'paste' || change.origin === 'cut' || change.origin === 'undo' || change.origin === 'redo') {
		return;
	}
	
	// Annuler le timer précédent
	if (hintTimer) {
		clearTimeout(hintTimer);
	}
	
	const text = change.text[0];
	const cur = cm.getCursor();
	const token = cm.getTokenAt(cur);
	
	// Déclencher immédiatement pour certains caractères
	const immediateChars = /[a-zA-Z_]/;
	// Ne pas déclencher pour certains caractères
	const skipChars = /[\s;,()]/;
	
	// Si on tape un caractère spécial qui ne devrait pas déclencher l'autocomplétion
	if (skipChars.test(text)) {
		return;
	}
	
	// Déclencher l'autocomplétion avec un petit délai pour éviter de spam
	const delay = immediateChars.test(text) ? 150 : 300;
	
	hintTimer = setTimeout(function() {
		// Ne montrer les hints que si on est en train de taper un mot
		if (token.string && token.string.trim().length > 0) {
			const hints = cm.showHint({
				hint: getSQLHints,
				completeSingle: false,
				alignWithWord: true,
				closeCharacters: /[\s()\[\]{};:>,]/
			});
			lastHintPos = cur;
		}
	}, delay);
});

// Améliorer la navigation dans l'autocomplétion
CodeMirror.commands.autocomplete = function(cm) {
	cm.showHint({
		hint: getSQLHints,
		completeSingle: false,
		alignWithWord: true
	});
};

// Gérer Tab pour accepter les suggestions
editor.on('keydown', function(cm, event) {
	const hints = cm.state.completionActive;
	
	if (hints && event.key === 'Tab') {
		event.preventDefault();
		// Accepter la suggestion avec Tab
		const widget = hints.widget;
		if (widget) {
			widget.pick();
		}
		return;
	}
});

// Cache pour les métadonnées de la base de données
let dbMetadataCache = {
	tables: [],
	columns: {},
	lastUpdate: null
};

// Fonction pour récupérer les métadonnées de la base
function updateDatabaseMetadata() {
	// Utiliser le worker pour récupérer les métadonnées
	const metadataWorker = worker;
	
	// Récupérer la liste des tables
	metadataWorker.onmessage = function(event) {
		if (event.data && event.data.results && event.data.results[0]) {
			const tablesResult = event.data.results[0];
			
			if (tablesResult.values && tablesResult.values.length > 0) {
				dbMetadataCache.tables = tablesResult.values.map(row => row[0]);
				dbMetadataCache.columns = {};
				
				// Pour chaque table, récupérer les colonnes
				let tableIndex = 0;
				
				function fetchNextTableColumns() {
					if (tableIndex >= dbMetadataCache.tables.length) {
						dbMetadataCache.lastUpdate = Date.now();
						console.log('Database metadata updated:', dbMetadataCache);
						return;
					}
					
					const tableName = dbMetadataCache.tables[tableIndex];
					
					const columnWorker = new Worker(assetPath("/assets/sql.js/worker.sql-wasm.js"));
					columnWorker.onmessage = function(colEvent) {
						if (colEvent.data && colEvent.data.results && colEvent.data.results[0]) {
							const columnsResult = colEvent.data.results[0];
							if (columnsResult.values) {
								dbMetadataCache.columns[tableName] = columnsResult.values.map(col => ({
									name: col[1],
									type: col[2],
									notNull: col[3] === 1,
									defaultValue: col[4],
									pk: col[5] === 1
								}));
							}
						}
						tableIndex++;
						fetchNextTableColumns();
					};
					
					columnWorker.onerror = function() {
						console.warn(`Could not get columns for table ${tableName}`);
						tableIndex++;
						fetchNextTableColumns();
					};
					
					// Cette approche ne fonctionne pas car le worker n'a pas accès à la base
					// On va plutôt exécuter une seule requête qui récupère tout
				}
				
				// Nouvelle approche : récupérer toutes les colonnes en une seule requête
				const allColumnsQuery = dbMetadataCache.tables.map(tableName => 
					`SELECT '${tableName}' as table_name, name, type FROM pragma_table_info('${tableName}')`
				).join(' UNION ALL ');
				
				if (allColumnsQuery) {
					const columnsWorkerMsg = worker;
					const originalOnMessage = worker.onmessage;
					
					worker.onmessage = function(colEvent) {
						if (colEvent.data && colEvent.data.results && colEvent.data.results[0]) {
							const allColumnsResult = colEvent.data.results[0];
							if (allColumnsResult.values) {
								allColumnsResult.values.forEach(row => {
									const tableName = row[0];
									const colName = row[1];
									const colType = row[2];
									
									if (!dbMetadataCache.columns[tableName]) {
										dbMetadataCache.columns[tableName] = [];
									}
									
									dbMetadataCache.columns[tableName].push({
										name: colName,
										type: colType,
										notNull: false,
										defaultValue: null,
										pk: false
									});
								});
							}
						}
						
						dbMetadataCache.lastUpdate = Date.now();
						console.log('Database metadata updated:', dbMetadataCache);
						
						// Restaurer le handler original
						worker.onmessage = originalOnMessage;
					};
					
					worker.postMessage({ action: 'exec', sql: allColumnsQuery });
				}
			}
		}
	};
	
	// Lancer la requête pour récupérer les tables
	metadataWorker.postMessage({ 
		action: 'exec', 
		sql: "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name" 
	});
}

// Mettre à jour les métadonnées quand la base est chargée
function refreshDatabaseMetadata() {
	// Attendre un peu que le worker soit prêt
	setTimeout(() => {
		updateDatabaseMetadata();
	}, 100);
}

// Get autocomplete hints based on current database context
function getSQLHints(cm) {
	const cur = cm.getCursor();
	const token = cm.getTokenAt(cur);
	const line = cm.getLine(cur.line);
	
	// Analyser tout le texte avant le curseur pour un meilleur contexte
	let allTextBefore = '';
	for (let i = 0; i <= cur.line; i++) {
		if (i < cur.line) {
			allTextBefore += cm.getLine(i) + ' ';
		} else {
			allTextBefore += line.substring(0, cur.ch);
		}
	}
	
	// Déterminer le contexte SQL de manière plus précise
	const beforeCursor = line.substring(0, cur.ch);
	
	// Contextes spécifiques qui demandent uniquement des tables
	const afterFROM = /\bFROM\s+$/i.test(beforeCursor) || /\bFROM\s+\w*$/i.test(beforeCursor);
	const afterJOIN = /\b(JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|CROSS\s+JOIN)\s+$/i.test(beforeCursor) || 
	                  /\b(JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|CROSS\s+JOIN)\s+\w*$/i.test(beforeCursor);
	const afterINTO = /\bINTO\s+$/i.test(beforeCursor) || /\bINTO\s+\w*$/i.test(beforeCursor);
	const afterUPDATE = /\bUPDATE\s+$/i.test(beforeCursor) || /\bUPDATE\s+\w*$/i.test(beforeCursor);
	
	// Contextes qui demandent des colonnes
	const afterSELECT = /\bSELECT\s+/i.test(allTextBefore) && !/\bFROM\b/i.test(allTextBefore.split(/\bSELECT\b/i).pop());
	const afterSELECTComma = /\bSELECT\s+.*,\s*$/i.test(beforeCursor);
	const inWHERE = /\bWHERE\s+/i.test(beforeCursor) && !afterFROM && !afterJOIN;
	const afterON = /\bON\s+$/i.test(beforeCursor) || /\bON\s+\w+\s*$/i.test(beforeCursor);
	const inORDER = /\bORDER\s+BY\s+/i.test(beforeCursor);
	const inGROUP = /\bGROUP\s+BY\s+/i.test(beforeCursor);
	const afterSET = /\bSET\s+/i.test(beforeCursor) && /\bUPDATE\b/i.test(allTextBefore);
	
	// Contextes qui demandent des mots-clés
	const needsKeyword = !afterFROM && !afterJOIN && !afterSELECT && !inWHERE && !afterINTO && !afterUPDATE;
	
	// Déterminer le mot actuel
	let start = token.start;
	let end = cur.ch;
	let word = token.string.toLowerCase();
	
	// Si le token est vide ou contient des espaces, utiliser le texte avant le curseur
	if (!word || word.trim() === '') {
		const match = beforeCursor.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
		if (match) {
			word = match[0].toLowerCase();
			start = cur.ch - word.length;
		} else {
			word = '';
			start = cur.ch;
		}
	}
	
	const completions = [];
	const addedTexts = new Set(); // Pour éviter les doublons
	
	// Fonction helper pour ajouter une complétion
	function addCompletion(text, displayText, className, priority = 0) {
		const lowerText = text.toLowerCase();
		if (!addedTexts.has(lowerText) && lowerText.startsWith(word)) {
			completions.push({
				text: text,
				displayText: displayText,
				className: className,
				priority: priority,
				render: function(element, self, data) {
					const icon = document.createElement('span');
					icon.className = 'hint-icon ' + className;
					element.appendChild(icon);
					
					const textSpan = document.createElement('span');
					textSpan.className = 'hint-text';
					textSpan.textContent = data.displayText;
					element.appendChild(textSpan);
				}
			});
			addedTexts.add(lowerText);
		}
	}
	
	// SQL Keywords
	const keywords = [
		'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
		'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'IS', 'NULL', 'BETWEEN',
		'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'ASC', 'DESC',
		'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
		'ALTER', 'DROP', 'ADD', 'COLUMN', 'CONSTRAINT', 'PRIMARY', 'KEY', 'UNIQUE',
		'FOREIGN', 'REFERENCES', 'CHECK', 'DEFAULT', 'CAST', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
		'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'SUBSTR', 'LENGTH', 'UPPER', 'LOWER',
		'ROUND', 'ABS', 'CURRENT_DATE', 'CURRENT_TIME', 'DATETIME', 'DATE', 'TIME', 'STRFTIME'
	];
	
	// Logique contextuelle intelligente
	if (afterFROM || afterJOIN || afterINTO || afterUPDATE) {
		// CONTEXTE TABLE UNIQUEMENT : après FROM, JOIN, INTO, UPDATE
		// Ne proposer QUE des tables
		if (dbMetadataCache.tables.length > 0) {
			dbMetadataCache.tables.forEach(tableName => {
				addCompletion(tableName, tableName, 'cm-hint-table', 100);
			});
		}
		
		// Ajouter quelques mots-clés pertinents avec faible priorité
		if (afterFROM) {
			['WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ORDER', 'GROUP', 'LIMIT'].forEach(kw => {
				if (kw.toLowerCase().startsWith(word)) {
					addCompletion(kw, kw, 'cm-hint-keyword', 10);
				}
			});
		}
		
	} else if (afterSELECT || afterSELECTComma || inWHERE || afterON || inORDER || inGROUP || afterSET) {
		// CONTEXTE COLONNE : après SELECT, dans WHERE, après ON, etc.
		// Proposer principalement des colonnes
		if (dbMetadataCache.tables.length > 0) {
			Object.keys(dbMetadataCache.columns).forEach(tableName => {
				const columns = dbMetadataCache.columns[tableName];
				columns.forEach(col => {
					const displayText = `${col.name} (${tableName}.${col.name})`;
					const displayType = col.type ? ` : ${col.type}` : '';
					
					// Ajouter la colonne simple
					addCompletion(col.name, displayText + displayType, 'cm-hint-column', 80);
					
					// Ajouter aussi la version qualifiée tableName.colName
					const qualifiedName = `${tableName}.${col.name}`;
					if (qualifiedName.toLowerCase().startsWith(word)) {
						addCompletion(qualifiedName, `${tableName}.${col.name}` + displayType, 'cm-hint-column', 90);
					}
				});
			});
		}
		
		// Ajouter les fonctions et mots-clés pertinents
		const columnKeywords = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'NOT', 
		                        'LIKE', 'IN', 'IS', 'NULL', 'BETWEEN', 'COALESCE', 'CAST', 'CASE'];
		columnKeywords.forEach(kw => {
			if (kw.toLowerCase().startsWith(word)) {
				addCompletion(kw, kw, 'cm-hint-keyword', 40);
			}
		});
		
		// FROM est TRÈS important après SELECT - priorité élevée
		if (afterSELECT || afterSELECTComma) {
			// Détecter si on a déjà au moins une colonne (présence d'un mot avant le curseur actuel)
			const hasColumns = /\bSELECT\s+\w+/i.test(allTextBefore);
			// Priorité encore plus haute si le mot commence par F ou si on a déjà des colonnes
			const fromPriority = hasColumns ? 85 : 70;
			
			if ('from'.startsWith(word.toLowerCase())) {
				addCompletion('FROM', 'FROM', 'cm-hint-keyword', fromPriority);
			}
		}
		
		// Tables avec priorité basse (pour les alias)
		if (dbMetadataCache.tables.length > 0) {
			dbMetadataCache.tables.forEach(tableName => {
				addCompletion(tableName, tableName, 'cm-hint-table', 20);
			});
		}
		
	} else {
		// CONTEXTE GÉNÉRAL : proposer surtout des mots-clés
		keywords.forEach(keyword => {
			addCompletion(keyword, keyword, 'cm-hint-keyword', 60);
		});
		
		// Ajouter tables avec priorité moyenne
		if (dbMetadataCache.tables.length > 0) {
			dbMetadataCache.tables.forEach(tableName => {
				addCompletion(tableName, tableName, 'cm-hint-table', 40);
			});
		}
		
		// Colonnes avec faible priorité
		if (dbMetadataCache.tables.length > 0) {
			Object.keys(dbMetadataCache.columns).forEach(tableName => {
				const columns = dbMetadataCache.columns[tableName];
				columns.forEach(col => {
					const displayText = `${col.name} (${tableName})`;
					addCompletion(col.name, displayText, 'cm-hint-column', 20);
				});
			});
		}
	}
	
	// Trier par priorité puis par ordre alphabétique
	completions.sort((a, b) => {
		if (b.priority !== a.priority) {
			return b.priority - a.priority;
		}
		return a.text.localeCompare(b.text);
	});
	
	return {
		from: CodeMirror.Pos(cur.line, start),
		to: CodeMirror.Pos(cur.line, end),
		list: completions
	};
}

// Now that editor is created, add event listener to execute button
elements.execBtn.addEventListener('click', execEditorContents);

// Load a db from a file
elements.dbFileElm.onchange = function () {
	loadDatabaseFromFile();
};

function loadDatabaseFromFile() {
	var f = elements.dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function () {
		worker.onmessage = function () {
			toc("Chargement de la base de données depuis un fichier");
			editor.setValue("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
			execEditorContents();
			showNotification('Base de données chargée avec succès');
			updateStatus('success', 'Base de données chargée avec succès');
			
			// Mettre à jour les métadonnées pour l'autocomplétion
			setTimeout(() => {
				refreshDatabaseMetadata();
			}, 500);
		};
		tic();
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}
	r.readAsArrayBuffer(f);
}

// Sauvegardation de la base de données dans un fichier
function savedb() {
	updateStatus('info', 'Sauvegarde de la base de données...');
	
	worker.onmessage = function (event) {
		toc("Exportation de la base de données");
		downloadDatabaseFile(event.data.buffer);
		showNotification('Base de données sauvegardée avec succès');
		updateStatus('success', 'Base de données sauvegardée avec succès');
		addButtonClickFeedback(elements.savedbElm);
	};
	tic();
	worker.postMessage({ action: 'export' });
}

function downloadDatabaseFile(arraybuff) {
	var blob = new Blob([arraybuff]);
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = "sql.db";
	a.onclick = function () {
		setTimeout(function () {
			window.URL.revokeObjectURL(a.href);
		}, 1500);
	};
	a.click();
}

elements.savedbElm.addEventListener("click", savedb);

// Create a notification system
function showNotification(message) {
	let notification = document.querySelector('.notification');
	if (!notification) {
		notification = document.createElement('div');
		notification.className = 'notification';
		document.body.appendChild(notification);
	}
	
	notification.textContent = message;
	notification.classList.add('show');
	
	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

// Initialize resizable panels
function initResizer() {
	const editorPanel = document.querySelector('.editor-panel');
	const isMobileView = window.matchMedia('(max-width: 768px)').matches;
	
	elements.panelResizerElm.addEventListener('mousedown', function(e) {
		state.isResizing = true;
		document.body.classList.add('resizing');
		elements.panelResizerElm.classList.add('active');
	});
	
	document.addEventListener('mousemove', function(e) {
		if (!state.isResizing) return;
		
		const isMobileView = window.matchMedia('(max-width: 768px)').matches;
		
		if (isMobileView) {
			resizePanelHeight(e, editorPanel);
		} else {
			resizePanelWidth(e, editorPanel);
		}
		
		e.preventDefault();
	});
	
	document.addEventListener('mouseup', function() {
		if (state.isResizing) {
			state.isResizing = false;
			document.body.classList.remove('resizing');
			elements.panelResizerElm.classList.remove('active');
		}
	});
	
	setInitialPanelSize(editorPanel, isMobileView);
}

function resizePanelHeight(e, panel) {
	const containerHeight = document.querySelector('.app-container').offsetHeight;
	const newHeight = e.clientY - panel.getBoundingClientRect().top;
	const minHeight = 100;
	const maxHeight = containerHeight - 100;
	
	panel.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
}

function resizePanelWidth(e, panel) {
	const containerWidth = document.querySelector('.app-container').offsetWidth;
	const newWidth = e.clientX - panel.getBoundingClientRect().left;
	const minWidth = 200;
	const maxWidth = containerWidth - 200;
	
	panel.style.width = `${Math.min(Math.max(newWidth, minWidth), maxWidth)}px`;
}

function setInitialPanelSize(panel, isMobileView) {
	if (isMobileView) {
		panel.style.height = '50%';
		panel.style.width = '';
	} else {
		panel.style.width = '50%';
		panel.style.height = '';
	}
}

// Initialize tabs
function initTabs() {
	if (!elements.newTabBtn || !elements.resultsTabs) {
		console.warn('Tab elements not found');
		return;
	}
	
	elements.newTabBtn.addEventListener('click', createNewTab);
	
	elements.resultsTabs.addEventListener('click', function(e) {
		const target = e.target;
		
		if (target.classList.contains('tab-close')) {
			const tabId = target.parentElement.dataset.tab;
			closeTab(tabId);
			e.stopPropagation();
			return;
		}
		
		if (target.classList.contains('tab') && !target.id) {
			const tabId = target.dataset.tab;
			if (tabId) {
				setActiveTab(tabId);
			}
		}
	});
	
	initializeFirstTab();
}

function initializeFirstTab() {
	const firstTab = document.querySelector('.tab[data-tab="tab1"]');
	if (firstTab) {
		firstTab.innerHTML = '';
		firstTab.textContent = `Result ${state.tabCounter}`;
		
		const closeBtn = document.createElement('span');
		closeBtn.className = 'tab-close';
		closeBtn.textContent = '×';
		firstTab.appendChild(closeBtn);
		
		setActiveTab('tab1');
	}
}

// Create a new results tab
function createNewTab() {
	state.tabCounter++;
	const tabId = `tab${state.tabCounter}`;
	
	createTabButton(tabId);
	createTabPanel(tabId);
	
	setActiveTab(tabId);
	
	return tabId;
}

function createTabButton(tabId) {
	const tabTemplate = document.getElementById('tab-template');
	const tabClone = tabTemplate.content.cloneNode(true);
	const tab = tabClone.querySelector('.tab');
	tab.dataset.tab = tabId;
	
	tab.innerHTML = '';
	tab.textContent = `Result ${state.tabCounter}`;
	
	const closeBtn = document.createElement('span');
	closeBtn.className = 'tab-close';
	closeBtn.textContent = '×';
	tab.appendChild(closeBtn);
	
	elements.resultsTabs.insertBefore(tab, elements.newTabBtn);
}

function createTabPanel(tabId) {
	const panelTemplate = document.getElementById('tab-panel-template');
	const panelClone = panelTemplate.content.cloneNode(true);
	const tabPanel = panelClone.querySelector('.tab-panel');
	tabPanel.id = tabId;
	
	const resultsContainer = document.querySelector('.results-panels');
	if (resultsContainer) {
		resultsContainer.appendChild(tabPanel);
	}
}

// Set active tab
function setActiveTab(tabId) {
	state.currentTabId = tabId;
	
	document.querySelectorAll('.results-tabs .tab').forEach(tab => {
		tab.classList.toggle('active', tab.dataset.tab === tabId);
	});
	
	document.querySelectorAll('.tab-panel').forEach(panel => {
		panel.classList.toggle('active', panel.id === tabId);
	});
}

// Close a tab
function closeTab(tabId) {
	const contentTabs = document.querySelectorAll('.results-tabs .tab:not(#newTabBtn)');
	if (contentTabs.length <= 1) {
		return;
	}
	
	const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
	if (tab) {
		tab.remove();
	}
	
	const panel = document.getElementById(tabId);
	if (panel) {
		panel.remove();
	}
	
	if (state.currentTabId === tabId) {
		const firstTab = document.querySelector('.results-tabs .tab:not(#newTabBtn)');
		if (firstTab) {
			setActiveTab(firstTab.dataset.tab);
		}
	}
}

// Query history functions
// ===========================
// HISTORY MANAGEMENT
// ===========================

function addToHistory(query) {
	// Ne pas ajouter les requêtes vides ou dupliquées
	if (!query || !query.trim()) return;
	
	// Vérifier si la dernière requête est identique
	if (state.queryHistory.length > 0 && state.queryHistory[0].query === query) {
		return;
	}
	
	// Limiter à 200 requêtes
	if (state.queryHistory.length >= 200) {
		state.queryHistory.pop();
	}
	
	state.queryHistory.unshift({
		query: query,
		timestamp: new Date(),
		executionTime: state.lastExecutionTime,
		id: Date.now() + Math.random()
	});
	
	// Sauvegarder dans localStorage
	saveHistoryToStorage();
}

function saveHistoryToStorage() {
	try {
		const historyData = state.queryHistory.map(item => ({
			query: item.query,
			timestamp: item.timestamp.toISOString(),
			executionTime: item.executionTime
		}));
		localStorage.setItem('sqlQueryHistory', JSON.stringify(historyData));
	} catch (e) {
		console.warn('Could not save history to localStorage:', e);
	}
}

function loadHistoryFromStorage() {
	try {
		const stored = localStorage.getItem('sqlQueryHistory');
		if (stored) {
			const historyData = JSON.parse(stored);
			state.queryHistory = historyData.map(item => ({
				query: item.query,
				timestamp: new Date(item.timestamp),
				executionTime: item.executionTime || 0,
				id: Date.now() + Math.random()
			}));
		}
	} catch (e) {
		console.warn('Could not load history from localStorage:', e);
	}
}

function initHistoryModal() {
	// Charger l'historique depuis localStorage
	loadHistoryFromStorage();
	
	// Bouton pour ouvrir la modal
	if (elements.openHistoryBtn) {
		elements.openHistoryBtn.addEventListener('click', openHistoryModal);
	}
	
	// Bouton pour fermer la modal
	if (elements.closeHistoryBtn) {
		elements.closeHistoryBtn.addEventListener('click', closeHistoryModal);
	}
	
	// Fermer si on clique en dehors
	if (elements.historyModal) {
		elements.historyModal.addEventListener('click', function(e) {
			if (e.target === elements.historyModal) {
				closeHistoryModal();
			}
		});
	}
	
	// Bouton copier tout
	if (elements.copyAllHistoryBtn) {
		elements.copyAllHistoryBtn.addEventListener('click', copyAllHistory);
	}
	
	// Bouton exporter
	if (elements.exportHistoryBtn) {
		elements.exportHistoryBtn.addEventListener('click', exportHistory);
	}
	
	// Bouton effacer
	if (elements.clearHistoryBtn) {
		elements.clearHistoryBtn.addEventListener('click', clearHistory);
	}
}

function openHistoryModal() {
	updateHistoryUI();
	if (elements.historyModal) {
		elements.historyModal.classList.add('show');
	}
}

function closeHistoryModal() {
	if (elements.historyModal) {
		elements.historyModal.classList.remove('show');
	}
}

function updateHistoryUI() {
	if (!elements.historyList) return;
	
	elements.historyList.innerHTML = '';
	
	if (state.queryHistory.length === 0) {
		elements.historyList.innerHTML = '<div class="history-empty">Aucune requête dans l\'historique</div>';
		return;
	}
	
	state.queryHistory.forEach((item, index) => {
		const historyItem = createHistoryItemElement(item, index);
		elements.historyList.appendChild(historyItem);
	});
}

function createHistoryItemElement(item, index) {
	const div = document.createElement('div');
	div.className = 'history-item-card';
	
	const timeStr = item.timestamp.toLocaleString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	
	const executionTimeStr = item.executionTime ? `${item.executionTime}ms` : '-';
	
	div.innerHTML = `
		<div class="history-item-header">
			<span class="history-item-number">#${state.queryHistory.length - index}</span>
			<span class="history-item-time">${timeStr}</span>
			<span class="history-item-exec-time">${executionTimeStr}</span>
		</div>
		<pre class="history-item-query">${escapeHtml(item.query)}</pre>
		<div class="history-item-actions">
			<button class="history-action-btn load-query" title="Charger dans l'éditeur">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="4 17 10 11 4 5"></polyline>
					<line x1="12" y1="19" x2="20" y2="19"></line>
				</svg>
				Charger
			</button>
			<button class="history-action-btn copy-query" title="Copier">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
				Copier
			</button>
			<button class="history-action-btn delete-query" title="Supprimer">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
				</svg>
				Supprimer
			</button>
		</div>
	`;
	
	// Event listeners pour les boutons
	const loadBtn = div.querySelector('.load-query');
	const copyBtn = div.querySelector('.copy-query');
	const deleteBtn = div.querySelector('.delete-query');
	
	loadBtn.addEventListener('click', () => {
		editor.setValue(item.query);
		editor.focus();
		closeHistoryModal();
		showNotification('Requête chargée dans l\'éditeur');
	});
	
	copyBtn.addEventListener('click', () => {
		copyToClipboard(item.query);
		showNotification('Requête copiée dans le presse-papiers');
	});
	
	deleteBtn.addEventListener('click', () => {
		deleteHistoryItem(item.id);
	});
	
	return div;
}

function copyToClipboard(text) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).catch(err => {
			console.error('Erreur lors de la copie:', err);
			fallbackCopyToClipboard(text);
		});
	} else {
		fallbackCopyToClipboard(text);
	}
}

function fallbackCopyToClipboard(text) {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.select();
	try {
		document.execCommand('copy');
	} catch (err) {
		console.error('Erreur lors de la copie:', err);
	}
	document.body.removeChild(textarea);
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function copyAllHistory() {
	if (state.queryHistory.length === 0) {
		showNotification('Aucune requête à copier', 'warning');
		return;
	}
	
	const allQueries = state.queryHistory
		.map((item, index) => {
			const timeStr = item.timestamp.toLocaleString('fr-FR');
			return `-- Requête #${state.queryHistory.length - index} (${timeStr})\n${item.query}`;
		})
		.join('\n\n');
	
	copyToClipboard(allQueries);
	showNotification('Tout l\'historique copié dans le presse-papiers');
}

function exportHistory() {
	if (state.queryHistory.length === 0) {
		showNotification('Aucune requête à exporter', 'warning');
		return;
	}
	
	const sqlContent = state.queryHistory
		.map((item, index) => {
			const timeStr = item.timestamp.toLocaleString('fr-FR');
			return `-- Requête #${state.queryHistory.length - index}\n-- Date: ${timeStr}\n-- Temps d'exécution: ${item.executionTime || 0}ms\n\n${item.query};`;
		})
		.join('\n\n');
	
	const blob = new Blob([sqlContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `historique_sql_${new Date().toISOString().split('T')[0]}.sql`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
	
	showNotification('Historique exporté en fichier SQL');
}

function clearHistory() {
	if (state.queryHistory.length === 0) {
		showNotification('L\'historique est déjà vide', 'warning');
		return;
	}
	
	if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
		state.queryHistory = [];
		saveHistoryToStorage();
		updateHistoryUI();
		showNotification('Historique effacé');
	}
}

function deleteHistoryItem(id) {
	state.queryHistory = state.queryHistory.filter(item => item.id !== id);
	saveHistoryToStorage();
	updateHistoryUI();
	showNotification('Requête supprimée de l\'historique');
}

// Close history when pressing Escape
document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape' && elements.historyModal && elements.historyModal.classList.contains('show')) {
		closeHistoryModal();
	}
});

// Schema loading functions
function loadDatabaseSchema(dbConfig) {
	if (!dbConfig || !dbConfig.base) {
		console.log('No database config provided for schema');
		return;
	}
	
	console.log('Loading schema for database:', dbConfig.base);
	
	// Load schema diagram (PNG image)
	const dbName = dbConfig.base.replace('.sqlite', '').replace('.db', '');
	const schemaImagePath = assetPath(`/assets/bases/${dbName}.png`);
	
	console.log('Looking for schema image at:', schemaImagePath);
	
	const diagramDiv = document.getElementById('schemaDiagram');
	if (diagramDiv) {
		// Check if image exists and create a link to open it in new tab
		const img = new Image();
		img.onload = function() {
			console.log('✓ Schema image loaded successfully');
			diagramDiv.innerHTML = `
				<a href="${schemaImagePath}" target="_blank" rel="noopener noreferrer" class="schema-link">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;">
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
						<polyline points="15 3 21 3 21 9"></polyline>
						<line x1="10" y1="14" x2="21" y2="3"></line>
					</svg>
					Ouvrir le diagramme de la base <strong>${dbName}</strong> dans un nouvel onglet
				</a>
			`;
		};
		img.onerror = function() {
			console.log('✗ No schema image found at:', schemaImagePath);
			diagramDiv.innerHTML = '<p class="schema-placeholder">Aucun diagramme disponible pour cette base de données.<br>Pour ajouter un diagramme, placez un fichier PNG nommé <strong>' + dbName + '.png</strong> dans le dossier /bases/</p>';
		};
		img.src = schemaImagePath;
	}
	
	// Load table structure with a delay to ensure database is ready
	setTimeout(() => {
		loadTableStructure();
	}, 1000);
}

function loadTableStructure() {
	console.log('Loading table structure...');
	
	// Query to get all tables (exclude sqlite system tables and test tables)
	const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'test%' ORDER BY name";
	
	// Create a one-time handler for this specific query
	const handleTablesResponse = function(event) {
		console.log('Tables query response:', event.data);
		
		if (event.data.results && event.data.results.length > 0) {
			const tables = event.data.results[0].values.map(row => row[0]);
			console.log('Found tables:', tables);
			
			// Remove this handler
			worker.removeEventListener('message', handleTablesResponse);
			
			// Load details for all tables
			loadAllTableDetails(tables);
		} else {
			console.log('No tables found');
			worker.removeEventListener('message', handleTablesResponse);
			const detailsDiv = document.getElementById('schemaDetails');
			if (detailsDiv) {
				detailsDiv.innerHTML = '<p class="schema-placeholder">Aucune table trouvée dans cette base de données</p>';
			}
		}
	};
	
	// Add the handler
	worker.addEventListener('message', handleTablesResponse);
	
	// Send the query
	worker.postMessage({ action: 'exec', sql: tablesQuery });
}

function loadAllTableDetails(tables) {
	if (!tables || tables.length === 0) {
		const detailsDiv = document.getElementById('schemaDetails');
		if (detailsDiv) {
			detailsDiv.innerHTML = '<p class="schema-placeholder">Aucune table trouvée dans cette base de données</p>';
		}
		return;
	}
	
	const detailsDiv = document.getElementById('schemaDetails');
	if (!detailsDiv) return;
	
	console.log('Loading details for tables:', tables);
	
	// Use the database to get table info directly without PRAGMA
	const tableData = {};
	
	// For each table, query sqlite_master and do simple SELECT to get columns
	let completedTables = 0;
	
	tables.forEach((tableName, index) => {
		tableData[tableName] = {
			columns: [],
			primaryKeys: new Set(),
			foreignKeys: new Set()
		};
		
		// Get the CREATE TABLE statement to parse structure
		const query = `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`;
		
		const handleResponse = function(event) {
			if (!event.data.results || event.data.results.length === 0) {
				worker.removeEventListener('message', handleResponse);
				completedTables++;
				if (completedTables === tables.length) {
					displayTableStructure(tables, tableData);
				}
				return;
			}
			
			const createSQL = event.data.results[0].values[0][0];
			console.log(`CREATE TABLE for ${tableName}:`, createSQL);
			
			// Parse the CREATE TABLE statement
			parseTableStructure(tableName, createSQL, tableData);
			
			worker.removeEventListener('message', handleResponse);
			completedTables++;
			
			if (completedTables === tables.length) {
				displayTableStructure(tables, tableData);
			}
		};
		
		// Add a small delay between queries to avoid conflicts
		setTimeout(() => {
			worker.addEventListener('message', handleResponse);
			worker.postMessage({ action: 'exec', sql: query });
		}, index * 100);
	});
}

function parseTableStructure(tableName, createSQL, tableData) {
	// Extract column definitions from CREATE TABLE statement
	// Format: CREATE TABLE tableName (col1 type1 constraints, col2 type2, ...)
	
	const match = createSQL.match(/CREATE TABLE\s+\w+\s*\(([\s\S]+)\)/i);
	if (!match) return;
	
	const columnDefs = match[1];
	
	// Split by comma, but be careful with commas in CHECK constraints, etc.
	const columns = [];
	let currentCol = '';
	let parenDepth = 0;
	
	for (let i = 0; i < columnDefs.length; i++) {
		const char = columnDefs[i];
		if (char === '(') parenDepth++;
		if (char === ')') parenDepth--;
		
		if (char === ',' && parenDepth === 0) {
			columns.push(currentCol.trim());
			currentCol = '';
		} else {
			currentCol += char;
		}
	}
	if (currentCol.trim()) columns.push(currentCol.trim());
	
	// Parse each column
	columns.forEach(colDef => {
		// Skip table-level constraints
		if (/^(PRIMARY KEY|FOREIGN KEY|UNIQUE|CHECK|CONSTRAINT)/i.test(colDef.trim())) {
			// Parse table-level PK: PRIMARY KEY (col1, col2, ...)
			const pkMatch = colDef.match(/PRIMARY KEY\s*\(\s*([^)]+)\s*\)/i);
			if (pkMatch) {
				const pkCols = pkMatch[1].split(',').map(c => c.trim());
				pkCols.forEach(col => tableData[tableName].primaryKeys.add(col));
			}
			
			// Parse table-level FK: FOREIGN KEY (col) REFERENCES ...
			const fkMatch = colDef.match(/FOREIGN KEY\s*\(\s*(\w+)\s*\)/i);
			if (fkMatch) {
				tableData[tableName].foreignKeys.add(fkMatch[1]);
			}
			return;
		}
		
		// Parse column: name type constraints
		const colMatch = colDef.match(/^(\w+)\s+([^\s,]+)/i);
		if (!colMatch) return;
		
		const colName = colMatch[1];
		const colType = colMatch[2];
		
		// Check for PRIMARY KEY constraint
		const isPK = /PRIMARY\s+KEY/i.test(colDef);
		if (isPK) {
			tableData[tableName].primaryKeys.add(colName);
		}
		
		// Check for REFERENCES (FK)
		const isFK = /REFERENCES/i.test(colDef);
		if (isFK) {
			tableData[tableName].foreignKeys.add(colName);
			
			// Heuristic: if a column has REFERENCES and NOT NULL, it's likely part of a composite PK
			// (common pattern in junction tables like DetailCommande)
			const hasNotNull = /NOT\s+NULL/i.test(colDef);
			if (hasNotNull && !isPK) {
				// Check if this table has no explicit PRIMARY KEY yet
				// If so, columns with REFERENCES + NOT NULL are likely composite PK
				tableData[tableName].primaryKeys.add(colName);
			}
		}
		
		tableData[tableName].columns.push({
			name: colName,
			type: colType,
			isPrimaryKey: isPK
		});
	});
	
	console.log(`Parsed ${tableName}:`, tableData[tableName]);
}

function displayTableStructure(tables, tableData) {
	console.log('Displaying table structure for', tables.length, 'tables');
	
	const detailsDiv = document.getElementById('schemaDetails');
	if (!detailsDiv) return;
	
	// Display each table with improved formatting
	let html = '';
	tables.forEach(tableName => {
		const table = tableData[tableName];
		if (!table || table.columns.length === 0) {
			console.log(`Skipping ${tableName} - no columns`);
			return;
		}
		
		console.log(`Displaying ${tableName} with ${table.columns.length} columns, ${table.primaryKeys.size} PKs, ${table.foreignKeys.size} FKs`);
		
		// Build column list with symbols for keys
		const columnsList = table.columns.map(col => {
			let colStr = '';
			const isPK = table.primaryKeys.has(col.name);
			const isFK = table.foreignKeys.has(col.name);
			
			// Show both symbols if column is both PK and FK
			if (isPK) colStr += '🔑';
			if (isFK) colStr += '🔗';
			if (isPK || isFK) colStr += ' ';
			
			colStr += col.name;
			return colStr;
		}).join(', ');
		
		html += `
			<div class="table-info">
				<div class="table-signature">${tableName} (${columnsList})</div>
			</div>
		`;
	});
	
	detailsDiv.innerHTML = html || '<p class="schema-placeholder">Aucune information disponible</p>';
	console.log('Table structure displayed');
}

// Initial status
updateStatus('info', 'Prêt');

// Handle window resize
window.addEventListener('resize', function() {
	const isMobileView = window.innerWidth <= 768;
	const editorPanel = document.querySelector('.editor-panel');
	
	if (editorPanel) {
		if (isMobileView) {
			editorPanel.style.width = '';
		} else {
			editorPanel.style.height = '';
		}
	}
});

// Add keyboard shortcuts info
function initKeyboardShortcuts() {
	document.addEventListener('DOMContentLoaded', function() {
		const editorHeader = document.querySelector('.editor-header');
		if (editorHeader) {
			const shortcuts = document.createElement('div');
			shortcuts.className = 'shortcuts';
			
			addShortcutInfo(shortcuts, 'Execute: Ctrl/Cmd+Enter', 'Ctrl+Enter');
			addShortcutInfo(shortcuts, 'Save DB: Ctrl/Cmd+S', 'Ctrl+S');
			addShortcutInfo(shortcuts, 'Toggle History: Ctrl+Space', 'Ctrl+Space');
			
			editorHeader.appendChild(shortcuts);
		}
	});
}

function addShortcutInfo(container, title, keyText) {
	const shortcutTemplate = document.getElementById('shortcut-template');
	const shortcutClone = shortcutTemplate.content.cloneNode(true);
	const shortcut = shortcutClone.querySelector('span');
	shortcut.title = title;
	
	const keySlot = document.createElement('span');
	keySlot.slot = 'key';
	keySlot.textContent = keyText;
	shortcut.appendChild(keySlot);
	
	container.appendChild(shortcut);
}

// End of DOMContentLoaded
});
