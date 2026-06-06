## Summary
After generating a plan, logged-in users auto-save to cloud; guests keep localStorage behavior.

## Acceptance criteria
- [ ] On generatePlan(), if authenticated, save to Supabase
- [ ] On app load, authenticated users restore latest saved inputs from cloud
- [ ] Merge strategy documented: cloud wins on login, offer import from localStorage once
- [ ] UX feedback: Saved to cloud / Sign in to sync
- [ ] Works on mobile

## Dependencies
- #7 Plan persistence API
- #9 Auth UI

## Estimate
2-3 days
