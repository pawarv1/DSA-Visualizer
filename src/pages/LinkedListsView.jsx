import { Animation1, Animation2, Animation3 } from "./CanvasCode/LinkedListAnimations";

/*
Page for linked lists
*/

function LinkedListsView() {
    return (
      <>
        <div>
          <h1>Introduction to Pointers and Nodes</h1>
          <Animation1></Animation1>
        </div><br></br>
        <div>
          <h1>Linked Lists Animation 2</h1>
          <Animation2></Animation2>
        </div><br></br>
        <div>
          <h1>Linked Lists Animation 3</h1>
          <Animation3></Animation3>
        </div>
      </>
    );
  }
  
  export default LinkedListsView;