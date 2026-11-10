import React from 'react';
import useBoard from '../hooks/useBoard.js';
import Board from '../components/Board/Board.jsx';
import PriorityFilter from '../components/PriorityFilter/PriorityFilter.jsx';
import TaskModal from '../components/TaskModal/TaskModal.jsx';
import { PRIORITY_ALL } from '../utils/constants.js';

export function BoardPage() {
  const {
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
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useBoard(1);

  const isFiltered = selectedPriority !== PRIORITY_ALL;

  return (
    <div className="board-page">
      <header className="board-page__header">
        <div className="board-page__title-section">
          <h1 className="board-page__title">{board?.name || 'TaskFlow'}</h1>
          <p className="board-page__subtitle">
            Organize, prioritize, and manage tasks across workflow stages.
          </p>
        </div>

        <div className="board-page__toolbar">
          <button
            type="button"
            className="board-page__add-task-btn"
            onClick={() => openCreateModal()}
            disabled={loading || actionLoading}
          >
            + Add Task
          </button>

          <PriorityFilter
            selectedPriority={selectedPriority}
            onSelectPriority={filterTasks}
            disabled={loading || actionLoading}
          />
        </div>
      </header>

      {error && (
        <div className="board-page__error-banner" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="board-page__retry-btn"
            onClick={() => loadBoard()}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="board-page__loading" role="status">
          <div className="board-page__spinner" aria-hidden="true"></div>
          <p>Loading board...</p>
        </div>
      ) : (
        <Board
          columns={columns}
          tasks={tasks}
          onAddTask={openCreateModal}
          onEditTask={openEditModal}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
          disabled={actionLoading}
          isFiltered={isFiltered}
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={editingTask}
        defaultColumnId={defaultColumnId}
        columns={columns}
        onClose={closeModal}
        onSubmit={modalMode === 'create' ? createTask : updateTask}
        loading={actionLoading}
      />
    </div>
  );
}

export default BoardPage;
