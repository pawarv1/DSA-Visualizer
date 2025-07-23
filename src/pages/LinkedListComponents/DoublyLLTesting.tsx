import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { DoublyLinkedListNode } from './DoublyLL';

function DoublyLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runDoublyLLSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        // Creating a single node, then clearing it
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a single node and clearing");
            testCaseHeader.draw(mainContext);
            const dll = new DoublyLinkedListNode(100, 100, 70, 40, 'a');
            dll.drawNode(mainContext);
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