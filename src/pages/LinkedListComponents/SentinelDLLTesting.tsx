import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { SentinelDLL } from './SentinelDLL';

function SentinelDLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Sentinel DLL step callback
    const runSentinelDLLsteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {

        
        const step1 = () => {
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

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(mainContext);
            const text1 = new Text (100, 200, "");
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            text1.setContent(await dll.getAt(mainContext, 2));
            text1.draw(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "find");
            testCaseHeader.draw(mainContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.find(mainContext, 'd');
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(mainContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(mainContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(mainContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.append(mainContext, 'e');
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, []);
            await dll.prepend(mainContext, 'a', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'c', 'e', 'f']);
            await dll.insertAt(mainContext, 2, 'd', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 6, 'g', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "shift");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b']);
            await dll.shift(mainContext, canvasWidth, canvasHeight);
            await dll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "pop");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b']);
            await dll.pop(mainContext);
            await dll.pop(mainContext);
            setIsAnimating(false);
        }

        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "removeAt");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step13 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Clear");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.clear(mainContext);
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
            case 3:
                step3();
                break;
            case 4:
                step4();
                break;
            case 5:
                step5();
                break;
            case 6:
                step6();
                break;
            case 7:
                step7();
                break;
            case 8:
                step8();
                break;
            case 9:
                step9();
                break;
            case 10:
                step10();
                break;
            case 11:
                step11();
                break;
            case 12:
                step12();
                break;
            case 13:
                step13();
                break;
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={13} runStep={runSentinelDLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default SentinelDLLTestCases;