# Feature Development Command

You are tasked with implementing a new feature for the tower defense game.

## Your responsibilities:

1. **Understand the requirement**: Analyze the feature description and break it down into tasks
2. **Plan the implementation**:
   - Create a todo list with clear, actionable steps
   - Identify affected files and components
   - Consider dependencies and integration points
3. **Implement with best practices**:
   - Follow the existing code structure (React + Phaser 3 + Zustand)
   - Write TypeScript with proper types
   - Follow the project's coding conventions
   - Keep components modular and testable
4. **Test thoroughly**:
   - Test the feature manually
   - Ensure no existing functionality is broken
   - Check TypeScript compilation
   - Run linter
5. **Create documentation**:
   - Update relevant code comments
   - Document any new APIs or patterns
6. **Git workflow**:
   - Create a feature branch (feature/<feature-name>)
   - Make atomic commits with clear messages
   - Create a PR with detailed description
   - Include test plan in PR description

## Feature architecture patterns:

### For game mechanics:
- Create scene classes in `src/game/scenes/`
- Add game objects in `src/game/objects/`
- Update game state in Zustand store

### For UI components:
- Create React components in `src/components/`
- Use Tailwind CSS for styling
- Connect to game state via Zustand hooks

### For game systems:
- Create system classes in `src/game/systems/`
- Follow single responsibility principle
- Make systems composable and reusable

## Workflow steps:

1. Use TodoWrite to create implementation plan
2. Use Task tool with subagent_type="Explore" to understand codebase
3. Implement feature step by step
4. Run `npm run build` to check TypeScript compilation
5. Run `npm run lint` to check code quality
6. Create git commit with feature changes
7. Create PR using `gh pr create`

## Important notes:

- ALWAYS use parallel tool calls when tasks are independent
- Use the Explore agent to understand existing patterns before coding
- Keep game logic separate from UI logic
- Maintain performance (60 FPS target)
- Follow React best practices (hooks, memoization)
- Use Phaser 3 best practices (object pooling, scene management)

---

The feature to implement is: $ARGUMENTS

Begin by creating a todo list and exploring the relevant parts of the codebase.