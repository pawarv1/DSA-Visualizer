import React from 'react';
import { IntroductionAnimation, BigOAnimation, BestWorstAverageAnimation, CommonMistakesAnimation, BigORules } from "./TimeSpaceAnimations";

// This page explains time and space complexity

function AsymptoticAnalysisView() {
    return (
      <>
        <div>
          <h1>Introduction to time and space complexity</h1>
          <IntroductionAnimation></IntroductionAnimation>
        </div><br></br><br></br><br></br><br></br>
        <div>
          <h1>Big O, Big 𝝮 and Big 𝚯</h1>
          <BigOAnimation></BigOAnimation>
        </div><br></br><br></br><br></br><br></br>
        <div>
          <h1>Worst Case, Best Case and Average Case</h1>
          <BestWorstAverageAnimation></BestWorstAverageAnimation>
        </div><br></br><br></br><br></br><br></br>
        <div>
          <h1>Common Mistakes</h1>
          <CommonMistakesAnimation></CommonMistakesAnimation>
        </div><br></br><br></br><br></br><br></br>
        <div>
          <h1>Big O rules</h1>
          <BigORules></BigORules>
        </div><br></br><br></br><br></br><br></br>
      </>
    );
}

export default AsymptoticAnalysisView