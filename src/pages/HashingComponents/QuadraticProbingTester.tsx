import React from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { QPHashTable } from './QuadraticProbing';

// This component handles all the canvas logic needed for Quadratic Probing animations

function QuadraticProbingTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1800;

    const runQuadraticProbingSteps = (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        const step1 = () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(70, 40, "Empty Quadratic Probing Hash Table");
            testCaseHeader.draw(staticContext);

            const qp = new QPHashTable(100, 100, 100, 60);
            qp.draw(mainContext);

            setIsAnimating(false);
        };

        const step2 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Adding + Duplicate");
            testCaseHeader.draw(staticContext);

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 10);
            await qp.add(mainContext, 21); // collision if capacity becomes 11
            await qp.add(mainContext, 32); // collision if capacity becomes 11
            await qp.add(mainContext, 21); // duplicate

            setIsAnimating(false);
        };

        const step3 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Rehash");
            testCaseHeader.draw(staticContext);

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 0);
            await qp.add(mainContext, 11);
            await qp.add(mainContext, 22);
            await qp.add(mainContext, 33);
            await qp.add(mainContext, 44);
            await qp.add(mainContext, 55);
            await qp.add(mainContext, 66); // should trigger rehash around 0.5 load

            setIsAnimating(false);
        };

        const step4 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Contains");
            testCaseHeader.draw(staticContext);

            const text1 = new Text(100, 900, "");
            const text2 = new Text(100, 980, "");

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 5);
            await qp.add(mainContext, 16);
            await qp.add(mainContext, 27);

            let result = await qp.contains(mainContext, 16);
            text1.setContent(`contains(16): ${result}`);
            text1.draw(staticContext);

            result = await qp.contains(mainContext, 38);
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

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 5);
            await qp.add(mainContext, 16);
            await qp.add(mainContext, 27);

            let result = await qp.remove(mainContext, 16);
            text1.setContent(`remove(16): ${result}`);
            text1.draw(staticContext);

            result = await qp.contains(mainContext, 27);
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

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 5);
            await qp.add(mainContext, 16);
            await qp.add(mainContext, 27);

            await qp.remove(mainContext, 16);

            const addResult = await qp.add(mainContext, 38);
            text1.setContent(`add(38): ${addResult}`);
            text1.draw(staticContext);

            const containsResult = await qp.contains(mainContext, 38);
            text2.setContent(`contains(38): ${containsResult}`);
            text2.draw(staticContext);

            setIsAnimating(false);
        };

        const step7 = async () => {
            setIsAnimating(true);

            const testCaseHeader = new Text(20, 20, "Quadratic Probe Pattern");
            testCaseHeader.draw(staticContext);

            const qp = new QPHashTable(100, 80, 100, 60);
            qp.draw(mainContext);

            await qp.add(mainContext, 3);
            await qp.add(mainContext, 14);
            await qp.add(mainContext, 25);
            await qp.add(mainContext, 36);

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
            runStep={runQuadraticProbingSteps}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
        />
    );
}

export default QuadraticProbingTestCases;