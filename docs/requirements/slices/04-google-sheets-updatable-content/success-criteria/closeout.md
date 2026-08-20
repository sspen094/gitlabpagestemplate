# Success criteria — Slice 04 google-sheets-updatable-content

## SC-01 Text + card list + event sections driven from Sheets
- [ ] At least one text block, one card list, and one event/calendar section render from Google Sheets-linked data
- verify: component tests with published-feed fixtures for each of the three sections
- evidence: _(test results at closeout)_

## SC-02 Schemas + explicit mappings per updatable type
- [ ] Text Block, Card List, Event/Calendar, and Contact/Info have defined schemas and explicit page→section→sheet/range mappings
- verify: unit tests validating each schema; review of mapping config
- evidence: _(test results + mapping config at closeout)_

## SC-03 Graceful fallback on failure/malformed data
- [ ] Unreachable source or malformed rows produce a safe fallback; page renders without crashing
- verify: unit/component tests with failing fetch + malformed fixtures
- evidence: _(test results at closeout)_

## SC-04 Validation + sanitization of external content
- [ ] External content is validated to approved fields and sanitized/constrained before render (no raw HTML injection)
- verify: unit tests on sanitization + field allow-list
- evidence: _(test results at closeout)_

## SC-05 Non-blocking load + collection limits
- [ ] External content load does not block initial render; large collections are limited/paginated
- verify: component/perf smoke — initial paint without feed; limit/pagination test
- evidence: _(test results at closeout)_
