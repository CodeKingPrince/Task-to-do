import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard.jsx';
import './Column.css';

export function Column({
  column,
  tasks = [],
  columns = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  disabled = false,
  isFiltered = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    let dragData = null;
    try {
      const jsonStr = e.dataTransfer.getData('application/json');
      if (jsonStr) {
        dragData = JSON.parse(jsonStr);
      }
    } catch {
      // Fallback
    }

    const taskId = dragData
      ? Number(dragData.taskId)
      : Number(e.dataTransfer.getData('text/plain'));
    const sourceColumnId = dragData ? Number(dragData.sourceColumnId) : null;

    if (!taskId || isNaN(taskId)) return;

    // Prevent unnecessary API call if dropped into the same column
    if (sourceColumnId === column.id) {
      return;
    }

    onMoveTask(taskId, column.id);
  };

  return (
    <section
      className={`board-column ${isDragOver ? 'is-drag-over' : ''}`}
      aria-label={`Column: ${column.name}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="board-column__header">
        <h3 className="board-column__title">{column.name}</h3>
        <span className="board-column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </div>

      <div className="board-column__content">
        {tasks.length === 0 ? (
          <div className="board-column__empty">
            {isFiltered ? 'No tasks match this priority.' : 'No tasks yet'}
          </div>
        ) : (
          <div className="board-column__task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columns={columns}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>

      <div className="board-column__footer">
        <button
          type="button"
          className="board-column__add-btn"
          onClick={() => onAddTask(column.id)}
          disabled={disabled}
          aria-label={`Add task to ${column.name}`}
        >
          <span className="board-column__add-icon">+</span> Add Task
        </button>
      </div>
    </section>
  );
}

export default Column;
