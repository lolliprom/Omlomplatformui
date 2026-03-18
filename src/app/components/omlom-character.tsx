import { motion } from 'motion/react';
import { OmlomState } from '../types';

interface OmlomCharacterProps {
  state: OmlomState;
  size?: 'small' | 'medium' | 'large';
}

export function OmlomCharacter({ state, size = 'medium' }: OmlomCharacterProps) {
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

  const getExpression = () => {
    switch (state.mode) {
      case 'stressed':
        return (
          <>
            {/* Stressed eyes */}
            <ellipse cx="35" cy="45" rx="4" ry="8" fill="#333" />
            <ellipse cx="65" cy="45" rx="4" ry="8" fill="#333" />
            {/* Worried mouth */}
            <path d="M 30 65 Q 50 60 70 65" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Stress marks */}
            <path d="M 15 30 L 12 25" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
            <path d="M 20 20 L 18 15" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
            <path d="M 85 30 L 88 25" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
            <path d="M 80 20 L 82 15" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'happy':
      case 'evolved':
        return (
          <>
            {/* Happy eyes */}
            <circle cx="35" cy="42" r="5" fill="#333" />
            <circle cx="65" cy="42" r="5" fill="#333" />
            <circle cx="37" cy="40" r="2" fill="white" />
            <circle cx="67" cy="40" r="2" fill="white" />
            {/* Big smile */}
            <path d="M 25 60 Q 50 75 75 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="20" cy="55" r="6" fill="#ffb3ba" opacity="0.5" />
            <circle cx="80" cy="55" r="6" fill="#ffb3ba" opacity="0.5" />
            {/* Sparkles */}
            <motion.g
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="15" cy="25" r="2" fill="#ffd700" />
              <circle cx="85" cy="25" r="2" fill="#ffd700" />
            </motion.g>
          </>
        );
      default:
        return (
          <>
            {/* Normal eyes */}
            <circle cx="35" cy="45" r="4" fill="#333" />
            <circle cx="65" cy="45" r="4" fill="#333" />
            {/* Content smile */}
            <path d="M 35 65 Q 50 70 65 65" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  const colors = getAuraColor();

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

      {/* Omlom body */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
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
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main blob body */}
          <motion.path
            d={
              state.mode === 'stressed'
                ? "M 50 10 Q 70 15 80 30 Q 90 45 85 60 Q 75 80 50 85 Q 25 80 15 60 Q 10 45 20 30 Q 30 15 50 10"
                : "M 50 5 Q 75 10 85 30 Q 95 50 85 70 Q 75 90 50 95 Q 25 90 15 70 Q 5 50 15 30 Q 25 10 50 5"
            }
            fill="url(#blobGradient)"
            animate={{
              d: state.mode === 'happy'
                ? [
                    "M 50 5 Q 75 10 85 30 Q 95 50 85 70 Q 75 90 50 95 Q 25 90 15 70 Q 5 50 15 30 Q 25 10 50 5",
                    "M 50 8 Q 72 12 83 32 Q 92 50 83 68 Q 72 88 50 92 Q 28 88 17 68 Q 8 50 17 32 Q 28 12 50 8",
                    "M 50 5 Q 75 10 85 30 Q 95 50 85 70 Q 75 90 50 95 Q 25 90 15 70 Q 5 50 15 30 Q 25 10 50 5",
                  ]
                : undefined,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={state.mode === 'stressed' ? '#ffd6d6' : state.mode === 'happy' ? '#fff4e6' : '#e3f2ff'} />
              <stop offset="100%" stopColor={state.mode === 'stressed' ? '#ffb3b3' : state.mode === 'happy' ? '#ffe066' : '#bae0ff'} />
            </linearGradient>
          </defs>

          {/* Face */}
          {getExpression()}
        </svg>
      </motion.div>

      {/* Evolved crown/accessories */}
      {state.mode === 'evolved' && (
        <motion.div
          className="absolute -top-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <svg width="60" height="40" viewBox="0 0 60 40">
            <path d="M 10 30 L 15 10 L 20 30 L 25 5 L 30 30 L 35 10 L 40 30 L 45 15 L 50 30" fill="#ffd700" stroke="#f4b400" strokeWidth="2" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
