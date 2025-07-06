import { useEffect, useRef } from 'react';

// This component abstracts the canvas lifecycle and rendering logic that is used in all the animations

function useCanvasAnimation(
    step: number,
    runStep: (
        mainCtx: CanvasRenderingContext2D,
        staticCtx: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => void,
    setIsAnimating: (val: boolean) => void
) {
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const staticCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        const staticCanvas = staticCanvasRef.current;
        const mainCtx = mainCanvas?.getContext('2d');
        const staticCtx = staticCanvas?.getContext('2d');

        if (!mainCanvas || !mainCtx || !staticCanvas || !staticCtx) {
            return;
        }

        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);

        runStep(mainCtx, staticCtx, step, setIsAnimating);

    }, [step]);

    return { mainCanvasRef, staticCanvasRef };
}

export default useCanvasAnimation;