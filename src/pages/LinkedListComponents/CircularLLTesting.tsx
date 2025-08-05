import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { CircularLinkedList } from './CircularLL';
import { context } from 'gsap';

function CircularLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runCircularLLsteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        // Creating a single node
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a single node");
            testCaseHeader.draw(mainContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ["a"]);
            setIsAnimating(false);
        }

        // Preload circular linked list test case
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list loaded in");
            testCaseHeader.draw(mainContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(mainContext);
            const text1 = new Text (100, 200, "");
            const text2 = new Text (100, 300, "");
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            text1.setContent(await cll.getAt(mainContext, 0));
            text2.setContent(await cll.getAt(mainContext, 3));
            text1.draw(mainContext);
            text2.draw(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "find");
            testCaseHeader.draw(mainContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await cll.find(mainContext, 'a');
            await cll.find(mainContext, 'd');
            await cll.find(mainContext, 'z');
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse");
            testCaseHeader.draw(mainContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await cll.traverse(mainContext);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(mainContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, []);
            await cll.append(mainContext, 'a');
            await cll.append(mainContext, 'b');
            await cll.append(mainContext, 'c');
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, []);
            await cll.prepend(mainContext, 'b', canvasWidth, canvasHeight);
            await cll.prepend(mainContext, 'a', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        // Insert at test cases
        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(80, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['b', 'c', 'e', 'f']);
            await cll.insertAt(mainContext, 2, 'd', canvasWidth, canvasHeight);
            await cll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await cll.insertAt(mainContext, 6, 'g', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        // Shift test case
        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Shift");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(100, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c']);
            await cll.shift(mainContext, canvasWidth, canvasHeight);
            await cll.shift(mainContext, canvasWidth, canvasHeight);
            await cll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        // Pop test cases
        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Pop");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(80, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b']);
            await cll.pop(mainContext);
            await cll.pop(mainContext);
            setIsAnimating(false);
        }

        // Remove at test cases
        // Bit of a clearing bug on node b after node a is removed
        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "removeAt");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(80, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await cll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await cll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await cll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        // Clear test case
        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "clear");
            testCaseHeader.draw(staticContext);
            const cll = new CircularLinkedList(80, 100, 50, 30);
            cll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await cll.clear(mainContext);
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
            /*
            case 13:
                step13();
                break;
            case 14:
                step14();
                break;
            case 15:
                step15();
                break;
            */
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={12} runStep={runCircularLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default CircularLLTestCases;