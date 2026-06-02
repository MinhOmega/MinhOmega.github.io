import os, json, re

blog_dir = os.path.expanduser('~/Desktop/Web/MinhOmega.github.io/content/blogs')

for i in range(7):
    path = os.path.expanduser(f'~/Desktop/Web/MinhOmega.github.io/scripts/final-retry-{i}.json')
    with open(path) as f:
        blogs = json.load(f)
    
    for b in blogs:
        filepath = os.path.join(blog_dir, b['file'])
        with open(filepath) as fh:
            content = fh.read()
        
        m = re.search(r'^title:\s*["\'](.+?)["\']', content, re.MULTILINE)
        b['title'] = m.group(1) if m else b['file'].replace('.mdx','').replace('-',' ').title()
        m = re.search(r'^description:\s*["\'](.+?)["\']', content, re.MULTILINE)
        b['description'] = m.group(1) if m else ''
        m = re.search(r'^tags:\s*\[(.+?)\]', content, re.MULTILINE)
        if m:
            b['tags'] = [t.strip().strip('"').strip("'") for t in m.group(1).split(',')]
        else:
            b['tags'] = []
    
    with open(path, 'w') as f:
        json.dump(blogs, f, indent=2)
    print(f'Updated final-retry-{i}.json')
