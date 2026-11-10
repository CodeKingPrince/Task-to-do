import React, { useState, useEffect } from 'react';
import { PRIORITIES } from '../../utils/constants.js';
import './TaskModal.css';

export function TaskModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  defaultColumnId = null,
  columns = [],
  onClose,
  onSubmit,
  loading = false,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [columnId, setColumnId] = useState(defaultColumnId || columns[0]?.id || 1);
  const [formError, setFormError] = useState('');

  // Sync form state with initialData or default values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setPriority(initialData.priority || 'Medium');
        setColumnId(initialData.column_id || defaultColumnId || columns[0]?.id || 1);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setColumnId(defaultColumnId || columns[0]?.id || 1);
      }
      setFormError('');
    }
  }, [isOpen, mode, initialData, defaultColumnId, columns]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      setFormError('Task title is required.');
      return;
    }

    setFormError('');

    try {
      const payload = {
        title: title.trim(),
        description: description ? description.trim() : null,
        priority,
      };

      if (mode === 'create') {
        payload.columnId = Number(columnId);
        await onSubmit(payload);
      } else {
        await onSubmit(initialData.id, payload);
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving the task.');
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="task-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="task-modal__header">
          <h3 id="task-modal-title" className="task-modal__title">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            type="button"
            className="task-modal__close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal__form">
          {formError && (
            <div className="task-modal__error" role="alert">
              {formError}
            </div>
          )}

          <div className="task-modal__field">
            <label htmlFor="task-title" className="task-modal__label">
              Title <span className="task-modal__required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="task-modal__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement user authentication"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="task-modal__field">
            <label htmlFor="task-description" className="task-modal__label">
              Description <span className="task-modal__optional">(optional)</span>
            </label>
            <textarea
              id="task-description"
              className="task-modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or notes..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="task-modal__row">
            <div className="task-modal__field task-modal__field--half">
              <label htmlFor="task-priority" className="task-modal__label">
                Priority
              </label>
              <select
                id="task-priority"
                className="task-modal__select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {!isEdit && (
              <div className="task-modal__field task-modal__field--half">
                <label htmlFor="task-column" className="task-modal__label">
                  Column
                </label>
                <select
                  id="task-column"
                  className="task-modal__select"
                  value={columnId}
                  onChange={(e) => setColumnId(Number(e.target.value))}
                  disabled={loading}
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="task-modal__actions">
            <button
              type="button"
              className="task-modal__btn task-modal__btn--cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="task-modal__btn task-modal__btn--submit"
              disabled={loading}
            >
              {loading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
