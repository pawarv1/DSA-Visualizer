import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";
import { DoublyLinkedList } from "./DLL";

// Doubly linked list, but both the head and tail use sentinel nodes
export class SentinelDLL extends DoublyLinkedList {
    protected headPtr: DLLNode;
    protected tailPtr: DLLNode;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        // Head and tail are set to sentinel nodes
        this.headPtr = new DLLNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity);
        this.tailPtr = new DLLNode(x + nodeWidth * 2, y, nodeWidth, nodeHeight, null, opacity, opacity);
        // Update head next pointer to tail and tail prev pointer to head
        this.headPtr.next = this.tailPtr;
        this.tailPtr.prev = this.headPtr;
        this.numElements = 0;
    }

    // Preload the DLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr
        
        for (let i = 0; i < nodeData.length; i++) {
            // newNode is intialized with tail as the next node and currNode as the previous node
            const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity, "black", "white", this.tailPtr, currNode);
            currNode.next = newNode;
            this.tailPtr.prev = newNode;
            this.tailPtr.x = newNode.x + this.nodeWidth * 2 // Update the position of sentinel tail node
            currNode.drawNode(context); // Draw currNode after the pointer update
            this.tailPtr.drawNode(context); // Draw tail node after its moved
            newNode.drawNode(context);
            currNode = currNode.next;
            this.numElements++; // Increment number of elements
        }
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // currNode starts at the node after head
            let currNode = this.headPtr.next;

            // Highlight nodes to show traversal if iterationAnimation is true
            for (let i = 0; i < index; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode!);
                }
                currNode = currNode!.next;
            }

            if (iterationAnimation) {
                await this.highlightNode(context, currNode!);
            }

            return currNode!.data;
        }
    }

    // Search through the DLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // currNode starts at the node after head
        let currNode = this.headPtr.next!;
        let index = 0;

        // Iterate until currNode is the sentinel tail node
        while (currNode != this.tailPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            
            // Data was found
            if (currNode.data === data) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next!;
            index++;
        }

        // Data was not found
        return -1;
    }

    // Traverse forward through the DLL and print the nodes index and data
    async traverseForward(context: CanvasRenderingContext2D) {
        // currNode starts at the node after head
        let currNode = this.headPtr.next!;
        let index = 0;

        // Iterate until currNode is the sentinel tail node
        while (currNode != this.tailPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next!;
            index++;
        }
    }

    // If the DLL uses a tail pointer, traverse backwards from tail to head and print nodes index and data
    async traverseBackward(context: CanvasRenderingContext2D) {
        // currNode starts at the node before tail
        let currNode = this.tailPtr.prev!;
        let index = this.numElements - 1;

        // Iterate until currNode is the sentinel head node
        while (currNode != this.headPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.prev!;
            index--;
        }
    }

    
}