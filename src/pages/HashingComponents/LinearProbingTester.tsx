import React from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { LPHashTable } from './LinearProbing';

// This component handles all the canvas logic needed for Linear Probing animations

function LinearProbingTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1600;

    const runLinearProbingSteps = (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        const step1 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "Empty Linear Probing Hash Table");
            testCaseHeader.draw(staticContext);

            const lp = new LPHashTable(100, 100, 100, 60);
            lp.draw(mainContext);

            setIsAnimating(false);
        };

        const step2 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(20, 20, "Adding + Duplicate");
            testCaseHeader.draw(staticContext);

            const lp = new LPHashTable(100, 80, 100, 60);
            lp.draw(mainContext);

            await lp.add(mainContext, 10);
            await lp.add(mainContext, 18); // collision with 10 if capacity is 8
            await lp.add(mainContext, 26); // another collision
            await lp.add(mainContext, 18); // duplicate

            setIsAnimating(false);
        };

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(20, 20, "Rehash");
            testCaseHeader.draw(staticContext);

            const lp = new LPHashTable(100, 80, 100, 60);
            lp.draw(mainContext);

            await lp.add(mainContext, 0);
            await lp.add(mainContext, 8);
            await lp.add(mainContext, 16);
            await lp.add(mainContext, 24);
            await lp.add(mainContext, 32); // should trigger rehash at 0.5 load factor
            
            setIsAnimating(false);
        };

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(20, 20, "Contains");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 700, "");
            const text2 = new Text(100, 780, "");

            const lp = new LPHashTable(100, 80, 100, 60);
            lp.draw(mainContext);

            await lp.add(mainContext, 5);
            await lp.add(mainContext, 13);
            await lp.add(mainContext, 21);

            let result = await lp.contains(mainContext, 13);
            text1.setContent(`contains(13): ${result}`);
            text1.draw(staticContext);

            result = await lp.contains(mainContext, 29);
            text2.setContent(`contains(29): ${result}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(20, 20, "Remove + Tombstone");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 700, "");
            const text2 = new Text(100, 780, "");

            const lp = new LPHashTable(100, 80, 100, 60);
            lp.draw(mainContext);

            await lp.add(mainContext, 5);
            await lp.add(mainContext, 13);
            await lp.add(mainContext, 21);

            let result = await lp.remove(mainContext, 13);
            text1.setContent(`remove(13): ${result}`);
            text1.draw(staticContext);

            result = await lp.contains(mainContext, 21);
            text2.setContent(`contains(21): ${result}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(20, 20, "Tombstone Reuse");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 700, "");
            const text2 = new Text(100, 780, "");

            const lp = new LPHashTable(100, 80, 100, 60);
            lp.draw(mainContext);

            await lp.add(mainContext, 5);
            await lp.add(mainContext, 13);
            await lp.add(mainContext, 21);

            await lp.remove(mainContext, 13);

            const addResult = await lp.add(mainContext, 29); // should reuse tombstone
            text1.setContent(`add(29): ${addResult}`);
            text1.draw(staticContext);

            const containsResult = await lp.contains(mainContext, 29);
            text2.setContent(`contains(29): ${containsResult}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        switch (step) {
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
            default:
                break;
        }
    };

    return (
        <StepPlayer
            totalSteps={6}
            runStep={runLinearProbingSteps}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
        />
    );
}

export default LinearProbingTestCases;