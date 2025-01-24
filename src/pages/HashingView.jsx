import { Animation1, Animation2, Animation3 } from './CanvasCode/HashingAnimations';

/*
Page for hashing. FIXME: only Animation 1 and 3 for now
*/

function HashingView() {
    return (
      <>
        <>
        <div>
            <h1>Hashing Animation 1</h1>
            <Animation1></Animation1>
        </div><br></br><br></br>
        <div>
            <h1>Hashing Animation 2</h1>
            <Animation2></Animation2>
        </div><br></br><br></br>
        <div>
            <h1>Hashing Animation 3</h1>
            <Animation3></Animation3>
        </div><br></br><br></br>
      </>      
      </>
    );
  }
  
  export default HashingView;