const fs = require('fs');
const path = require('path');

function generateTree(dirPath, prefix = '') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(item => !['node_modules', '.git'].includes(item.name));

  const lastIndex = items.length - 1;
  let tree = '';

  items.forEach((item, index) => {
    const isLast = index === lastIndex;
    const pointer = isLast ? '└── ' : '├── ';

    // Ícone: 📦 para pasta, 📄 para arquivo
    const icon = item.isDirectory() ? '📦 ' : '📄 ';

    tree += `${prefix}${pointer}${icon}${item.name}\n`;

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree += generateTree(path.join(dirPath, item.name), newPrefix);
    }
  });

  return tree;
}

// Começa da raiz do projeto
const tree = `${path.basename(process.cwd())}/\n` + generateTree(process.cwd());
fs.writeFileSync('arvore_projeto_com_icons.txt', tree);
console.log('🌳 Árvore com ícones gerada em arvore_projeto_com_icons.txt');

//para gerar a estrutura do projeto automaticamente
//node src/doc/generate-tree.js