import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(__dirname, 'taskflow.db');

const schemaPath = path.resolve(__dirname, 'schema.sql');

function seed() {
  let db;
  try {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    // 1. Initialize schema
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);

    // 2. Check if data is already seeded
    const existingBoard = db.prepare('SELECT id FROM boards LIMIT 1').get();
    if (existingBoard) {
      console.log('Seed data already present. Database seeding skipped.');
      return;
    }

    // 3. Execute seeding within a transaction
    const seedTransaction = db.transaction(() => {
      // Insert 1 Board
      const insertBoard = db.prepare(`
        INSERT INTO boards (name, created_at)
        VALUES (?, datetime('now', '-3 days'))
      `);
      const boardResult = insertBoard.run('TaskFlow Main Board');
      const boardId = boardResult.lastInsertRowid;

      // Insert 3 Columns
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

      // Insert realistic tasks with varied priorities, descriptions, and timestamps
      const insertTask = db.prepare(`
        INSERT INTO tasks (column_id, title, description, priority, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

      const tasks = [
        // Done Column
        {
          columnId: doneId,
          title: 'Initialize project repository and structure',
          description: 'Set up Vite frontend, Express backend, and folder structure.',
          priority: 'Low',
          createdAt: "datetime('now', '-3 days')",
          rawTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          columnId: doneId,
          title: 'Design relational database schema',
          description: 'Create SQLite schema with boards, columns, tasks, foreign keys, and indexes.',
          priority: 'High',
          rawTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },

        // In Progress Column
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
          description: null, // Null description to demonstrate optional field
          priority: 'Medium',
          rawTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },

        // To Do Column
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
          description: null, // Optional description left empty
          priority: 'Low',
          rawTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
      ];

      for (const t of tasks) {
        insertTask.run(t.columnId, t.title, t.description, t.priority, t.rawTime);
      }
    });

    seedTransaction();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exitCode = 1;
    throw error;
  } finally {
    if (db) {
      db.close();
    }
  }
}

seed();
