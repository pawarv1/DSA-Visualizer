import React from "react";
import { Text } from "../../GeneralAnimating/GeneralAnimationGraphics";
import StepPlayer from "../../GeneralAnimating/StepPlayer";
import { DynamicArrayStack } from "./DynamicArrayStack";

function DynamicArrayStackTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1400;

    const runDynamicArrayStackSteps = async (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        const step1 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Empty Dynamic Array Stack");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);
            stack.draw(mainContext);

            setIsAnimating(false);
        };

        const step2 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Push 10, 20, 30");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, 10);
            await stack.push(mainContext, 20);
            await stack.push(mainContext, 30);

            setIsAnimating(false);
        };

        const step3 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Push Past Initial Capacity");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, "A");
            await stack.push(mainContext, "B");
            await stack.push(mainContext, "C");
            await stack.push(mainContext, "D");

            setIsAnimating(false);
        };

        const step4 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Peek Top Element");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, 10);
            await stack.push(mainContext, 20);
            await stack.push(mainContext, 30);

            await stack.peek(mainContext);

            setIsAnimating(false);
        };

        const step5 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Pop Top Element");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, 10);
            await stack.push(mainContext, 20);
            await stack.push(mainContext, 30);

            await stack.pop(mainContext);

            setIsAnimating(false);
        };

        const step6 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Stack Underflow Test");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, 10);
            await stack.pop(mainContext);
            await stack.pop(mainContext); // Should warn: Stack Underflow

            setIsAnimating(false);
        };

        const step7 = async () => {
            setIsAnimating(true);

            const header = new Text(70, 40, "Mixed Dynamic Stack Operations");
            header.draw(staticContext);

            const stack = new DynamicArrayStack(100, 100, 100, 60, 2);

            await stack.push(mainContext, "A");
            await stack.push(mainContext, "B");
            await stack.push(mainContext, "C");

            await stack.pop(mainContext);

            await stack.push(mainContext, "D");
            await stack.peek(mainContext);

            await stack.pop(mainContext);
            await stack.pop(mainContext);
            await stack.pop(mainContext);

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
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            totalSteps={7}
            runStep={runDynamicArrayStackSteps}
        />
    );
}

export default DynamicArrayStackTestCases;