import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";


export type TActive = {
    name: string
    , active: boolean
    , fnUpdActive: (nActive: boolean) => void
}

const Bar: React.FC<{
    dark: boolean
    , fnMute: (nMute?: boolean) => boolean
    , actives: Array<TActive>
}> = ({ dark, fnMute, actives }) => {
    const [hovered, setHovered] = useState(false);
    const [moved, setMoved] = useState(false);
    const [mute, setMute] = useState(fnMute());
    const [moveTimeOut, setMoveTimeOut] = useState<NodeJS.Timeout | null>(null);

    const timeOutSec: number = 5;

    const btnCss: CSSProperties = useMemo(() => ({
        cursor: "pointer"
        , color: dark ? "white" : "black"
        , userSelect: "none"
    }), [dark]);

    const fnFullScreen = useCallback((e: React.MouseEvent) => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            document.documentElement.requestFullscreen();
        }
        e.stopPropagation();
    }, []);

    const fnPlayOrMute = useCallback((e: React.MouseEvent) => {
        setMute(!mute);
        fnMute(!mute);
        e.stopPropagation();
    }, [mute, fnMute]);

    const fnUserMoved = useCallback(() => {
        setMoved(true);

        if (moveTimeOut) {
            clearTimeout(moveTimeOut);
        }

        setMoveTimeOut(setTimeout(() => {
            setMoved(false);

            if (moveTimeOut) {
                clearTimeout(moveTimeOut);
            }
        }, timeOutSec * 1000));
    }, [moveTimeOut]);

    useEffect(() => {
        window.addEventListener("mousemove", fnUserMoved);

        return () => {
            if (moveTimeOut) {
                window.removeEventListener("mousemove", fnUserMoved);
                clearTimeout(moveTimeOut);
            }
        };
    }, [fnUserMoved, moveTimeOut]);

    /*useEffect(() => {
        if (!hovered && !moved) {
            document.body.style.cursor = "none";
        }
        else {
            document.body.style.cursor = "auto";
        }
    }, [hovered, moved]);*/

    return (
        <div className="min-h-10 min-w-10 flex flex-col gap-2 p-2" onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
            {(hovered || moved) && [
                <div key="control" className="flex flex-row gap-2 items-start justify-start">
                    <span className="material-icons" onClick={e => fnFullScreen(e)} style={btnCss}>fullscreen</span>
                    <span className="material-icons" onClick={e => fnPlayOrMute(e)} style={btnCss}>{mute ? "volume_up" : "volume_off"}</span>
                </div>
                , <div key="actives" className="flex flex-row gap-2 items-start justify-start">
                    {actives.map((active: TActive, idx: number) => (
                        <span key={idx} className={`cursor-pointer select-none ${dark ? "text-white" : ""}`} onClick={(e) => { active.fnUpdActive(!active.active); e.stopPropagation(); }}>
                            <input type="checkbox" defaultChecked={active.active} readOnly={true} /> {active.name}
                        </span>
                    ))}
                </div>
            ]}
        </div>
    );
}

export default Bar;
