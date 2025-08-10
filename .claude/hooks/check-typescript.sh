#!/bin/bash

# TypeScript type checking hook for Claude Code
# Runs after editing TypeScript files to check for type errors

set -e

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
if [ -z "$PROJECT_DIR" ]; then
    PROJECT_DIR="$(pwd)"
fi

cd "$PROJECT_DIR"

echo "🔍 Running TypeScript type checking..."

# Check if tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️  No tsconfig.json found, skipping TypeScript check"
    exit 0
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found, running pnpm install..."
    pnpm install
fi

# Run TypeScript compiler in check mode
if npx tsc --noEmit --pretty 2>&1; then
    echo "✅ TypeScript types are valid"
    exit 0
else
    echo "❌ TypeScript type errors found"
    echo ""
    echo "💡 Suggesting fixes..."
    
    # Try to get specific error information
    ERRORS=$(npx tsc --noEmit --pretty 2>&1 || true)
    
    # Count errors
    ERROR_COUNT=$(echo "$ERRORS" | grep -c "error TS" || echo "0")
    
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo "Found $ERROR_COUNT TypeScript errors"
        echo "Run 'npx tsc --noEmit' for full error details"
        
        # For common errors, suggest fixes
        if echo "$ERRORS" | grep -q "Cannot find module"; then
            echo "💡 Try running: pnpm install"
        fi
        
        if echo "$ERRORS" | grep -q "implicitly has an 'any' type"; then
            echo "💡 Add explicit type annotations to resolve 'any' type errors"
        fi
        
        if echo "$ERRORS" | grep -q "is not assignable to"; then
            echo "💡 Check type compatibility and add proper type assertions"
        fi
    fi
    
    exit 1
fi