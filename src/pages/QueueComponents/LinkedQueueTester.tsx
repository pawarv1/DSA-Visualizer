import React from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { LinkedQueue } from './LinkedQueue';

function LinkedQueueTestCases() {
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

                const header = new Text(70, 40, "Empty Linked Queue");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);
                queue.draw(mainContext);

                setIsAnimating(false);
                break;
            }

            case 2: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Enqueue Operations");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

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

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                const removed = await queue.dequeue(mainContext);
                console.log("Dequeued:", removed);

                setIsAnimating(false);
                break;
            }

            case 4: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Front and Rear");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

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

                const header = new Text(70, 40, "Multiple Dequeues");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                console.log("Dequeued:", await queue.dequeue(mainContext));
                console.log("Dequeued:", await queue.dequeue(mainContext));

                const front = await queue.getFront(mainContext);
                const rear = await queue.getRear(mainContext);

                console.log("Front after dequeues:", front);
                console.log("Rear after dequeues:", rear);

                setIsAnimating(false);
                break;
            }

            case 6: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Interleaved Enqueue and Dequeue");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);

                console.log("Dequeued:", await queue.dequeue(mainContext));

                await queue.enqueue(mainContext, 30);
                await queue.enqueue(mainContext, 40);

                console.log("Dequeued:", await queue.dequeue(mainContext));

                const front = await queue.getFront(mainContext);
                const rear = await queue.getRear(mainContext);

                console.log("Front:", front);
                console.log("Rear:", rear);

                setIsAnimating(false);
                break;
            }

            case 7: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Queue Underflow");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

                await queue.dequeue(mainContext);

                setIsAnimating(false);
                break;
            }

            case 8: {
                setIsAnimating(true);

                const header = new Text(70, 40, "Clear Queue");
                header.draw(staticContext);

                const queue = new LinkedQueue<number>(100, 100, 100, 60);

                await queue.enqueue(mainContext, 10);
                await queue.enqueue(mainContext, 20);
                await queue.enqueue(mainContext, 30);

                await queue.clear(mainContext);

                setIsAnimating(false);
                break;
            }

            default:
                break;
        }
    };

    return (
        <StepPlayer
            totalSteps={8}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            runStep={runQueueSteps}
        />
    );
}

export default LinkedQueueTestCases;