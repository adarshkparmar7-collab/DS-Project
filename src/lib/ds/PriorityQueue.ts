/**
 * PRIORITY QUEUE — binary min-heap.
 * Used to process transport requests: Emergency (1) before
 * Senior Citizen (2) before Regular Passenger (3).
 *
 * enqueue / dequeue -> O(log n),  peek -> O(1)
 */
export class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  /** Insert an element and restore the heap property bottom-up */
  enqueue(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  /** Remove the element with the highest priority (smallest value) */
  dequeue(): T | null {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const last = this.heap.pop() as T;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return top;
  }

  peek(): T | null {
    return this.isEmpty() ? null : this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  clear(): void {
    this.heap = [];
  }

  /** Heap order (useful for showing the internal heap array) */
  toHeapArray(): T[] {
    return [...this.heap];
  }

  /** Sorted snapshot: highest priority first (does not mutate the heap) */
  toArray(): T[] {
    return [...this.heap].sort(this.compare);
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parent]) < 0) {
        this.swap(index, parent);
        index = parent;
      } else break;
    }
  }

  private heapifyDown(index: number): void {
    const n = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === index) break;
      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
