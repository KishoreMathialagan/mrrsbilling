import json

with open('/home/shaktimaan/.gemini/antigravity/brain/b8414182-4878-433f-8f64-e9dc259bf410/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'GENERIC' and 'dashboard/page.tsx' in data.get('content', ''):
                content = data['content']
                if 'export default function DashboardPage' in content or 'export default async function DashboardPage' in content:
                    print("Found original dashboard!")
                    with open('dashboard_history.txt', 'w') as out:
                        out.write(content)
                    break
        except Exception as e:
            pass
