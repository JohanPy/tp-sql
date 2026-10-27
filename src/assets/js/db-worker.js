/**
 * db-worker.js
 * Web Worker SQLite (sql.js) avec support intégré de l'émulation MariaDB.
 */

/* global importScripts, initSqlJs, registerMariaDBEmulation, sanitizeSQLForSQLite */
"use strict";

importScripts("../sql.js/sql-wasm.js");
importScripts("./mariadb-emulation.js");

var db = null;
var SQL = null;

// Initialiser le module WebAssembly sql.js en spécifiant le chemin relatif vers sql-wasm.wasm
var sqlModuleReady = initSqlJs({
  locateFile: function (file) {
    return "../sql.js/" + file;
  }
}).then(function (module) {
  SQL = module;
  return SQL;
});

function createDb(data) {
  if (db != null) {
    db.close();
  }
  db = new SQL.Database(data);
  // Enregistrer toutes les fonctions et agrégats MariaDB sur la nouvelle base
  registerMariaDBEmulation(db);
  return db;
}

function onModuleReady(SQLInstance) {
  var data = this["data"];
  var buff;
  var result;
  var config = data && data["config"] ? data["config"] : {};

  switch (data && data["action"]) {
    case "open":
      buff = data["buffer"];
      createDb(buff && new Uint8Array(buff));
      return postMessage({
        id: data["id"],
        ready: true
      });

    case "exec":
      if (db === null) {
        createDb();
      }
      if (!data["sql"]) {
        throw new Error("exec: Missing query string");
      }
      // Assainissement transparent pour compatibilité syntaxique SQLite (CURRENT_DATE(), ISNULL(), etc.)
      var sanitizedSql = sanitizeSQLForSQLite(data["sql"]);
      return postMessage({
        id: data["id"],
        results: db.exec(sanitizedSql, data["params"], config)
      });

    case "getRowsModified":
      return postMessage({
        id: data["id"],
        rowsModified: db ? db.getRowsModified() : 0
      });

    case "each":
      if (db === null) {
        createDb();
      }
      var callback = function (row) {
        return postMessage({
          id: data["id"],
          row: row,
          finished: false
        });
      };
      var done = function () {
        return postMessage({
          id: data["id"],
          finished: true
        });
      };
      var eachSql = sanitizeSQLForSQLite(data["sql"]);
      return db.each(eachSql, data["params"], callback, done, config);

    case "export":
      buff = db["export"]();
      result = {
        id: data["id"],
        buffer: buff
      };
      try {
        return postMessage(result, [result]);
      } catch (error) {
        return postMessage(result);
      }

    case "close":
      if (db) {
        db.close();
        db = null;
      }
      return postMessage({
        id: data["id"]
      });

    default:
      throw new Error("Invalid action : " + (data && data["action"]));
  }
}

function onError(err) {
  return postMessage({
    id: this["data"] && this["data"]["id"],
    error: err ? (err.message || String(err)) : "Erreur inconnue dans db-worker"
  });
}

function messageHandler(event) {
  return sqlModuleReady
    .then(onModuleReady.bind(event))
    .catch(onError.bind(event));
}

self.onmessage = messageHandler;

