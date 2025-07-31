import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node, inherits from SLL.tsx
export class DummyNodeSLL extends LinkedList {
    protected headPtr: LinkedListNode
    protected tailPtr: LinkedListNode   // While not all ll use tail pointer, this class will keep track of the tail to make some animations easier
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = new LinkedListNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity); // Head is set to a dummy node
        this.tailPtr = this.headPtr;    // Set tail to the head when initialized
        this.numElements = 0;
    }

    // Preload the linked list without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currNode.next = newNode;
            currNode.drawNode(context);
            newNode.drawNode(context);
            currNode = currNode.next;
            this.tailPtr = currNode; // Update tail pointer
            this.numElements++;
        }
    }

    // Draw the sll
    draw(context: CanvasRenderingContext2D) {
        this.headPtr.drawNode(context);
        let currNode = this.headPtr.next;

        while(currNode) {
            currNode.drawNode(context);
            currNode = currNode.next;
        }
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr.next;

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

    // Search through the ll for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        let currNode = this.headPtr.next;
        let index = 0;

        while (currNode) {
            await this.highlightNode(context, currNode);
            
            // Data was found
            if (currNode.data === data) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next;
            index++;
        }

        // Data was not found
        return -1;
    }

    // Traverse through ll and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr.next;
        let index = 0;

        while (currNode) {
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next;
            index++;
        }
    }

    // Insert at the end of the ll
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let currNode = this.headPtr;

        // Show append animations for linked lists whether or not they use a tail pointer
        if (usingTailPointer) {
            currNode = this.tailPtr;
        }
        // Can choose to show appending with iterations start at the head, as linked lists may not include a tail pointer
        else {
            while (currNode.next) {
                currNode = currNode.next;
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }
        }
            
        const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        currNode.next = newNode;
        currNode.drawNode(context);
        this.tailPtr = newNode; // update the tail pointer to the new node (regardless of which animation is being used)

        // Fade in the new node
        await new Promise<void>((resolve) => {
            gsap.to(newNode, {
                nodeOpacity: 1,
                pointerOpacity: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });
    
        this.numElements++;
    }

    // Insert right after dummy head node
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {    
        const promises: Promise<void>[] = [];
        let currNode = this.headPtr.next;
        
        // Slide the whole ll forward to make room for the new head
        while (currNode) {
            const targetX = currNode.x + this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currNode, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
            currNode = currNode.next;
        }
        
        await Promise.all(promises);

        // Only dummy head node exists
        if (!this.headPtr.next) {
            // In this particular case, append can be used to simplify the code
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
            const newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", this.headPtr.next);

            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                // Fade in the new node
                timeline.to(newNode, {
                    nodeOpacity : 1,
                    pointerOpacity: 1,
                    duration: fadeIntime,
                    onUpdate: () => {
                        newNode.drawNode(context);
                    }
                });

                // Fade out the head nodes next pointer, than set it to the new node
                timeline.to(this.headPtr, {
                    pointerOpacity: 0,
                    duration: fadeIntime,
                    onUpdate: () => {
                        context.clearRect(this.headPtr.x + this.nodeWidth, this.headPtr.y, this.headPtr.next!.x - (this.headPtr.x + this.nodeWidth) - 1, this.nodeHeight);
                        newNode.drawNode(context);
                        this.headPtr.drawNode(context);
                    },
                    onComplete: () => {
                        this.headPtr.next = newNode;
                    }
                });

                // Fade in the head nodes next pointer, which now points to the new node
                timeline.to(this.headPtr, {
                    pointerOpacity: 1,
                    duration: fadeIntime,
                    onStart: () => {
                        newNode.drawNode(context);
                    },
                    onUpdate: () => {
                        this.headPtr.drawNode(context);
                    }
                });

                // Move the new node to the same height as the other nodes
                timeline.to(newNode, {
                    y: this.y,
                    duration: fadeIntime,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    }
                });
            });

            this.numElements++;
        }
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        // Insertions right after the dummy head node
        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr.next;

            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode!);
                }
                currNode = currNode!.next;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currNode!);
            }

            // Insertions in the middle of the ll
            if (currNode?.next) {

                let tempPtr: LinkedListNode | null = currNode.next;  // This pointer will be used to help move nodes following the new node forward
                const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", tempPtr);

                const promises: Promise<void>[] = [];

                // Slide the nodes after the insertion index forward to make space for the new node
                while (tempPtr) {
                    const targetX = tempPtr.x + this.nodeWidth * 2;

                    const promise = new Promise<void>((resolve) => {
                        gsap.to(tempPtr, {
                            x: targetX,
                            duration: 1,
                            onUpdate: () => {
                                context.clearRect(0, 0, canvasWidth, canvasHeight);
                                this.draw(context);
                            },
                            onComplete: () => resolve()
                        });
                    });

                    promises.push(promise);
                    tempPtr = tempPtr.next;
                }
                
                await Promise.all(promises);

                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade in the new node
                    timeline.to(newNode, {
                        nodeOpacity : 1,
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onUpdate: () => {
                            newNode.drawNode(context);
                        }
                    });

                    // Fade out the curr nodes next pointer, than set it to the new node
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(currNode.x + this.nodeWidth, currNode.y, currNode.next!.x - (currNode.x + this.nodeWidth) - 1, this.nodeHeight);
                            newNode.drawNode(context);
                            currNode.drawNode(context);
                        },
                        onComplete: () => {
                            currNode.next = newNode;
                        }
                    });

                    // Fade in the current nodes next pointer, which now points to the new node
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onStart: () => {
                            newNode.drawNode(context);
                        },
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Move the new node to the same height as the other nodes
                    timeline.to(newNode, {
                        y: this.y,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(0, 0, canvasWidth, canvasHeight);
                            this.draw(context);
                        }
                    });
                });

                this.numElements++;
            }
            else {
                // Insertions at the end can use the appending animation, using the tail pointer to prevent another full iteration
                await this.append(context, newData, fadeIntime);
            }
        }

        return true;    // Insertion was successful
    }

    // Remove the first node after the dummy head node, and return its data
    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        // No such node to remove
        if (!this.headPtr.next) {
            return;
        }

        const firstRealNode = this.headPtr.next;
        let currNode = firstRealNode.next;
        firstRealNode.next = null;

        // If the removal of the node only leaves the dummy head, set the tail pointer to the head
        if (!currNode) {
            this.tailPtr = this.headPtr;
        }

        this.headPtr.next = currNode;

        // Fade out the removed node
        await new Promise<void>((resolve) => {
            gsap.to(firstRealNode, {
                nodeOpacity: 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    firstRealNode.drawNode(context);
                    this.headPtr.drawNode(context)
                },
                onComplete: () => {
                    resolve();
                }
            });
        });

        const promises: Promise<void>[] = [];
        
        // Slide the rest of the linked list back
        while (currNode) {
            const targetX = currNode.x - this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currNode, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
            currNode = currNode.next;
        }

        await Promise.all(promises);
        
        this.numElements--;

        // Return the removed nodes data
        return firstRealNode.data;
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        let currNode = this.headPtr;

        while (currNode.next?.next) {
            currNode = currNode.next;
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }
        }

        const lastNode = currNode.next;
        currNode.next = null;
        this.tailPtr = currNode; // Update the tail pointer
        currNode.drawNode(context);

        // Fade out the removed last node
        await new Promise<void>((resolve) => {
            gsap.to(lastNode, {
                nodeOpacity : 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    lastNode?.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });

        this.numElements--;

        // Return the removed nodes data
        return lastNode?.data;
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Deletions right after the dummy head node
        else if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else {
            let currNode = this.headPtr.next!;

            for (let i = 0; i < index - 1; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
                currNode = currNode.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }

            const deleteNode = currNode.next!;

            // Deletions in the middle of the ll
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the pointer which pointed from currNode to deleteNode
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Set the currNode to the node after deleteNode, and deleteNode next pointer to null, then redraw currNode after the pointer update
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onStart: () => {
                            currNode.next = tempPtr;
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Fade out the deleted node
                    timeline.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                            currNode.drawNode(context);
                        }
                    });
                });

                const promises: Promise<void>[] = [];

                // Slide the following nodes back
                while (tempPtr) {
                    const targetX = tempPtr.x - this.nodeWidth * 2;

                    const promise = new Promise<void>((resolve) => {
                        gsap.to(tempPtr, {
                            x: targetX,
                            duration: 1,
                            onUpdate: () => {
                                context.clearRect(0, 0, canvasWidth, canvasHeight);
                                this.draw(context);
                            },
                            onComplete: () => resolve()
                        });
                    });

                    promises.push(promise);
                    tempPtr = tempPtr.next;
                }
                
                await Promise.all(promises);
            }
            // Deletions from the end of the ll
            else {
                currNode.next = null;
                this.tailPtr = currNode; // Update the tail pointer
                currNode.drawNode(context);

                // Fade out the deleted node
                await new Promise<void>((resolve) => {
                    gsap.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                        },
                        onComplete: () => resolve()
                    });
                });
            }

            this.numElements--;
        }

        return true;    // Deletion was successful
    }

    // Clear all but the dummy head node
    async clear(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr.next;
        const promises: Promise<void>[] = [];

        this.tailPtr = this.headPtr;    // Set the tail pointer to the dummy head node
        this.headPtr.next = null;
        this.headPtr.drawNode(context);
        this.numElements = 0;   // Set number of elements to 0

        // Fade out the ll
        while (currNode) {
            const node = currNode;
            currNode = currNode.next;

            const promise = new Promise<void>((resolve) => {
                gsap.to(node, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        node.drawNode(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
        }
        await Promise.all(promises);
    }
}