<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

# Project Rules

## Lovable Integration

> IMPORTANT:
> This project is connected to Lovable.
> Avoid rewriting published git history — do not force push, rebase, amend, or squash commits that have already been pushed.
>
> Commits pushed to the connected branch sync back to Lovable and appear in the editor, so keep the branch in a working state.

## General

- Use TypeScript instead of JavaScript.
- Follow the existing project structure and conventions.
- Prefer simple and readable solutions over unnecessary complexity.
- Do not modify files that are unrelated to the requested task.

## React

- Use functional components.
- Use reusable components whenever possible.
- Keep components small and focused on a single responsibility.
- Avoid duplicating UI or business logic.

## Code Quality

- Use meaningful variable and function names.
- Avoid unnecessary comments.
- Handle errors explicitly.
- Do not introduce dependencies unless they are necessary.

## Styling

- Reuse the existing styling system and components.
- Do not introduce a new CSS framework.
- Maintain the existing visual design.
- Do not change colors, typography, spacing, or existing UI patterns unless explicitly requested.

## Before Making Changes

- First inspect the relevant files and understand how they are connected.
- Before making significant architectural changes, explain the proposed approach.
- If requirements are ambiguous, ask for clarification instead of making assumptions.
- Reuse existing components whenever possible instead of creating duplicates.

## Testing

- Run the relevant tests after making changes.
- If tests do not exist, verify the affected functionality manually when possible.
- After making changes, check that existing functionality has not been broken.

## Git

- Do not modify the main branch directly.
- Keep changes focused on the requested task.
- Do not create commits unless explicitly requested.
- Never rewrite published Git history.

<!-- LOVABLE:END -->
