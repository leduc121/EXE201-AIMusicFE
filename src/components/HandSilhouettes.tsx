import React from 'react';
interface HandSilhouettesProps {
  activeKeys: number[];
}
export function HandSilhouettes({ activeKeys }: HandSilhouettesProps) {
  // Map keys to approximate hand positions (0-100%)
  // This is a visual approximation for the demo
  const getKeyPosition = (note: number) => {
    const startNote = 48; // C3
    const totalKeys = 24;
    const index = note - startNote;
    if (index < 0 || index >= totalKeys) return -1;
    return index / totalKeys * 100;
  };
  // Determine which hand covers which keys
  // Left hand: C3-B3 (48-59), Right hand: C4-B4 (60-71)
  const leftHandKeys = activeKeys.filter((k) => k >= 48 && k < 60);
  const rightHandKeys = activeKeys.filter((k) => k >= 60 && k < 72);
  // Calculate hand center position based on active keys or default rest position
  const getHandCenter = (keys: number[], defaultPos: number) => {
    if (keys.length === 0) return defaultPos;
    const positions = keys.map(getKeyPosition);
    const avg = positions.reduce((a, b) => a + b, 0) / positions.length;
    return avg;
  };
  const leftPos = getHandCenter(leftHandKeys, 25);
  const rightPos = getHandCenter(rightHandKeys, 75);
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Left Hand */}
      <div
        className="absolute top-1/2 transition-all duration-300 ease-out will-change-transform"
        style={{
          left: `${leftPos}%`,
          transform: 'translateX(-50%) translateY(-20%)'
        }}>

        <HandSVG side="left" active={leftHandKeys.length > 0} />
      </div>

      {/* Right Hand */}
      <div
        className="absolute top-1/2 transition-all duration-300 ease-out will-change-transform"
        style={{
          left: `${rightPos}%`,
          transform: 'translateX(-50%) translateY(-20%)'
        }}>

        <HandSVG side="right" active={rightHandKeys.length > 0} />
      </div>
    </div>);

}
function HandSVG({
  side,
  active



}: {side: 'left' | 'right';active: boolean;}) {
  const isLeft = side === 'left';
  return (
    <div
      className={`
      relative w-32 h-32 opacity-60 transition-opacity duration-300
      ${active ? 'opacity-80 scale-105' : 'opacity-40'}
    `}>

      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        {/* Palm/Hand Base */}
        <path
          d={
          isLeft ?
          'M30,60 Q20,50 30,40 Q40,30 50,40 Q60,30 70,40 Q80,50 70,70 Q50,90 30,60' :
          'M70,60 Q80,50 70,40 Q60,30 50,40 Q40,30 30,40 Q20,50 30,70 Q50,90 70,60'
          }
          fill="#3E2723"
          className="transition-all duration-300" />


        {/* Fingers - simplified animation */}
        {[1, 2, 3, 4, 5].map((finger, i) => {
          // Calculate finger positions roughly
          const xOffset = isLeft ? i * 10 : (4 - i) * 10;
          const yOffset = active ? 5 : 0; // Press down effect
          return (
            <circle
              key={finger}
              cx={30 + xOffset}
              cy={40 + i % 2 * 5 + yOffset}
              r={4}
              fill={active ? '#D4A574' : '#3E2723'}
              className="transition-all duration-150" />);


        })}
      </svg>

      {/* Glow effect when active */}
      {active &&
      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
      }
    </div>);

}