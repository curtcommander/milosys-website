#!/usr/bin/env node
'use strict';

const fs = require('fs');
const htmlMinifier = require('html-minifier');

const opts = {
    removeComments: true,
    collapseWhitespace: true
};

function index() {
    const htmlString = fs.readFileSync('src/front/index.html').toString();
    const htmlStringMin = htmlMinifier.minify(htmlString, opts);
    fs.writeFileSync(`${process.env.PATH_BUILD_OUT_FRONT}/index.html`, htmlStringMin);
}

module.exports = { index };
