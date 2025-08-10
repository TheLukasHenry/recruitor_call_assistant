#!/bin/bash

# ESLint and Prettier hook for Claude Code
# Runs linting and auto-fixing after code changes

set -e

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
if [ -z "$PROJECT_DIR" ]; then
    PROJECT_DIR="$(pwd)"
fi

cd "$PROJECT_DIR"

echo "🔧 Running linting and formatting checks..."

# Check if we have package.json
if [ ! -f "package.json" ]; then
    echo "⚠️  No package.json found, skipping lint check"
    exit 0
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found, running pnpm install..."
    pnpm install
fi

# Check for and run available linters/formatters
FIXES_APPLIED=false

# ESLint check and fix
if command -v npx &> /dev/null && npx eslint --version &> /dev/null; then
    echo "🔍 Checking ESLint..."
    
    # Check if eslint config exists
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc.yaml" ] || [ -f "eslint.config.js" ]; then
        if npx eslint . --fix --ext .ts,.tsx,.js,.jsx 2>/dev/null; then
            echo "✅ ESLint passed"
        else
            echo "⚠️  ESLint found issues (attempted auto-fix)"
            FIXES_APPLIED=true
        fi
    else
        echo "⚠️  No ESLint config found"
    fi
else
    echo "ℹ️  ESLint not available"
fi

# Prettier check and fix
if command -v npx &> /dev/null && npx prettier --version &> /dev/null; then
    echo "🔍 Checking Prettier..."
    
    # Check if prettier config exists or if it's in package.json
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ] || grep -q "prettier" package.json; then
        if npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}" 2>/dev/null; then
            echo "✅ Prettier formatting applied"
            FIXES_APPLIED=true
        else
            echo "⚠️  Prettier encountered issues"
        fi
    else
        echo "ℹ️  No Prettier config found"
    fi
else
    echo "ℹ️  Prettier not available"
fi

# Check for common TypeScript/JavaScript issues
echo "🔍 Running basic code quality checks..."

# Check for console.log statements (except in specific files)
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "logger\|debug" | head -5; then
    echo "⚠️  Found console.log statements - consider using proper logging"
fi

# Check for TODO/FIXME comments
TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 0 ]; then
    echo "📝 Found $TODO_COUNT TODO/FIXME comments"
fi

if [ "$FIXES_APPLIED" = true ]; then
    echo "🔧 Auto-fixes were applied - you may want to review the changes"
    
    # Show git diff if in a git repo
    if [ -d ".git" ]; then
        echo "📋 Recent changes:"
        git diff --stat || true
    fi
else
    echo "✅ Code quality checks passed"
fi

echo "✨ Linting and formatting complete"
exit 0