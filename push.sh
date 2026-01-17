#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Bitte eine Commit-Nachricht angeben."
  echo "Beispiel: ./push.sh \"Navigation aktualisieren\""
  exit 1
fi

git status
git add .
git commit -m "$1"
git push

