#!/usr/bin/env node
'use strict';

const fs = require('fs');
const csso = require('csso');
const uglify = require('uglify-js');

const { index } = require('./index');

const mode = process.argv.slice(2)[0];
const dev = (mode === 'dev');

buildMain().catch(console.error);

async function buildMain() {
    
    // index.html
    index();
    
    // css
    try { fs.mkdirSync('dist/front/css'); } catch {}
    const css = await getCss();
    for (const basename in css) {
        fs.writeFileSync(`dist/front/css/${basename}.css`, css[basename]);
    }

    // js
    try { fs.mkdirSync('dist/front/js'); } catch {}
    const js = await getJs();
    for (const basename in js) {
        fs.writeFileSync(`dist/front/js/${basename}.js`, js[basename]);
    }
    
    // other
    for (const dir of fs.readdirSync('src/front')) {
        if (!['index.html', 'css', 'js'].includes(dir)) {
            const pathTo = `dist/front/${dir}`;
            try { fs.mkdirSync(pathTo); } catch {}
            copy(`src/front/${dir}`, pathTo);
        }
    }
}

async function getCss() {
    const path = './src/front/css';
    const cb = async (pathFile) => {
        let css = fs.readFileSync(pathFile).toString();

        // minify
        if (!dev) css = csso.minify(css).css;

        return css;
    }
    return get(path, cb);
}

function getJs() {
    const path = './src/front/js';
    const cb = (pathFile) => {
        let js = fs.readFileSync(pathFile).toString();

        // minify
        if (!dev) js = uglify.minify(js).code; 
        return js;
    }
    return get(path, cb);
}

async function get(path, cb, filter) {
    let files = fs.readdirSync(path);
    if (filter) files = files.filter(filter);
    
    const out = {};
    for (const filename of files) {
        const baseName = getBaseName(filename);
        out[baseName] = await cb(`${path}/${filename}`);
    }
    return out;
}

function getBaseName(filename) {
    const parts = filename.split('.'); 
    return parts.slice(0, parts.length - 1).join('.');
}

function copy(pathFrom, pathTo) {
    for (const file of fs.readdirSync(pathFrom)) {
        const pathFile = `${pathFrom}/${file}`;
        if (fs.statSync(pathFile).isFile()) {  
            fs.copyFileSync(pathFile, `${pathTo}/${file}`);
        } else {
            const pathFromSub = `${pathFrom}/${file}`;
            const pathToSub = `${pathTo}/${file}`;
            if (!fs.existsSync(pathToSub)) fs.mkdirSync(pathToSub);
            copy(pathFromSub, pathToSub);
        }
    }
}
