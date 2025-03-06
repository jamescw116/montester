import { CSSProperties, useState } from "react";

const Bar: React.FC<{
    dark: boolean
    , fnMute: (nMute?: boolean) => boolean
}> = ({ dark, fnMute }) => {
    const [show, setShow] = useState(false);

    const [mute, setMute] = useState(fnMute());

    const btnCss: CSSProperties  = {
        cursor: "pointer"
        , color: dark ? "white" : "black"
    }
    
    const fnFullScreen = (e: React.MouseEvent) => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            document.documentElement.requestFullscreen();
        }
        e.stopPropagation();
    }

    const fnPlayOrMute = (e: React.MouseEvent) => {
        setMute(!mute);
        fnMute(!mute);
        e.stopPropagation();
    }

    return (
        <div className="h-10 min-w-10 flex flex-row gap-2 p-2" onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
            {show && [
                <span key="fullscreen" className="material-icons" onClick={e => fnFullScreen(e)} style={btnCss}>fullscreen</span>
                , <span key="audio" className="material-icons" onClick={e => fnPlayOrMute(e)} style={btnCss}>{mute ? "volume_up" : "volume_off"}</span>
            ]}
        </div>
    );
}

export default Bar;