#!/usr/bin/env bash
set -e

# Se placer à la racine de tp-sql
cd "$(dirname "$0")/.."

echo "[CineData] Masquage du TP 6 (CineData)..."
rm -f src/tps/tp6-*.md

echo "[CineData] Recompilation du site Eleventy..."
npm run build

echo "🔒 TP 6 (CineData) est maintenant MASQUÉ. Seul le TP 5 (NetflixStream) reste actif."
