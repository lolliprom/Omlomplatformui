import { motion } from 'motion/react';
import { OmlomState, Accessory } from '../types';
import omlomImage from 'figma:asset/7dd5ed6cb98fbb3d5d7f2d861cfd8799640eaecf.png';

interface OmlomCharacterProps {
  state: OmlomState;
  size?: 'small' | 'medium' | 'large';
  accessories?: Accessory[];
}

export function OmlomCharacter({ state, size = 'medium', accessories = [] }: OmlomCharacterProps) {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const getAuraColor = () => {
    switch (state.currentAura) {
      case 'red':
        return ['#ff6b6b', '#ee5a6f'];
      case 'rainbow':
        return ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const colors = getAuraColor();
  const equippedAccessories = accessories.filter(a => a.equipped);

  // Get accessories by type for layering
  const scarf = equippedAccessories.find(a => a.type === 'scarf');
  const glasses = equippedAccessories.find(a => a.type === 'glasses');
  const hat = equippedAccessories.find(a => a.type === 'hat');
  const crown = equippedAccessories.find(a => a.type === 'crown');
  const wings = equippedAccessories.find(a => a.type === 'wings');
  const pet = equippedAccessories.find(a => a.type === 'pet');

  return (
    <div className="relative flex items-center justify-center">
      {/* Aura effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{
          background: state.mode === 'stressed'
            ? `radial-gradient(circle, ${colors[0]}, ${colors[1] || colors[0]})`
            : `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`,
        }}
        animate={{
          scale: state.mode === 'stressed' ? [1, 1.1, 1] : [1, 1.15, 1],
          opacity: state.mode === 'happy' ? [0.5, 0.7, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: state.mode === 'happy' ? 2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Wings (behind Omlom) */}
      {wings && (
        <motion.div
          className="absolute -left-2 top-1/2 -translate-y-1/2 text-5xl z-0"
          animate={{
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {wings.emoji}
        </motion.div>
      )}

      {/* Omlom body */}
      <motion.div
        className={`relative ${sizeClasses[size]} z-10`}
        animate={{
          y: state.mode === 'stressed' ? [0, -5, 0] : [0, -10, 0],
          rotate: state.mode === 'stressed' ? [0, -2, 0, 2, 0] : 0,
        }}
        transition={{
          duration: state.mode === 'stressed' ? 1 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Scarf (behind) */}
        {scarf && (
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-4xl z-0">
            {scarf.emoji}
          </div>
        )}

        {/* Main Omlom Image */}
        <img 
          src={omlomImage} 
          alt="Omlom" 
          className="w-full h-full object-contain relative z-10"
        />

        {/* Glasses */}
        {glasses && (
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 text-3xl z-20">
            {glasses.emoji}
          </div>
        )}

        {/* Hat or Crown */}
        {(hat || crown) && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl z-20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {hat ? hat.emoji : crown?.emoji}
          </motion.div>
        )}

        {/* Stress indicators */}
        {state.mode === 'stressed' && (
          <>
            <motion.div
              className="absolute -top-4 left-0 text-red-500 text-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💢
            </motion.div>
            <motion.div
              className="absolute -top-4 right-0 text-red-500 text-xl"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💢
            </motion.div>
          </>
        )}

        {/* Happy sparkles */}
        {state.mode === 'happy' && (
          <>
            <motion.div
              className="absolute -top-2 left-0 text-yellow-400 text-2xl"
              animate={{ opacity: [0.3, 1, 0.3], y: [-5, 0, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -top-2 right-0 text-yellow-400 text-2xl"
              animate={{ opacity: [1, 0.3, 1], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Pet (beside Omlom) */}
      {pet && (
        <motion.div
          className="absolute -right-8 bottom-0 text-4xl z-5"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {pet.emoji}
        </motion.div>
      )}
    </div>
  );
}