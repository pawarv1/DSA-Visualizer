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
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }
        
        const step2 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 200, "");
            const text2 = new Text(100, 300, "");
            const text3 = new Text(100, 400, "");
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            text1.setContent(await String(dll.getAt(mainContext, 2)));
            text1.draw(staticContext);
            text2.setContent(await String(dll.getAt(mainContext, 3)));
            text2.draw(staticContext);
            text3.setContent(await String(dll.getAt(mainContext, 4)));
            text3.draw(staticContext);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, []);
            await dll.append(mainContext, 'a', 1);
            await dll.append(mainContext, 'b', 1);
            await dll.append(mainContext, 'c', 1);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'c', 'd']);
            await dll.prepend(mainContext, 'a');
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'f']);
            await dll.insertAt(mainContext, 1, 'd');
            await dll.insertAt(mainContext, 0, 'a');
            await dll.insertAt(mainContext, 4, 'g');
            await dll.insertAt(mainContext, 2, 'c');
            await dll.insertAt(mainContext, 4, 'e');
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Shift");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c']);
            await dll.shift(mainContext);
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Pop");
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
            const testCaseHeader = new Text (70, 40, "removeAt");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await dll.removeAt(mainContext, 2);
            await dll.removeAt(mainContext, 3);
            await dll.removeAt(mainContext, 2);
            await dll.removeAt(mainContext, 0);
            await dll.removeAt(mainContext, 2);
            setIsAnimating(false);
        }

        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "delete");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.delete(mainContext, 'c');
            await dll.delete(mainContext, 'a');
            await dll.delete(mainContext, 'f');
            await dll.delete(mainContext, 'h');
            setIsAnimating(false);
        }

        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "clearAll");
            testCaseHeader.draw(staticContext);
            const dll = new DoublyLinkedList(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.clearAll(mainContext);
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

    return <StepPlayer totalSteps={12} runStep={runDoublyLLSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DoublyLLTestCases;