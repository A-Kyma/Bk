#!/usr/bin/env node
/**
 * Script to compile .vue files to .js files for Meteor package publication
 * This allows .vue components to be used in the published package without Vite
 * 
 * Note: Run via build-vue.sh to handle npm install and node_modules cleanup
 */
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function getAllVueFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
      getAllVueFiles(filePath, fileList);
    } else if (file.endsWith('.vue')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function compileVueFile(filePath) {
  console.log(`Compiling ${relative(rootDir, filePath)}...`);
  
  const source = readFileSync(filePath, 'utf-8');
  const { descriptor } = parse(source, { filename: filePath });
  
  let output = '';

  // Compile script and normalize default export to _sfc_main
  if (descriptor.script || descriptor.scriptSetup) {
    const script = compileScript(descriptor, {
      id: filePath,
      inlineTemplate: false
    });
    let code = script.content + '\n';
    if (code.includes('export default')) {
      code = code.replace('export default', 'const _sfc_main =');
      code += '\nexport default _sfc_main;\n';
    }
    output += code;
  } else {
    output += 'const _sfc_main = {}\nexport default _sfc_main;\n';
  }
  
  // Compile template
  if (descriptor.template) {
    const template = compileTemplate({
      source: descriptor.template.content,
      filename: filePath,
      id: filePath,
      scoped: descriptor.styles.some(s => s.scoped),
      compilerOptions: {
        mode: 'module'
      }
    });
    
    // Replace render function export
    const renderCode = template.code.replace('export function render', 'function render');
    output += `\n${renderCode}\n_sfc_main.render = render;\n`;
  }
  
  // Note: styles are handled by Vite in development, ignored for now in compiled output
  
  // Write compiled .js file
  const outPath = filePath.replace('.vue', '.vue.js');
  // Ensure Vue runtime import is explicit to avoid missing index.js resolution in Meteor
  // Rewrite imports for vue runtime and js-yaml ESM to avoid resolution issues in Meteor
  // Normalize imports for Vue runtime and js-yaml ESM (handle both quote styles)
  // Also rewrite local component imports (.vue -> .vue.js), including relative paths like ../
  const fixed = output
    .replace(/from ["']vue["']/g, 'from "vue/dist/vue.runtime.esm-bundler.js"')
    .replace(/from ["']js-yaml["']/g, 'from "js-yaml/dist/js-yaml.mjs"')
    .replace(/from ["']((?:\.\.|\.)\/.+?)\.vue["']/g, 'from "$1.vue.js"');
  writeFileSync(outPath, fixed, 'utf-8');
  console.log(`  → ${relative(rootDir, outPath)}`);
}

// Main execution
console.log('Starting Vue SFC compilation...\n');

const clientDir = join(rootDir, 'client');
const vueFiles = getAllVueFiles(clientDir);

console.log(`Found ${vueFiles.length} .vue files\n`);

vueFiles.forEach(compileVueFile);

console.log(`\nCompilation complete! ${vueFiles.length} files compiled.`);
