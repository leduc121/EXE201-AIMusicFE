import { useEffect, useState } from 'react';
import { Scene3D } from '../components/3d/Scene3D';
import { SheetMusic } from '../components/SheetMusic';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { DAN_TRANH_DEMO_SONG, getActiveStrings } from '../data/DanTranhSong';

export function DanTranhLearningPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeStrings, setActiveStrings] = useState<number[]>([]);
    const [progress, setProgress] = useState(0);
    const [currentNote, setCurrentNote] = useState<number | undefined>(undefined);

    // Simulate song playback
    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        if (isPlaying) {
            const playSong = () => {
                const totalDuration = 8000;
                
                DAN_TRANH_DEMO_SONG.forEach((event) => {
                    const t1 = setTimeout(() => {
                        const strings = getActiveStrings([event]);
                        setActiveStrings(strings);
                        setCurrentNote(event.midi);
                        setProgress((event.startTime / totalDuration) * 100);
                    }, event.startTime);

                    const t2 = setTimeout(() => {
                        setActiveStrings([]);
                        setCurrentNote(undefined);
                    }, event.startTime + event.duration);

                    timeouts.push(t1, t2);
                });

                const loopTime = setTimeout(playSong, totalDuration);
                timeouts.push(loopTime);
            };

            playSong();
        } else {
            setActiveStrings([]);
            setCurrentNote(undefined);
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
                        Đàn Tranh - Bài Tập Cơ Bản
                    </h2>
                    <span className="text-[#D4A574] text-sm font-serif italic">
                        Vietnamese 16-string Zither
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
                    <SheetMusic isPlaying={isPlaying} currentNote={currentNote} />

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

                    {/* String Indicator */}
                    <div className="mt-4 flex justify-center space-x-2">
                        {activeStrings.map(stringIdx => (
                            <span 
                                key={stringIdx}
                                className="px-3 py-1 bg-[#D4A574] text-[#3E2723] rounded-full text-sm font-bold animate-pulse">
                                Dây {stringIdx + 1}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3D Đàn Tranh Visualization */}
            <Scene3D instrument="dan-tranh" activeKeys={activeStrings} />
        </div>
    );
}
