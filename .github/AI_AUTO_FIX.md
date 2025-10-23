# 🤖 AI Auto-Fix System

Automated issue detection and fixing system powered by Claude AI.

## Overview

This system automatically detects critical issues in code reviews and creates fixes without manual intervention.

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Create Pull Request
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  CI/CD & Code Review                        │
├─────────────────────────────────────────────────────────────┤
│  • Run CI tests                                             │
│  • Claude AI Code Review                                    │
│  • Analyze for critical issues                              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              No Issues          Critical Issues
                    │                   │
                    │                   ▼
                    │      ┌────────────────────────────┐
                    │      │  Auto-Create Issue         │
                    │      │  Label: auto-fix           │
                    │      └────────────────────────────┘
                    │                   │
                    │                   ▼
                    │      ┌────────────────────────────┐
                    │      │  AI Auto-Fix Workflow      │
                    │      │  • Analyze issue           │
                    │      │  • Generate fixes          │
                    │      │  • Create fix branch       │
                    │      │  • Apply fixes             │
                    │      │  • Create fix PR           │
                    │      └────────────────────────────┘
                    │                   │
                    │                   ▼
                    │      ┌────────────────────────────┐
                    │      │  Review Fix PR             │
                    │      │  • CI checks               │
                    │      │  • Code review             │
                    │      └────────────────────────────┘
                    │                   │
                    └───────────────────┘
                              │
                              ▼
                      Merge to main
```

## Components

### 1. Claude Code Review (`claude-review.yml`)

**Triggers**: Pull Request opened/updated

**Function**:
- Performs AI-powered code review
- Analyzes code quality, security, performance
- Detects critical issues using keywords
- Automatically creates Issues for critical problems

**Critical Issue Keywords**:
- `critical`
- `security vulnerability`
- `memory leak`
- `type error`
- `undefined`
- `null reference`
- `performance issue`
- `blocking`
- `must fix`

### 2. AI Auto-Fix Workflow (`ai-auto-fix.yml`)

**Triggers**: Issue with `auto-fix` label created/added

**Process**:

1. **Acknowledgment**
   - Posts comment: "AI Auto-Fix Agent Started"

2. **Context Extraction**
   - Extracts PR number, branch name, review findings
   - Parses issue body for relevant information

3. **AI Analysis**
   - Calls Claude API to analyze issues
   - Generates specific fix instructions
   - Categorizes by priority (critical/high/medium/low)

4. **Automated Fixes**
   - Checks out target branch
   - Creates fix branch: `auto-fix/issue-{number}`
   - Runs automated fix commands:
     - `npm run lint --fix`
     - `npm run build`
   - Applies AI-generated fixes

5. **PR Creation**
   - Commits all fixes
   - Pushes to remote
   - Creates Pull Request with detailed description
   - Links back to original issue
   - Adds `auto-fix` and `automated` labels

6. **Notification**
   - Comments on original issue with PR link
   - Updates status

### 3. Issue Template (`.github/ISSUE_TEMPLATE/auto-fix.yml`)

Structured template for auto-fix issues including:
- Problem description
- Context (PR, commit, files)
- Suggested fixes
- Severity level
- Category (code-quality, security, performance, etc.)

## Usage

### Automatic Usage (Recommended)

The system works automatically:

1. Create a PR
2. Claude reviews the code
3. If critical issues found → Issue created automatically
4. AI agent analyzes and fixes → New PR created
5. Review and merge the fix PR

### Manual Trigger

You can manually trigger auto-fix by:

1. Creating an issue with the `auto-fix` label
2. Or adding `auto-fix` label to an existing issue

**Issue Format**:
```markdown
## Problem Description
[Describe the issue]

## Context
- PR: #123
- Branch: `feature/my-feature`
- Files: src/components/Example.tsx

## Suggested Fix
[Optional suggestions]
```

### Manual Override

To prevent auto-fix:
1. Remove the `auto-fix` label from the issue
2. Fix manually and close the issue

## Configuration

### Required Secrets

- `ANTHROPIC_API_KEY`: Claude API key for AI analysis and fix generation

### Permissions

The workflows need:
```yaml
permissions:
  contents: write        # Create branches and commits
  pull-requests: write   # Create and update PRs
  issues: write          # Create and comment on issues
```

### Customization

#### Adjust Critical Keywords

Edit `.github/workflows/claude-review.yml`:

```javascript
const criticalKeywords = [
  'critical',
  'security vulnerability',
  // Add your keywords here
];
```

#### Customize Fix Commands

Edit `.github/workflows/ai-auto-fix.yml`:

```yaml
- name: Apply automated fixes
  run: |
    npm run lint --fix || true
    npm run build || true
    # Add your fix commands here
