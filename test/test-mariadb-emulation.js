const assert = require('assert');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { registerMariaDBEmulation, sanitizeSQLForSQLite } = require('../src/assets/js/mariadb-emulation');

async function runTests() {
  console.log("=== Début de la suite de tests MariaDB Emulation ===");

  const SQL = await initSqlJs();
  const db = new SQL.Database();
  registerMariaDBEmulation(db);

  // Helper d'exécution d'une requête renvoyant 1 seule valeur
  function queryVal(sql) {
    const sanitized = sanitizeSQLForSQLite(sql);
    const res = db.exec(sanitized);
    assert(res.length > 0, `Pas de résultat pour : ${sql}`);
    return res[0].values[0][0];
  }

  // 1. Dates et Heures
  console.log("\n--- Test 1 : Dates et Heures ---");
  const now = queryVal("SELECT NOW()");
  console.log("NOW():", now);
  assert(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(now));

  const curdate = queryVal("SELECT CURDATE()");
  console.log("CURDATE():", curdate);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(curdate));

  const curtime = queryVal("SELECT CURTIME()");
  console.log("CURTIME():", curtime);
  assert(/^\d{2}:\d{2}:\d{2}$/.test(curtime));

  // Test de CURRENT_DATE() avec parenthèses via sanitizeSQLForSQLite
  const curdateParen = queryVal("SELECT CURRENT_DATE()");
  assert.strictEqual(curdateParen, curdate);
  console.log("CURRENT_DATE() avec parenthèses géré avec succès :", curdateParen);

  const curtimeParen = queryVal("SELECT CURRENT_TIME()");
  assert.strictEqual(curtimeParen, curtime);
  console.log("CURRENT_TIME() avec parenthèses géré avec succès :", curtimeParen);

  assert.strictEqual(queryVal("SELECT YEAR('2024-03-15')"), 2024);
  assert.strictEqual(queryVal("SELECT MONTH('2024-03-15')"), 3);
  assert.strictEqual(queryVal("SELECT DAY('2024-03-15')"), 15);
  assert.strictEqual(queryVal("SELECT DAYOFMONTH('2024-03-15')"), 15);
  assert.strictEqual(queryVal("SELECT HOUR('14:35:20')"), 14);
  assert.strictEqual(queryVal("SELECT MINUTE('14:35:20')"), 35);
  assert.strictEqual(queryVal("SELECT SECOND('14:35:20')"), 20);
  assert.strictEqual(queryVal("SELECT QUARTER('2024-08-10')"), 3);
  assert.strictEqual(queryVal("SELECT DAYNAME('2024-03-15')"), 'Friday');
  assert.strictEqual(queryVal("SELECT MONTHNAME('2024-03-15')"), 'March');
  assert.strictEqual(queryVal("SELECT DAYOFWEEK('2024-03-15')"), 6); // Friday = 6 in ODBC
  assert.strictEqual(queryVal("SELECT WEEKDAY('2024-03-15')"), 4); // Friday = 4 (Monday=0)

  assert.strictEqual(queryVal("SELECT DATEDIFF('2024-03-20', '2024-03-15')"), 5);
  assert.strictEqual(queryVal("SELECT DATEDIFF('2024-03-15', '2024-03-20')"), -5);
  assert.strictEqual(queryVal("SELECT ADDDATE('2024-03-15', 5)"), '2024-03-20');
  assert.strictEqual(queryVal("SELECT SUBDATE('2024-03-15', 5)"), '2024-03-10');
  assert.strictEqual(queryVal("SELECT LAST_DAY('2024-02-10')"), '2024-02-29'); // 2024 bissextile
  assert.strictEqual(queryVal("SELECT LAST_DAY('2023-02-10')"), '2023-02-28');
  assert.strictEqual(queryVal("SELECT DATE_FORMAT('2024-03-15 14:05:09', '%d/%m/%Y %Hh%i')"), '15/03/2024 14h05');
  console.log("✓ Tous les tests Dates et Heures passent !");

  // 2. Chaînes de caractères
  console.log("\n--- Test 2 : Chaînes de caractères ---");
  // Test d'arité variable sur CONCAT
  assert.strictEqual(queryVal("SELECT CONCAT('Hello', ' ', 'World', '!')"), 'Hello World!');
  assert.strictEqual(queryVal("SELECT CONCAT('Hello', NULL, 'World')"), null); // MariaDB standard
  assert.strictEqual(queryVal("SELECT CONCAT_WS('-', '2024', NULL, '03', '15')"), '2024-03-15');
  assert.strictEqual(queryVal("SELECT LEFT('Antigravity', 4)"), 'Anti');
  assert.strictEqual(queryVal("SELECT RIGHT('Antigravity', 7)"), 'gravity');
  assert.strictEqual(queryVal("SELECT SUBSTRING('MariaDB', 1, 5)"), 'Maria');
  assert.strictEqual(queryVal("SELECT SUBSTRING('MariaDB', 6)"), 'DB');
  assert.strictEqual(queryVal("SELECT MID('MariaDB', 1, 5)"), 'Maria');
  assert.strictEqual(queryVal("SELECT CHAR_LENGTH('Éléphant')"), 8);
  assert.strictEqual(queryVal("SELECT CHARACTER_LENGTH('Éléphant')"), 8);
  assert.strictEqual(queryVal("SELECT LOCATE('bar', 'foobarbar')"), 4);
  assert.strictEqual(queryVal("SELECT LOCATE('bar', 'foobarbar', 5)"), 7);
  assert.strictEqual(queryVal("SELECT LOCATE('absent', 'foobar')"), 0);
  assert.strictEqual(queryVal("SELECT LPAD('hi', 5, '0')"), '000hi');
  assert.strictEqual(queryVal("SELECT RPAD('hi', 5, '.')"), 'hi...');
  assert.strictEqual(queryVal("SELECT REVERSE('radar')"), 'radar');
  assert.strictEqual(queryVal("SELECT REVERSE('MariaDB')"), 'BDairaM');
  assert.strictEqual(queryVal("SELECT FORMAT(1234567.891, 2)"), '1,234,567.89');
  assert.strictEqual(queryVal("SELECT REPEAT('Abc', 3)"), 'AbcAbcAbc');
  assert.strictEqual(queryVal("SELECT SPACE(3)"), '   ');

  // Unicode Casse
  assert.strictEqual(queryVal("SELECT UPPER('hélène')"), 'HÉLÈNE');
  assert.strictEqual(queryVal("SELECT UCASE('hélène')"), 'HÉLÈNE');
  assert.strictEqual(queryVal("SELECT LOWER('HÉLÈNE')"), 'hélène');
  assert.strictEqual(queryVal("SELECT LCASE('HÉLÈNE')"), 'hélène');
  console.log("✓ Tous les tests Chaînes et Unicode passent !");

  // 3. Logique et Conditions
  console.log("\n--- Test 3 : Logique et Conditions ---");
  assert.strictEqual(queryVal("SELECT IF(1 > 0, 'Vrai', 'Faux')"), 'Vrai');
  assert.strictEqual(queryVal("SELECT IF(1 = 0, 'Vrai', 'Faux')"), 'Faux');
  assert.strictEqual(queryVal("SELECT IF(NULL, 'Vrai', 'Faux')"), 'Faux');
  assert.strictEqual(queryVal("SELECT ISNULL(NULL)"), 1);
  assert.strictEqual(queryVal("SELECT ISNULL('test')"), 0);
  assert.strictEqual(queryVal("SELECT NVL(NULL, 'Fallback')"), 'Fallback');
  assert.strictEqual(queryVal("SELECT NVL('Valide', 'Fallback')"), 'Valide');
  console.log("✓ Tous les tests Logique et Conditions passent !");

  // 4. Mathématiques
  console.log("\n--- Test 4 : Mathématiques ---");
  assert.strictEqual(queryVal("SELECT MOD(29, 3)"), 2);
  assert.strictEqual(queryVal("SELECT TRUNCATE(123.4567, 2)"), 123.45);
  assert.strictEqual(queryVal("SELECT TRUNCATE(123.4567, 0)"), 123);
  assert.strictEqual(queryVal("SELECT POW(2, 8)"), 256);
  assert.strictEqual(queryVal("SELECT POWER(2, 8)"), 256);
  assert.strictEqual(queryVal("SELECT LN(1)"), 0);
  assert.strictEqual(queryVal("SELECT LOG2(1024)"), 10);
  const rnd = queryVal("SELECT RAND()");
  assert(rnd >= 0 && rnd < 1);
  assert.strictEqual(queryVal("SELECT GREATEST(10, 50, 30, 20)"), 50);
  assert.strictEqual(queryVal("SELECT LEAST(10, 50, 30, 20)"), 10);
  console.log("✓ Tous les tests Mathématiques passent !");

  // 5. Agrégats Statistiques
  console.log("\n--- Test 5 : Agrégats Statistiques ---");
  db.exec("CREATE TABLE test_stats (val REAL);");
  // Série : [2, 4, 4, 4, 5, 5, 7, 9] -> Moyenne = 5, Var Pop = 4, Std Pop = 2
  db.exec("INSERT INTO test_stats VALUES (2), (4), (4), (4), (5), (5), (7), (9);");

  const varPop = queryVal("SELECT VAR_POP(val) FROM test_stats");
  assert.strictEqual(Math.round(varPop * 100) / 100, 4);

  const variance = queryVal("SELECT VARIANCE(val) FROM test_stats");
  assert.strictEqual(Math.round(variance * 100) / 100, 4);

  const stdPop = queryVal("SELECT STDDEV_POP(val) FROM test_stats");
  assert.strictEqual(Math.round(stdPop * 100) / 100, 2);

  const std = queryVal("SELECT STD(val) FROM test_stats");
  assert.strictEqual(Math.round(std * 100) / 100, 2);

  const stddev = queryVal("SELECT STDDEV(val) FROM test_stats");
  assert.strictEqual(Math.round(stddev * 100) / 100, 2);

  // Variance échantillon : 32 / 7 = 4.5714...
  const varSamp = queryVal("SELECT VAR_SAMP(val) FROM test_stats");
  assert.strictEqual(Math.round(varSamp * 1000) / 1000, 4.571);

  // Écart-type échantillon : sqrt(32/7) = 2.138...
  const stdSamp = queryVal("SELECT STDDEV_SAMP(val) FROM test_stats");
  assert.strictEqual(Math.round(stdSamp * 1000) / 1000, 2.138);

  console.log("✓ Tous les tests Agrégats Statistiques passent !");

  // 6. Test sur une base SQLite réelle du projet (Comptoir2000.sqlite)
  console.log("\n--- Test 6 : Base réelle Comptoir2000.sqlite ---");
  const dbFile = path.join(__dirname, '../bases/Comptoir2000.sqlite');
  if (fs.existsSync(dbFile)) {
    const fileBuffer = fs.readFileSync(dbFile);
    const dbCpt = new SQL.Database(fileBuffer);
    registerMariaDBEmulation(dbCpt);

    // Requête typique étudiant MariaDB sur Comptoir2000
    const testMariaQuery = `
      SELECT 
        YEAR(DateCom) AS Annee,
        MONTH(DateCom) AS Mois,
        CONCAT('C-', NoCom) AS CodeCommande,
        IF(Port > 50, 'Élevé', 'Standard') AS FraisPort,
        ROUND(Port, 2) AS PortArrondi
      FROM Commande
      LIMIT 5;
    `;
    const res = dbCpt.exec(sanitizeSQLForSQLite(testMariaQuery));
    console.log("Résultat sur Comptoir2000 (colonnes) :", res[0].columns);
    console.log("Première ligne :", res[0].values[0]);
    assert.strictEqual(res[0].values.length, 5);
    console.log("✓ Requête MariaDB réussie sur Comptoir2000.sqlite !");
  }

  console.log("\n=======================================================");
  console.log("🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (100% OK) !");
  console.log("=======================================================");
}

runTests().catch(err => {
  console.error("❌ Échec des tests :", err);
  process.exit(1);
});

