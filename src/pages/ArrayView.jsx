import { Animation1, Animation2, Animation3 } from './CanvasCode/ArrayAnimations';

/*
The array view component seres aws the page for the arrays section
It will display the animations from the ArrayAnimations file, and other components deemed necessary
*/

function ArrayView() {

  return (
    <>
      <div>
        <h1>Introduction to Arrays</h1>
        <Animation1></Animation1>
      </div><br></br>
      <div>
        <h1>Second Array Animation</h1>
        <Animation2></Animation2>
      </div><br></br>
      <div>
        <h1>Third Array Animation</h1>
        <Animation3></Animation3>
      </div>
    </>
  );
}

export default ArrayView;