import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";


// Singly linked list class
export class LinkedList {
    protected headPtr: LinkedListNode | null;
    protected tailPtr: LinkedListNode | null;   // While not all LL use tail pointer, this class will keep track of the tail to make some animations easier
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    // Preload the linked list without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (currNode === null) {
                this.headPtr = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            // Loading in following nodes
            else {
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode.next = newNode;
                currNode.drawNode(context);
                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;
            this.numElements++;
        }
    }

    // Draw the SLL
    draw(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;

        while(currNode) {
            currNode.drawNode(context);
            currNode = currNode.next;
        }
    }

    // Return true if the ll is empty
    isEmpty() {
        return this.numElements === 0;
    }

    // Return the size of the ll
    getSize() {
        return this.numElements;
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    // This is ussually used to portray traversals, and can be disabled if needed using the iterationAnimation parameter
    async highlightNode(context: CanvasRenderingContext2D, node: LinkedListNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        return new Promise<void>((resolve) => {
            node.outlineColor = outlineColor
            node.fillColor = fillColor;
            node.drawNode(context);

            setTimeout(() => {
                // Reset to orignal colors
                node.outlineColor = "black";
                node.fillColor = "white";
                node.drawNode(context);
                resolve();
            }, duration);
        });
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

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
        let currNode = this.headPtr;
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

    // Return true if the ll has the provided data
    async contains(context: CanvasRenderingContext2D, data: any) {
        const findOutput = await this.find(context, data);
        return findOutput != -1;
    }

    // Traverse through ll and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
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
        let newNode: LinkedListNode;

        // Empty linked list case
        if (this.headPtr === null) {
            newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currNode = this.headPtr;

            // Show append animations for linked lists whether or not they use a tail pointer
            if (usingTailPointer) {
                currNode = this.tailPtr!;
            }
            // Can choose to show appending with iterations start at the head, as linked lists may not include a tail pointer
            else {

                // Highlight nodes to show traversal
                while (currNode.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            currNode.next = newNode;
            currNode.drawNode(context);
            this.tailPtr = newNode; // update the tail pointer to the new node (regardless of which animation is being used)
        }

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

    // Insert to the head of the ll
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {
        
        const promises: Promise<void>[] = [];
        let currNode = this.headPtr;
        
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

        const newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", this.headPtr);

        // If the ll was previously empty, tail pointer will also point to the new node 
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        this.headPtr = newNode;

        // Fade in new node
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

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        // Insertions at the head
        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(this.headPtr === null || index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
                currNode = currNode.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }

            // Insertions in the middle of the ll
            if (currNode.next) {

                let tempPtr: LinkedListNode | null = currNode.next;  // This pointer will be used to help move nodes following the new node forward
                const initialY = this.y + this.nodeHeight * 2;        // New nodes will appear below the height of the rest of the linked list, before being moved up
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
                            context.clearRect(currNode.x + this.nodeWidth, currNode.y, currNode.next!.x - (currNode.x + this.nodeWidth) - 1, this.nodeHeight);  // Clear the area between the current node and the new node
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

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            // firstNode is the old head, which will be removed
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;
            firstNode.next = null;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            if (!this.headPtr) {
                this.tailPtr = null;
            }

            // Fade out the removed first node
            await new Promise<void>((resolve) => {
                gsap.to(firstNode, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        firstNode.drawNode(context);
                    },
                    onComplete: () => {
                        resolve();
                    }
                });
            });

            let currNode = this.headPtr;
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
            return firstNode.data;
        }
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            if (this.headPtr.next === null) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal
                while (currNode.next?.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }

                lastNode = currNode.next;
                currNode.next = null;
                this.tailPtr = currNode; // Update the tail pointer
                currNode.drawNode(context);
            }

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
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        if (this.headPtr === null || index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Deletions at the head
        else if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
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

    // This should be changed so its not a class method, since its not a necessary operation for an ll to support
    async reverse(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (!this.headPtr || !this.headPtr.next) {
            return;
        }

        let prevNode: LinkedListNode | null = null;
        let currNode: LinkedListNode | null = this.headPtr;
        let newX = this.x;

        while (currNode) {
            let nextNode: LinkedListNode | null = currNode.next;
            await this.highlightNode(context, currNode);
            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currNode, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        currNode?.drawNode(context);
                    },
                    onComplete: () => {
                        currNode!.next = prevNode;
                    }
                });
                timeline.to(currNode, {
                    pointerOpacity: 0.25,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        prevNode?.drawNode(context, !(prevNode?.next));
                        currNode?.drawNode(context);
                    }
                });
            });
            prevNode = currNode;
            currNode = nextNode;
        }

        this.tailPtr = this.headPtr;
        this.headPtr = prevNode;

        currNode = this.headPtr;
        const promises: Promise<void>[] = [];

        while (currNode) {
            const targetX = newX;
            const promise = new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currNode, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                });
                timeline.to(currNode, {
                    pointerOpacity: 1,
                    duration: 0,
                    onUpdate: () => {
                        currNode?.drawNode(context);
                    },
                });
            });

            promises.push(promise);
            newX += this.nodeWidth * 2;
            currNode = currNode.next;
        }

        await Promise.all(promises);
    }

    // Clear the ll and set head and tail to null
    async clear(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

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
        // Set head and tail to null, and number of elements to 0
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }
}