const fs = require('fs');
// read file using utf-16le because powershell out-file might write in utf16
let content = fs.readFileSync('swagger.js');
let text = content.toString('utf16le');
if (!text.includes('swaggerDoc')) {
  // try utf8
  text = content.toString('utf8');
}

const startIndex = text.indexOf('"swaggerDoc": {');
if (startIndex !== -1) {
  // Find the matching closing brace for swaggerDoc
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let endIndex = -1;
  const startObjIndex = text.indexOf('{', startIndex);
  
  for (let i = startObjIndex; i < text.length; i++) {
    const char = text[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') depth++;
      else if (char === '}') depth--;
      
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex !== -1) {
    const jsonStr = text.substring(startObjIndex, endIndex + 1);
    fs.writeFileSync('openapi.json', jsonStr);
    console.log('Successfully wrote openapi.json');
  } else {
    console.log('Failed to find end of JSON');
  }
} else {
  console.log('Could not find swaggerDoc');
}
