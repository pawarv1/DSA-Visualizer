import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { SentinelDLL } from './SentinelDLL';

function SentinelDLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Sentinel DLL step callback
    const runSentinelDLLsteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {

        
        const step1 = async() => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a sentinel DLL");
            testCaseHeader.draw(mainContext);
            const ll = new SentinelDLL(100, 100, 50, 30);
            ll.draw(mainContext);
            setIsAnimating(false);
        }
        
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "DLL loaded in");
            testCaseHeader.draw(mainContext);
            const ll = new SentinelDLL(100, 100, 50, 30);
            ll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        // Switch statement which runs the associated step method for the given step
        switch(step) {
            case 1:
                step1();
                break;
            case 2:
                step2();
                break;
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={2} runStep={runSentinelDLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default SentinelDLLTestCases;