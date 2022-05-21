#!/bin/sh
mkdir -p data
echo Retrieving data from AKU
node translate-aku-site.js
echo Bundling data
node bundle-data.js