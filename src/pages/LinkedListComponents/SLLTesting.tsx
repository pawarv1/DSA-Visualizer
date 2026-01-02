import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { LinkedList } from './SLL';

function LinkedListTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Linked List step callback
    const runLinkedListSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        // Creating a single node, then clearing it
        const step1 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a single node and clearing");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a']);
            await ll.clearAll(mainContext);
            setIsAnimating(false);
        }

        // Preload linked list test case
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list loaded in");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        // Clearing a linked list
        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list clearAll");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await ll.clearAll(mainContext);
            setIsAnimating(false);
        }

        // Append to empty linked list test case
        const step4 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Append linked list node to empty list");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            ll.append(mainContext, "a");
            setIsAnimating(false);
        }

        // Append test cases
        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list append");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            await ll.append(mainContext, 'a', 1);
            await ll.append(mainContext, 'b', 1);
            await ll.append(mainContext, 'c', 1);
            setIsAnimating(false);
        }

        // Prepend to empty linked list test case
        const step6 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepend linked list node to empty list");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            ll.prepend(mainContext, "a");
            setIsAnimating(false);
        }

        // Prepend test cases
        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list prepend");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(100, 100, 50, 30);
            await ll.prepend(mainContext, 'd');
            await ll.prepend(mainContext, 'c');
            await ll.prepend(mainContext, 'b');
            await ll.prepend(mainContext, 'a');
            setIsAnimating(false);
        }

        // Insert at test cases
        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list insert at");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['b', 'c', 'e', 'f']);
            await ll.insertAt(mainContext, 2, 'd');
            await ll.insertAt(mainContext, 0, 'a');
            await ll.insertAt(mainContext, 6, 'g');
            setIsAnimating(false);
        }

        // Shift test case
        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove first");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c']);
            await ll.shift(mainContext);
            setIsAnimating(false);
        }

        // Pop test cases
        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list pop");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c']);
            await ll.pop(mainContext);
            await ll.pop(mainContext);
            await ll.pop(mainContext);
            setIsAnimating(false);
        }

        // Remove at test cases
        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list remove at");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await ll.removeAt(mainContext, 2);
            await ll.removeAt(mainContext, 0);
            await ll.removeAt(mainContext, 3);
            setIsAnimating(false);
        }

        // Delete test cases
        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list delete");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await ll.delete(mainContext, 'c');
            await ll.delete(mainContext, 'a');
            await ll.delete(mainContext, 'f');
            await ll.delete(mainContext, 'h');
            setIsAnimating(false);
        }

        // Get at test cases
        const step13 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list get at");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 200, "");
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            text1.setContent(await ll.getAt(mainContext, 5));
            text1.draw(staticContext)
            setIsAnimating(false);
        }

        // Find test cases
        const step14 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list find");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 200, "");
            const text2 = new Text(100, 300, "");
            const text3 = new Text(100, 400, "");
            const ll = new LinkedList(80, 100, 50, 30);
            text1.setContent((await ll.find(mainContext, 'a')).toString());
            text1.draw(staticContext)
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            text2.setContent((await ll.find(mainContext, 'd')).toString());
            text2.draw(staticContext)
            text3.setContent((await ll.find(mainContext, 'x')).toString());
            text3.draw(staticContext)
            setIsAnimating(false);
        }

        // Traverse test cases
        const step15 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list traverse");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await ll.traverse(mainContext);
            setIsAnimating(false);
        }

        // Reverse test cases
        /*
        const step15 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Linked list reverse");
            testCaseHeader.draw(staticContext);
            const ll = new LinkedList(80, 100, 50, 30);
            ll.loadLinkedList(mainContext, ['a', 'b', 'c', 'd']);
            await ll.reverse(mainContext);
            setIsAnimating(false);
        }
        */

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
            case 14:
                step14();
                break;
            case 15:
                step15();
                break;
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={15} runStep={runLinkedListSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default LinkedListTestCases;