```

#### AI Model Configuration

Change the Claude model in workflows:

```javascript
model: 'claude-sonnet-4-20250514',  // Change model here
max_tokens: 8192,                   // Adjust token limit
```

## Examples

### Example 1: Type Error Auto-Fix

**PR Review finds**:
> ⚠️ Type error: Property 'foo' does not exist on type 'Bar'

**Auto-Fix Flow**:
1. Issue created: `[AUTO-FIX] Code review found critical issues in PR #123`
2. AI analyzes and suggests adding type definition
3. Fix PR created with TypeScript changes
4. CI passes → Merge

### Example 2: ESLint Violations

**PR Review finds**:
> 🔴 Critical: Multiple ESLint errors with 'any' types

**Auto-Fix Flow**:
1. Issue created automatically
2. AI runs `npm run lint --fix`
3. AI generates proper type definitions
4. Fix PR created
5. Review and merge

### Example 3: Security Vulnerability

**PR Review finds**:
> 🚨 Security vulnerability: Using eval() is dangerous

**Auto-Fix Flow**:
1. High-priority issue created
2. AI suggests safer alternative
3. Fix PR created with refactored code
4. Security team reviews
5. Merge after approval

## Monitoring

### Check Auto-Fix Status

1. **GitHub Issues**: Filter by `auto-fix` label
2. **GitHub Actions**: View workflow runs
3. **PR Labels**: Look for `automated` label

### Success Metrics

Track in GitHub Insights:
- Number of auto-fix issues created
- Success rate of auto-fix PRs
- Time to fix (from issue creation to PR merge)

## Troubleshooting

### Issue: No auto-fix issue created

**Possible causes**:
- Review didn't contain critical keywords
- ANTHROPIC_API_KEY not configured
- Claude Review workflow failed

**Solution**: Check workflow logs, verify API key

### Issue: Auto-fix workflow fails

**Possible causes**:
- Invalid branch name in issue
- Permission issues
- API rate limit exceeded

**Solution**:
1. Check issue format
2. Verify repository permissions
3. Check API quota

### Issue: Fix PR doesn't solve the problem

**Possible causes**:
- AI misunderstood the issue
- Complex problem requiring manual intervention

**Solution**:
1. Review the fix PR
2. Add comments for AI to refine
3. Or close and fix manually

## Best Practices

### For Developers

1. **Review auto-fix PRs carefully**: AI isn't perfect
2. **Provide clear error messages**: Helps AI understand issues
3. **Use descriptive PR titles**: Improves AI context
4. **Add manual fixes when needed**: Don't rely 100% on automation

### For Maintainers

1. **Monitor auto-fix success rate**: Adjust keywords if needed
2. **Review AI-generated fixes**: Ensure quality standards
3. **Update fix commands**: Keep automation scripts current
4. **Tune Claude prompts**: Improve fix quality over time

### For Teams

1. **Establish review process**: Who reviews auto-fix PRs?
2. **Set merge policies**: Auto-merge criteria
3. **Document patterns**: What issues auto-fix handles well
4. **Training**: Educate team on the system

## Limitations

### Current Limitations

1. **Simple fixes only**: Complex refactors need manual work
2. **Context-dependent**: AI needs clear issue descriptions
3. **No testing**: Auto-fix doesn't write tests (yet)
4. **Rate limits**: API calls are limited

### Future Enhancements

- [ ] Automatic test generation
- [ ] Multi-file refactoring
- [ ] Learning from merged fixes
- [ ] Integration with issue tracking
- [ ] Performance optimization suggestions
- [ ] Automatic documentation updates

## Safety Features

### Built-in Safeguards

1. **Human Review Required**: Auto-fix PRs need approval
2. **CI Checks**: All fixes go through standard CI
3. **Manual Override**: Can disable auto-fix anytime
4. **Audit Trail**: Full history in issues and PRs
5. **Rollback**: Easy to revert if needed

### Risk Mitigation

- Never auto-merge critical changes
- Require approval from code owners
- Test fixes in preview environments
- Monitor for regressions

## Support

### Getting Help

1. **Check logs**: GitHub Actions workflow logs
2. **Issue template**: Use provided template
3. **Documentation**: Read this guide
4. **Manual fix**: When in doubt, fix manually

### Reporting Issues

If the auto-fix system isn't working:

1. Create an issue with label `auto-fix-system`
2. Include:
   - Workflow run URL
   - Original issue link
   - Expected vs actual behavior
3. Tag maintainers

---

**Version**: 1.0.0
**Last Updated**: 2025-10-23
**Maintained By**: AI-Powered Development Team
