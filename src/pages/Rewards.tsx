import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Coins, Users } from 'lucide-react';
import { useAppStore } from '../store';
import { WARRIORS } from '../utils/warriors';
import { WarriorRarity } from '../types';
import WarriorCard from '../components/rewards/WarriorCard';
import RewardsFilters from '../components/rewards/RewardsFilters';
import PointsDisplay from '../components/common/PointsDisplay';
import SamuraiMascot from '../components/common/SamuraiMascot';
import { toast } from 'sonner';

const Rewards: React.FC = () => {
  const { userProfile, purchaseWarrior, setActiveWarrior } = useAppStore();
  const [selectedRarity, setSelectedRarity] = useState<WarriorRarity | 'All'>('All');
  const [sortBy, setSortBy] = useState<'cost' | 'rarity' | 'name'>('cost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showOwned, setShowOwned] = useState(false);

  const filteredAndSortedWarriors = useMemo(() => {
    let filtered = WARRIORS.filter(warrior => {
      if (selectedRarity !== 'All' && warrior.rarity !== selectedRarity) {
        return false;
      }
      if (showOwned && !userProfile.ownedWarriors.includes(warrior.id)) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'cost':
          comparison = a.cost - b.cost;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [selectedRarity, sortBy, sortOrder, showOwned, userProfile.ownedWarriors]);

  const handlePurchase = (warriorId: string) => {
    const warrior = WARRIORS.find(w => w.id === warriorId);
    if (!warrior) return;

    if (userProfile.points < warrior.cost) {
      toast.error('Insufficient points!');
      return;
    }

    purchaseWarrior(warriorId);
    toast.success(`${warrior.name} purchased successfully!`);
  };

  const handleSelectWarrior = (warriorId: string) => {
    setActiveWarrior(warriorId);
    const warrior = WARRIORS.find(w => w.id === warriorId);
    toast.success(`${warrior?.name} is now your active warrior!`);
  };

  const ownedWarriors = WARRIORS.filter(w => userProfile.ownedWarriors.includes(w.id));
  const totalWarriors = WARRIORS.length;
  const collectionProgress = (ownedWarriors.length / totalWarriors) * 100;

  return (
    <div className="min-h-screen bg-sakura p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl fight-time-heading text-black mb-4">
            Warrior Collection
          </h1>
          <div className="mb-6">
            <PointsDisplay size="lg" />
          </div>
          
          {/* Show victory mascot if user has warriors */}
          {ownedWarriors.length > 0 && (
            <div className="flex justify-center">
              <SamuraiMascot mood="victory" size={140} useActiveWarrior={true} />
            </div>
          )}
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collection</p>
                <p className="text-2xl font-bold">{ownedWarriors.length}/{totalWarriors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${collectionProgress}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">{userProfile.points.toLocaleString()}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold">{userProfile.streak} days</p>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold">{userProfile.totalTasksCompleted}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <RewardsFilters
          selectedRarity={selectedRarity}
          sortBy={sortBy}
          sortOrder={sortOrder}
          showOwned={showOwned}
          onRarityChange={setSelectedRarity}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onShowOwnedChange={setShowOwned}
        />

        {/* Warriors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedWarriors.map((warrior) => (
            <WarriorCard
              key={warrior.id}
              warrior={warrior}
              owned={userProfile.ownedWarriors.includes(warrior.id)}
              canAfford={userProfile.points >= warrior.cost}
              onPurchase={handlePurchase}
              onSelect={handleSelectWarrior}
              isActive={userProfile.activeWarrior === warrior.id}
            />
          ))}
        </div>

        {filteredAndSortedWarriors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No warriors match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;