#!/usr/bin/env python3
"""
Script pour convertir les fichiers TP existants en format Eleventy.
Fusionne les fichiers markdown et ajoute le front-matter.
"""

import os
import json
from pathlib import Path

# Chemins
TP_SOURCE = Path("TP-S1")
TP_DEST = Path("src/tps")

def read_json_config(json_path):
    """Lit le fichier JSON de configuration d'un TP"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def read_markdown_file(md_path):
    """Lit un fichier markdown"""
    if not md_path.exists():
        return ""
    with open(md_path, 'r', encoding='utf-8') as f:
        return f.read()

def create_eleventy_page(tp_num, config, md_files_dir):
    """Crée une page Eleventy pour un exercice de TP"""
    
    intitule = config.get('intitule', f'TP {tp_num}')
    base = config.get('base', '')
    fichiers = config.get('fichiers', [])
    
    pages = []
    
    for idx, fichier_base in enumerate(fichiers, start=1):
        md_path = md_files_dir / f"{fichier_base}.md"
        content = read_markdown_file(md_path)
        
        if not content:
            print(f"  ⚠️  Fichier vide ou introuvable: {md_path}")
            continue
        
        # Extraire le titre du markdown (première ligne #)
        lines = content.split('\n')
        titre = f"Exercice {idx}"
        for line in lines:
            if line.startswith('# '):
                titre = line.replace('# ', '').strip()
                break
        
        # Créer le front-matter
        front_matter = f"""---
layout: base.njk
title: "{titre}"
intitule: "{intitule}"
base: "{base}"
tpNum: {tp_num}
exerciceNum: {idx}
titre: "{titre}"
permalink: "/tp{tp_num}/exercice{idx}/"
tags: tp
---

"""
        
        full_content = front_matter + content
        pages.append({
            'filename': f"tp{tp_num}-ex{idx}.md",
            'content': full_content,
            'titre': titre
        })
        
    return pages

def main():
    """Fonction principale"""
    print("🔄 Conversion des TPs en format Eleventy...\n")
    
    # Créer le dossier de destination s'il n'existe pas
    TP_DEST.mkdir(parents=True, exist_ok=True)
    
    # Parcourir les dossiers TP
    for tp_dir in sorted(TP_SOURCE.iterdir()):
        if not tp_dir.is_dir() or not tp_dir.name.startswith('TP'):
            continue
        
        tp_num = tp_dir.name.replace('TP', '')
        print(f"📁 Traitement {tp_dir.name}...")
        
        # Lire le fichier JSON de configuration
        json_path = tp_dir / f"TP{tp_num}.json"
        if not json_path.exists():
            print(f"  ⚠️  Fichier JSON introuvable: {json_path}")
            continue
        
        config = read_json_config(json_path)
        
        # Créer les pages Eleventy
        pages = create_eleventy_page(tp_num, config, tp_dir)
        
        # Écrire les fichiers
        for page in pages:
            output_path = TP_DEST / page['filename']
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(page['content'])
            print(f"  ✅ Créé: {output_path.name} - {page['titre']}")
        
        print()
    
    print("✨ Conversion terminée!")

if __name__ == "__main__":
    main()
