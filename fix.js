const fs = require('fs');
let code = fs.readFileSync('/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/generate.js', 'utf8');
code = code.replace(/\$\{item\./g, '\\${item.');
code = code.replace(/\$\{store\./g, '\\${store.');
// Wait, store needs to be evaluated! So I should only escape item.
fs.writeFileSync('/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/generate.js', code);
