@echo off
if not exist data mkdir data
echo Retrieving data from AKU
node translate-aku-site.js
echo Bundling data
node bundle-data.js
echo Downloading preview images
node download-previews.js
