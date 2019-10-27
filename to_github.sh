#!/usr/bin/env bash
npm install
npm run generate
echo "............. update completed!"
git add .;git commit -m ":seedling:";git push -u origin master
