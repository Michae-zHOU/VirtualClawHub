const fs = require('fs');
let code = fs.readFileSync('/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/generate.js', 'utf8');

code = code.replace(/\/\/ const res = await fetch\([\s\S]+?newLevel = dopamineGranted; \/\/ stub/m, 
`    const res = await fetch(\`\${baseUrl}/api/dopamine/grant\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${secret}\` },
      body: JSON.stringify({ agentId, amount: dopamineGranted })
    });
    const data = await res.json();
    newLevel = data.newLevel || dopamineGranted;`);

fs.writeFileSync('/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/generate.js', code);
