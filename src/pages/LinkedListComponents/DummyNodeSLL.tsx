import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./LinkedListNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node
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
        let currPtr = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currPtr.next = newNode;
            currPtr.drawNode(context);
            newNode.drawNode(context);
            currPtr = currPtr.next;
            this.tailPtr = currPtr; // Update tail pointer
            this.numElements++;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.headPtr.drawNode(context);
        let currPtr = this.headPtr.next;

        while(currPtr) {
            currPtr.drawNode(context);
            currPtr = currPtr.next;
        }
    }

    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next;

            for (let i = 0; i < index; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
                currPtr = currPtr!.next;
            }

            if (iterationAnimation) {
                await this.highlightNode(context, currPtr!);
            }

            return currPtr?.data;
        }
    }

    async find(context: CanvasRenderingContext2D, data: any) {
        let currPtr = this.headPtr.next;
        let index = 0;

        while (currPtr) {
            await this.highlightNode(context, currPtr);
            
            if (currPtr.data === data) {
                await this.highlightNode(context, currPtr, 1000, "black", "lightgreen");
                return index;
            }

            currPtr = currPtr.next;
            index++;
        }

        if (this.tailPtr) {
            await this.highlightNode(context, this.tailPtr, 1000, "black", "red");
        }

        return -1;
    }

    async contains(context: CanvasRenderingContext2D, data: any) {
        const findOutput = await this.find(context, data);
        return findOutput != -1;
    }

    async traverse(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr.next;
        let index = 0;

        while (currPtr) {
            await this.highlightNode(context, currPtr);
            console.log(`[${index}]: ${currPtr.data}`);
            currPtr = currPtr.next;
            index++;
        }
    }

    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let currPtr: LinkedListNode;

        if (usingTailPointer) {
            currPtr = this.tailPtr;
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr!);
            }
        }

        else {
            currPtr = this.headPtr;

            while (currPtr.next != null) {
                currPtr = currPtr.next;
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
            }
        }
            
        let newNode = new LinkedListNode(currPtr!.x + this.nodeWidth * 2, currPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        currPtr!.next = newNode;
        currPtr?.drawNode(context);
        this.tailPtr = newNode;

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

    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {    
        const promises: Promise<void>[] = [];
        let currPtr: LinkedListNode | null = this.headPtr.next;
        
        while (currPtr) {
            const targetX = currPtr.x + this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currPtr, {
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
            currPtr = currPtr.next;
        }
        
        await Promise.all(promises);
        let newNode: LinkedListNode;

        if (!this.headPtr.next) {
            newNode = new LinkedListNode(this.x + this.nodeWidth * 2, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr.next = newNode;
            this.tailPtr = newNode;
            this.headPtr.drawNode(context);

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
        }
        else {
            let initialY = this.y + this.nodeHeight * 2;
            newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", this.headPtr.next);

            await new Promise<void>((resolve) => {
                let timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(newNode, {
                    nodeOpacity : 1,
                    pointerOpacity: 1,
                    duration: fadeIntime,
                    onUpdate: () => {
                        newNode.drawNode(context);
                        this.headPtr.drawNode(context);
                    }
                });

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

                timeline.to(newNode, {
                    y: this.y,
                    duration: fadeIntime,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    }
                });
            });
        }

        this.numElements++;
    }

    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next;

            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
                currPtr = currPtr!.next;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr!);
            }

            if (currPtr?.next) {

                let tempPtr: LinkedListNode | null = currPtr.next;
                let initialY = this.y + this.nodeHeight * 2;
                let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", tempPtr);

                const promises: Promise<void>[] = [];

                while (tempPtr != null) {
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
                    let timeline = gsap.timeline({onComplete: () => resolve()});

                    timeline.to(newNode, {
                        nodeOpacity : 1,
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onUpdate: () => {
                            newNode.drawNode(context);
                            currPtr.drawNode(context);
                        }
                    });

                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(currPtr.x + this.nodeWidth, currPtr.y, currPtr.next!.x - (currPtr.x + this.nodeWidth) - 1, this.nodeHeight);
                            newNode.drawNode(context);
                            currPtr.drawNode(context);
                        },
                        onComplete: () => {
                            currPtr.next = newNode;
                        }
                    });

                    timeline.to(currPtr, {
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onStart: () => {
                            newNode.drawNode(context);
                        },
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

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
                await this.append(context, newData, fadeIntime);
            }
        }

        return true;
    }

    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (!this.headPtr.next) {
            return;
        }

        let firstRealNode = this.headPtr.next;
        let currPtr: LinkedListNode | null = firstRealNode?.next;

        if (!currPtr) {
            this.tailPtr = this.headPtr;
        }

        this.headPtr.next = currPtr;

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
        
        while (currPtr != null) {
            const targetX = currPtr.x - this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currPtr, {
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
            currPtr = currPtr.next;
        }

        await Promise.all(promises);
        
        this.numElements--;
        return firstRealNode.data;
    }

    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        let lastNode: LinkedListNode | null;
        let currPtr = this.headPtr;

        while (currPtr.next?.next) {
            currPtr = currPtr.next;
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }
        }

        lastNode = currPtr.next;
        currPtr.next = null;
        this.tailPtr = currPtr;
        currPtr.drawNode(context);

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
        return lastNode?.data;
    }

    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
    
        if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else if (index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next!;

            for (let i = 0; i < index - 1; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
                currPtr = currPtr.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }

            let deleteNode = currPtr.next;

            if (deleteNode!.next != null) {
                let tempPtr: LinkedListNode | null = deleteNode!.next;

                await new Promise<void>((resolve) => {
                    let timeline = gsap.timeline({onComplete: () => resolve()});

                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    timeline.to(currPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onStart: () => {
                            currPtr.next = tempPtr;
                            deleteNode!.next = null;
                        },
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    timeline.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode?.drawNode(context);
                            currPtr.drawNode(context);
                        }
                    });
                });

                const promises: Promise<void>[] = [];

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
            else {
                currPtr.next = null;
                this.tailPtr = currPtr;
                currPtr.drawNode(context);

                await new Promise<void>((resolve) => {
                    gsap.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode?.drawNode(context);
                        },
                        onComplete: () => resolve()
                    });
                });
            }

            this.numElements--;
        }

        return true;
    }

    async clear(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr.next;
        const promises: Promise<void>[] = [];

        this.tailPtr = this.headPtr;
        this.headPtr.next = null;
        this.headPtr.drawNode(context);
        this.numElements = 0;

        while (currPtr) {
            const node = currPtr;
            currPtr = currPtr.next;

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