#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "First argument should be install path"
    exit 1
fi

if [ ! -d "$1" ]; then
    echo "Specified install path is not a directory"
    exit 1
fi

echo "Installing into $1"

cp index.html "$1/index.html"
cp script.js "$1/script.js"
cp -rf data "$1/data"
