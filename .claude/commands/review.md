# Code Review Command

You are tasked with performing a thorough code review of the current changes.

## Review criteria:

### 1. Code Quality
- Readability and clarity
- Proper naming conventions
- Code organization and structure
- DRY principle (Don't Repeat Yourself)
- SOLID principles

### 2. TypeScript/JavaScript
- Proper type definitions
- No `any` types without justification
- Correct async/await usage
- Proper error handling
- Memory leak prevention

### 3. React Best Practices
- Proper hooks usage
- Component composition
- Performance optimizations (useMemo, useCallback)
- Prop types and interfaces
- State management patterns

### 4. Phaser 3 Best Practices
- Proper scene lifecycle management
- Resource cleanup (destroy methods)
- Event listener management
- Performance optimization (object pooling)
- Proper use of Phaser APIs

### 5. Security & Performance
- Input validation
- Potential XSS vulnerabilities
- Performance bottlenecks
- Bundle size impact
- Memory usage

### 6. Testing & Maintainability
- Code testability
- Edge case handling
- Error boundaries
- Logging and debugging support

## Review process:

1. **Get current changes**:
   - Run `git status` to see modified files
   - Run `git diff` to see changes

2. **Analyze each file**:
   - Read modified files
   - Check for issues in each category
   - Note improvements and concerns

3. **Check build & lint**:
   - Run `npm run build`
   - Run `npm run lint`

4. **Provide feedback**:
   - List all issues found by severity (Critical, Major, Minor)
   - Suggest specific improvements
   - Highlight good practices
   - Provide code examples for fixes

## Output format:

```
# Code Review Results

## Summary
[Brief overview of changes reviewed]

## Critical Issues
[Issues that must be fixed]

## Major Issues
[Important issues that should be fixed]

## Minor Issues
[Nice-to-have improvements]

## Suggestions
[General improvement suggestions]

## Positive Notes
[Good practices observed]

## Action Items
[Concrete steps to address issues]
```

---

Begin the code review by checking git status and diff.