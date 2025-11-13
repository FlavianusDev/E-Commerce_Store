import React from 'react';
import Tooltip from './Tooltip';

interface SortControlsProps {
  sortOrder: string;
  onSortChange: (sortOrder: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortOrder, onSortChange }) => {
  return (
    <Tooltip text="Change product sort order">
      <div className="flex items-center space-x-2">
        <label htmlFor="sort-order" className="text-sm font-medium text-slate-600 shrink-0">
          Sort by:
        </label>
        <select
          id="sort-order"
          name="sort-order"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </Tooltip>
  );
};

export default SortControls;
