#!/bin/bash

# Project context hook for Claude Code
# Provides additional context about the project state

set -e

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
if [ -z "$PROJECT_DIR" ]; then
    PROJECT_DIR="$(pwd)"
fi

cd "$PROJECT_DIR"

echo "📊 Project Context Report"
echo "========================="

# Git status
if [ -d ".git" ]; then
    echo "📂 Git Status:"
    echo "  Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
    echo "  Status: $(git status --porcelain | wc -l | tr -d ' ') files changed"
    
    # Show recent commits
    echo "  Recent commits:"
    git log --oneline -3 2>/dev/null | sed 's/^/    /'
    echo ""
fi

# Package info
if [ -f "package.json" ]; then
    echo "📦 Package Info:"
    NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "unknown")
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
    echo "  Name: $NAME"
    echo "  Version: $VERSION"
    echo ""
fi

# Project structure
echo "📁 Project Structure:"
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | head -10 | sed 's/^/  /'
if [ $(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l) -gt 10 ]; then
    echo "  ... and more"
fi
echo ""

# Environment status
echo "🔧 Environment:"
if [ -f ".env.local" ]; then
    echo "  .env.local: exists"
    ENV_VARS=$(grep -c "^[A-Z]" .env.local 2>/dev/null || echo "0")
    echo "  Environment variables: $ENV_VARS"
else
    echo "  .env.local: missing"
fi

if [ -d "node_modules" ]; then
    echo "  node_modules: installed"
else
    echo "  node_modules: missing"
fi
echo ""

# Recent activity
echo "⏰ Recent Activity:"
if [ -d ".git" ]; then
    LAST_COMMIT=$(git log -1 --format="%ar" 2>/dev/null || echo "unknown")
    echo "  Last commit: $LAST_COMMIT"
fi

# File modification times
echo "  Recently modified files:"
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs ls -lt | head -5 | awk '{print "    " $9 " (" $6 " " $7 ")"}'

echo ""
echo "========================="

exit 0