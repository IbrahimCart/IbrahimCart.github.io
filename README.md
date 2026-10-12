# IbrahimCart.github.io

Course portfolio and projects for Ibrahim Cartan. Live at **https://ibrahimcart.github.io**.

## Updating the site

All content lives in **`projects.js`**. You never need to edit the HTML.

- **Release an artifact:** in `COURSES[0].artifacts`, set `status` to `"released"` and fill in `title`, `summary`, `tags`, `repo`, `demo` and `week`. The "x / 5 released" counter updates on its own.
- **Prompt log:** add entries to `LOG.md` each week.
- **New class next quarter:** add a new course block to the *top* of `COURSES`. The first course is featured in the header and hero, and older courses stay listed below it.
- **Personal projects:** add them to `PROJECTS`. An "Other Projects" section appears once there's at least one.

Commit the change and GitHub Pages redeploys within a minute or two.

## Files

- `projects.js`: **your content**
- `LOG.md`: AI prompt log
- `index.html`, `styles.css`, `main.js`: layout, styling and rendering
