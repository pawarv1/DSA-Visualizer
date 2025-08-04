import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { DoublyLinkedList } from './DLL';

function DoublyLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runDoublyLLSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Doubly linked list loaded in");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step2 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.append(mainContext, 'e', 1, false);
            await dll.append(mainContext, 'f', 1, false);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'c', 'd']);
            await dll.prepend(mainContext, 'a', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list insert at");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'c', 'e', 'f']);
            await dll.insertAt(mainContext, 2, 'd', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 6, 'g', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove first");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c']);
            await dll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list pop");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c','d']);
            await dll.pop(mainContext, 1 , false);
            await dll.pop(mainContext, 1, false);
            await dll.pop(mainContext, 1, false);
            await dll.pop(mainContext, 1, false);
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove at");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list clear");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
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
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={10} runStep={runDoublyLLSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DoublyLLTestCases;