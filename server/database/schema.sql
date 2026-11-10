-- ============================================================================
-- TaskFlow Database Schema (SQLite)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Table: boards
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: columns
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table: tasks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK(length(trim(title)) > 0),
    description TEXT,
    priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- ============================================================================
-- Required Assignment SQL Queries
-- ============================================================================

-- Required Query 1:
-- Count tasks per column for a specified board (includes columns with 0 tasks)
-- Parameter: :board_id
-- SELECT 
--     c.id AS column_id,
--     c.name AS column_name,
--     c.position AS column_position,
--     COUNT(t.id) AS task_count
-- FROM columns c
-- LEFT JOIN tasks t ON c.id = t.column_id
-- WHERE c.board_id = ?
-- GROUP BY c.id, c.name, c.position
-- ORDER BY c.position ASC;

-- Required Query 2:
-- Get tasks with a given priority, ordered newest first
-- Parameter: :priority
-- SELECT 
--     t.id,
--     t.column_id,
--     c.name AS column_name,
--     t.title,
--     t.description,
--     t.priority,
--     t.created_at
-- FROM tasks t
-- JOIN columns c ON t.column_id = c.id
-- WHERE t.priority = ?
-- ORDER BY t.created_at DESC;
