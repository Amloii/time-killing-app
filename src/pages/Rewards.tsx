import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Coins, Users, Heart, Zap } from 'lucide-react';
import { useAppStore } from '../store';
import { WARRIORS } from '../utils/warriors';
import { PETS, getCompatiblePets } from '../utils/pets';
import { WarriorRarity } from '../types';
import WarriorCard from '../components/rewards/WarriorCard';
import PetCard from '../components/rewards/PetCard';
import RewardsFilters from '../components/rewards/RewardsFilters';
import PointsDisplay from '../components/common/PointsDisplay';
import SamuraiMascot from '../components/common/SamuraiMascot';
import WarriorPetDisplay from '../components/common/WarriorPetDisplay';
import { toast } from 'sonner';

const Rewards: React.FC = () => {
  const { userProfile, purchaseWarrior, purchasePet, setActiveWarrior, pairWarriorWithPet, getActiveWarriorPetPair } = useAppStore();
  const [selectedRarity, setSelectedRarity] = useState<WarriorRarity | 'All'>('All');
  const [sortBy, setSortBy] = useState<'cost' | 'rarity' | 'name'>('cost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showOwned, setShowOwned] = useState(false);
  const [activeTab, setActiveTab] = useState<'warriors' | 'pets'>('warriors');

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

  const filteredAndSortedPets = useMemo(() => {
    let filtered = PETS.filter(pet => {
      if (selectedRarity !== 'All' && pet.rarity !== selectedRarity) {
        return false;
      }
      if (showOwned && !(userProfile.ownedPets || []).includes(pet.id)) {
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
  }, [selectedRarity, sortBy, sortOrder, showOwned, userProfile.ownedPets]);

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

  const handlePurchasePet = (petId: string) => {
    const pet = PETS.find(p => p.id === petId);
    if (!pet) return;

    if (userProfile.points < pet.cost) {
      toast.error('Insufficient points!');
      return;
    }

    // Check compatibility with active warrior
    if (userProfile.activeWarrior && !pet.compatibleWarriors.includes(userProfile.activeWarrior)) {
      toast.error('This pet is not compatible with your active warrior!');
      return;
    }

    purchasePet(petId);
    toast.success(`${pet.name} purchased successfully!`);
  };

  const handleSelectPet = (petId: string) => {
    if (!userProfile.activeWarrior) {
      toast.error('Please select a warrior first!');
      return;
    }

    const pet = PETS.find(p => p.id === petId);
    if (!pet) return;

    if (!pet.compatibleWarriors.includes(userProfile.activeWarrior)) {
      toast.error('This pet is not compatible with your active warrior!');
      return;
    }

    pairWarriorWithPet(userProfile.activeWarrior, petId);
    toast.success(`${pet.name} is now paired with your warrior!`);
  };

  const ownedWarriors = WARRIORS.filter(w => userProfile.ownedWarriors.includes(w.id));
  const ownedPets = PETS.filter(p => (userProfile.ownedPets || []).includes(p.id));
  const totalWarriors = WARRIORS.length;
  const totalPets = PETS.length;
  const warriorCollectionProgress = (ownedWarriors.length / totalWarriors) * 100;
  const petCollectionProgress = (ownedPets.length / totalPets) * 100;
  
  const currentPair = getActiveWarriorPetPair();
  const compatiblePets = userProfile.activeWarrior ? getCompatiblePets(userProfile.activeWarrior) : [];

  return (
    <div className="min-h-screen bg-sakura p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl fight-time-heading text-black mb-4">
            Warrior & Pet Collection
          </h1>
          <div className="mb-6">
            <PointsDisplay size="lg" />
          </div>
          
          {/* Active Warrior-Pet Pair Display */}
          {currentPair && (
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Active Pair</h3>
                <WarriorPetDisplay size="lg" showNames={true} showBond={true} />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab('warriors')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'warriors'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Warriors</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'pets'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Pets</span>
              </div>
            </button>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warriors</p>
                <p className="text-2xl font-bold">{ownedWarriors.length}/{totalWarriors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${warriorCollectionProgress}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pets</p>
                <p className="text-2xl font-bold">{ownedPets.length}/{totalPets}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${petCollectionProgress}%` }}
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

        {/* Content based on active tab */}
        {activeTab === 'warriors' ? (
          <>
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
          </>
        ) : (
          <>
            {/* Compatibility Notice */}
            {userProfile.activeWarrior && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Showing pets compatible with your active warrior
                  </span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  {compatiblePets.length} compatible pets available
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedPets.map((pet) => {
                const isCompatible = !userProfile.activeWarrior || pet.compatibleWarriors.includes(userProfile.activeWarrior);
                return (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    owned={(userProfile.ownedPets || []).includes(pet.id)}
                    canAfford={userProfile.points >= pet.cost}
                    isCompatible={isCompatible}
                    onPurchase={handlePurchasePet}
                    onSelect={handleSelectPet}
                    isActive={userProfile.activePet === pet.id}
                    activeWarriorId={userProfile.activeWarrior}
                  />
                );
              })}
            </div>

            {filteredAndSortedPets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No pets match your current filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Rewards;