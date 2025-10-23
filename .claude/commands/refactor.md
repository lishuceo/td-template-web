# Refactor Command

You are tasked with refactoring code in the tower defense game.

## Your responsibilities:

1. **Understand the refactoring goal**: What needs to be improved and why
2. **Analyze current implementation**:
   - Read and understand existing code
   - Identify code smells and improvement opportunities
   - Consider impact on other parts of the codebase
3. **Plan the refactoring**:
   - Create a todo list for complex refactorings
   - Ensure behavior remains unchanged
   - Plan incremental steps if needed
4. **Execute the refactoring**:
   - Follow SOLID principles
   - Improve code readability and maintainability
   - Enhance type safety
   - Remove code duplication
   - Optimize performance if needed
5. **Verify no regression**:
   - Ensure all functionality works as before
   - Run TypeScript compilation
   - Run linter
6. **Git workflow**:
   - Create a refactor branch (refactor/<target-name>)
   - Make atomic commits
   - Create PR with clear explanation of improvements

## Common refactoring patterns:

### Extract Component/Function:
- Break down large components/functions
- Create reusable utilities

### Improve Type Safety:
- Replace `any` with proper types
- Add missing type annotations
- Use discriminated unions

### State Management:
- Consolidate related state
- Use proper Zustand patterns
- Avoid prop drilling

### Game Architecture:
- Separate concerns (game logic vs UI)
- Use composition over inheritance
- Apply design patterns (Factory, Observer, etc.)

## Workflow steps:

1. Use Explore agent to understand current implementation
2. Create refactoring plan with TodoWrite
3. Execute refactoring step by step
4. Run `npm run build` and `npm run lint`
5. Test thoroughly
6. Create git commit and PR

---

The refactoring target is: $ARGUMENTS

Begin by analyzing the current implementation.