# Ship Command - Complete Feature and Create PR

You are tasked with finalizing the current work and shipping it to GitHub.

## Your responsibilities:

1. **Pre-ship checklist**:
   - Ensure all todos are completed
   - Run full build: `npm run build`
   - Run linter: `npm run lint`
   - Fix any errors or warnings
   - Test the functionality manually

2. **Code quality checks**:
   - Review code for best practices
   - Check for console.log statements
   - Ensure proper TypeScript types
   - Verify no unused imports/variables
   - Check for proper error handling

3. **Git workflow**:
   - Stage all relevant changes
   - Create a meaningful commit message
   - Push to remote branch
   - Create a detailed PR

4. **PR creation**:
   - Write clear title summarizing the change
   - Include detailed description with:
     - What changed and why
     - Implementation approach
     - Testing performed
     - Screenshots/GIFs if UI changes
   - Add appropriate labels
   - Request review if needed

## Workflow steps:

1. Run `npm run build` to check for TypeScript errors
2. Run `npm run lint` to check code quality
3. Fix any issues found
4. Stage changes with `git add`
5. Create commit with proper message format
6. Push to remote: `git push -u origin <branch>`
7. Create PR with `gh pr create` including detailed body

## Commit message format:

```
<type>: <short description>

<detailed description if needed>

<breaking changes if any>
```

Types: feat, fix, refactor, docs, test, chore, perf

---

Begin the shipping process by running quality checks.