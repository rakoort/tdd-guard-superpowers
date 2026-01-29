export const RULES = `## TDD Fundamentals — Superpowers Methodology

### The Iron Law

NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.

Code written before the test? The agent must delete it and start over. No exceptions:
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Delete means delete

### The TDD Cycle (Red-Green-Refactor)

1. **RED Phase**: Write ONE failing test that describes desired behavior
   - The test must fail for the RIGHT reason (not syntax/import errors)
   - Only one test at a time - this is critical for TDD discipline
   - **Adding a single test to a test file is ALWAYS allowed** - no prior test output needed
   - Starting TDD for a new feature is always valid, even if test output shows unrelated work

2. **GREEN Phase**: Write MINIMAL code to make the test pass
   - Implement only what's needed for the current failing test
   - No anticipatory coding or extra features
   - Address the specific failure message
   - Don't add features, refactor other code, or "improve" beyond the test

3. **REFACTOR Phase**: Improve code structure while keeping tests green
   - Only allowed when relevant tests are passing
   - Requires proof that tests have been run and are green
   - Applies to BOTH implementation and test code
   - No refactoring with failing tests - fix them first
   - Types, interfaces, constants replacing magic values are allowed
   - New behavior is NOT allowed during refactoring

### Core Violations

1. **Multiple Test Addition**
   - Adding more than one new test at once
   - Exception: Initial test file setup or extracting shared test utilities

2. **Over-Implementation**
   - Code that exceeds what's needed to pass the current failing test
   - Adding untested features, methods, or error handling
   - Implementing multiple methods when test only requires one

3. **Premature Implementation**
   - Adding implementation before a test exists and fails properly
   - Adding implementation without running the test first
   - Refactoring when tests haven't been run or are failing

4. **Code Before Test (Iron Law Violation)**
   - Writing any production code without a corresponding failing test
   - Keeping pre-written code as "reference" while writing tests
   - "Adapting" existing untested code rather than rewriting from tests

### Critical Principle: Incremental Development
Each step in TDD should address ONE specific issue:
- Test fails "not defined" → Create empty stub/class only
- Test fails "not a function" → Add method stub only
- Test fails with assertion → Implement minimal logic only

### Common Rationalizations to REJECT

These are NOT valid reasons to skip TDD:
- "Too simple to test" → Simple code breaks. Test takes 30 seconds.
- "I'll test after" → Tests passing immediately prove nothing.
- "Need to explore first" → Fine, but throw away exploration, start with TDD.
- "TDD will slow me down" → TDD is faster than debugging.
- "Just this once" → No exceptions without the human partner's permission.
- "Keep as reference" → You'll adapt it. That's testing after. Delete.
- "Tests after achieve the same goals" → Tests-after answer "what does this do?" Tests-first answer "what should this do?"

### Good Tests

- **Minimal**: One thing. "and" in the name? Split it.
- **Clear**: Name describes behavior, not implementation.
- **Real code**: No mocks unless unavoidable. Test what the code does, not what mocks do.

### General Information
- Sometimes test output shows no tests ran when a new test is failing due to a missing import or constructor. Allow simple stubs in this case.
- It is never allowed to introduce new logic without evidence of relevant failing tests. Stubs and simple implementation to make imports work is fine.
- In the refactor phase, refactoring both test and implementation code is fine. New functionality is not allowed.
- Adding types, interfaces, or constants to replace magic values is fine during refactoring.
- Provide the agent with helpful directions so they do not get stuck when blocking them.
`
