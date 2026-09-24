/**
 * Custom SINGLY LINKED LIST — used to store trip / passenger history.
 * Each node stores the data and a reference to the next node.
 *
 * addLast / addFirst -> O(1) (with tail pointer),  removeFirst -> O(1),
 * insertAt / removeAt -> O(n),  traversal -> O(n)
 */
export class ListNode<T> {
  constructor(public data: T, public next: ListNode<T> | null = null) {}
}

export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private count = 0;

  /** Insert at the end (most recent trip goes to the tail) */
  addLast(data: T): void {
    const node = new ListNode<T>(data);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      (this.tail as ListNode<T>).next = node;
      this.tail = node;
    }
    this.count++;
  }

  /** Insert at the beginning (latest trip shown first) */
  addFirst(data: T): void {
    const node = new ListNode<T>(data, this.head);
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.count++;
  }

  /** Insert at a given position (0-based) */
  insertAt(index: number, data: T): boolean {
    if (index < 0 || index > this.count) return false;
    if (index === 0) {
      this.addFirst(data);
      return true;
    }
    if (index === this.count) {
      this.addLast(data);
      return true;
    }
    let current = this.head as ListNode<T>;
    for (let i = 0; i < index - 1; i++) current = current.next as ListNode<T>;
    const node = new ListNode<T>(data, current.next);
    current.next = node;
    this.count++;
    return true;
  }

  removeFirst(): T | null {
    if (this.head === null) return null;
    const data = this.head.data;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    this.count--;
    return data;
  }

  removeAt(index: number): T | null {
    if (index < 0 || index >= this.count) return null;
    if (index === 0) return this.removeFirst();
    let current = this.head as ListNode<T>;
    for (let i = 0; i < index - 1; i++) current = current.next as ListNode<T>;
    const removed = current.next as ListNode<T>;
    current.next = removed.next;
    if (removed.next === null) this.tail = current;
    this.count--;
    return removed.data;
  }

  /** Linear search inside the linked list */
  contains(match: (data: T) => boolean): boolean {
    let current = this.head;
    while (current !== null) {
      if (match(current.data)) return true;
      current = current.next;
    }
    return false;
  }

  reverse(): void {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    this.tail = this.head;
    while (current !== null) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  toArray(): T[] {
    const out: T[] = [];
    let current = this.head;
    while (current !== null) {
      out.push(current.data);
      current = current.next;
    }
    return out;
  }
}
