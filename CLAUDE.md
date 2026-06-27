@AGENTS.md

# Git Workflow

- Always commit changes to the `dev` branch and push to `origin/dev`.
- NEVER commit directly to `main`.
- When the user says "publica", "publish", "merge" or similar, merge `dev` into `main` and push:
  `git checkout main && git merge dev && git push origin main && git checkout dev`
- The Vercel preview URL for `dev` lets the user review before publishing to production.
