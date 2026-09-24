/**
 * STACK (LIFO) — used to store recently searched routes.
 * The latest searched route always stays on the top of the stack.
 *
 * push()  -> O(1)   pop() -> O(1)   peek() -> O(1)
 */
export class Stack<T> {
  private items: T[] = [];

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  /** Insert element on top of the stack */
  push(item: T): void {
    this.items.push(item);
  }

  /** Remove and return the top element */
  pop(): T | null {
    if (this.isEmpty()) return null;
    return this.items.pop() ?? null;
  }

  /** Return the top element without removing it */
  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  /** Top element first (index 0 = top of stack) */
  toArray(): T[] {
    return [...this.items].reverse();
  }
}
