import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { CircularDLL } from './CircularDLL';
import { context } from 'gsap';

function CircularDLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runCircularDLLsteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        // Creating a single node
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a single node");
            testCaseHeader.draw(mainContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a']);
            setIsAnimating(false);
        }

        // Preload circular doubly linked list test case
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "CDLL loaded in");
            testCaseHeader.draw(mainContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(mainContext);
            const text1 = new Text(100, 300, "");
            const text2 = new Text(100, 400, "");
            const text3 = new Text(100, 500, "");
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            text1.setContent(await cdll.getAt(mainContext, 2));
            text1.draw(mainContext);
            text2.setContent(await cdll.getAt(mainContext, 3));
            text2.draw(mainContext);
            text3.setContent(await cdll.getAt(mainContext, 4));
            text3.draw(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(mainContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(mainContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(mainContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.append(mainContext, 'e', 1);
            await cdll.append(mainContext, 'f', 1);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, []);
            await cdll.prepend(mainContext, 'c', canvasWidth, canvasHeight);
            await cdll.prepend(mainContext, 'b', canvasWidth, canvasHeight);
            await cdll.prepend(mainContext, 'a', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['b', 'f']);
            await cdll.insertAt(mainContext, 1, 'd', canvasWidth, canvasHeight);
            await cdll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await cdll.insertAt(mainContext, 4, 'g', canvasWidth, canvasHeight);
            await cdll.insertAt(mainContext, 2, 'c', canvasWidth, canvasHeight);
            await cdll.insertAt(mainContext, 4, 'e', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Shift");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Pop");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c','d']);
            await cdll.pop(mainContext, 1);
            await cdll.pop(mainContext, 1);
            await cdll.pop(mainContext, 1);
            await cdll.pop(mainContext, 1);
            setIsAnimating(false);
        }

        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "removeAt");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await cdll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await cdll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            await cdll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await cdll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await cdll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }
        
        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "clear");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await cdll.clear(mainContext);
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
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={12} runStep={runCircularDLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default CircularDLLTestCases;