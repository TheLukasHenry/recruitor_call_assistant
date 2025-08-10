#!/bin/bash

# macOS notification hook for Claude Code
# Sends native macOS notifications when Claude needs attention

set -e

TITLE="${1:-Claude Code}"
MESSAGE="${2:-Task completed and needs your attention}"
SOUND="${3:-Glass}"  # Glass, Ping, Pop, Bottle, etc.

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  macOS notifications only work on macOS"
    exit 0
fi

# Send notification using osascript
osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" sound name \"$SOUND\""

echo "📱 Notification sent: $TITLE - $MESSAGE"

# Optional: Also show a brief banner in terminal
echo ""
echo "🔔 ====================================="
echo "   $TITLE"
echo "   $MESSAGE"
echo "===================================== 🔔"
echo ""

exit 0