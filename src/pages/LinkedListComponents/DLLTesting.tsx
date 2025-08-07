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
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(mainContext);
            const text1 = new Text(100, 200, "");
            const text2 = new Text(100, 300, "");
            const text3 = new Text(100, 400, "");
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            text1.setContent(await dll.getAt(mainContext, 2));
            text1.draw(mainContext);
            text2.setContent(await dll.getAt(mainContext, 3));
            text2.draw(mainContext);
            text3.setContent(await dll.getAt(mainContext, 4));
            text3.draw(mainContext);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.append(mainContext, 'e', 1);
            await dll.append(mainContext, 'f', 1);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'c', 'd']);
            await dll.prepend(mainContext, 'a', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list insert at");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'f']);
            await dll.insertAt(mainContext, 1, 'd', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 0, 'a', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 4, 'g', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 2, 'c', canvasWidth, canvasHeight);
            await dll.insertAt(mainContext, 4, 'e', canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove first");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c']);
            await dll.shift(mainContext, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list pop");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c','d']);
            await dll.pop(mainContext, 1);
            await dll.pop(mainContext, 1);
            await dll.pop(mainContext, 1);
            await dll.pop(mainContext, 1);
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove at");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await dll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 3, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 0, canvasWidth, canvasHeight);
            await dll.removeAt(mainContext, 2, canvasWidth, canvasHeight);
            setIsAnimating(false);
        }

        const step11 = async () => {
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
            case 11:
                step11();
                break;
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={11} runStep={runDoublyLLSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DoublyLLTestCases;