import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import { HashSet } from './HashSet';

//This component handles all the canvas logic needed for the various hash set animations

function HashSetTestCases() {
    let canvasWidth = 1000;
    let canvasHeight = 1600;

    // HashSet step callback
    const runHashSetSteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
        
        const step1 = () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (70, 40, "Empty HashSet");
            testCaseHeader.draw(staticContext);
            const hs = new HashSet(100, 100, 100, 60);
            hs.draw(mainContext);
            setIsAnimating(false);
        }

        const step2 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Adding");
            testCaseHeader.draw(staticContext);
            const hs = new HashSet(100, 20, 100, 60);
            hs.draw(mainContext);
            await hs.add(mainContext, 10);
            await hs.add(mainContext, 34);
            await hs.add(mainContext, 34);
            setIsAnimating(false);
           
        }

        const step3 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Rehash");
            testCaseHeader.draw(staticContext);
            const hs = new HashSet(100, 20, 100, 60);
            hs.draw(mainContext);
            for (let i = 0; i < 5; i++) {
                await hs.add(mainContext, i);
            }
            setIsAnimating(false);
        }

        const step4 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Contains");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 600, "");
            const text2 = new Text(100, 700, "");
            const hs = new HashSet(100, 20, 100, 60);
            hs.draw(mainContext);
            for (let i = 0; i < 3; i++) {
                await hs.add(mainContext, i);
            }
            let result = await hs.contains(mainContext, 1);
            text1.setContent(result.toString());
            text1.draw(staticContext);
            result = await hs.contains(mainContext, 5);
            text2.setContent(result.toString());
            text2.draw(staticContext);
            setIsAnimating(false);
        }

        const step5 = async () => {
            setIsAnimating(true);
            const testCaseHeader = new Text (20, 20, "Remove");
            testCaseHeader.draw(staticContext);
            const text1 = new Text(100, 600, "");
            const text2 = new Text(100, 700, "");
            const hs = new HashSet(100, 20, 100, 60);
            hs.draw(mainContext);
            for (let i = 0; i < 3; i++) {
                await hs.add(mainContext, i);
            }
            let result = await hs.remove(mainContext, 1);
            text1.setContent(result.toString());
            text1.draw(staticContext);
            result = await hs.remove(mainContext, 1);
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

    return <StepPlayer totalSteps={5} runStep={runHashSetSteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default HashSetTestCases;