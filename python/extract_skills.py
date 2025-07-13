import sys
import re

def extract_skills(text):
    skill_keywords = [
        'python', 'java', 'c++', 'sql', 'mysql', 'html', 'css', 'javascript',
        'flask', 'django', 'spring', 'react', 'node.js', 'docker', 'aws',
        'rest apis', 'tensorflow', 'pytorch'
    ]
    found_skills = []
    text = text.lower()
    for skill in skill_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            found_skills.append(skill)
    return found_skills

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_skills.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
            skills = extract_skills(text)
            print(','.join(skills))
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)
