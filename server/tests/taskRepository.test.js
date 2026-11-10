import { describe, it, expect } from 'vitest';
import * as taskRepository from '../src/repositories/taskRepository.js';

describe('taskRepository (Database Query Layer)', () => {
  it('returns correct task counts per column for known seeded board', () => {
    const boardId = 1;
    const result = taskRepository.countTasksPerColumn(boardId);

    // Verify all 3 columns are present
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    // Verify columns structure and expected task counts from seed data
    const todoColumn = result.find((col) => col.column_name === 'To Do');
    const inProgressColumn = result.find((col) => col.column_name === 'In Progress');
    const doneColumn = result.find((col) => col.column_name === 'Done');

    expect(todoColumn).toBeDefined();
    expect(todoColumn).toHaveProperty('column_id');
    expect(todoColumn).toHaveProperty('column_name', 'To Do');
    expect(todoColumn).toHaveProperty('task_count', 3);

    expect(inProgressColumn).toBeDefined();
    expect(inProgressColumn).toHaveProperty('column_id');
    expect(inProgressColumn).toHaveProperty('column_name', 'In Progress');
    expect(inProgressColumn).toHaveProperty('task_count', 2);

    expect(doneColumn).toBeDefined();
    expect(doneColumn).toHaveProperty('column_id');
    expect(doneColumn).toHaveProperty('column_name', 'Done');
    expect(doneColumn).toHaveProperty('task_count', 2);
  });

  it('filters tasks by priority with newest-first ordering', () => {
    const priority = 'High';
    const highTasks = taskRepository.getTasksByPriority(priority);

    expect(Array.isArray(highTasks)).toBe(true);
    expect(highTasks.length).toBe(3);

    // Verify all returned tasks have the requested priority
    for (const task of highTasks) {
      expect(task.priority).toBe('High');
      expect(task).toHaveProperty('column_name');
      expect(task).toHaveProperty('title');
    }

    // Verify newest-first ordering (descending created_at)
    for (let i = 0; i < highTasks.length - 1; i++) {
      const currentTime = new Date(highTasks[i].created_at).getTime();
      const nextTime = new Date(highTasks[i + 1].created_at).getTime();
      expect(currentTime).toBeGreaterThanOrEqual(nextTime);
    }
  });
});
