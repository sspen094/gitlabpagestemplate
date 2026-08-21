# Update content with Google Sheets

For the person who keeps the site current. You need a browser and edit access to one spreadsheet. **You never touch code, and nothing needs to be deployed** — the site reads the spreadsheet each time a visitor loads the page.

Not every part of the site is editable this way. A developer decides which sections are sheet-driven; the rest is set in code. Ask your developer which sections are yours, or check the table in [§2](#2-which-tab-changes-which-section).

## 1. Open the right spreadsheet

Your site uses **one** spreadsheet. Each worksheet tab along the bottom feeds one section of one page.

The shipped sample site uses this [public, read-only placeholder spreadsheet](https://docs.google.com/spreadsheets/d/1wwsme35OY5Kdl8aeC7izcVHzGpLTjpVgJQBgqItYeNA/edit?usp=sharing). It is a demonstration only — you cannot edit it. Your developer will give you your own copy.

## 2. Which tab changes which section

| Tab | Page | Section |
|-----|------|---------|
| `demo-text` | Home | Community updates |
| `demo-cards` | About > Members | Sample member directory |
| `demo-calendar` | Events | Sample event calendar |
| `contact-info` | About > Contact | Get in touch |

**Do not rename a tab.** The site finds content by tab name, so a renamed tab means that section quietly goes back to its built-in placeholder text.

## 3. How a tab is laid out

Row 1 is a **header row** naming the columns. Every row below it is one item — one paragraph, one card, one event, or one contact line.

Columns are matched by header name, so the order does not matter. Type the names exactly as shown below, including capital letters.

**`demo-text` — paragraphs**

| Column | Required | Notes |
|--------|----------|-------|
| `text` | yes | One paragraph per row. Add a row to add a paragraph. |

**`demo-cards` — cards**

| Column | Required | Notes |
|--------|----------|-------|
| `title` | yes¹ | Card heading |
| `subtitle` | | Small line under the heading |
| `description` | | Body text |
| `link` | | Makes the heading clickable. A web address, an email address, or a phone number. |
| `imageUrl` | | Picture shown above the heading |
| `sortOrder` | | A whole number. Lower numbers appear first; blank rows go last. |

¹ A row with only a `description` still shows as a card.

**`demo-calendar` — events**

| Column | Required | Notes |
|--------|----------|-------|
| `title` | yes | |
| `date` | yes | `2026-09-01`, `9/1/2026`, or `Sep 1, 2026`. Slash dates read as **month/day**. |
| `time` | | Shown beside the date, e.g. `7:00 PM` |
| `location` | | |
| `description` | | |
| `link` | | More-information link |

**`contact-info` — contact lines**

| Column | Required | Notes |
|--------|----------|-------|
| `label` | yes | e.g. `Email`, `Phone`, `Office` |
| `value` | yes | The address, number, or text itself |
| `type` | | `email`, `phone`, `url`, or `plain`. Leave blank and the site works it out from the value. |

## 4. Make a change

1. Open the tab for the section you want to change.
2. Edit a cell, add a row at the bottom, or delete a row you no longer need.
3. Wait a few seconds — Google saves on its own.
4. Reload the page on the site. Google caches published data briefly, so give it up to a couple of minutes if the old text is still showing.

To reorder events, just change the dates — the site sorts them for you. To reorder cards, use the `sortOrder` column.

## 5. What happens if something is wrong

The site is deliberately forgiving: a bad row is skipped, never shown broken.

| If you… | Then… |
|---------|-------|
| Leave a required cell empty | That whole row is skipped. Other rows still show. |
| Add a column of your own | It is ignored. |
| Misspell a column name | That column is ignored, and rows needing it are skipped. |
| Type a date the site cannot read | That event is skipped. |
| Rename or delete a tab | The section reverts to its built-in placeholder text. |
| Paste formatting, links, or HTML | Formatting is stripped; only the plain text is used. Unsafe links are dropped. |
| Delete every row | The section reverts to its built-in placeholder text. |

So if a change does not appear, the usual cause is a missing required cell or a renamed column. Check row 1 first.

There is one cap to know about: very long lists are trimmed. Cards stop at 12, events at 25, paragraphs and contact lines at 20. Ask your developer to raise a limit if you need more.

## 6. Keep the sheet shareable

The site reads the spreadsheet as an anonymous visitor, so sharing must stay **Anyone with the link → Viewer**. If sharing is tightened, every sheet-driven section falls back to placeholder text.

Never put anything private in this spreadsheet. It is public to anyone who has the link.

## Related

- [Map a Google Sheets data source](google-sheets-source.md) — the developer side of this setup
- [Configure an updatable section](updatable-section.md) — making a new section editable
- [`configuration/google-sheets.md`](../configuration/google-sheets.md) — URL, gid, and env reference
