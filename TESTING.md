# Testing

## Five users and no initial selection

Refreshed the page and checked that no user was selected.
Checked that the dropdown contains exactly five users.

## Empty initial agendas

Opened the website in a fresh Incognito session and selected each
of the five users. Every user displayed:
"No revision dates saved for this user."

## Loading the selected user's agenda

Added topics for different users and switched between them.
Each user displayed only their own saved revisions.

## Empty-agenda message

Selected a user with no saved topics and checked that the page displayed:
"No revision dates saved for this user."

## Topic form

Checked that the form contains a labelled topic input, a built-in
date picker and a submit button.

The form remained available after adding a topic.

## Default date

Refreshed the page and checked that the date picker defaulted to today.

## Form validation

Tried submitting an empty topic, a topic containing only spaces,
and a missing date.

Each attempt was rejected without adding revisions.

## Revision-date calculations

Unit tests in `common.test.mjs`.

The tests check:
- All five revision intervals
- Dates crossing the spring daylight-saving boundary
- Dates crossing the autumn daylight-saving boundary
- Shorter months
- Leap years

Also tested the published website by adding "Functions in JS"
for User 1 with a study date of 19 July 2027.

The agenda displayed:
- Functions in JS — 2027-07-26
- Functions in JS — 2027-08-19
- Functions in JS — 2027-10-19
- Functions in JS — 2028-01-19
- Functions in JS — 2028-07-19

All dates matched the rubric.

## Updated agenda after submission

Added a topic and checked that its revision entries appeared immediately,
without refreshing the page.

## Chronological order

On the published website, added these topics for User 2 in this order:
1. Variables in Python — study date 5 November 2027
2. Functions in Python — study date 5 October 2027

The agenda displayed:
- Functions in Python — 2027-10-12
- Functions in Python — 2027-11-05
- Variables in Python — 2027-11-12
- Variables in Python — 2027-12-05
- Functions in Python — 2028-01-05
- Variables in Python — 2028-02-05
- Functions in Python — 2028-04-05
- Variables in Python — 2028-05-05
- Functions in Python — 2028-10-05
- Variables in Python — 2028-11-05

All ten revisions appeared in the expected chronological order,
even though the later study date was entered first.

## Past revisions hidden

On 15 October 2026, tested the published website by adding "Codewars"
for User 3 with a study date of 15 September 2026.

The agenda displayed:
- Codewars — 2026-10-15
- Codewars — 2026-12-15
- Codewars — 2027-03-15
- Codewars — 2027-09-15

The revision dated 22 September 2026 was hidden because it was
in the past. The revision due that day remained visible.

## Persistence across page loads

Added revisions, refreshed the page and selected the same user again.
Their saved revisions were still displayed.

## Keyboard access

Used the keyboard to select a user, enter a topic and submit the form.
The topic was saved and five correct revision dates appeared.

## Accessibility

Ran Lighthouse in Snapshot mode with Desktop selected on the
published website for:
- No user selected
- A user with an empty agenda
- A user with saved revisions

All automated accessibility checks passed.
Two views passed 17/17 checks and one passed 18/18 checks.

## Unit-test command

Ran:

```bash
npm i && npm test
```

All five tests passed.

The tests import `calculateRevisionDates` from `common.mjs`.
The website imports and uses that same function.

## No dead or unused code

Reviewed `script.mjs` and `common.mjs`. All functions are used.
Removed the original `getUserIds` sample and its test.
Removed duplicate date functions from `script.mjs`.
No commented-out code remains in these files.

The supplied `storage.mjs` was kept unchanged, including its
development helper `clearData`, which the brief permits.

## Indentation

Formatted the HTML and JavaScript files using VS Code's
Format Document command.

## Project repository

The project is stored in its own repository:

https://github.com/lauracs24/spaced-repetition-tracker

The reviewed project folder contains the tracker source files,
tests, package files and documentation.

## Deployment

The published website is available at:

https://lauracs24.github.io/spaced-repetition-tracker/

GitHub Pages is configured to deploy from the `main` branch.
Changes merged into `main` trigger deployment automatically.

Confirmed that the published website loads and that all three
manual date scenarios produce the expected results.
