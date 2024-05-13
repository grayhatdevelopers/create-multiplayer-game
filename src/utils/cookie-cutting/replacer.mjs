import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, search, replace) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = content.replace(search, replace);
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

export function replaceInDirectory(directoryPath, search, replace) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    // Ignore .git folder
    if (file === '.git') {
      return;
    }

    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceInDirectory(filePath, search, replace);
    } else if (stat.isFile()) {
      replaceInFile(filePath, search, replace);
    }
  });
}
