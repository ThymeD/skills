#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

def get_home():
    return Path.home()

def expand_path(path_str):
    return str(Path(path_str.replace('~', str(Path.home()))))

def read_skill_info(skill_dir):
    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        return None
    
    try:
        content = skill_md.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        name = skill_dir.name
        description = ""
        
        in_description = False
        for line in lines[1:]:
            if line.strip().startswith('description:'):
                in_description = True
                description = line.split('description:')[1].strip()
                if description.startswith('|'):
                    continue
            elif in_description and line.strip().startswith('license') or line.strip().startswith('metadata'):
                break
            elif in_description and description:
                break
        
        if not description:
            description = name
        
        return {
            'name': name,
            'description': description,
            'type': 'npx 全局' if '.agents' in str(skill_dir) else '手动创建',
            'location': f'~/{skill_dir.relative_to(get_home())}',
            'lastUpdate': datetime.now().strftime('%Y-%m-%d')
        }
    except Exception as e:
        print(f"Error reading {skill_dir}: {e}", file=sys.stderr)
        return None

def scan_skills():
    skills = []
    
    locations = [
        get_home() / '.config' / 'opencode' / 'skills',
        get_home() / '.agents' / 'skills'
    ]
    
    for base_dir in locations:
        if not base_dir.exists():
            continue
            
        for item in base_dir.iterdir():
            if item.is_dir() and (item / 'SKILL.md').exists():
                skill_info = read_skill_info(item)
                if skill_info:
                    skills.append(skill_info)
    
    return skills

def main():
    cache_file = get_home() / '.config' / 'opencode' / 'skills' / 'skill-manager' / 'cache.json'
    
    skills = scan_skills()
    
    cache_data = {
        'version': 1,
        'lastUpdate': datetime.now(timezone.utc).isoformat(),
        'skills': skills
    }
    
    cache_file.parent.mkdir(parents=True, exist_ok=True)
    cache_file.write_text(json.dumps(cache_data, ensure_ascii=False, indent=2), encoding='utf-8')
    
    print(f"Cache updated: {len(skills)} skills found")

if __name__ == '__main__':
    main()
