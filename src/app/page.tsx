"use client"

import { CSSProperties, useEffect, useState } from "react";

import Bar from "./Bar";

const bgs: Array<string> = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF", "#000000"] as const;
const pattern: Array<string> = ["to left, white, black", "to right, white, black", "to bottom, white, black", "to top, white, black"] as const;
const dark: Array<boolean> = [false, false, false, false, true, true, false, false, true] as const;

const Home: React.FC = () => {
    const [init, setInit] = useState(false);
    
    const [bgIdx, setBgIdx] = useState(0);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const fnChgBg = () => {
        if (init) {
            setBgIdx((bgIdx + 1) % (bgs.length + pattern.length));
        }
    }

    const fnMute = (nMute?: boolean): boolean => {
        if (audio) {
            if (nMute !== undefined) {
                audio.muted = nMute;
            }

            return audio.muted;
        }

        return false;
    }

    const bgStyle: CSSProperties = {
        ...(!init && { backgroundColor: "#FFFFFF" })
        , ...((init && bgIdx >= 0 && bgIdx < bgs.length) && { backgroundColor: bgs[bgIdx] })
        , ...((init && bgIdx >= bgs.length && bgIdx < bgs.length + pattern.length) && { background: `linear-gradient(${pattern[bgIdx - bgs.length]})` })
    }

    useEffect(() => {
        if (init) {
            const audio = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH}stereo-test.mp3`);
            audio.loop = true;
            audio.play();
            setAudio(audio);
        }
    }, [init]);

    return (
        <div className="w-full h-full" onClick={fnChgBg} style={bgStyle}>
            {!init && <div className="w-full h-full flex items-center justify-center absolute" onClick={() => setInit(true)}>Start Testing</div>}
            <Bar dark={dark[bgIdx]} fnMute={fnMute} />
        </div>
    );
}

export default Home;