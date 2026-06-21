import React from "react";
import { Text } from "../GeneralAnimating/GeneralAnimationGraphics";
import StepPlayer from "../GeneralAnimating/StepPlayer";
import { StaticArrayDeque } from "./StaticArrayDeque";

function StaticArrayDequeTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1400;

    const runDequeSteps = (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        const step1 = () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Empty Static Array Deque");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);
            deque.draw(mainContext);

            setIsAnimating(false);
        };

        const step2 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Insert Rear: 10, 20, 30");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);
            deque.draw(mainContext);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);

            setIsAnimating(false);
        };

        const step3 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Insert Front: 5, 1");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);

            await deque.insertFront(mainContext, 5);
            await deque.insertFront(mainContext, 1);

            setIsAnimating(false);
        };

        const step4 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Get Front and Rear");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);
            await deque.insertFront(mainContext, 5);
            await deque.insertFront(mainContext, 1);

            await deque.getFront(mainContext);
            await deque.getRear(mainContext);

            setIsAnimating(false);
        };

        const step5 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Delete Front Twice");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);
            await deque.insertFront(mainContext, 5);
            await deque.insertFront(mainContext, 1);

            await deque.deleteFront(mainContext);
            await deque.deleteFront(mainContext);

            setIsAnimating(false);
        };

        const step6 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Delete Rear Twice");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);
            await deque.insertFront(mainContext, 5);
            await deque.insertFront(mainContext, 1);

            await deque.deleteRear(mainContext);
            await deque.deleteRear(mainContext);

            setIsAnimating(false);
        };

        const step7 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Wraparound Behavior");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);
            await deque.insertRear(mainContext, 40);

            await deque.deleteFront(mainContext);
            await deque.deleteFront(mainContext);

            await deque.insertRear(mainContext, 50);
            await deque.insertRear(mainContext, 60);
            await deque.insertRear(mainContext, 70);

            setIsAnimating(false);
        };

        const step8 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Overflow Test");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);

            await deque.insertRear(mainContext, 10);
            await deque.insertRear(mainContext, 20);
            await deque.insertRear(mainContext, 30);
            await deque.insertRear(mainContext, 40);
            await deque.insertRear(mainContext, 50);
            await deque.insertRear(mainContext, 60);

            await deque.insertRear(mainContext, 70);

            setIsAnimating(false);
        };

        const step9 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Underflow Test");
            header.draw(staticContext);

            const deque = new StaticArrayDeque<number>(100, 100, 90, 60, 6);
            deque.draw(mainContext);

            await deque.deleteFront(mainContext);
            await deque.deleteRear(mainContext);

            setIsAnimating(false);
        };

        const steps = [
            step1,
            step2,
            step3,
            step4,
            step5,
            step6,
            step7,
            step8,
            step9,
        ];

        steps[step - 1]?.();
    };

    return (
        <StepPlayer
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            totalSteps={9}
            runStep={runDequeSteps}
        />
    );
}

export default StaticArrayDequeTestCases;