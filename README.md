# Student ID Card Generator

A frontend-only React + Vite + Tailwind CSS app: fill in a form on the left,
see a school ID card render live on the right, using a fixed visual template
(dark navy header, diagonal green/white accents, black-bordered photo frame,
labeled details block, footer with school contact + principal signature).

No backend, no database, no auth — everything lives in local React state.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## About the default data

The template's proportions, colors, and layout are modeled on a real school
ID card design. The **pre-filled sample values** (name, father's name, DOB,
address, phone number, photo) are intentionally **fictional placeholders**,
not copied from any real student — the point of the app is that every one of
those fields is fully editable, so shipping made-up defaults doesn't change
what the app demonstrates. Swap in real data through the form as needed.

## Project structure

```
src/
  App.jsx                     – layout, state, reset logic
  components/
    StudentForm.jsx           – controlled form (student + school fields, photo upload)
    IDCard.jsx                – renders the fixed template with dynamic data
  data/
    dummyStudent.js           – default (fictional) state + placeholder avatar
  styles/
    student-id-card.css       – the fixed ID card template styling (diagonals, header, etc.)
  index.css                   – Tailwind directives + base body styling
```

## Notes on the template

- The card uses `aspect-ratio` + `%`/`vw`-based sizing internally so it scales
  proportionally at any width, from mobile up to desktop, without breaking
  its layout.
- Long names shrink via `vw`-relative font sizing and wrap with
  `word-break: break-word` rather than overflowing the card.
- The address row wraps naturally and won't overlap the footer since the
  details block and footer are independently positioned with percentage
  offsets, and the details block does not extend past the footer's `top`.
- Diagonal bands are pure CSS (rotated `div`s with a `::after` pseudo-element
  for the green segment) — no image assets required for the template itself.
- Logos are simple inline SVG placeholders; swap the `<svg>` blocks in
  `IDCard.jsx` for real `<img>` logos when available.

## Customizing further

- Edit `studentFields` / `schoolFields` in `StudentForm.jsx` to add or remove
  form inputs.
- Edit `detailRows` in `IDCard.jsx` to add/remove/reorder the labeled rows in
  the details block (labels stay fixed, only values are dynamic).
- Tweak `src/styles/student-id-card.css` to fine-tune spacing, colors, or the
  diagonal angles if you want an even closer visual match to a specific
  reference design.
