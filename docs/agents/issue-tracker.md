# Issue tracker: GitHub

Prismo planning, handoff regressions, and long-running decisions live in GitHub Issues for `ckken/shadcnagent`. Use the `gh` CLI from this checkout.

## Conventions

- Create: `gh issue create --title "..." --body "..."`.
- Read: `gh issue view <number> --comments`.
- List: `gh issue list --state open --json number,title,body,labels,comments,assignees,url`.
- Comment: `gh issue comment <number> --body "..."`.
- Label: `gh issue edit <number> --add-label "..."`.
- Close: `gh issue close <number> --comment "..."`.

Pull requests are not a request surface.

## Wayfinding operations

- A Map is one issue labelled `wayfinder:map`, containing Destination, Notes, Decisions so far, Not yet specified, and Out of scope.
- Each decision ticket is a child issue labelled exactly one of `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.
- Link children with GitHub sub-issues where available. If unavailable, add `Part of #<map>` to the child and list it in the Map task list.
- Represent blocking with GitHub native issue dependencies. If unavailable, use a `Blocked by: #<number>` line in the child body.
- A session claims an unblocked ticket by assigning itself before work. Resolve one decision ticket per session, except parallel research tickets.
- Resolution means: comment with the decision, close the ticket, then append a one-line linked pointer to the Map's Decisions so far.

## Scheduled handoff regressions

The `Prismo Handoff Audit` workflow may create or update only the open issue labelled `prismo:handoff-regression` when its verifier itself fails. It never changes code, commits, or deploys.
