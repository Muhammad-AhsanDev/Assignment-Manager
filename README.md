# Assignment Manager

A small React app for keeping track of assignments. You add an assignment with a title, course, due date and priority, then edit it, mark it as done, search, filter and sort your list. Everything is saved in the browser, so your list is still there when you come back.

**Live demo:** https://your-site-name.netlify.app

![Assignment Manager screenshot](screenshots/app.png)

I built this as a React practice project. The goal was to get comfortable with state, effects, rendering lists and keeping data in sync, using a small app that is actually useful.

## Features

- Add an assignment with a title, course, due date and priority (Low, Medium or High)
- Basic validation: every field is required and the due date can't be in the past
- Edit an assignment in place, or delete it
- Mark an assignment as completed or pending
- Search by title or course
- Filter by All, Pending, Completed or Overdue (the Overdue button shows how many you have)
- Sort by due date (soonest or latest first) or by priority (high to low)
- Overdue assignments get a red label and a red shadow so they stand out
- Your list is saved in the browser with `localStorage`
- Works on phone-sized screens

## Tech stack

- React (function components and hooks)
- Vite
- Plain CSS, no UI library
- Google Fonts: Fredoka and Press Start 2P

## Running it locally

You need Node.js installed.

```bash
git clone https://github.com/your-username/Assignment-Manager.git
cd Assignment-Manager
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

Other commands:

```bash
npm run build     # creates the production build in /dist
npm run preview   # serves the production build locally
```

## Project structure

```
Assignment-Manager/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx      # all the logic and markup
│   ├── App.css      # all the styling
│   ├── index.css    # default Vite styles (overridden in App.css)
│   └── main.jsx     # entry point
├── index.html
├── package.json
└── vite.config.js
```

Almost everything lives in `App.jsx` and `App.css`. For an app this size I kept it in one component to keep the data flow easy to follow.

## How it works

### The data

Each assignment is a plain object:

```js
{
  id: "b1f0c7e2-...",   // generated with crypto.randomUUID()
  title: "Lab report",
  course: "Physics",
  priority: "High",     // Low, Medium or High
  completed: false,
  date: "2026-11-25"    // yyyy-mm-dd, the format a date input gives you
}
```

I use a unique `id` instead of the array position, so deleting, editing and toggling always target the right assignment even after the list is filtered or sorted.

### State

The main piece of state is `assignment`, the full list. Next to it there is one state value for each form field, plus `filter`, `searchTerm`, `sort` and `editid` (the id of the assignment currently being edited, or `null` when nothing is being edited). Because only one `editid` exists, only one edit panel can be open at a time.

Updates use the functional form, for example `setAssignment(previous => ...)`. That way each change is built on the latest list rather than on a stale copy.

### Saving to localStorage

When the app loads, it reads the `assignments` key from `localStorage` and falls back to an empty list if nothing is there. A `useEffect` that depends on `assignment` writes the list back every time it changes, so adding, editing, deleting and toggling are all saved automatically.

### Overdue logic

An assignment is overdue when it is not completed and its due date is before today. Today's date is created with `toLocaleDateString("en-CA")`, which gives a `yyyy-mm-dd` string in the user's local time zone. I used this instead of `toISOString()` because that one works in UTC and can show the wrong day depending on the time. Since both dates are in `yyyy-mm-dd` format, they can be compared directly as strings.

### Filter, search and sort

The list on screen is built in three steps, each one feeding the next:

1. `FilteredAssignments` applies the selected filter (all, pending, completed or overdue)
2. `searchedAssignments` keeps the ones whose title or course contains the search text (case-insensitive)
3. `sortedAssignments` sorts a copy of that result. With "Sort by..." selected the original order is kept. Priority sorting puts High first and uses the soonest due date to break ties.

None of these are stored in state. They are calculated from `assignment` on every render, so they can never get out of sync with the real list.

The search box and filter bar only show up once there is at least one assignment.

### Editing

Clicking Edit on a card sets `editid` and copies that assignment's values into the edit fields. The edit panel opens inside the card. Save Changes updates only the assignment with that id, and Cancel closes the panel without changing anything.

## Styling

The look is a 70s / arcade style: thick dark borders, hard offset shadows, a pixel font for headings and a warm orange, yellow and mint palette. A few things worth knowing if you read `App.css`:

- Colours, fonts and the max width are CSS variables defined in `:root`
- Each card uses CSS grid with named areas, so the title, chips and buttons stay in fixed positions
- Priority colours come from a `--accent` variable set by the `prio-low`, `prio-medium` and `prio-high` classes
- At 640px and below, the cards and filter bar switch to a stacked mobile layout
- Animations are turned off for people who have "reduce motion" enabled in their system settings

The red shadow on overdue cards uses the CSS `:has()` selector. It works in current versions of all major browsers. In an older browser that shadow is simply skipped, and the Overdue label still shows.

## Limitations and ideas

- Data is stored per browser. There are no accounts and nothing syncs between devices, and clearing the site data deletes the list.
- The add form validates its fields, but the edit form doesn't yet, so an empty title can be saved there.
- Validation messages use `alert()`. Inline messages would be nicer.
- `App.jsx` could be split into smaller components (form, toolbar, card).

## Deployment

The app is deployed on Netlify from this repository.

- Build command: `npm run build`
- Publish directory: `dist`

Every push to `main` triggers a new deploy.