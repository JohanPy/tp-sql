/**
 * mariadb-emulation.js
 * Émulation des fonctions courantes de MariaDB / MySQL pour SQLite (via sql.js).
 * Compatible Node.js et Web Worker / Navigateur.
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var exp = factory();
    root.registerMariaDBEmulation = exp.registerMariaDBEmulation;
    root.sanitizeSQLForSQLite = exp.sanitizeSQLForSQLite;
    root.MariaDBEmulation = exp;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Helper pour enregistrer une fonction avec une arité explicite.
   * Dans sql.js, func.length est transmis au moteur C de SQLite.
   * Si arity est -1, SQLite autorise un nombre variable d'arguments.
   */
  function registerFunc(db, name, fn, arity) {
    if (arity !== undefined) {
      try {
        Object.defineProperty(fn, 'length', { value: arity, configurable: true });
      } catch (e) {
        // Fallback si non configurable
      }
    }
    db.create_function(name, fn);
  }

  /**
   * Parser tolérant de date/heure.
   * Gère 'YYYY-MM-DD', 'YYYY-MM-DD HH:MM:SS', timestamps, etc.
   */
  function parseDate(d) {
    if (d === null || d === undefined || d === '') return null;
    if (d instanceof Date) return isNaN(d.getTime()) ? null : d;

    if (typeof d === 'number') {
      const date = new Date(d);
      return isNaN(date.getTime()) ? null : date;
    }

    const s = String(d).trim();
    // Format YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS ou ISO
    const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.\d+)?)?)?/);
    if (m) {
      const year = parseInt(m[1], 10);
      const month = parseInt(m[2], 10) - 1;
      const day = parseInt(m[3], 10);
      const hour = m[4] !== undefined ? parseInt(m[4], 10) : 0;
      const min = m[5] !== undefined ? parseInt(m[5], 10) : 0;
      const sec = m[6] !== undefined ? parseInt(m[6], 10) : 0;
      const parsed = new Date(year, month, day, hour, min, sec);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const fallback = new Date(s);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  function padZero(n, len) {
    let s = String(n);
    len = len || 2;
    while (s.length < len) s = '0' + s;
    return s;
  }

  const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAY_NAMES_ABBR_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const MONTH_NAMES_ABBR_EN = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  /**
   * Assainissement syntaxique SQL pour les cas où le parseur de SQLite
   * déclenche une syntax error avant même l'appel aux UDF.
   * Notamment CURRENT_DATE(), CURRENT_TIME(), CURRENT_TIMESTAMP(), ISNULL(expr).
   */
  function sanitizeSQLForSQLite(sql) {
    if (typeof sql !== 'string') return sql;

    // Remplacer CURRENT_DATE() par CURDATE()
    let cleaned = sql.replace(/\bCURRENT_DATE\s*\(\s*\)/gi, 'CURDATE()');

    // Remplacer CURRENT_TIME() par CURTIME()
    cleaned = cleaned.replace(/\bCURRENT_TIME\s*\(\s*\)/gi, 'CURTIME()');

    // Remplacer CURRENT_TIMESTAMP() par NOW()
    cleaned = cleaned.replace(/\bCURRENT_TIMESTAMP\s*\(\s*\)/gi, 'NOW()');

    // ISNULL(...) est un mot-clé postfixe dans SQLite (syntax error si préfixe ISNULL(...))
    // On le renomme vers __ISNULL(...) pour invoquer l'UDF sans heurter la grammaire
    cleaned = cleaned.replace(/\bISNULL\s*\(/gi, '__ISNULL(');

    return cleaned;
  }

  /**
   * Enregistre l'ensemble des UDF et agrégats MariaDB sur une instance de base sql.js.
   */
  function registerMariaDBEmulation(db) {
    if (!db || typeof db.create_function !== 'function') {
      throw new Error("registerMariaDBEmulation requiert une instance valide de sql.js Database");
    }

    /* =========================================================================
     * 1. DATES ET HEURES
     * ========================================================================= */

    // Horodatage courant
    registerFunc(db, 'NOW', function () {
      const now = new Date();
      return (
        now.getFullYear() + '-' +
        padZero(now.getMonth() + 1) + '-' +
        padZero(now.getDate()) + ' ' +
        padZero(now.getHours()) + ':' +
        padZero(now.getMinutes()) + ':' +
        padZero(now.getSeconds())
      );
    }, 0);

    registerFunc(db, 'CURDATE', function () {
      const now = new Date();
      return (
        now.getFullYear() + '-' +
        padZero(now.getMonth() + 1) + '-' +
        padZero(now.getDate())
      );
    }, 0);

    registerFunc(db, 'CURTIME', function () {
      const now = new Date();
      return (
        padZero(now.getHours()) + ':' +
        padZero(now.getMinutes()) + ':' +
        padZero(now.getSeconds())
      );
    }, 0);

    // Extraction de composants (retournent des entiers INTEGER comme MariaDB)
    registerFunc(db, 'YEAR', function (d) {
      const dt = parseDate(d);
      return dt ? dt.getFullYear() : null;
    }, 1);

    registerFunc(db, 'MONTH', function (d) {
      const dt = parseDate(d);
      return dt ? dt.getMonth() + 1 : null;
    }, 1);

    registerFunc(db, 'DAY', function (d) {
      const dt = parseDate(d);
      return dt ? dt.getDate() : null;
    }, 1);

    registerFunc(db, 'DAYOFMONTH', function (d) {
      const dt = parseDate(d);
      return dt ? dt.getDate() : null;
    }, 1);

    registerFunc(db, 'HOUR', function (t) {
      if (t === null || t === undefined || t === '') return null;
      const s = String(t).trim();
      const m = s.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
      if (m) return parseInt(m[1], 10);
      const dt = parseDate(t);
      return dt ? dt.getHours() : null;
    }, 1);

    registerFunc(db, 'MINUTE', function (t) {
      if (t === null || t === undefined || t === '') return null;
      const s = String(t).trim();
      const m = s.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
      if (m) return parseInt(m[2], 10);
      const dt = parseDate(t);
      return dt ? dt.getMinutes() : null;
    }, 1);

    registerFunc(db, 'SECOND', function (t) {
      if (t === null || t === undefined || t === '') return null;
      const s = String(t).trim();
      const m = s.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/);
      if (m) return parseInt(m[3], 10);
      const dt = parseDate(t);
      return dt ? dt.getSeconds() : null;
    }, 1);

    registerFunc(db, 'QUARTER', function (d) {
      const dt = parseDate(d);
      if (!dt) return null;
      return Math.floor(dt.getMonth() / 3) + 1;
    }, 1);

    // Noms de jour et mois
    registerFunc(db, 'DAYNAME', function (d) {
      const dt = parseDate(d);
      return dt ? DAY_NAMES_EN[dt.getDay()] : null;
    }, 1);

    registerFunc(db, 'MONTHNAME', function (d) {
      const dt = parseDate(d);
      return dt ? MONTH_NAMES_EN[dt.getMonth()] : null;
    }, 1);

    // Jours de la semaine
    // DAYOFWEEK : 1 = Sunday, 2 = Monday, ..., 7 = Saturday (ODBC/MariaDB)
    registerFunc(db, 'DAYOFWEEK', function (d) {
      const dt = parseDate(d);
      return dt ? dt.getDay() + 1 : null;
    }, 1);

    // WEEKDAY : 0 = Monday, 1 = Tuesday, ..., 6 = Sunday (MariaDB)
    registerFunc(db, 'WEEKDAY', function (d) {
      const dt = parseDate(d);
      if (!dt) return null;
      const day = dt.getDay(); // 0 is Sunday
      return day === 0 ? 6 : day - 1;
    }, 1);

    // Calculs de dates
    registerFunc(db, 'DATEDIFF', function (d1, d2) {
      const dt1 = parseDate(d1);
      const dt2 = parseDate(d2);
      if (!dt1 || !dt2) return null;

      // Uniquement sur la partie date (sans heures) UTC pour éviter les décalages DST
      const utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
      const utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());
      const diffMs = utc1 - utc2;
      return Math.round(diffMs / (1000 * 60 * 60 * 24));
    }, 2);

    registerFunc(db, 'ADDDATE', function (d, days) {
      const dt = parseDate(d);
      if (!dt || days === null || days === undefined) return null;
      const numDays = parseInt(days, 10);
      if (isNaN(numDays)) return null;
      const result = new Date(dt.getTime());
      result.setDate(result.getDate() + numDays);
      return (
        result.getFullYear() + '-' +
        padZero(result.getMonth() + 1) + '-' +
        padZero(result.getDate())
      );
    }, 2);

    registerFunc(db, 'SUBDATE', function (d, days) {
      const dt = parseDate(d);
      if (!dt || days === null || days === undefined) return null;
      const numDays = parseInt(days, 10);
      if (isNaN(numDays)) return null;
      const result = new Date(dt.getTime());
      result.setDate(result.getDate() - numDays);
      return (
        result.getFullYear() + '-' +
        padZero(result.getMonth() + 1) + '-' +
        padZero(result.getDate())
      );
    }, 2);

    registerFunc(db, 'LAST_DAY', function (d) {
      const dt = parseDate(d);
      if (!dt) return null;
      // Mois suivant jour 0 = dernier jour du mois courant
      const last = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
      return (
        last.getFullYear() + '-' +
        padZero(last.getMonth() + 1) + '-' +
        padZero(last.getDate())
      );
    }, 1);

    // Formatage de dates selon motifs MariaDB
    registerFunc(db, 'DATE_FORMAT', function (d, format) {
      const dt = parseDate(d);
      if (!dt || format === null || format === undefined) return null;

      const f = String(format);
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      const day = dt.getDate();
      const hours24 = dt.getHours();
      const hours12 = hours24 % 12 || 12;
      const minutes = dt.getMinutes();
      const seconds = dt.getSeconds();
      const ampm = hours24 >= 12 ? 'PM' : 'AM';

      const map = {
        '%Y': String(year),
        '%y': padZero(year % 100),
        '%m': padZero(month),
        '%c': String(month),
        '%d': padZero(day),
        '%e': String(day),
        '%H': padZero(hours24),
        '%h': padZero(hours12),
        '%I': padZero(hours12),
        '%k': String(hours24),
        '%l': String(hours12),
        '%i': padZero(minutes),
        '%s': padZero(seconds),
        '%S': padZero(seconds),
        '%p': ampm,
        '%W': DAY_NAMES_EN[dt.getDay()],
        '%a': DAY_NAMES_ABBR_EN[dt.getDay()],
        '%M': MONTH_NAMES_EN[dt.getMonth()],
        '%b': MONTH_NAMES_ABBR_EN[dt.getMonth()],
        '%%': '%'
      };

      return f.replace(/%[YymcdehHiklisSpWaMb%]/g, function (match) {
        return Object.prototype.hasOwnProperty.call(map, match) ? map[match] : match;
      });
    }, 2);

    /* =========================================================================
     * 2. CHAÎNES DE CARACTÈRES
     * ========================================================================= */

    // CONCAT(s1, s2, ...) : variadique (-1).
    // Règle MariaDB : si UN argument est NULL -> retourne NULL.
    registerFunc(db, 'CONCAT', function () {
      const args = Array.prototype.slice.call(arguments);
      for (let i = 0; i < args.length; i++) {
        if (args[i] === null || args[i] === undefined) return null;
      }
      return args.join('');
    }, -1);

    // CONCAT_WS(sep, s1, s2, ...) : variadique (-1).
    // Si sep est NULL -> retourne NULL. Ignore les arguments NULL suivants.
    registerFunc(db, 'CONCAT_WS', function () {
      const args = Array.prototype.slice.call(arguments);
      if (args.length === 0) return '';
      const sep = args[0];
      if (sep === null || sep === undefined) return null;

      const nonNull = [];
      for (let i = 1; i < args.length; i++) {
        if (args[i] !== null && args[i] !== undefined) {
          nonNull.push(String(args[i]));
        }
      }
      return nonNull.join(String(sep));
    }, -1);

    // LEFT & RIGHT
    registerFunc(db, 'LEFT', function (str, len) {
      if (str === null || str === undefined || len === null || len === undefined) return null;
      const l = parseInt(len, 10);
      if (isNaN(l) || l <= 0) return '';
      return String(str).slice(0, l);
    }, 2);

    registerFunc(db, 'RIGHT', function (str, len) {
      if (str === null || str === undefined || len === null || len === undefined) return null;
      const l = parseInt(len, 10);
      if (isNaN(l) || l <= 0) return '';
      const s = String(str);
      return s.slice(Math.max(0, s.length - l));
    }, 2);

    // SUBSTRING & MID (1-based, support pos négatif, support pos == 0 -> '')
    function MariaDBSubstring(str, pos, len) {
      if (str === null || str === undefined || pos === null || pos === undefined) return null;
      const s = String(str);
      let p = parseInt(pos, 10);
      if (isNaN(p) || p === 0) return '';

      let start;
      if (p > 0) {
        start = p - 1; // 1-based vers 0-based
      } else {
        start = s.length + p; // négatif compte depuis la fin
      }

      if (len === undefined || len === null) {
        return s.slice(start);
      }

      const l = parseInt(len, 10);
      if (isNaN(l) || l <= 0) return '';
      return s.slice(start, start + l);
    }

    registerFunc(db, 'SUBSTRING', MariaDBSubstring, -1);
    registerFunc(db, 'MID', MariaDBSubstring, -1);

    // Longueur de chaînes
    registerFunc(db, 'CHAR_LENGTH', function (str) {
      if (str === null || str === undefined) return null;
      return Array.from(String(str)).length;
    }, 1);

    registerFunc(db, 'CHARACTER_LENGTH', function (str) {
      if (str === null || str === undefined) return null;
      return Array.from(String(str)).length;
    }, 1);

    // Recherche et position : LOCATE(substr, str, [pos])
    // Ordre inverse de INSTR(str, substr). Renvoie la position 1-based (0 si absent).
    registerFunc(db, 'LOCATE', function (substr, str, pos) {
      if (substr === null || substr === undefined || str === null || str === undefined) return null;
      const sub = String(substr);
      const s = String(str);
      let start = 0;
      if (pos !== undefined && pos !== null) {
        const p = parseInt(pos, 10);
        if (!isNaN(p) && p > 1) {
          start = p - 1;
        }
      }
      const idx = s.indexOf(sub, start);
      return idx === -1 ? 0 : idx + 1;
    }, -1);

    // LPAD & RPAD
    registerFunc(db, 'LPAD', function (str, len, pad) {
      if (str === null || len === null || pad === null || str === undefined || len === undefined || pad === undefined) return null;
      const s = String(str);
      const l = parseInt(len, 10);
      const p = String(pad);
      if (isNaN(l) || l <= 0) return '';
      if (p.length === 0) return '';
      if (s.length >= l) return s.slice(0, l);

      const needed = l - s.length;
      let padStr = '';
      while (padStr.length < needed) {
        padStr += p;
      }
      return padStr.slice(0, needed) + s;
    }, 3);

    registerFunc(db, 'RPAD', function (str, len, pad) {
      if (str === null || len === null || pad === null || str === undefined || len === undefined || pad === undefined) return null;
      const s = String(str);
      const l = parseInt(len, 10);
      const p = String(pad);
      if (isNaN(l) || l <= 0) return '';
      if (p.length === 0) return '';
      if (s.length >= l) return s.slice(0, l);

      const needed = l - s.length;
      let padStr = '';
      while (padStr.length < needed) {
        padStr += p;
      }
      return s + padStr.slice(0, needed);
    }, 3);

    // REVERSE
    registerFunc(db, 'REVERSE', function (str) {
      if (str === null || str === undefined) return null;
      return Array.from(String(str)).reverse().join('');
    }, 1);

    // FORMAT(num, decimals) : formatage de nombre avec séparateurs
    registerFunc(db, 'FORMAT', function (num, decimals) {
      if (num === null || num === undefined) return null;
      const n = Number(num);
      if (isNaN(n)) return null;
      const dec = parseInt(decimals, 10);
      const d = isNaN(dec) || dec < 0 ? 0 : dec;
      return n.toLocaleString('en-US', {
        minimumFractionDigits: d,
        maximumFractionDigits: d
      });
    }, 2);

    // Répétition et espaces
    registerFunc(db, 'REPEAT', function (str, count) {
      if (str === null || count === null || str === undefined || count === undefined) return null;
      const c = parseInt(count, 10);
      if (isNaN(c) || c <= 0) return '';
      return String(str).repeat(c);
    }, 2);

    registerFunc(db, 'SPACE', function (count) {
      if (count === null || count === undefined) return null;
      const c = parseInt(count, 10);
      if (isNaN(c) || c <= 0) return '';
      return ' '.repeat(c);
    }, 1);

    // Surcharge Casse Unicode (gestion correcte des accents français)
    registerFunc(db, 'UPPER', function (str) {
      return str === null || str === undefined ? null : String(str).toUpperCase();
    }, 1);

    registerFunc(db, 'UCASE', function (str) {
      return str === null || str === undefined ? null : String(str).toUpperCase();
    }, 1);

    registerFunc(db, 'LOWER', function (str) {
      return str === null || str === undefined ? null : String(str).toLowerCase();
    }, 1);

    registerFunc(db, 'LCASE', function (str) {
      return str === null || str === undefined ? null : String(str).toLowerCase();
    }, 1);

    /* =========================================================================
     * 3. LOGIQUE ET CONDITIONS
     * ========================================================================= */

    // IF(condition, val_true, val_false)
    registerFunc(db, 'IF', function (cond, valTrue, valFalse) {
      if (cond === null || cond === undefined || cond === false || cond === 0 || cond === '0' || cond === '') {
        return valFalse;
      }
      return valTrue;
    }, 3);

    // ISNULL(expr) : retourne 1 si NULL, 0 sinon
    const isNullFn = function (expr) {
      return (expr === null || expr === undefined) ? 1 : 0;
    };
    registerFunc(db, '__ISNULL', isNullFn, 1);
    try {
      registerFunc(db, 'ISNULL', isNullFn, 1);
    } catch (e) {
      // Ignorer si SQLite refuse ISNULL
    }

    // NVL(expr, fallback) : alias de IFNULL
    registerFunc(db, 'NVL', function (expr, fallback) {
      return (expr === null || expr === undefined) ? fallback : expr;
    }, 2);

    /* =========================================================================
     * 4. MATHÉMATIQUES
     * ========================================================================= */

    registerFunc(db, 'MOD', function (n, m) {
      if (n === null || m === null || n === undefined || m === undefined) return null;
      const numN = Number(n);
      const numM = Number(m);
      if (isNaN(numN) || isNaN(numM) || numM === 0) return null;
      return numN % numM;
    }, 2);

    registerFunc(db, 'TRUNCATE', function (x, d) {
      if (x === null || d === null || x === undefined || d === undefined) return null;
      const numX = Number(x);
      const numD = parseInt(d, 10);
      if (isNaN(numX) || isNaN(numD)) return null;
      const factor = Math.pow(10, numD);
      return Math.trunc(numX * factor) / factor;
    }, 2);

    registerFunc(db, 'POW', function (x, y) {
      if (x === null || y === null || x === undefined || y === undefined) return null;
      const numX = Number(x);
      const numY = Number(y);
      if (isNaN(numX) || isNaN(numY)) return null;
      return Math.pow(numX, numY);
    }, 2);

    registerFunc(db, 'POWER', function (x, y) {
      if (x === null || y === null || x === undefined || y === undefined) return null;
      const numX = Number(x);
      const numY = Number(y);
      if (isNaN(numX) || isNaN(numY)) return null;
      return Math.pow(numX, numY);
    }, 2);

    registerFunc(db, 'RAND', function () {
      return Math.random();
    }, 0);

    registerFunc(db, 'LN', function (x) {
      if (x === null || x === undefined) return null;
      const n = Number(x);
      if (isNaN(n) || n <= 0) return null;
      return Math.log(n);
    }, 1);

    registerFunc(db, 'LOG2', function (x) {
      if (x === null || x === undefined) return null;
      const n = Number(x);
      if (isNaN(n) || n <= 0) return null;
      return Math.log2(n);
    }, 1);

    registerFunc(db, 'GREATEST', function () {
      const args = Array.prototype.slice.call(arguments);
      if (args.length === 0) return null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === null || args[i] === undefined) return null;
      }
      return args.reduce(function (max, val) {
        return val > max ? val : max;
      });
    }, -1);

    registerFunc(db, 'LEAST', function () {
      const args = Array.prototype.slice.call(arguments);
      if (args.length === 0) return null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === null || args[i] === undefined) return null;
      }
      return args.reduce(function (min, val) {
        return val < min ? val : min;
      });
    }, -1);

    /* =========================================================================
     * 5. AGRÉGATS STATISTIQUES
     * ========================================================================= */

    // Helper d'agrégat pour la variance et l'écart-type
    function createStatAggregate(isSample, isStdDev) {
      return {
        init: function () {
          return { n: 0, sum: 0, sumSq: 0 };
        },
        step: function (state, val) {
          if (val !== null && val !== undefined && val !== '') {
            const num = Number(val);
            if (!isNaN(num)) {
              state.n += 1;
              state.sum += num;
              state.sumSq += num * num;
            }
          }
          return state;
        },
        finalize: function (state) {
          if (!state || state.n === 0) return null;
          if (isSample && state.n <= 1) return null;

          const mean = state.sum / state.n;
          let variance;
          if (isSample) {
            // Variance échantillon : sum((x - mean)^2) / (n - 1)
            const sumDevSq = state.sumSq - 2 * mean * state.sum + state.n * mean * mean;
            variance = sumDevSq / (state.n - 1);
          } else {
            // Variance population : sumSq/n - mean^2
            variance = (state.sumSq / state.n) - (mean * mean);
          }

          if (variance < 0) variance = 0; // correction d'arrondi flottant

          if (isStdDev) {
            return Math.sqrt(variance);
          }
          return variance;
        }
      };
    }

    // Variance de population (N) : VARIANCE(), VAR_POP()
    const varPopAgg = createStatAggregate(false, false);
    db.create_aggregate('VAR_POP', varPopAgg);
    db.create_aggregate('VARIANCE', varPopAgg);

    // Variance d'échantillon (N - 1) : VAR_SAMP()
    const varSampAgg = createStatAggregate(true, false);
    db.create_aggregate('VAR_SAMP', varSampAgg);

    // Écart-type de population : STD(), STDDEV(), STDDEV_POP()
    const stdPopAgg = createStatAggregate(false, true);
    db.create_aggregate('STD', stdPopAgg);
    db.create_aggregate('STDDEV', stdPopAgg);
    db.create_aggregate('STDDEV_POP', stdPopAgg);

    // Écart-type d'échantillon : STDDEV_SAMP()
    const stdSampAgg = createStatAggregate(true, true);
    db.create_aggregate('STDDEV_SAMP', stdSampAgg);

    return db;
  }

  return {
    registerMariaDBEmulation: registerMariaDBEmulation,
    sanitizeSQLForSQLite: sanitizeSQLForSQLite
  };
});
