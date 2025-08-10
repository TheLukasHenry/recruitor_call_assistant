# Claude Code Hooks Configuration

This project uses Claude Code hooks to enhance the development workflow with automated checks, notifications, and quality assurance.

## 🔧 Configured Hooks

### PostToolUse Hooks
These hooks run after Claude Code performs various actions:

#### TypeScript Type Checking
- **Trigger**: After editing `.ts` or `.tsx` files
- **Script**: `.claude/hooks/check-typescript.sh`
- **Purpose**: Automatically runs `tsc --noEmit` to check for type errors
- **Features**:
  - Validates TypeScript types after code changes
  - Provides helpful error suggestions
  - Auto-installs dependencies if missing

#### Linting and Formatting
- **Trigger**: After editing any JavaScript/TypeScript files
- **Script**: `.claude/hooks/lint-and-fix.sh`
- **Purpose**: Runs ESLint and Prettier to maintain code quality
- **Features**:
  - Auto-fixes ESLint issues where possible
  - Applies Prettier formatting
  - Detects console.log statements and TODO comments
  - Shows git diff of changes


### UserPromptSubmit Hooks
These hooks run when you submit a prompt:

#### Project Context
- **Trigger**: On every prompt submission
- **Script**: `.claude/hooks/project-context.sh`
- **Purpose**: Provides Claude with current project context
- **Features**:
  - Git branch and status information
  - Package.json details
  - Project structure overview
  - Recently modified files
  - Environment status

### Completion Notification Hooks
These hooks notify you when Claude finishes tasks:

#### Task Completion Notifications
- **Trigger**: When subtasks or main tasks complete
- **Script**: `.claude/hooks/macos-notification.sh`
- **Purpose**: Sends native macOS notifications
- **Features**:
  - Different sounds for different completion types
  - Task completion alerts
  - Terminal banner notifications

## 🛠 Hook Scripts

### check-typescript.sh
```bash
# Features:
- Runs TypeScript compiler in check mode
- Suggests fixes for common errors
- Auto-installs dependencies if needed
- Provides clear error reporting
```

### lint-and-fix.sh
```bash
# Features:
- ESLint with auto-fix
- Prettier formatting
- Code quality checks
- Git diff reporting
```


### macos-notification.sh
```bash
# Features:
- Native macOS notifications
- Customizable sounds and messages
- Terminal banner display
- Cross-platform compatibility check
```

### project-context.sh
```bash
# Features:
- Git status and history
- Package information
- File structure overview
- Recent activity summary
```

## 🔒 Security Considerations

All hooks follow Claude Code security best practices:

- ✅ Use absolute paths and proper quoting
- ✅ Validate inputs and handle errors gracefully
- ✅ Use `$CLAUDE_PROJECT_DIR` for project-relative operations
- ✅ Implement reasonable timeouts and exit codes
- ✅ Avoid accessing sensitive system files
- ✅ Provide clear feedback and error messages

## 🎛 Customization

### Disabling Hooks
To temporarily disable hooks, you can:
1. Comment out hook configurations in `.claude/settings.local.json`
2. Make hook scripts non-executable: `chmod -x .claude/hooks/*.sh`
3. Modify matcher patterns to be more specific

### Adding New Hooks
1. Create a new script in `.claude/hooks/`
2. Make it executable: `chmod +x .claude/hooks/your-hook.sh`
3. Add configuration to `.claude/settings.local.json`

### Hook Matchers
- `*` - Matches all tool uses
- `Edit(**/*.ts)` - Matches editing TypeScript files
- `Bash(npm install:*)` - Matches npm install commands
- `Read(**/*.json)` - Matches reading JSON files

## 📋 Troubleshooting

### Hook Not Running
1. Check script permissions: `ls -la .claude/hooks/`
2. Verify JSON syntax in settings.local.json
3. Check script paths are correct
4. Review matcher patterns

### Script Errors
1. Run scripts manually to debug: `.claude/hooks/script-name.sh`
2. Check error output in Claude Code
3. Verify dependencies (npm, git, etc.) are available
4. Ensure project structure is as expected

### Performance Issues
1. Disable heavy hooks temporarily
2. Optimize script execution
3. Use more specific matchers
4. Consider async execution where appropriate

## 🚀 Benefits

- **Immediate Feedback**: Get TypeScript errors and linting issues right away
- **Quality Assurance**: Automated code quality checks
- **Better Context**: Claude has more information about your project
- **Stay Informed**: Native notifications keep you updated on progress
- **Consistency**: Enforced code formatting and standards

The hooks system makes Claude Code development more efficient and maintainable!