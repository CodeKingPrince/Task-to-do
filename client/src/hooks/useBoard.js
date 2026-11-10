import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api.js';
import { PRIORITY_ALL } from '../utils/constants.js';

export function useBoard(boardId = 1) {
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(PRIORITY_ALL);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState(null);

  /**
   * Load board structure and tasks.
   */
  const loadBoard = useCallback(
    async (priority = selectedPriority) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch board structure (including its columns)
        const boardData = await api.getBoard(boardId);
        setBoard(boardData);
        setColumns(boardData.columns || []);

        // Fetch tasks (filtered by priority if selected)
        let taskData = [];
        if (priority === PRIORITY_ALL) {
          taskData = await api.getTasks();
        } else {
          taskData = await api.getTasksByPriority(priority);
        }
        setTasks(taskData || []);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          'Unable to load the board. Please try again.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [boardId, selectedPriority]
  );

  // Initial load
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  /**
   * Filter tasks by priority.
   */
  const filterTasks = async (priority) => {
    setSelectedPriority(priority);
    try {
      setLoading(true);
      setError(null);
      let taskData = [];
      if (priority === PRIORITY_ALL) {
        taskData = await api.getTasks();
      } else {
        taskData = await api.getTasksByPriority(priority);
      }
      setTasks(taskData || []);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to filter tasks. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new task.
   */
  const handleCreateTask = async (taskData) => {
    try {
      setActionLoading(true);
      setError(null);
      const created = await api.createTask(taskData);

      // If created task matches current filter, append to list
      if (
        selectedPriority === PRIORITY_ALL ||
        created.priority.toLowerCase() === selectedPriority.toLowerCase()
      ) {
        setTasks((prev) => [...prev, created]);
      }
      closeModal();
      return created;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to save the task. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Update an existing task.
   */
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setActionLoading(true);
      setError(null);
      const updated = await api.updateTask(taskId, taskData);

      // If updated task still matches current filter, update in state; else remove
      if (
        selectedPriority === PRIORITY_ALL ||
        updated.priority.toLowerCase() === selectedPriority.toLowerCase()
      ) {
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
      closeModal();
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to update the task. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete a task.
   */
  const handleDeleteTask = async (taskId) => {
    try {
      setActionLoading(true);
      setError(null);
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to delete the task. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Move a task to a different column.
   */
  const handleMoveTask = async (taskId, columnId) => {
    try {
      setActionLoading(true);
      setError(null);
      const moved = await api.moveTask(taskId, columnId);
      setTasks((prev) =>
        prev.map((t) => (t.id === moved.id ? moved : t))
      );
      return moved;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to move the task. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Open modal to create a new task in a specified column.
   */
  const openCreateModal = (colId = null) => {
    setModalMode('create');
    setEditingTask(null);
    setDefaultColumnId(colId || (columns[0]?.id ?? 1));
    setIsModalOpen(true);
  };

  /**
   * Open modal to edit an existing task.
   */
  const openEditModal = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setDefaultColumnId(task.column_id);
    setIsModalOpen(true);
  };

  /**
   * Close modal and reset modal state.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setDefaultColumnId(null);
  };

  return {
    board,
    columns,
    tasks,
    loading,
    actionLoading,
    error,
    selectedPriority,
    isModalOpen,
    modalMode,
    editingTask,
    defaultColumnId,
    loadBoard,
    filterTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    moveTask: handleMoveTask,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}

export default useBoard;
