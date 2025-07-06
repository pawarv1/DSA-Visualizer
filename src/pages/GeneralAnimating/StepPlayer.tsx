import React, { useState } from 'react';
import useCanvasAnimation from './CanvasAnimationHook';
import AnimationController from './AnimationController';

// This component abstracts the UI/interaction logic that is used in all the animations

type Props = {
  totalSteps: number;
  runStep: (mainCtx: CanvasRenderingContext2D, staticCtx: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => void;
};

export default function StepPlayer({ totalSteps, runStep }: Props) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Callback function to update the step modifications in AnimationController
  // Step can only be changed if the animation is not running
  const handleStepChange = (newStep: number) => {
      if (!isAnimating) {
          setStep(newStep);
      }
  };

  const { mainCanvasRef, staticCanvasRef } = useCanvasAnimation(step, runStep, setIsAnimating);

  return (
    <div>
      <AnimationController currStep={step} numSteps={totalSteps} updateStep={handleStepChange} isAnimating={isAnimating}></AnimationController>
      <br></br>
      <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
      <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
    </div>
  );
}