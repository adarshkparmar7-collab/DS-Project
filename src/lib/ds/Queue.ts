/**
 * QUEUE (FIFO) — used to manage passengers waiting for a bus/train.
 * Implemented with a moving "front" index so dequeue() is O(1)
 * (no array shifting like a naive implementation).
 */
export class Queue<T> {
  private items: T[] = [];
  private front = 0;

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  /** Insert an element at the rear of the queue */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** Remove the element from the front of the queue */
  dequeue(): T | null {
    if (this.isEmpty()) return null;
    const item = this.items[this.front];
    this.front++;
    // reclaim memory once the queue is fully drained
    if (this.front === this.items.length) {
      this.items = [];
      this.front = 0;
    }
    return item ?? null;
  }

  /** Element at the front without removing it */
  peekFront(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.front];
  }

  /** Element at the rear without removing it */
  peekRear(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.front >= this.items.length;
  }

  size(): number {
    return this.items.length - this.front;
  }

  clear(): void {
    this.items = [];
    this.front = 0;
  }

  toArray(): T[] {
    return this.items.slice(this.front);
  }
}
