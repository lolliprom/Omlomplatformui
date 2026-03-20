import { useState, useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import { OmlomCharacter } from '../components/omlom-character';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Accessory } from '../types';
import { Sparkles, ShoppingBag, Lock, Check, Coins } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Default accessories catalog
const DEFAULT_ACCESSORIES: Accessory[] = [
  // Hats
  { id: 'wizard-hat', name: 'Wizard Hat', type: 'hat', emoji: '🎩', rarity: 'common', cost: 100, unlocked: true, equipped: false },
  { id: 'party-hat', name: 'Party Hat', type: 'hat', emoji: '🎉', rarity: 'common', cost: 150, unlocked: false, equipped: false },
  { id: 'cowboy-hat', name: 'Cowboy Hat', type: 'hat', emoji: '🤠', rarity: 'uncommon', cost: 300, unlocked: false, equipped: false },
  { id: 'graduate-cap', name: 'Graduate Cap', type: 'hat', emoji: '🎓', rarity: 'rare', cost: 500, unlocked: false, equipped: false },
  
  // Glasses
  { id: 'sunglasses', name: 'Cool Sunglasses', type: 'glasses', emoji: '😎', rarity: 'common', cost: 100, unlocked: true, equipped: false },
  { id: 'nerd-glasses', name: 'Smart Glasses', type: 'glasses', emoji: '🤓', rarity: 'uncommon', cost: 250, unlocked: false, equipped: false },
  { id: 'monocle', name: 'Fancy Monocle', type: 'glasses', emoji: '🧐', rarity: 'rare', cost: 400, unlocked: false, equipped: false },
  
  // Scarves
  { id: 'red-scarf', name: 'Red Scarf', type: 'scarf', emoji: '🧣', rarity: 'common', cost: 120, unlocked: false, equipped: false },
  { id: 'bow-tie', name: 'Bow Tie', type: 'scarf', emoji: '👔', rarity: 'uncommon', cost: 200, unlocked: false, equipped: false },
  
  // Crowns
  { id: 'crown', name: 'Royal Crown', type: 'crown', emoji: '👑', rarity: 'epic', cost: 800, unlocked: false, equipped: false },
  { id: 'laurel', name: 'Victory Laurel', type: 'crown', emoji: '🏆', rarity: 'legendary', cost: 1500, unlocked: false, equipped: false },
  
  // Wings
  { id: 'angel-wings', name: 'Angel Wings', type: 'wings', emoji: '👼', rarity: 'epic', cost: 1000, unlocked: false, equipped: false },
  { id: 'fairy-wings', name: 'Fairy Wings', type: 'wings', emoji: '🧚', rarity: 'rare', cost: 600, unlocked: false, equipped: false },
  
  // Pets
  { id: 'cat-pet', name: 'Study Cat', type: 'pet', emoji: '🐱', rarity: 'uncommon', cost: 350, unlocked: false, equipped: false },
  { id: 'dog-pet', name: 'Study Dog', type: 'pet', emoji: '🐶', rarity: 'uncommon', cost: 350, unlocked: false, equipped: false },
  { id: 'dragon-pet', name: 'Baby Dragon', type: 'pet', emoji: '🐉', rarity: 'legendary', cost: 2000, unlocked: false, equipped: false },
];

export default function Inventory() {
  const { stats, omlom, accessories, unlockAccessory, toggleAccessory } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | Accessory['type']>('all');

  // Initialize accessories if empty
  useEffect(() => {
    if (accessories.length === 0) {
      useGameStore.setState({ accessories: DEFAULT_ACCESSORIES });
    }
  }, []);

  const handlePurchase = (accessory: Accessory) => {
    if (stats.gold < accessory.cost) {
      toast.error(`Not enough gold! Need ${accessory.cost - stats.gold} more.`);
      return;
    }

    // Deduct gold
    useGameStore.setState((state) => ({
      stats: {
        ...state.stats,
        gold: state.stats.gold - accessory.cost,
      },
    }));

    // Unlock accessory
    unlockAccessory(accessory.id);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    toast.success(`Unlocked ${accessory.name}! 🎉`);
  };

  const handleEquip = (accessory: Accessory) => {
    toggleAccessory(accessory.id);
    toast.success(accessory.equipped ? `Unequipped ${accessory.name}` : `Equipped ${accessory.name}!`);
  };

  const getRarityColor = (rarity: Accessory['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 border-orange-400';
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: '🎨' },
    { id: 'hat', label: 'Hats', icon: '🎩' },
    { id: 'glasses', label: 'Glasses', icon: '👓' },
    { id: 'scarf', label: 'Scarves', icon: '🧣' },
    { id: 'crown', label: 'Crowns', icon: '👑' },
    { id: 'wings', label: 'Wings', icon: '🦋' },
    { id: 'pet', label: 'Pets', icon: '🐾' },
  ];

  const filteredAccessories = selectedCategory === 'all'
    ? accessories
    : accessories.filter(a => a.type === selectedCategory);

  const equippedAccessories = accessories.filter(a => a.equipped);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl mb-1">Wardrobe</h1>
        <p className="text-gray-600">Dress up your Omlom!</p>
      </div>

      {/* Gold Display */}
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-600" />
            <span className="text-lg">Your Gold</span>
          </div>
          <span className="text-2xl font-bold text-yellow-700">{stats.gold}</span>
        </div>
      </Card>

      {/* Omlom Preview */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="text-lg mb-4 text-center">Your Omlom</h2>
        <div className="flex justify-center">
          <OmlomCharacter state={omlom} size="large" accessories={accessories} />
        </div>
        {equippedAccessories.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Currently wearing:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {equippedAccessories.map(acc => (
                <span key={acc.id} className="text-2xl">{acc.emoji}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredAccessories.map(accessory => (
          <Card
            key={accessory.id}
            className={`p-4 relative ${
              accessory.equipped ? 'ring-2 ring-purple-500 shadow-lg' : ''
            }`}
          >
            {/* Rarity Badge */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs border ${getRarityColor(accessory.rarity)}`}>
              {accessory.rarity}
            </div>

            {/* Accessory Display */}
            <div className="text-center mb-3">
              <div className="text-6xl mb-2">{accessory.emoji}</div>
              <h3 className="font-medium text-sm mb-1">{accessory.name}</h3>
            </div>

            {/* Action Button */}
            {!accessory.unlocked ? (
              <Button
                onClick={() => handlePurchase(accessory)}
                disabled={stats.gold < accessory.cost}
                className="w-full"
                variant={stats.gold < accessory.cost ? 'outline' : 'default'}
                size="sm"
              >
                {stats.gold < accessory.cost ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    {accessory.cost} 💰
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Buy {accessory.cost} 💰
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => handleEquip(accessory)}
                className="w-full"
                variant={accessory.equipped ? 'default' : 'outline'}
                size="sm"
              >
                {accessory.equipped ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Equipped
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Equip
                  </>
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {filteredAccessories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No accessories in this category yet!</p>
        </div>
      )}
    </div>
  );
}
