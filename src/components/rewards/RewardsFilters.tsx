import React from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { WarriorRarity } from '../../types';
import Button from '../common/Button';

interface RewardsFiltersProps {
  selectedRarity: WarriorRarity | 'All';
  sortBy: 'cost' | 'rarity' | 'name';
  sortOrder: 'asc' | 'desc';
  showOwned: boolean;
  onRarityChange: (rarity: WarriorRarity | 'All') => void;
  onSortChange: (sortBy: 'cost' | 'rarity' | 'name') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onShowOwnedChange: (show: boolean) => void;
}

const RewardsFilters: React.FC<RewardsFiltersProps> = ({
  selectedRarity,
  sortBy,
  sortOrder,
  showOwned,
  onRarityChange,
  onSortChange,
  onSortOrderChange,
  onShowOwnedChange,
}) => {
  const rarities: (WarriorRarity | 'All')[] = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold">Filters & Sorting</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rarity
          </label>
          <select
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value as WarriorRarity | 'All')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'cost' | 'rarity' | 'name')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="cost">Cost</option>
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            icon={sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>

        {/* Show Owned */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showOwned"
              checked={showOwned}
              onChange={(e) => onShowOwnedChange(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="showOwned" className="text-sm text-gray-700">
              Show owned only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsFilters;