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
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a']);
            setIsAnimating(false);
        }

        // Preload circular doubly linked list test case
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "CDLL loaded in");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 300, "");
            const text2 = new Text(100, 400, "");
            const text3 = new Text(100, 500, "");
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            text1.setContent(await cdll.getAt(mainContext, 2));
            text1.draw(staticContext);
            text2.setContent(await cdll.getAt(mainContext, 3));
            text2.draw(staticContext);
            text3.setContent(await cdll.getAt(mainContext, 4));
            text3.draw(staticContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await cdll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            await cdll.append(mainContext, 'a', 1);
            await cdll.append(mainContext, 'b', 1);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(100, 100, 50, 30);
            cdll.loadDLL(mainContext, []);
            await cdll.prepend(mainContext, 'c');
            await cdll.prepend(mainContext, 'b');
            await cdll.prepend(mainContext, 'a');
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['b', 'f']);
            await cdll.insertAt(mainContext, 1, 'd');
            await cdll.insertAt(mainContext, 0, 'a');
            await cdll.insertAt(mainContext, 4, 'g');
            await cdll.insertAt(mainContext, 2, 'c');
            await cdll.insertAt(mainContext, 4, 'e');
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Shift");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c']);
            await cdll.shift(mainContext);
            await cdll.shift(mainContext);
            await cdll.shift(mainContext);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Pop");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c']);
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
            await cdll.removeAt(mainContext, 2);
            await cdll.removeAt(mainContext, 3);
            await cdll.removeAt(mainContext, 2);
            await cdll.removeAt(mainContext, 0);
            await cdll.removeAt(mainContext, 2);
            setIsAnimating(false);
        }

        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "delete");
            testCaseHeader.draw(staticContext);
            const dll = new CircularDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.delete(mainContext, 'c');
            await dll.delete(mainContext, 'a');
            await dll.delete(mainContext, 'f');
            await dll.delete(mainContext, 'd');
            await dll.delete(mainContext, 'h');
            setIsAnimating(false);
        }
        
        const step13 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "clearAll");
            testCaseHeader.draw(staticContext);
            const cdll = new CircularDLL(80, 100, 50, 30);
            cdll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await cdll.clearAll(mainContext);
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

    return <StepPlayer totalSteps={13} runStep={runCircularDLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default CircularDLLTestCases;