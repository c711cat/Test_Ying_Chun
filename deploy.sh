#!/usr/bin/env sh

# abort on errors
set -e

yarn build

cd dist

echo > .nojekyll

git init
git checkout -B main 
git add -A
git commit -m 'deploy'


git push -f http://github.com/c711cat/Test_Ying_Chun.git main:gh-pages

cd -