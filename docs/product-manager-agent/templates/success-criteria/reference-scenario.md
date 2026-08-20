# Reference scenario — RS-01

**Slice:** NN-kebab-name  
**Purpose:** Stable data and permissions for mockup alignment and regression demos.

## Scenario

_Describe the business state — e.g. "User `qa-lead` views assembly `9999AR-00-00` with three open travellers."_

## Data fixture

| Entity | Key values | Seed source |
|--------|------------|-------------|
| _…_ | _…_ | _SQL seed, CSV in input-files/, or env flag_ |

## Permission profile

| Profile | User / role | Expected UI differences |
|---------|-------------|-------------------------|
| _standard_ | _…_ | _full edit_ |
| _read-only_ | _…_ | _no Save; banner shown_ |

## Routes / entry points

- _/path or API endpoint_

Used by: mockup checklist SC-xx, Playwright smoke, manual `/v` review.
