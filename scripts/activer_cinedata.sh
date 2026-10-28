#!/usr/bin/env bash
set -e

# Se placer à la racine de tp-sql
cd "$(dirname "$0")/.."

echo "[CineData] Activation du TP 6 (Révision & Entraînement Autonome)..."
cp archived_tps/cinedata/tp6-*.md src/tps/

echo "[CineData] Recompilation du site Eleventy..."
npm run build

echo "✅ TP 6 (CineData avec corrections) est maintenant ACTIF et VISIBLE sur le site !"
