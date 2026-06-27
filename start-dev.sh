#!/bin/bash
# Starta Jobbminne – fungerar med npm ELLER utan npm i PATH (Cursor-fallback)

set -e
cd "$(dirname "$0")"
PORT=3000

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Jobbminne – utvecklingsserver"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Projektmapp: $(pwd)"
echo ""

# Hitta Node
NODE=""
NPM=""
if command -v node >/dev/null 2>&1; then
  NODE="$(command -v node)"
fi
if command -v npm >/dev/null 2>&1; then
  NPM="$(command -v npm)"
fi

# Fallback: Cursor/standard Node-sökvägar
for candidate in \
  "$NODE" \
  "/opt/homebrew/bin/node" \
  "/usr/local/bin/node" \
  "$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -1)/bin/node" \
  "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node" \
  "/Volumes/Cursor Installer/Cursor.app/Contents/Resources/app/resources/helpers/node"
do
  if [[ -n "$candidate" && -x "$candidate" ]]; then
    NODE="$candidate"
    break
  fi
done

if [[ -z "$NODE" ]]; then
  echo "❌ Node.js saknas."
  echo "   Installera Node.js LTS från https://nodejs.org"
  echo "   Starta om terminalen efter installation."
  exit 1
fi

echo "  Node: $($NODE --version)"

if [[ -n "$NPM" ]]; then
  echo "  npm:  $($NPM --version)"
else
  echo "  npm:  saknas i PATH (använder node direkt)"
fi

# .env.local
if [[ -f ".env.local" ]]; then
  if grep -q "OPENAI_API_KEY=" .env.local 2>/dev/null; then
    echo "  AI:   OPENAI_API_KEY finns i .env.local"
  else
    echo "  AI:   .env.local finns (ingen OPENAI_API_KEY)"
  fi
else
  echo "  AI:   .env.local saknas (lokal fallback används)"
fi

# Installera om node_modules saknas
if [[ ! -d "node_modules" ]]; then
  echo ""
  echo "📦 Installerar paket..."
  if [[ -n "$NPM" ]]; then
    "$NPM" install
  else
    echo "❌ node_modules saknas och npm finns inte i PATH."
    echo "   Installera Node.js LTS från https://nodejs.org"
    exit 1
  fi
fi

# IP för iPhone
LOCAL_IP=""
for iface in en0 en1; do
  ip=$(ipconfig getifaddr "$iface" 2>/dev/null)
  if [[ -n "$ip" ]]; then
    LOCAL_IP="$ip"
    break
  fi
done

echo ""
echo "  💻 På datorn:  http://localhost:${PORT}"
if [[ -n "$LOCAL_IP" ]]; then
  echo "  📱 På iPhone:   http://${LOCAL_IP}:${PORT}  (samma WiFi)"
  echo "  Tips: Safari → Dela → Lägg till på hemskärmen"
fi
echo ""

# Port upptagen?
EXISTING_PID=$(lsof -ti :"$PORT" 2>/dev/null | head -1)
if [[ -n "$EXISTING_PID" ]]; then
  echo "⚠️  Port ${PORT} används redan – servern kör troligen redan."
  [[ -n "$LOCAL_IP" ]] && echo "   📱 http://${LOCAL_IP}:${PORT}"
  echo "   💻 http://localhost:${PORT}"
  echo ""
  echo "   Stoppa med Ctrl+C i andra terminalen, eller: kill ${EXISTING_PID}"
  exit 1
fi

echo "  Tryck Ctrl+C för att stoppa."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [[ -n "$NPM" ]]; then
  "$NPM" run dev -- -H 0.0.0.0 -p "$PORT"
else
  "$NODE" "$(pwd)/node_modules/.bin/next" dev -H 0.0.0.0 -p "$PORT"
fi
