"use client"

import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";

import Bar, { TActive } from "./Bar";


type TStyles = {
    [name: string]: { style: CSSProperties, topLeftDark: boolean }
}

const styles: TStyles = {
    "red": { style: { backgroundColor: "#FF0000" }, topLeftDark: false }
    , "green": { style: { backgroundColor: "#00FF00" }, topLeftDark: false }
    , "blue": { style: { backgroundColor: "#0000FF" }, topLeftDark: false }
    , "white": { style: { backgroundColor: "#FFFFFF" }, topLeftDark: false }
    , "black": { style: { backgroundColor: "#000000" }, topLeftDark: true }

    , "white-black-right-left": { style: { background: "linear-gradient(to left, white, black)" }, topLeftDark: true }
    , "white-black-left-right": { style: { background: "linear-gradient(to right, white, black)" }, topLeftDark: false }
    , "white-black-top-bottom": { style: { background: "linear-gradient(to bottom, white, black)" }, topLeftDark: false }
    , "white-black-bottom-top": { style: { background: "linear-gradient(to top, white, black)" }, topLeftDark: true }
};

const Home: React.FC = () => {
    const [init, setInit] = useState(false);
    const [bgIdx, setBgIdx] = useState(0);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const styleNames = Object.keys(styles);

    const [isActive, setIsActive] = useState(styleNames.map(() => true));

    const actives: Array<TActive> = useMemo(() => (
        styleNames.map((name: string, idx: number) => ({
            name: name
            , active: isActive[idx]
            , fnUpdActive: (nActive: boolean) => {
                setIsActive([
                    ...isActive.slice(0, idx)
                    , nActive
                    , ...isActive.slice(idx + 1, isActive.length)
                ])
            }
        }))
    ), [isActive])

    const fnChgBg = useCallback(() => {
        if (init) {
            let nIdx: number = bgIdx;

            do {
                nIdx = (nIdx + 1) % (styleNames.length);
            } while (!isActive[nIdx] && nIdx !== bgIdx);

            if (nIdx !== bgIdx) {
                setBgIdx(nIdx);
            }
        }
    }, [init, bgIdx, isActive]);

    const fnMute = useCallback((nMute?: boolean): boolean => {
        if (audio) {
            if (nMute !== undefined) {
                audio.muted = nMute;
            }

            return audio.muted;
        }

        return false;
    }, [audio]);

    useEffect(() => {
        if (init) {
            const audio = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH}stereo-test.mp3`);
            audio.loop = true;
            audio.play();
            setAudio(audio);
        }
    }, [init]);

    // Change background color on any key press
    useEffect(() => {
        window.addEventListener("keydown", fnChgBg);

        return () => {
            window.removeEventListener("keydown", fnChgBg);
        };
    }, [fnChgBg]);

    return (
        <div id="bg" className="w-full h-full" onClick={fnChgBg} style={(init ? styles[styleNames[bgIdx]].style : {})}>
            {!init && <div className="w-full h-full flex flex-col items-center justify-center gap-1 absolute" onClick={() => setInit(true)}>
                <div className="text-2xl mb-4">Instructions</div>
                <div>Click Anywhere to Change Background</div>
                <div>Move Mouse to Show Controls</div>
            </div>}
            {init && <Bar dark={styles[styleNames[bgIdx]].topLeftDark} fnMute={fnMute} actives={actives} />}
        </div>
    );
}

export default Home;