import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { DoublyLinkedList } from './DoublyLL';

function DoublyLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runDoublyLLSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        // Creating a single node, then clearing it
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list loaded in");
            testCaseHeader.draw(mainContext);
            const ll = new DoublyLinkedList(100, 100, 50, 30);
            ll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step2 = () => {
        }

        const step3 = async () => {
        }

        const step4 = () => {
        }

        const step5 = async () => {
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
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={1} runStep={runDoublyLLSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DoublyLLTestCases;