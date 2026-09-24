/**
 * SEARCHING & SORTING utilities.
 * Written from scratch (no library sort / search) so the logic can be
 * explained line by line during the viva.
 */

/** LINEAR SEARCH — O(n). Used for locations (unsorted list of strings). */
export function linearSearch<T>(items: T[], match: (item: T) => boolean): T[] {
  const results: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (match(items[i])) results.push(items[i]);
  }
  return results;
}

/** BINARY SEARCH — O(log n). The array MUST already be sorted by the same key. */
export function binarySearch<T>(sortedItems: T[], key: string, keyOf: (item: T) => string): T[] {
  const target = key.toLowerCase();
  const results: T[] = [];
  let low = 0;
  let high = sortedItems.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midKey = keyOf(sortedItems[mid]).toLowerCase();
    if (midKey === target) {
      results.push(sortedItems[mid]);
      // collect duplicates on both sides
      let i = mid - 1;
      while (i >= 0 && keyOf(sortedItems[i]).toLowerCase() === target) {
        results.push(sortedItems[i]);
        i--;
      }
      let j = mid + 1;
      while (j < sortedItems.length && keyOf(sortedItems[j]).toLowerCase() === target) {
        results.push(sortedItems[j]);
        j++;
      }
      return results;
    }
    if (target < midKey) high = mid - 1;
    else low = mid + 1;
  }
  return results;
}

/** Prefix / substring match helper used by the location search box */
export function fuzzyMatch(term: string, value: string): boolean {
  return value.toLowerCase().includes(term.trim().toLowerCase());
}

/** QUICK SORT — O(n log n) average. In-place with the last element as pivot. */
export function quickSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
  const copy = [...items];
  sort(copy, 0, copy.length - 1, compare);
  return copy;
}

function sort<T>(arr: T[], low: number, high: number, compare: (a: T, b: T) => number): void {
  if (low < high) {
    const p = partition(arr, low, high, compare);
    sort(arr, low, p - 1, compare);
    sort(arr, p + 1, high, compare);
  }
}

function partition<T>(arr: T[], low: number, high: number, compare: (a: T, b: T) => number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (compare(arr[j], pivot) <= 0) {
      i++;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }
  const tmp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = tmp;
  return i + 1;
}

/** BUBBLE SORT — O(n^2). Kept to show the classic classroom sorting algorithm. */
export function bubbleSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
  const copy = [...items];
  for (let i = 0; i < copy.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < copy.length - 1 - i; j++) {
      if (compare(copy[j], copy[j + 1]) > 0) {
        const tmp = copy[j];
        copy[j] = copy[j + 1];
        copy[j + 1] = tmp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return copy;
}
