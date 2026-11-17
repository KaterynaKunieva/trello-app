# Trello clone using React

A kanban-board for task tracking with the ability to add new task-lists and tasks.

## Features (All written from scratch)
- **Native HTML5 Drag-and-Drop** — Column and card reordering within and across lists.
- **Full CRUD Operations** — Seamless creation, editing, and deletion of boards, lists, and cards.
- - **Inline Editing & Form Validation** — Reusable edit-in-place fields with input validation and cancel-on-escape
support.
- **Optimistic UI Updates** — Instant state updates with automatic transactional rollback on API errors.
- **Frontend Position Calculation** — Smart reordering and index management handled entirely client-side.
- **Custom Markdown Parser** — In-house text formatter for bold, italic, code, and links (zero regex / external
libraries).

## Tech Stack

- TypeScript
- React
- Redux Toolkit
- Sass

## Run

1. `npm i` - install dependencies
2. `npm run start` - run application on url http://localhost:3000/
3. navigate to the board page http://localhost:3000/trello-app/#board
4. more commands in the file package.json

## Preview

Live demo: [Github Pages](https://katerynakunieva.github.io/trello-app/#/board)
