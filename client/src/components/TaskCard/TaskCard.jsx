import React, { useState } from 'react';
import './TaskCard.css';

/**
 * Format timestamp into human-readable date (e.g., Aug 14, 2026).
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function TaskCard({
  task,
  columns = [],
  onEdit,
  onDelete,
  onMove,
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMoveChange = (e) => {
    const targetColId = Number(e.target.value);
    if (targetColId && targetColId !== task.column_id) {
      onMove(task.id, targetColId);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );
    if (confirmed) {
      onDelete(task.id);
    }
  };

  const handleDragStart = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        taskId: task.id,
        sourceColumnId: task.column_id,
      })
    );
    e.dataTransfer.setData('text/plain', String(task.id));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const priorityLower = (task.priority || 'Medium').toLowerCase();

  return (
    <article
      className={`task-card task-card--priority-${priorityLower} ${isDragging ? 'is-dragging' : ''}`}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-grabbed={isDragging}
    >
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
        <span className={`task-card__priority-badge task-card__priority-badge--${priorityLower}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <span className="task-card__date">
          Created: {formatDate(task.created_at)}
        </span>

        <div className="task-card__actions">
          <button
            type="button"
            className="task-card__btn task-card__btn--edit"
            onClick={() => onEdit(task)}
            disabled={disabled}
            aria-label={`Edit task: ${task.title}`}
          >
            Edit
          </button>

          <button
            type="button"
            className="task-card__btn task-card__btn--delete"
            onClick={handleDelete}
            disabled={disabled}
            aria-label={`Delete task: ${task.title}`}
          >
            Delete
          </button>

          <div className="task-card__move-wrapper">
            <label htmlFor={`move-task-${task.id}`} className="task-card__move-label">
              Move to:
            </label>
            <select
              id={`move-task-${task.id}`}
              className="task-card__move-select"
              value={task.column_id}
              onChange={handleMoveChange}
              disabled={disabled}
              aria-label={`Move task: ${task.title}`}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="task-card__drag-hint" aria-hidden="true">
          <span className="task-card__drag-handle">⋮⋮</span> Drag card to move
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
