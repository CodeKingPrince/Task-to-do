import React from 'react';
import { PRIORITIES, PRIORITY_ALL } from '../../utils/constants.js';
import './PriorityFilter.css';

export function PriorityFilter({ selectedPriority, onSelectPriority, disabled }) {
  const options = [PRIORITY_ALL, ...PRIORITIES];

  return (
    <div className="priority-filter" role="group" aria-label="Filter tasks by priority">
      <span className="priority-filter__label">Priority:</span>
      <div className="priority-filter__options">
        {options.map((priority) => {
          const isActive = selectedPriority === priority;
          return (
            <button
              key={priority}
              type="button"
              className={`priority-filter__btn ${isActive ? 'is-active' : ''} priority-filter__btn--${priority.toLowerCase()}`}
              onClick={() => onSelectPriority(priority)}
              disabled={disabled}
              aria-pressed={isActive}
            >
              {priority}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PriorityFilter;
