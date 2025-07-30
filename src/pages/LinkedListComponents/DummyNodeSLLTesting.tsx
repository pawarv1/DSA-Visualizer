import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { LinkedList } from './SLL';
import { DummyNodeSLL } from './DummyNodeSLL';

function DummyNodeSLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runLinkedListSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {

        const step1 = async() => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a dummy node linked list");
            testCaseHeader.draw(mainContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            ll.draw(mainContext);
            setIsAnimating(false);
        }
        
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list loaded in");
            testCaseHeader.draw(mainContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list append");
            testCaseHeader.draw(mainContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            await ll.append(mainContext, 'a', 1, false);
            await ll.append(mainContext, 'b', 1, false);
            await ll.append(mainContext, 'c', 1, false);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list prepend");
            testCaseHeader.draw(staticContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            await ll.prepend(mainContext, 'd', canvasWidth, canvasHeight, 1);
            await ll.prepend(mainContext, 'c', canvasWidth, canvasHeight, 1);
            await ll.prepend(mainContext, 'b', canvasWidth, canvasHeight, 1);
            await ll.prepend(mainContext, 'a', canvasWidth, canvasHeight, 1);
            setIsAnimating(false);
        }

        // Insert at test cases
        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list insert at");
            testCaseHeader.draw(staticContext);
            const ll = new DummyNodeSLL(20, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['b', 'c', 'e', 'f']);
            await ll.insertAt(mainContext, 2, 'd', canvasWidth, canvasHeight);
            await ll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await ll.insertAt(mainContext, 6, 'g', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove first");
            testCaseHeader.draw(staticContext);
            const ll = new DummyNodeSLL(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c']);
            await ll.shift(mainContext, canvasWidth, canvasHeight);
            await ll.shift(mainContext, canvasWidth, canvasHeight);
            await ll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list pop");
            testCaseHeader.draw(staticContext);
            const ll = new DummyNodeSLL(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c']);
            await ll.pop(mainContext);
            await ll.pop(mainContext);
            await ll.pop(mainContext);
            setIsAnimating(false);
        }

        // Remove at test cases
        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove at");
            testCaseHeader.draw(staticContext);
            const ll = new DummyNodeSLL(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await ll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await ll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await ll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }
        
        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list clear");
            testCaseHeader.draw(mainContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await ll.clear(mainContext);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list traverse");
            testCaseHeader.draw(mainContext);
            const ll = new DummyNodeSLL(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await ll.traverse(mainContext);
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
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={10} runStep={runLinkedListSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DummyNodeSLLTestCases;