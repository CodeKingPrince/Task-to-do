import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as taskRepository from '../src/repositories/taskRepository.js';

describe('Task API Endpoints', () => {
  describe('POST /api/tasks (Validation)', () => {
    it('rejects creating a task with an empty string title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: '',
          description: 'This should fail due to empty title',
          priority: 'High',
          columnId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    it('rejects creating a task with a whitespace-only title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: '     ',
          description: 'This should fail due to whitespace title',
          priority: 'Medium',
          columnId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('rejects creating a task when title is missing/null/undefined', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          columnId: 1,
          priority: 'Low',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/tasks/:id/move (Task Movement)', () => {
    it('moves a task to another column and updates both API response and database', async () => {
      // 1. Create a dedicated test task in column 1 (To Do)
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Movement Integration Test Task',
          description: 'Testing column migration via PATCH /move',
          priority: 'Medium',
          columnId: 1,
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.data).toHaveProperty('id');
      const testTaskId = createResponse.body.data.id;
      expect(createResponse.body.data.column_id).toBe(1);

      // Verify initial column state in database directly
      const initialDbTask = taskRepository.getTaskById(testTaskId);
      expect(initialDbTask).toBeDefined();
      expect(initialDbTask.column_id).toBe(1);

      try {
        // 2. Send PATCH request to move task to column 3 (Done)
        const moveResponse = await request(app)
          .patch(`/api/tasks/${testTaskId}/move`)
          .send({
            columnId: 3,
          });

        // 3. Verify HTTP response
        expect(moveResponse.status).toBe(200);
        expect(moveResponse.body).toHaveProperty('success', true);
        expect(moveResponse.body.data).toHaveProperty('column_id', 3);

        // 4. Verify actual database record changed
        const updatedDbTask = taskRepository.getTaskById(testTaskId);
        expect(updatedDbTask).toBeDefined();
        expect(updatedDbTask.column_id).toBe(3);
      } finally {
        // 5. Clean up created test task to preserve pristine database state
        await request(app).delete(`/api/tasks/${testTaskId}`);
      }
    });
  });
});
