import React from 'react';
interface PianoKeysProps {
  activeKeys: number[];
  onKeyPress: (note: number) => void;
}
export function PianoKeys({ activeKeys, onKeyPress }: PianoKeysProps) {
  // Generate 2 octaves (C3 to B4)
  // 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
  const octaves = 2;
  const startNote = 48; // C3 in MIDI
  const isBlackKey = (noteIndex: number) => {
    const noteInOctave = noteIndex % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
  };
  const getNoteLabel = (noteIndex: number) => {
    const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'];

    return notes[noteIndex % 12];
  };
  const keys = [];
  for (let i = 0; i < octaves * 12; i++) {
    keys.push(startNote + i);
  }
  // Separate white and black keys for rendering order (white first, then black on top)
  const whiteKeys = keys.filter((k) => !isBlackKey(k));
  const blackKeys = keys.filter((k) => isBlackKey(k));
  return (
    <div className="relative h-64 w-full select-none overflow-hidden rounded-b-xl shadow-2xl bg-[#2a1b15] p-1 border-t-8 border-[#3E2723]">
      {/* Wood texture strip above keys */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-[#3E2723] z-20 shadow-md" />

      <div className="relative flex h-full justify-center pt-2">
        {/* White Keys */}
        {whiteKeys.map((note) => {
          const isActive = activeKeys.includes(note);
          return (
            <div
              key={note}
              onMouseDown={() => onKeyPress(note)}
              className={`
                relative flex-1 h-full mx-[1px] rounded-b-md cursor-pointer
                transition-all duration-100 ease-out origin-top
                border-b-4 border-[#ccc]
                ${isActive ? 'bg-[#fff8e7] shadow-[inset_0_-10px_20px_rgba(184,134,11,0.4)] scale-y-[0.98] border-b-[#e0c080]' : 'bg-gradient-to-b from-[#fffff0] to-[#f0e6d2] hover:bg-[#fffcf5]'}
              `}
              style={{
                boxShadow: isActive ?
                'inset 0 2px 5px rgba(0,0,0,0.2)' :
                'inset -1px 0 2px rgba(0,0,0,0.1), inset 1px 0 2px rgba(255,255,255,0.5), 0 2px 3px rgba(0,0,0,0.2)'
              }}>

              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-serif text-[#8B4513]/50 font-bold">
                {getNoteLabel(note)}
              </span>
            </div>);

        })}

        {/* Black Keys - Positioned absolutely */}
        <div className="absolute top-2 left-0 right-0 flex h-36 px-[calc(100%/14/2)] pointer-events-none">
          {keys.map((note, index) => {
            if (!isBlackKey(note))
            return <div key={note} className="flex-1 invisible" />;
            const isActive = activeKeys.includes(note);
            // Calculate offset based on previous white keys
            // This is a simplified layout logic for the demo
            return (
              <div
                key={note}
                className="flex-1 flex justify-center -mx-[calc(100%/14/2)] z-10 pointer-events-auto">

                <div
                  onMouseDown={() => onKeyPress(note)}
                  className={`
                    w-[60%] h-full rounded-b-md cursor-pointer
                    transition-all duration-100 ease-out origin-top
                    border-b-4 border-[#000]
                    ${isActive ? 'bg-[#2a1b15] shadow-[0_0_15px_rgba(184,134,11,0.6)] scale-y-[0.98] border-b-[#3E2723]' : 'bg-gradient-to-b from-[#1a1a1a] to-[#000000]'}
                  `}
                  style={{
                    boxShadow: isActive ?
                    'inset 0 2px 5px rgba(0,0,0,0.5)' :
                    'inset 1px 0 2px rgba(255,255,255,0.15), 2px 4px 5px rgba(0,0,0,0.4)'
                  }}>

                  {/* Glossy highlight */}
                  <div className="w-[80%] h-[85%] mx-auto mt-1 rounded-b-sm bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

}