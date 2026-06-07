import { gsap } from "gsap";

export function collectNodes<T extends { next: T | null }>(
  start: T | null,
  end?: T | null
): T[] {
  const nodes: T[] = [];
  const seen = new Set<T>();
  let curr = start;

  while (curr && !seen.has(curr)) {
    seen.add(curr);
    nodes.push(curr);

    if (curr === end) {
      break;
    }

    curr = curr.next;
  }

  return nodes;
}

export function shiftNodesTL<T extends { x: number }>(
  tl: gsap.core.Timeline,
  nodes: T[],
  dx: number,
  duration: number,
  at: gsap.Position = 0
) {
  for (const n of nodes) {
    tl.to(n, { x: `+=${dx}`, duration }, at);
  }
}

export async function withRenderLoop(
  context: CanvasRenderingContext2D,
  render: (context: CanvasRenderingContext2D) => void,
  promises: Promise<void>[]
) {
  let active = true;

  const loop = () => {
    if (active) render(context);
  };

  gsap.ticker.add(loop);

  try {
    await Promise.all(promises);
  } finally {
    active = false;
    gsap.ticker.remove(loop);
    render(context);
  }
}

export function timelinePromise(
  build: (tl: gsap.core.Timeline) => void
): Promise<void> {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    build(tl);
  });
}

export async function withRenderTimeline(
  context: CanvasRenderingContext2D,
  render: (context: CanvasRenderingContext2D) => void,
  build: (tl: gsap.core.Timeline) => void
) {
  await withRenderLoop(context, render, [timelinePromise(build)]);
}

export async function highlightNode<
  T extends {
    outlineColor: string;
    fillColor: string;
  }
>(
  context: CanvasRenderingContext2D,
  node: T,
  render: (context: CanvasRenderingContext2D) => void,
  durationMs: number = 500,
  outlineColor = "red",
  fillColor = "yellow"
) {
  const oldOutline = node.outlineColor;
  const oldFill = node.fillColor;

  node.outlineColor = outlineColor;
  node.fillColor = fillColor;
  render(context);

  await new Promise<void>((resolve) => setTimeout(resolve, durationMs));

  node.outlineColor = oldOutline;
  node.fillColor = oldFill;
  render(context);
}