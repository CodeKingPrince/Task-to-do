# TaskFlow

TaskFlow is a lightweight, responsive task management board designed for small teams. It provides an intuitive workflow across stages (To Do, In Progress, Done) with robust SQLite persistence, relational data integrity, parameterized queries, priority filtering, and dual task movement (native drag-and-drop and accessible dropdown controls).

---

## 🔗 Live Demo

- **Frontend Application (Vercel)**: [https://taskflow-by-gk.vercel.app](https://taskflow-by-gk.vercel.app)
- **Backend API (Render)**: [https://task-to-do-3yw8.onrender.com](https://task-to-do-3yw8.onrender.com)
- **GitHub Repository**: [https://github.com/CodeKingPrince/Task-to-do](https://github.com/CodeKingPrince/Task-to-do)

---

## Features

- **Kanban Board & Column Management**: Dynamically loads board metadata and columns defined in the relational database.
- **Task Lifecycle (CRUD)**:
  - **Create**: Add tasks with required titles, optional descriptions, and priority levels.
  - **Edit**: Modify title, description, and priority seamlessly via a modal.
  - **Delete**: Remove tasks with confirmation dialogs and immediate database synchronization.
  - **Move**: Reposition tasks across columns using **both native HTML5 drag-and-drop** and an **accessible dropdown selector**.
- **Priority Filtering**: Filter tasks by `Low`, `Medium`, `High`, or view `All`—filtering is executed directly via parameterized SQL queries with newest-first ordering (`created_at DESC`).
- **Strict Validation & Error Handling**: Rejection of empty/whitespace titles on both frontend and backend (`400 Bad Request`), column existence validation, and sanitized error responses.
- **Relational SQLite Persistence**: Foreign key constraints with cascading deletes and indexing on frequently queried columns.
- **Automated Backend Test Suite**: Comprehensive tests using Vitest and Supertest covering validation rules, task movement, and aggregation queries.

---

## Tech Stack

### Frontend (`client/`)
- **React 19** with Hooks (`useState`, `useEffect`, `useCallback`, custom `useBoard`)
- **Vite 8** for fast bundling and hot module replacement (HMR)
- **Axios** for centralized HTTP API requests
- **Vanilla CSS** with design tokens for a responsive, clean, uncluttered interface

### Backend (`server/`)
- **Node.js** & **Express 5** (ES Modules)
- **SQLite** with **`better-sqlite3`** (synchronous, high-performance driver)
- **Layered Architecture**: Route $\rightarrow$ Middleware $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ SQLite
- **Vitest** & **Supertest** for automated integration and database testing

---

## Architecture

```text
React + Vite
      ↓
Axios API Client
      ↓
Express Routes
      ↓
Middleware
      ↓
Controllers
      ↓
Services
      ↓
Repositories
      ↓
SQLite
```

---

## Project Structure

```text
taskflow/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board/           # Board container & responsive column grid
│   │   │   ├── Column/          # Column presentation & drop target logic
│   │   │   ├── TaskCard/        # Task item with drag handle, actions & dropdown
│   │   │   ├── TaskModal/       # Unified Create/Edit task modal
│   │   │   └── PriorityFilter/  # Segmented priority filter controls
│   │   ├── hooks/
│   │   │   └── useBoard.js      # Centralized board & task state hook
│   │   ├── pages/
│   │   │   └── BoardPage.jsx    # Main page layout & error banner
│   │   ├── services/
│   │   │   └── api.js           # Centralized Axios API client
│   │   ├── utils/
│   │   │   └── constants.js     # Shared frontend constants
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQLite connection, auto-init & foreign keys
│   │   ├── controllers/
│   │   │   ├── boardController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js  # Centralized error handler
│   │   │   └── validateTask.js  # Title, column, priority validation
│   │   ├── repositories/
│   │   │   ├── boardRepository.js # Parameterized SQL operations for boards/columns
│   │   │   └── taskRepository.js  # SQL CRUD, joins, and aggregations
│   │   ├── routes/
│   │   │   ├── boardRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   ├── boardService.js  # Business logic & board composition
│   │   │   └── taskService.js   # Business rules, existence checks & validation
│   │   ├── app.js               # Express application configuration & CORS
│   │   └── server.js            # Server entry point
│   ├── database/
│   │   ├── schema.sql           # SQLite DDL with tables, constraints & indexes
│   │   ├── seed.js              # Database seeding script
│   │   └── taskflow.db          # SQLite database file
│   ├── tests/
│   │   ├── task.test.js         # HTTP API integration tests (Supertest)
│   │   └── taskRepository.test.js # Direct database layer query tests
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Local Setup (Clean Clone)

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### 1. Clone the Repository
```bash
git clone https://github.com/golukumar2016/taskflow.git
cd taskflow
```

---

### 2. Backend Setup
```bash
cd server
npm install
```

#### Environment Configuration:
Copy the example environment file:
```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Linux/macOS:
cp .env.example .env
```

Contents of `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_PATH=./database/taskflow.db
```

#### Initialize & Seed Database:
```bash
npm run seed
```

#### Start Backend Server:
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

#### Environment Configuration:
Copy the example environment file:
```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Linux/macOS:
cp .env.example .env
```

Contents of `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Dev Server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## Running Automated Tests

Run the backend test suite (Vitest + Supertest):
```bash
cd server
npm test
```

To run in watch mode during development:
```bash
npm run test:watch
```

---

## API Endpoints

All endpoints return predictable JSON structures: `{ success: true, data: ... }` on success and `{ success: false, error: "..." }` on error.

| Method | Endpoint | Description | Request Body | Success Status |
|---|---|---|---|---|
| `GET` | `/api/health` | Server health check | None | `200 OK` |
| `GET` | `/api/boards/:id` | Fetch board & its ordered columns | None | `200 OK` |
| `GET` | `/api/tasks` | Fetch all tasks | None | `200 OK` |
| `GET` | `/api/tasks?priority=High` | Fetch tasks by priority (`Low`, `Medium`, `High`) ordered newest-first | None | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `{"title": "...", "description": "...", "priority": "High", "columnId": 1}` | `201 Created` |
| `PUT` | `/api/tasks/:id` | Update task title, description, priority | `{"title": "...", "description": "...", "priority": "Medium"}` | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | None | `200 OK` |
| `PATCH` | `/api/tasks/:id/move` | Move task to another column | `{"columnId": 2}` | `200 OK` |

---

## Database Design & Required SQL Queries

### Relational Schema
- **`boards`**: `id` (INTEGER PRIMARY KEY), `name` (TEXT), `created_at` (DATETIME).
- **`columns`**: `id` (INTEGER PRIMARY KEY), `board_id` (FOREIGN KEY REFERENCES boards(id) ON DELETE CASCADE), `name` (TEXT), `position` (INTEGER), `created_at` (DATETIME).
- **`tasks`**: `id` (INTEGER PRIMARY KEY), `column_id` (FOREIGN KEY REFERENCES columns(id) ON DELETE CASCADE), `title` (TEXT NOT NULL CHECK(length(trim(title)) > 0)), `description` (TEXT), `priority` (TEXT CHECK(priority IN ('Low', 'Medium', 'High'))), `created_at` (DATETIME).

### Required SQL Queries Implemented in Repository Layer

1. **Count of tasks per column on a board (includes empty columns)**:
   ```sql
   SELECT 
     c.id AS column_id,
     c.name AS column_name,
     c.position AS column_position,
     COUNT(t.id) AS task_count
   FROM columns c
   LEFT JOIN tasks t ON c.id = t.column_id
   WHERE c.board_id = ?
   GROUP BY c.id, c.name, c.position
   ORDER BY c.position ASC;
   ```

2. **Tasks filtered by priority with newest-first ordering**:
   ```sql
   SELECT 
     t.id,
     t.column_id,
     c.name AS column_name,
     t.title,
     t.description,
     t.priority,
     t.created_at
   FROM tasks t
   JOIN columns c ON t.column_id = c.id
   WHERE t.priority = ?
   ORDER BY t.created_at DESC;
   ```

---

## Architectural & Design Decisions

1. **Layered Separation of Concerns**:
   - **Route Layer**: Endpoint routing and middleware mapping.
   - **Middleware Layer**: Request validation and centralized error formatting.
   - **Controller Layer**: HTTP request extraction and JSON response dispatching.
   - **Service Layer**: Pure business logic, entity existence checks, and normalization.
   - **Repository Layer**: Parameterized SQL execution directly against SQLite via `better-sqlite3`.
2. **Dual Movement System**:
   - Native HTML5 drag-and-drop provides direct tactile manipulation.
   - The `<select>` dropdown selector was intentionally retained in each task card to ensure accessibility, keyboard navigability, and device compatibility.
3. **No Client-Side SQL Filtering**:
   - Queries for priority filtering and column counting are executed in SQLite, avoiding in-memory JavaScript filtering.
4. **Resilient Data State**:
   - Same-column drops are prevented from sending redundant network requests.
   - Deletions require explicit user confirmation.
   - Validation failures return structured client errors (`400 Bad Request`) without leaking server stack traces.

---

## Assumptions

- **Single Board Context**: The default installation focuses on Board 1 ("TaskFlow Main Board") while the schema and services support multi-board scalability.
- **Task Ordering**: Tasks within columns are ordered by insertion ID and priority queries by creation date descending.
- **Priority Domain**: Supported priority tiers are constrained to `Low`, `Medium`, and `High`.

---

## Potential Future Enhancements

- **Multi-Board Workspaces**: Switching between different team projects or sprints.
- **In-Column Task Reordering**: Persistent drag ordering with explicit position indices.
- **Search & Tagging**: Full-text searching across task titles and descriptions.
- **Activity Log & Audit History**: Tracking task movements and status updates over time.

---

## Submission Details

### Time Spent
- **Total Development Time**: Approximately 4.5 hours covering database architecture, repository & service layer implementation, REST API routing, automated Vitest/Supertest test suites, React component hierarchy, and dual task movement (drag-and-drop & dropdown).

### What I Learned & Found Interesting
- **High-Performance SQLite with `better-sqlite3`**: Exploring `better-sqlite3`'s synchronous query execution alongside `PRAGMA foreign_keys = ON` demonstrated how clean, parameterized raw SQL with `LEFT JOIN` and `COUNT` aggregations outperforms heavy ORM abstractions in simplicity, transparency, and execution speed.
- **Accessible Progressive Enhancement in Drag-and-Drop**: Implementing native HTML5 drag-and-drop while retaining the `<select>` dropdown selector highlighted the value of progressive enhancement—providing tactile desktop interactivity without compromising mobile or keyboard-only accessibility.

---

## Deployment Guide

### Backend Deployment (Render)
1. Create a **New Web Service** on Render connected to this repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add Environment Variables:
   - `PORT`: `10000` (or leave default assigned by Render)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://taskflow-by-gk.vercel.app`
   - `DATABASE_PATH`: `./database/taskflow.db`
6. Verify deployment by visiting `https://task-to-do-3yw8.onrender.com/api/health`.

### Frontend Deployment (Vercel)
1. Import the repository into Vercel.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://task-to-do-3yw8.onrender.com/api`
5. Deploy and verify that the live board communicates with the Render backend.
