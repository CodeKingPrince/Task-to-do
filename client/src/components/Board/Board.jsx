import React from 'react';
import Column from '../Column/Column.jsx';
import './Board.css';

export function Board({
  columns = [],
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  disabled = false,
  isFiltered = false,
}) {
  return (
    <main className="taskflow-board" aria-label="Kanban Board">
      <div className="taskflow-board__grid">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.column_id === column.id);
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              columns={columns}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              disabled={disabled}
              isFiltered={isFiltered}
            />
          );
        })}
      </div>
    </main>
  );
}

export default Board;
