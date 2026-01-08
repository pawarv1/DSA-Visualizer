import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { HashMap } from './HashMap';

//This component handles all the canvas logic needed for the various hash set animations

function HashMapTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 1000;

    // HashSet step callback
    const runHashMapSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        const step1 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Empty HashMap");
            testCaseHeader.draw(staticContext);
            const hm = new HashMap(100, 100, 50, 30);
            hm.draw(mainContext);
            setIsAnimating(false);
        }

        const step2 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Adding");
            testCaseHeader.draw(staticContext);
            const hm = new HashMap(100, 20, 50, 30);
            hm.draw(mainContext);
            await hm.add(mainContext, 10, 1);
            await hm.add(mainContext, 34, 0);
            await hm.add(mainContext, 34, 5);
            setIsAnimating(false);
           
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Rehash");
            testCaseHeader.draw(staticContext);
            const hm = new HashMap(100, 20, 50, 30);
            hm.draw(mainContext);
            for (let i = 0; i < 5; i++) {
                await hm.add(mainContext, i, i * 2);
            }
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Contains");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 300, "");
            const text2 = new Text(100, 400, "");
            const hm = new HashMap(100, 20, 50, 30);
            hm.draw(mainContext);
            for (let i = 0; i < 3; i++) {
                await hm.add(mainContext, i, i * 2);
            }
            let result = await hm.contains(mainContext, 1);
            text1.setContent(result.toString());
            text1.draw(staticContext);
            result = await hm.contains(mainContext, 5);
            text2.setContent(result.toString());
            text2.draw(staticContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Remove");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 300, "");
            const text2 = new Text(100, 400, "");
            const hm = new HashMap(100, 20, 50, 30);
            hm.draw(mainContext);
            for (let i = 0; i < 3; i++) {
                await hm.add(mainContext, i, i * 2);
            }
            let result = await hm.remove(mainContext, 1);
            text1.setContent(result.toString());
            text1.draw(staticContext);
            result = await hm.remove(mainContext, 1);
            text2.setContent(result.toString());
            text2.draw(staticContext);
            setIsAnimating(false);
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
                break
        }
    }

    return <StepPlayer totalSteps={5} runStep={runHashMapSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default HashMapTestCases;