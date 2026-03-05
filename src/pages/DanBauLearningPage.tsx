import { useEffect, useState } from 'react';
import { Scene3D } from '../components/3d/Scene3D';
import { SheetMusic } from '../components/SheetMusic';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { DAN_BAU_DEMO_SONG, getDanBauHandPosition } from '../data/DanBauSong';

export function DanBauLearningPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPitch, setCurrentPitch] = useState<number>(60);
    const [isNotePlaying, setIsNotePlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pitchBend, setPitchBend] = useState(0);
    const [handPosition, setHandPosition] = useState(0.5);

    // Simulate song playback
    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        if (isPlaying) {
            const playSong = () => {
                const totalDuration = 8000;
                
                DAN_BAU_DEMO_SONG.forEach((event) => {
                    const t1 = setTimeout(() => {
                        setCurrentPitch(event.midi);
                        setIsNotePlaying(true);
                        setHandPosition(getDanBauHandPosition(event.midi));
                        setProgress((event.startTime / totalDuration) * 100);
                        
                        // Apply pitch bend if present
                        if (event.vietnamese?.bending) {
                            const bend = event.vietnamese.bending;
                            if (bend.type === 'up') {
                                setPitchBend(bend.amount / 12);
                            } else if (bend.type === 'down') {
                                setPitchBend(-bend.amount / 12);
                            } else if (bend.type === 'vibrato') {
                                // Simulate vibrato
                                let vibratoCount = 0;
                                const vibratoInterval = setInterval(() => {
                                    vibratoCount++;
                                    const vibratoAmount = Math.sin(vibratoCount) * 0.1;
                                    setPitchBend(vibratoAmount);
                                }, 50);
                                
                                setTimeout(() => {
                                    clearInterval(vibratoInterval);
                                    setPitchBend(0);
                                }, bend.duration);
                            }
                        } else {
                            setPitchBend(0);
                        }
                    }, event.startTime);

                    const t2 = setTimeout(() => {
                        setIsNotePlaying(false);
                        setPitchBend(0);
                    }, event.startTime + event.duration);

                    timeouts.push(t1, t2);
                });

                const loopTime = setTimeout(playSong, totalDuration);
                timeouts.push(loopTime);
            };

            playSong();
        } else {
            setIsNotePlaying(false);
            setPitchBend(0);
            timeouts.forEach(clearTimeout);
        }

        return () => timeouts.forEach(clearTimeout);
    }, [isPlaying]);

    return (
        <div className="min-h-screen w-full bg-[#2a1b15] flex flex-col">
            {/* Top Control Bar */}
            <div className="bg-wood-grain p-4 shadow-xl z-20 flex items-center justify-between border-b border-[#D4A574]/20">
                <div className="flex items-center space-x-4">
                    <h2 className="text-[#FAF7F0] text-xl font-bold tracking-wider">
                        Đàn Bầu - Kỹ Thuật Cơ Bản
                    </h2>
                    <span className="text-[#D4A574] text-sm font-serif italic">
                        Vietnamese Monochord
                    </span>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="min-w-[100px]">
                        {isPlaying ?
                            <>
                                <Pause className="mr-2 w-4 h-4" /> Pause
                            </> :
                            <>
                                <Play className="mr-2 w-4 h-4" /> Play
                            </>
                        }
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setProgress(0)}>
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Sheet Music Area */}
            <div className="flex-1 bg-[#1a100c] relative flex flex-col">
                <div className="w-full max-w-6xl mx-auto pt-8 px-4 flex-1 flex flex-col justify-center">
                    <SheetMusic isPlaying={isPlaying} currentNote={isNotePlaying ? currentPitch : undefined} />

                    {/* Progress Bar */}
                    <div className="mt-8 w-full bg-[#3E2723] h-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#D4A574] transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(212,165,116,0.5)]"
                            style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-[#8B4513] font-mono">
                        <span>00:00</span>
                        <span>00:08</span>
                    </div>

                    {/* Pitch and Position Indicators */}
                    <div className="mt-4 flex justify-center space-x-6">
                        <div className="text-center">
                            <span className="text-[#D4A574] text-xs uppercase tracking-wider">Pitch</span>
                            <div className="text-[#FAF7F0] text-xl font-bold">
                                {getNoteName(currentPitch)}
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-[#D4A574] text-xs uppercase tracking-wider">Hand Position</span>
                            <div className="text-[#FAF7F0] text-xl font-bold">
                                {Math.round(handPosition * 100)}%
                            </div>
                        </div>
                        {pitchBend !== 0 && (
                            <div className="text-center">
                                <span className="text-[#D4A574] text-xs uppercase tracking-wider">Bend</span>
                                <div className={`text-xl font-bold ${pitchBend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {pitchBend > 0 ? '+' : ''}{Math.round(pitchBend * 100)}%
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3D Đàn Bầu Visualization */}
            <Scene3D 
                instrument="dan-bau" 
                activeKeys={isNotePlaying ? [currentPitch] : []}
                pitch={currentPitch}
            />
        </div>
    );
}

function getNoteName(midi: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const noteName = noteNames[midi % 12];
    return `${noteName}${octave}`;
}
