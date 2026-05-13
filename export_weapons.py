import re
import json

def parse_astra_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into sections by headers
    sections = re.split(r'\n(## .*)\n', content)
    
    weapons = []
    current_tier = "Conventional" # Default
    
    # Iterate through parts
    # Part 0 is pre-header, Part 1 is header, Part 2 is content, etc.
    for i in range(1, len(sections), 2):
        header = sections[i].upper()
        body = sections[i+1]
        
        # Detect Tier from header
        if "SUPREME" in header:
            current_tier = "Supreme"
        elif "CELESTIAL" in header:
            current_tier = "Celestial"
        elif "ELEMENTAL" in header:
            current_tier = "Elemental"
        elif "CONVENTIONAL" in header:
            current_tier = "Conventional"
        
        # Find card blocks
        card_blocks = re.split(r'\n### (\d+)\. (.*)\n', body)
        
        for j in range(1, len(card_blocks), 3):
            card_id = int(card_blocks[j])
            name = card_blocks[j+1].strip().replace('**', '')
            details = card_blocks[j+2]
            
            weapon = {
                "id": card_id,
                "name": name,
                "tier": current_tier,
                "power": 0,
                "mantraCost": 0,
                "element": "None",
                "counters": [],
                "counteredBy": [],
                "rarity": "Common",
                "ability": {"name": "None", "effect": "None"},
                "description": ""
            }
            
            # Parse details
            power_match = re.search(r'\*\*Power:\*\* (\d+)', details)
            if power_match: weapon["power"] = int(power_match.group(1))
            
            cost_match = re.search(r'\*\*Mantra Cost:\*\* (\d+)', details)
            if cost_match: weapon["mantraCost"] = int(cost_match.group(1))
            
            element_match = re.search(r'\*\*Element:\*\* (.*)', details)
            if element_match: weapon["element"] = element_match.group(1).strip()
            
            counters_match = re.search(r'\*\*Counters:\*\* (.*)', details)
            if counters_match: weapon["counters"] = [c.strip() for c in counters_match.group(1).split(',')]
            
            countered_match = re.search(r'\*\*Countered By:\*\* (.*)', details)
            if countered_match: weapon["counteredBy"] = [c.strip() for c in countered_match.group(1).split(',')]
            
            rarity_match = re.search(r'\*\*Rarity:\*\* (.*)', details)
            if rarity_match: weapon["rarity"] = rarity_match.group(1).strip()
            
            ability_match = re.search(r'\*\*Ability:\*\* (.*)', details)
            if ability_match: 
                # Ability might be split into name and effect, or just text
                ability_text = ability_match.group(1).strip()
                if ':' in ability_text:
                    parts = ability_text.split(':', 1)
                    weapon["ability"] = {"name": parts[0].strip(), "effect": parts[1].strip()}
                else:
                    weapon["ability"] = {"name": "Special", "effect": ability_text}
            
            desc_match = re.search(r'\*\*Description:\*\* (.*)', details)
            if desc_match: weapon["description"] = desc_match.group(1).strip()
            
            # Basic validation: ignore non-card blocks that might have matched
            if weapon["power"] > 0 or weapon["mantraCost"] > 0:
                weapons.append(weapon)

    return weapons

# Run parser
weapons_data = parse_astra_md('Astra Card/astra_complete_database.md')

# Output to JSON
with open('Astra Card/astra-game/src/data/weapons.json', 'w', encoding='utf-8') as f:
    json.dump(weapons_data, f, indent=4, ensure_ascii=False)

print(f"Successfully exported {len(weapons_data)} weapons to weapons.json")
