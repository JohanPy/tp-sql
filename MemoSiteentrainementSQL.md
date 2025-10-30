
### 💡 L'Idée Principale : Site Statique Multi-pages

 **site statique multi-pages** où chaque TP est une page HTML distincte.

L'architecture de chaque page sera basée sur votre **modèle à 3 panneaux** :
1.  **Menu de Navigation :** Une colonne listant tous les TPs (générée automatiquement).
2.  **Contenu du TP :** La zone principale avec vos consignes (ex: "Exercice 1...").
3.  **Console SQL :** Une colonne avec l'éditeur de code et la zone de résultats.

L'étudiant navigue vers l'URL d'un TP (ex: `.../tp/select-where/`). La page se charge avec les bonnes consignes et la bonne base de données.

---

### 🛠️ Les Technologies (Le "Stack")

1.  **`Eleventy (11ty)`** : **Le Cerveau / Le Bâtisseur.**
    * C'est votre **générateur de site statique (SSG)**. Son rôle est de prendre vos fichiers de contenu (écrits en Markdown) et vos modèles (écrits en Nunjucks) pour *construire* l'ensemble du site web en HTML/CSS/JS pur.

2.  **`Markdown (.md)`** : **Le Contenu.**
    * C'est le format que vous utiliserez pour **écrire vos consignes de TP**. C'est simple, propre et géré nativement par 11ty.

3.  **`Nunjucks (.njk)`** : **Le Modèle (Layout).**
    * C'est le **fichier "moule"** (`base.njk`) qui définit la structure de vos 3 panneaux. 11ty y injectera le contenu de vos fichiers Markdown.

4.  **`sql.js`** : **Le Moteur.**
    * C'est la bibliothèque WebAssembly qui **exécute le SQL (SQLite)**. Elle tourne à 100% dans le navigateur de l'étudiant. C'est elle qui charge vos fichiers `.sqlite` ou qui crée une base de données vide pour le Semestre 2.

5.  **`CodeMirror`** : **L'Interface.**
    * C'est **l'éditeur de code** qui remplace le simple `<textarea>`. Il fournit la coloration syntaxique SQL, les numéros de ligne, etc., pour une expérience d'apprentissage bien meilleure.

6.  **`GitHub Pages`** : **L'Hébergeur.**
    * C'est la plateforme qui **hébergera gratuitement** le site statique final (le dossier `_site` généré par 11ty).

---

### 🔄 L'Articulation (Le "Workflow")

Il y a deux phases distinctes : le "Build" (ce que vous faites) et le "Run" (ce que fait l'étudiant).

#### 1. Phase "Build" (Ce que fait 11ty)

Ce processus se déroule avant que l'étudiant ne voie quoi que ce soit, soit sur votre machine, soit via une GitHub Action.

1.  **Analyse :** 11ty scanne votre projet. Il trouve votre layout `base.njk` et tous vos TPs dans le dossier `tps/` (ex: `tp1.md`, `tp2.md`...).
2.  **Collections :** Il crée automatiquement une "collection" (une liste) de tous vos TPs.
3.  **Génération :** Pour *chaque* fichier TP en Markdown :
    * Il prend le layout `base.njk`.
    * Il injecte le contenu du Markdown (vos consignes) dans le panneau "Contenu".
    * Il utilise la "collection" pour générer la liste du panneau "Menu".
    * Il lit les métadonnées de votre Markdown (ex: `db_file: "chinook.sqlite"`) et les "imprime" dans le HTML final (sous forme de variable JS).
4.  **Copie :** 11ty copie tous vos fichiers statiques (CSS, `sql-wasm.wasm`, vos fichiers `.sqlite`) dans le dossier final.
5.  **Résultat :** Vous obtenez un dossier `_site` rempli de pages HTML pures, une pour chaque TP.

#### 2. Phase "Run" (Ce qui se passe dans le navigateur)

1.  **Chargement :** L'étudiant accède à l'URL du TP 1. Le navigateur télécharge le fichier `tp1.html` (généré à l'étape "Build").
2.  **Initialisation :** Le JavaScript contenu dans `tp1.html` (celui que vous avez mis dans le layout) s'exécute.
3.  **Le Lien Magique :** Le script lit la variable (ex: `db_file = "chinook.sqlite"`) qu'Eleventy a laissée pour lui.
4.  **Démarrage de `sql.js` :**
    * Si `db_file` existe (Semestre 1), `sql.js` **télécharge (fetch)** le fichier `chinook.sqlite` et le charge en mémoire.
    * Si `db_file` est vide (Semestre 2), `sql.js` crée une **base de données vide**.
5.  **Démarrage de `CodeMirror` :** L'éditeur de code s'active.
6.  **Interaction :**
    * L'étudiant lit les consignes (HTML), écrit sa requête (CodeMirror).
    * Il clique sur "Exécuter".
    * Le script JS prend le texte de CodeMirror et le **donne à `sql.js`**.
    * `sql.js` exécute la requête sur la base en mémoire.
    * Le script JS récupère le résultat (un tableau d'objets) ou l'erreur.
    * Le script JS génère un tableau HTML et l'affiche dans le panneau "Résultats".
