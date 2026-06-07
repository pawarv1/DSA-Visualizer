import { gsap } from "gsap";
import { DLLNode } from "./DLLNode";
import { SLLNode } from "./SLLNode";
import { CircularLLNode } from "./CLLNode";
import { CircularDLLNode } from "./CircularDLLNode";

// This type can be any node types
type LLNodeType = SLLNode | DLLNode;

// This type only be circular node types
type CircularLLNodeType = CircularLLNode | DLLNode;

export function collectNodes(start: LLNodeType | null): LLNodeType[] {
  const nodes: LLNodeType[] = [];
  const seen = new Set<LLNodeType>();
  let curr = start;

  while (curr && !seen.has(curr)) {
      seen.add(curr);
      nodes.push(curr);
      curr = curr.next;
  }
  return nodes;
}

// This method only works for circular linked list types
export function collectToTail(start: CircularLLNodeType | null, tail: CircularLLNodeType | null): CircularLLNodeType[] {
    const nodes: CircularLLNodeType[] = [];
    const visited = new Set<CircularLLNodeType>();
    let curr = start;

    while (curr && !visited.has(curr)) {
        visited.add(curr);
        nodes.push(curr);
        if (curr === tail) break;
        curr = curr.next;
    }
    return nodes;
}

export function shiftNodesTL(tl: gsap.core.Timeline, nodes: LLNodeType[], dx: number, duration: number, at: gsap.Position = 0) {
  for (const n of nodes) {
    tl.to(n, { x: `+=${dx}`, duration }, at);
  }
}

export async function withRenderLoop(context: CanvasRenderingContext2D, render: (context: CanvasRenderingContext2D) => void, promises: Promise<void>[]) {
  let active = true;
  const loop = () => { if (active) render(context); };

  gsap.ticker.add(loop);
  try {
      await Promise.all(promises);
  } finally {
      active = false;
      gsap.ticker.remove(loop);
      render(context);
  }
}

export function timelinePromise(build: (tl: gsap.core.Timeline) => void) {
    return new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        build(tl);
    });
}

export async function withRenderTimeline(context: CanvasRenderingContext2D, render: (context: CanvasRenderingContext2D) => void, build: (tl: gsap.core.Timeline) => void) {
    await withRenderLoop(context, render, [timelinePromise(build)]);
}

// Method to higlight a specific node for a short duration then set it back to normal afterwards
export async function highlightNode(context: CanvasRenderingContext2D, node: LLNodeType, render: (context: CanvasRenderingContext2D) => void, durationMs: number = 500, outlineColor = "red", fillColor = "yellow") {
    const oldOutline = node.outlineColor;
    const oldFill = node.fillColor;

    node.outlineColor = outlineColor;
    node.fillColor = fillColor;
    render(context);
    
    await new Promise<void>(resolve => setTimeout(resolve, durationMs));

    node.outlineColor = oldOutline;
    node.fillColor = oldFill;
    render(context);
}