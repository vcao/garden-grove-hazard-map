#!/usr/bin/env bash
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use >/dev/null 2>&1 || nvm use 22.13.0 >/dev/null 2>&1
cd "$(dirname "$0")"
exec pnpm dev
