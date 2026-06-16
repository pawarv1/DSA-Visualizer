import React from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { DHHashTable } from './DoubleHashing';

// This component handles all the canvas logic needed for Double Hashing animations

function DoubleHashingTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1800;

    const runDoubleHashingSteps = (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        const step1 = () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(70, 40, "Empty Double Hashing Hash Table");
            testCaseHeader.draw(staticContext);

            const dh = new DHHashTable(100, 100, 100, 60);
            dh.draw(mainContext);

            setIsAnimating(false);
        };

        const step2 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Adding + Duplicate");
            testCaseHeader.draw(staticContext);

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 10);
            await dh.add(mainContext, 21);
            await dh.add(mainContext, 32);
            await dh.add(mainContext, 21); // duplicate

            setIsAnimating(false);
        };

        const step3 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Rehash");
            testCaseHeader.draw(staticContext);

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 0);
            await dh.add(mainContext, 11);
            await dh.add(mainContext, 22);
            await dh.add(mainContext, 33);
            await dh.add(mainContext, 44);
            await dh.add(mainContext, 55);
            await dh.add(mainContext, 66); // should trigger rehash around 0.5 load

            setIsAnimating(false);
        };

        const step4 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Contains");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 900, "");
            const text2 = new Text(100, 980, "");

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 5);
            await dh.add(mainContext, 16);
            await dh.add(mainContext, 27);

            let result = await dh.contains(mainContext, 16);
            text1.setContent(`contains(16): ${result}`);
            text1.draw(staticContext);

            result = await dh.contains(mainContext, 38);
            text2.setContent(`contains(38): ${result}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step5 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Remove + Tombstone");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 900, "");
            const text2 = new Text(100, 980, "");

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 5);
            await dh.add(mainContext, 16);
            await dh.add(mainContext, 27);

            let result = await dh.remove(mainContext, 16);
            text1.setContent(`remove(16): ${result}`);
            text1.draw(staticContext);

            result = await dh.contains(mainContext, 27);
            text2.setContent(`contains(27): ${result}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step6 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Tombstone Reuse");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 900, "");
            const text2 = new Text(100, 980, "");

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 5);
            await dh.add(mainContext, 16);
            await dh.add(mainContext, 27);

            await dh.remove(mainContext, 16);

            const addResult = await dh.add(mainContext, 38);
            text1.setContent(`add(38): ${addResult}`);
            text1.draw(staticContext);

            const containsResult = await dh.contains(mainContext, 38);
            text2.setContent(`contains(38): ${containsResult}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step7 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Double Hashing Probe Pattern");
            testCaseHeader.draw(staticContext);

            const dh = new DHHashTable(100, 80, 100, 60);
            dh.draw(mainContext);

            await dh.add(mainContext, 3);
            await dh.add(mainContext, 14);
            await dh.add(mainContext, 25);
            await dh.add(mainContext, 36);

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
            case 7:
                step7();
                break;
            default:
                break;
        }
    };

    return (
        <StepPlayer
            totalSteps={7}
            runStep={runDoubleHashingSteps}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
        />
    );
}

export default DoubleHashingTestCases;