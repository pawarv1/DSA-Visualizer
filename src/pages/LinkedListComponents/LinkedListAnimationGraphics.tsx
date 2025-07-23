import gsap, { context, set, timeline } from "gsap";
import { Arrow, Text } from "../GeneralAnimating/GeneralAnimationGraphics";

export class LinkedListNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacity: number;
    outlineColor: string;
    fillColor: string;
    next: LinkedListNode | null;
    pointerArrow: Arrow | null;

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white", next: LinkedListNode | null = null) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.next = next;
        this.pointerArrow = null;
    }

    // Adjust font size to fit within the node
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.data).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth * 2/3) - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.data).width;
        }
        return context.font;
    }

    drawPointer(context: CanvasRenderingContext2D) {
        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";

        if (this.next) {
            this.pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
            this.pointerArrow.draw(context);
        } else {
            const ptrX = this.x + (this.nodeWidth * 2 / 3);
            const ptrY = this.y;
            const ptrWidth = this.nodeWidth / 3;
            const ptrHeight = this.nodeHeight;
            context.font = "10px Arial";
            context.fillStyle = "red";
            context.fillText("null", ptrX + ptrWidth / 2, ptrY + ptrHeight / 2);
        }

        context.restore();
    }

    drawNode(context: CanvasRenderingContext2D, redrawPointer: boolean = true) {
        this.clearNode(context);
        context.save();
        context.globalAlpha = this.nodeOpacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.nodeWidth * 2/3, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const font = this.adjustFontSize(context);
        context.font = font;
        context.fillText(this.data, this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);
        if (redrawPointer) {
            this.drawPointer(context);
        }
        context.restore();
    }

    clearNode(context: CanvasRenderingContext2D) { 
        context.clearRect(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2);
    }
}


export class LinkedList {
    protected headPtr: LinkedListNode | null;
    protected tailPtr: LinkedListNode | null;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1, protected outlineColor: string = "black", protected fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currPtr = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currPtr === null) {
                this.headPtr = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.outlineColor, this.fillColor);
                this.headPtr.drawNode(context);
                currPtr = this.headPtr;
            }
            else {
                let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.outlineColor, this.fillColor);
                currPtr.next = newNode;
                currPtr.drawNode(context);
                newNode.drawNode(context);
                currPtr = currPtr.next;
            }

            this.tailPtr = currPtr;
            this.numElements++;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;

        while(currPtr) {
            currPtr.drawNode(context);
            currPtr = currPtr.next;
        }
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getSize() {
        return this.numElements;
    }

    async highlightNode(context: CanvasRenderingContext2D, node: LinkedListNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        return new Promise<void>((resolve) => {
            node.outlineColor = outlineColor
            node.fillColor = fillColor;
            node.drawNode(context);

            setTimeout(() => {
                node.outlineColor = this.outlineColor;
                node.fillColor = this.fillColor;
                node.drawNode(context);
                resolve();
            }, duration);
        });
    }

    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

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
        let currPtr = this.headPtr;
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
        let currPtr = this.headPtr;
        let index = 0;

        while (currPtr) {
            await this.highlightNode(context, currPtr);
            console.log(`[${index}]: ${currPtr.data}`);
            currPtr = currPtr.next;
            index++;
        }
    }

    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let newNode: LinkedListNode;

        if (this.headPtr === null) {
            newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, this.outlineColor, this.fillColor);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currPtr: LinkedListNode | null;

            if (usingTailPointer) {
                currPtr = this.tailPtr;
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
            }
            else {
                currPtr = this.headPtr;

                while (currPtr.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currPtr);
                    }
                    currPtr = currPtr.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
            }

            newNode = new LinkedListNode(currPtr!.x + this.nodeWidth * 2, currPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, this.outlineColor, this.fillColor);
            currPtr!.next = newNode;
            currPtr?.drawNode(context);
            this.tailPtr = newNode;
        }

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
        let currPtr: LinkedListNode | null = this.headPtr;
        
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

        let newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, this.outlineColor, this.fillColor);
        newNode.next = this.headPtr;

        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        this.headPtr = newNode;

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

    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(this.headPtr === null || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
                currPtr = currPtr.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }

            if (currPtr.next) {

                let tempPtr: LinkedListNode | null = currPtr.next;
                let initialY = this.y + this.nodeHeight * 2;
                let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, this.outlineColor, this.fillColor, tempPtr);

                const promises: Promise<void>[] = [];

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
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;
            firstNode.next = null;

            if (!this.headPtr) {
                this.tailPtr = null;
            }

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

            let currPtr: LinkedListNode | null = this.headPtr;
            const promises: Promise<void>[] = [];
            
            while (currPtr) {
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
            return firstNode.data;
        }
    }

    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode: LinkedListNode | null;

            if (this.headPtr.next === null) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currPtr = this.headPtr;

                while (currPtr.next?.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currPtr);
                    }
                    currPtr = currPtr.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }

                lastNode = currPtr.next;
                currPtr.next = null;
                this.tailPtr = currPtr;
                currPtr.drawNode(context);
            }

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
    }

    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else if (this.headPtr === null || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

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

    async reverse(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (!this.headPtr || !this.headPtr.next) {
            return;
        }

        let prevPtr: LinkedListNode | null = null;
        let currPtr: LinkedListNode | null = this.headPtr;
        let newX = this.x;

        while (currPtr) {
            let nextPtr: LinkedListNode | null = currPtr.next;
            await this.highlightNode(context, currPtr);
            await new Promise<void>((resolve) => {
                let timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currPtr, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        currPtr?.drawNode(context);
                    },
                    onComplete: () => {
                        currPtr!.next = prevPtr;
                    }
                });
                timeline.to(currPtr, {
                    pointerOpacity: 0.25,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        prevPtr?.drawNode(context, !(prevPtr?.next));
                        currPtr?.drawNode(context);
                    }
                });
            });
            prevPtr = currPtr;
            currPtr = nextPtr;
        }

        this.tailPtr = this.headPtr;
        this.headPtr = prevPtr;

        currPtr = this.headPtr;
        const promises: Promise<void>[] = [];

        while (currPtr) {
            const targetX = newX;
            const promise = new Promise<void>((resolve) => {
                let timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currPtr, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                });
                timeline.to(currPtr, {
                    pointerOpacity: 1,
                    duration: 0,
                    onUpdate: () => {
                        currPtr?.drawNode(context);
                    },
                });
            });

            promises.push(promise);
            newX += this.nodeWidth * 2;
            currPtr = currPtr.next;
        }

        await Promise.all(promises);
    }

    async clear(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;
        const promises: Promise<void>[] = [];

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
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }
}



