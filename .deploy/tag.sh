#!/usr/bin/env bash

set -e

PKG="$1"

if [ ! -d "$PKG" ]; then
  echo "Invalid package name"
  exit
elif [ ! -f "$PKG/package.json" ]; then
  echo "Invalid package name"
  exit
fi

NAME="$(node -e 'process.stdout.write(require("./'"$PKG"'/package.json").name)')"

yarn workspace "$NAME" version --no-git-tag-version

VERSION="v$(node -e 'process.stdout.write(require("./'"$PKG"'/package.json").version)')"

git add "./$PKG/package.json"
git commit -m "chore: bump $NAME to $VERSION"

if [[ "$PKG" == "cli" ]]; then
  TAG="$VERSION"
else
  TAG="$NAME@$VERSION"
fi

echo "Creating tag: $TAG"

git tag -a "$TAG" -m "$VERSION"
git push --tags
git push
