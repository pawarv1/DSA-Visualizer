import React from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { StaticArrayQueue } from './StaticArrayQueue';

function StaticArrayQueueTestCases() {
    const canvasWidth = 1000;
    const canvasHeight = 1800;

    const runQueueSteps = async (
        mainContext: CanvasRenderingContext2D,
        staticContext: CanvasRenderingContext2D,
        step: number,
        setIsAnimating: (value: boolean) => void
    ) => {
        switch (step) {
            case 1: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Empty Static Array Queue");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);
                queue.draw(mainContext);

                setIsAnimating(false);
                break;
            }

            case 2: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Enqueue Operations");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                queue.draw(mainContext);
                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                setIsAnimating(false);
                break;
            }

            case 3: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Dequeue Operation");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                const removed = await queue.dequeue(mainContext);
                console.log("Removed:", removed);

                setIsAnimating(false);
                break;
            }

            case 4: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Front and Rear");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                const front = await queue.getFront(mainContext);
                const rear = await queue.getRear(mainContext);

                console.log("Front:", front);
                console.log("Rear:", rear);

                setIsAnimating(false);
                break;
            }

            case 5: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Queue Overflow");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);
                await queue.enqueue(mainContext, 40);
                await queue.enqueue(mainContext, 50);

                await queue.enqueue(mainContext, 60);

                setIsAnimating(false);
                break;
            }

            case 6: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Queue Underflow");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                await queue.dequeue(mainContext);

                setIsAnimating(false);
                break;
            }

            case 7: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Circular Queue Wraparound");
                header.draw(staticContext);

                const queue = new StaticArrayQueue<number>(100, 100, 100, 60, 5);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);
                await queue.enqueue(mainContext, 40);
                await queue.enqueue(mainContext, 50);

                await queue.dequeue(mainContext);
                await queue.dequeue(mainContext);

                await queue.enqueue(mainContext, 60);
                await queue.enqueue(mainContext, 70);

                const front = await queue.getFront(mainContext);
                const rear = await queue.getRear(mainContext);

                console.log("Front:", front);
                console.log("Rear:", rear);

                setIsAnimating(false);
                break;
            }

            default:
                break;
        }
    };

    return (
        <StepPlayer
            totalSteps={7}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            runStep={runQueueSteps}
        />
    );
}

export default StaticArrayQueueTestCases;