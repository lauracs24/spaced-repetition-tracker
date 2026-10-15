# Testing

## Five users and no initial selection

Refreshed the page and checked that no user was selected.
Checked that the dropdown contains exactly five users.

## Empty initial agendas

Opened the website in an Incognito window and selected each of the
five users. Every user displayed:
"No revision dates saved for this user."

## Loading the selected user's agenda

Added topics for different users and switched between them.
Each user displayed only their own saved revisions.

## Empty-agenda message

Selected a user with no saved topics and checked that the page displayed:
"No revision dates saved for this user."

## Topic form

Checked that the form contains a labelled topic input, a built-in
date picker and a submit button. The form remained available after
adding a topic.

## Default date

Refreshed the page and checked that the date picker defaulted to today.

## Form validation

Tried submitting an empty topic, a topic containing only spaces,
and a missing date. Each attempt was rejected without adding revisions.

## Revision-date calculations

Unit tests in `common.test.mjs`.

The tests check all five revision intervals, spring and autumn
daylight-saving boundaries, shorter months and leap years.

Also added "Functions in JS" with a study date of 19 July 2027.
The agenda displayed:

- 26 July 2027
- 19 August 2027
- 19 October 2027
- 19 January 2028
- 19 July 2028

All dates matched the rubric.

## Updated agenda after submission

Added a topic and checked that its revision entries appeared immediately,
without refreshing the page.

## Chronological order

For User 2, added "Variables in Python" dated 5 November 2027,
then "Functions in Python" dated 5 October 2027.

All ten revisions appeared in the chronological order specified
in the rubric, even though the later study date was entered first.

## Past revisions hidden

For User 3, added "Codewars" dated 14 September 2026.

On 14 October 2026, the agenda displayed:

- 14 October 2026
- 14 December 2026
- 14 March 2027
- 14 September 2027

The revision dated 21 September 2026 was hidden because it was
in the past. The revision due that day remained visible.

## Persistence across page loads

Added revisions, refreshed the page and selected the same user again.
Their saved revisions were still displayed.

## Keyboard access

Used the keyboard to select a user, enter a topic and submit the form.
The topic was saved and five correct revision dates appeared.

## Accessibility

Ran Lighthouse in Snapshot mode with Desktop selected for:

- No user selected
- A user with an empty agenda
- A user with saved revisions

All automated accessibility checks passed in each view.

## Unit-test command

Ran `npm i && npm test`. All five tests passed.

The tests import calculateRevisionDates from common.mjs.
The website imports and uses that same function.

## No dead or unused code

Reviewed script.mjs and common.mjs. All functions are used.
Removed the original getUserIds sample and its test.
Removed duplicate date functions from script.mjs.
No commented-out code remains in these files.

The supplied storage.mjs was kept unchanged, including its
development helper clearData.

## Indentation

Formatted the HTML and JavaScript files using VS Code's
Format Document command.

## Project repository

Still to verify: the project is in its own repository, contains no
other projects, and is not a fork of CodeYourFuture/Checkpoint.

## Deployment

Still to verify: the website is publicly accessible and automatically
deploys changes merged into the deployment branch.

## Final submission

Still to complete: rerun the rubric checks on the deployed website,
confirm all tests pass, and record the final commit SHA for submission.
