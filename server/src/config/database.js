import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultDbPath = path.resolve(__dirname, '../../database/taskflow.db');
const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : defaultDbPath;

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

try {
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  // Auto-initialize schema if tables do not exist
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  // Auto-seed if database is fresh / has no boards
  const existingBoard = db.prepare('SELECT id FROM boards LIMIT 1').get();
  if (!existingBoard) {
    const seedTransaction = db.transaction(() => {
      const insertBoard = db.prepare(`
        INSERT INTO boards (name, created_at)
        VALUES (?, datetime('now', '-3 days'))
      `);
      const boardResult = insertBoard.run('TaskFlow Main Board');
      const boardId = boardResult.lastInsertRowid;

      const insertColumn = db.prepare(`
        INSERT INTO columns (board_id, name, position, created_at)
        VALUES (?, ?, ?, datetime('now', '-3 days'))
      `);

      const todoCol = insertColumn.run(boardId, 'To Do', 0);
      const inProgressCol = insertColumn.run(boardId, 'In Progress', 1);
      const doneCol = insertColumn.run(boardId, 'Done', 2);

      const todoId = todoCol.lastInsertRowid;
      const inProgressId = inProgressCol.lastInsertRowid;
      const doneId = doneCol.lastInsertRowid;

      const insertTask = db.prepare(`
        INSERT INTO tasks (column_id, title, description, priority, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

      const tasks = [
        {
          columnId: doneId,
          title: 'Initialize project repository and structure',
          description: 'Set up Vite frontend, Express backend, and folder structure.',
          priority: 'Low',
          rawTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: doneId,
          title: 'Design relational database schema',
          description: 'Create SQLite schema with boards, columns, tasks, foreign keys, and indexes.',
          priority: 'High',
          rawTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: inProgressId,
          title: 'Implement REST API endpoints',
          description: 'Build backend routes, controllers, and services for board and task CRUD.',
          priority: 'High',
          rawTime: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: inProgressId,
          title: 'Wire up React board UI with API',
          description: null,
          priority: 'Medium',
          rawTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: todoId,
          title: 'Implement drag-and-drop column sorting and task reordering',
          description: 'Allow moving cards between columns with immediate persistent state updates.',
          priority: 'Medium',
          rawTime: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: todoId,
          title: 'Add backend and database integration tests',
          description: 'Write tests verifying validation rules, foreign key constraints, and custom queries.',
          priority: 'High',
          rawTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: todoId,
          title: 'Update project README with local setup instructions',
          description: null,
          priority: 'Low',
          rawTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
      ];

      for (const t of tasks) {
        insertTask.run(t.columnId, t.title, t.description, t.priority, t.rawTime);
      }
    });

    seedTransaction();
  }
} catch (error) {
  console.error(`Failed to initialize SQLite database at "${dbPath}":`, error.message);
  throw error;
}

export { db };
export default db;
