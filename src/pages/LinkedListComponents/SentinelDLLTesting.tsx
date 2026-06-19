import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { SentinelDLL } from './SentinelDLL';

function SentinelDLLTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 600;

    // Sentinel DLL step callback
    const runSentinelDLLsteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        const step1 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Creating a sentinel DLL");
            testCaseHeader.draw(staticContext);
            const ll = new SentinelDLL(100, 100, 50, 30);
            ll.draw(mainContext);
            setIsAnimating(false);
        }
        
        const step2 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "DLL loaded in");
            testCaseHeader.draw(staticContext);
            const ll = new SentinelDLL(100, 100, 50, 30);
            ll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            setIsAnimating(false);
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "getAt");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 200, "");
            const text2 = new Text(100, 300, "");
            const text3 = new Text(100, 400, "");
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            text1.setContent(await String(dll.getAt(mainContext, 2)));
            text1.draw(staticContext);
            text2.setContent(await String(dll.getAt(mainContext, 3)));
            text2.draw(staticContext);
            text3.setContent(await String(dll.getAt(mainContext, 4)));
            text3.draw(staticContext);
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "find");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.find(mainContext, 'd');
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse forward");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseForward(mainContext);
            setIsAnimating(false);
        }

        const step6 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Traverse backward");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.traverseBackward(mainContext);
            setIsAnimating(false);
        }

        const step7 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Appending ");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);
            await dll.append(mainContext, 'e');
            setIsAnimating(false);
        }

        const step8 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Prepending ");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(100, 100, 50, 30);
            dll.loadDLL(mainContext, []);
            await dll.prepend(mainContext, 'b');
            await dll.prepend(mainContext, 'a');
            setIsAnimating(false);
        }

        const step9 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "insertAt");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['b', 'f']);
            await dll.insertAt(mainContext, 1, 'd');
            await dll.insertAt(mainContext, 0, 'a');
            await dll.insertAt(mainContext, 4, 'g');
            await dll.insertAt(mainContext, 2, 'c');
            await dll.insertAt(mainContext, 4, 'e');
            setIsAnimating(false);
        }

        const step10 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "shift");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b']);
            await dll.shift(mainContext);
            await dll.shift(mainContext);
            setIsAnimating(false);
        }

        const step11 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "pop");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b']);
            await dll.pop(mainContext);
            await dll.pop(mainContext);
            setIsAnimating(false);
        }

        const step12 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "removeAt");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
            await dll.removeAt(mainContext, 2);
            await dll.removeAt(mainContext, 3);
            await dll.removeAt(mainContext, 2);
            await dll.removeAt(mainContext, 0);
            await dll.removeAt(mainContext, 2);
            setIsAnimating(false);
        }

        const step13 = async () => {
                setIsAnimating(true);
                const testCaseHeader = new Text (70, 40, "delete");
                testCaseHeader.draw(staticContext);
                const dll = new SentinelDLL(80, 100, 50, 30);
                dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
                await dll.delete(mainContext, 'c');
                await dll.delete(mainContext, 'a');
                await dll.delete(mainContext, 'f');
                await dll.delete(mainContext, 'h');
                setIsAnimating(false);
            }

        const step14 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "clearAll");
            testCaseHeader.draw(staticContext);
            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e', 'f']);
            await dll.clearAll(mainContext);
            setIsAnimating(false);
        }

        const step15 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "append / pop stress");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c']);

            await dll.append(mainContext, 'd', 0.1);
            await dll.append(mainContext, 'e', 0.1);
            await dll.append(mainContext, 'f', 0.1);

            await dll.pop(mainContext, 0.1);
            await dll.pop(mainContext, 0.1);

            await dll.append(mainContext, 'g', 0.1);
            await dll.pop(mainContext, 0.1);

            setIsAnimating(false);
        };

        const step16 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "prepend / shift stress");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['c', 'd', 'e']);

            await dll.prepend(mainContext, 'b', 0.1);
            await dll.prepend(mainContext, 'a', 0.1);

            await dll.shift(mainContext, 0.1);
            await dll.shift(mainContext, 0.1);

            await dll.prepend(mainContext, 'z', 0.1);
            await dll.shift(mainContext, 0.1);

            setIsAnimating(false);
        };

        const step17 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "middle insert/remove");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e']);

            await dll.insertAt(mainContext, 2, 'X', 0.15);
            await dll.removeAt(mainContext, 3, 0.15);

            await dll.insertAt(mainContext, 1, 'Y', 0.15);
            await dll.removeAt(mainContext, 2, 0.15);

            setIsAnimating(false);
        };

        const step18 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "slow pointer inspection");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['1', '2', '3', '4']);

            await dll.append(mainContext, '5', 1.5);
            await dll.prepend(mainContext, '0', 1.5);
            await dll.insertAt(mainContext, 3, 'MID', 1.5);
            await dll.removeAt(mainContext, 2, 1.5);
            await dll.pop(mainContext, 1.5);
            await dll.shift(mainContext, 1.5);

            setIsAnimating(false);
        };

        const step19 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "clearAll + reuse");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd']);

            await dll.clearAll(mainContext, 0.2);

            await dll.append(mainContext, 'x', 0.2);
            await dll.append(mainContext, 'y', 0.2);
            await dll.prepend(mainContext, 'z', 0.2);

            setIsAnimating(false);
        };

        const step20 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text(70, 40, "glitch detector");
            testCaseHeader.draw(staticContext);

            const dll = new SentinelDLL(80, 100, 50, 30);
            dll.loadDLL(mainContext, ['a', 'b', 'c', 'd', 'e']);

            await dll.append(mainContext, 'f', 0.6);
            await dll.removeAt(mainContext, 2, 0.6);   // remove 'c'
            await dll.prepend(mainContext, 'z', 0.6);
            await dll.insertAt(mainContext, 3, 'X', 0.6);
            await dll.pop(mainContext, 0.6);
            await dll.shift(mainContext, 0.6);

            setIsAnimating(false);
        };

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
            case 16:
                step16();
                break;
            case 17:
                step17();
                break;
            case 18:
                step18();
                break;
            case 19:
                step19();
                break;
            case 20:
                step20();
                break;
            default:
                break;
        }
    }

    return <StepPlayer totalSteps={20} runStep={runSentinelDLLsteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default SentinelDLLTestCases;