# Bug Fix Command

You are tasked with fixing a bug in the tower defense game.

## Your responsibilities:

1. **Understand the bug**: Analyze the bug description thoroughly
2. **Reproduce and investigate**:
   - Locate the problematic code
   - Understand the root cause
   - Check if it affects other areas
3. **Plan the fix**:
   - Create a todo list if the fix is complex
   - Consider side effects and edge cases
4. **Implement the fix**:
   - Make minimal, focused changes
   - Ensure fix doesn't break other functionality
   - Add defensive coding if needed
5. **Verify the fix**:
   - Test the specific bug scenario
   - Test related functionality
   - Run TypeScript compilation
   - Run linter
6. **Git workflow**:
   - Create a fix branch (fix/<bug-name>)
   - Commit with clear message describing the bug and fix
   - Create PR with bug reproduction steps and fix description

## Debugging strategy:

1. Use Grep to search for related code
2. Use Read to examine suspicious files
3. Use Task tool with Explore agent for complex issues
4. Check game state, event handlers, and lifecycle methods
5. Look for common issues:
   - State synchronization bugs
   - Memory leaks (event listeners, timers)
   - Race conditions
   - Type errors
   - Phaser lifecycle issues

## Workflow steps:

1. Search for the bug location using Grep/Glob
2. Read and analyze the problematic code
3. Implement the fix
4. Run `npm run build` and `npm run lint`
5. Create git commit
6. Create PR with detailed explanation

---

The bug to fix is: $ARGUMENTS

Begin by locating and understanding the problematic code.