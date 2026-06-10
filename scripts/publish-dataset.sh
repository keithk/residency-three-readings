#!/usr/bin/env bash
# Publish the dataset/ folder to the public dataset repos.
#
# Validates both layers (canonical TS sources, generated markdown), splits
# dataset/ into a synthetic branch, and pushes it to both dataset remotes
# (dataset-pub = keithk/three-readings-dataset, dataset-propel =
# propel-ai-org/beyond-average-dataset).
# Run with FORCE=1 to overwrite diverged public history:
#   FORCE=1 scripts/publish-dataset.sh
set -euo pipefail
cd "$(dirname "$0")/.."

bun run dataset:validate
bun dataset/scripts/validate.ts
bun test dataset/scorer/

git subtree split --prefix=dataset -b dataset-publish
trap 'git branch -D dataset-publish >/dev/null 2>&1 || true' EXIT

for remote in dataset-pub dataset-propel; do
  if [[ "${FORCE:-0}" == "1" ]]; then
    git push --force "$remote" dataset-publish:main
  else
    git push "$remote" dataset-publish:main || {
      echo ""
      echo "Push to $remote rejected (public history diverged)."
      echo "If you are sure the local dataset/ is canonical, rerun with FORCE=1."
      exit 1
    }
  fi
  echo "✓ published dataset/ to $remote/main"
done
