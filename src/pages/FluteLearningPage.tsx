import React, { useEffect, useState } from 'react';
import { Scene3D } from '../components/3d/Scene3D';
import { SheetMusic } from '../components/SheetMusic';
import { Button } from '../components/ui/Button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { FLUTE_DEMO_SONG, FluteEvent } from '../data/FluteSong';

export function FluteLearningPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeHoles, setActiveHoles] = useState<number[]>([]);
    const [progress, setProgress] = useState(0);

    // Simulate song playback
    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        if (isPlaying) {
            const playSong = () => {
                FLUTE_DEMO_SONG.forEach((event: FluteEvent) => {
                    const t1 = setTimeout(() => {
                        setActiveHoles([event.note]);
                        setProgress((event.startTime / 8000) * 100);
                    }, event.startTime);

                    const t2 = setTimeout(() => {
                        setActiveHoles([]);
                    }, event.startTime + event.duration);

                    timeouts.push(t1, t2);
                });

                const loopTime = setTimeout(playSong, 8000);
                timeouts.push(loopTime);
            };

            playSong();
        } else {
            setActiveHoles([]);
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
                        Sáo Trúc - Bài Tập 1
                    </h2>
                    <span className="text-[#D4A574] text-sm font-serif italic">
                        Traditional Vietnamese Flute
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
                    <SheetMusic isPlaying={isPlaying} currentNote={activeHoles[0]} />

                    {/* Progress Bar */}
                    <div className="mt-8 w-full bg-[#3E2723] h-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#D4A574] transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(212,165,116,0.5)]"
                            style={{ width: `${progress}%` }} />

                    </div>
                    <div className="flex justify-between mt-2 text-xs text-[#8B4513] font-mono">
                        <span>00:00</span>
                        <span>03:45</span>
                    </div>
                </div>
            </div>

            {/* 3D Flute Visualization */}
            <Scene3D instrument="flute" activeKeys={activeHoles} />
        </div>);
}
