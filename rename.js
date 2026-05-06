const fs = require('fs');
const path = require('path');

const replacements = [
  // Names
  { regex: /Smart-Boomerang/g, replacement: 'Jilola' },
  { regex: /smart-boomerang/gi, replacement: 'jilola' },
  { regex: /BoomerangIcon/g, replacement: 'JilolaIcon' },
  { regex: /boomerangRef/g, replacement: 'jilolaRef' },
  { regex: /BoomerangLoader/g, replacement: 'JilolaLoader' },
  
  // Concepts
  { regex: /Bumerang effekti/gi, replacement: 'Sayqallangan qaytim' },
  { regex: /'bumerang' kabi uchirib yuboriladi/gi, replacement: "platforma filtrlaridan o'tib, yangi jilo bilan qaytariladi" },
  { regex: /bumerang kabi/gi, replacement: "platforma filtrlaridan o'tib, yangi jilo bilan" },
  { regex: /Bumerang Lentasi/gi, replacement: "Jilola Lentasi" },
  { regex: /Bumerang Yo'nalishi/gi, replacement: "Jilola Yo'nalishi" },
  { regex: /Bumerangni Yuborish/gi, replacement: "Jilolashga yuborish" },
  { regex: /Tarmoqqa uzatildi/g, replacement: "Jilolash tarmog'iga uzatildi" },
  { regex: /Tarmoqda aylanmoqda/g, replacement: "Jilolanmoqda" },
  
  // General fallback
  { regex: /Bumerang/g, replacement: 'Jilola' },
  { regex: /bumerang/g, replacement: 'jilola' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
