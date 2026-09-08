#!/bin/sh
set -eu
rm -rf dist
mkdir -p dist
cp -R src/. dist/
(cd dist && zip -qr ../dist/game-of-life.zip . -x 'game-of-life.zip')
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('dist/manifest.json'));if(m.manifest_version!==3)throw Error('Manifest V3 required');for(const f of [...(m.content_scripts||[]).flatMap(x=>[...(x.js||[]),...(x.css||[])]),...Object.values(m.icons||{})])if(!fs.existsSync('dist/'+f))throw Error('Missing '+f);console.log('manifest and assets valid')"
