import java.util.ArrayList;
import java.util.Comparator;

/**
 * PriorityQueueCustom.java   (CUSTOM PRIORITY QUEUE)
 *
 * Used for transport requests where an EMERGENCY must be served before a
 * SENIOR CITIZEN, and a senior citizen before a REGULAR passenger.
 *
 * The queue keeps its internal ArrayList sorted (smallest value first), so
 * the element with the highest priority is always at index 0.
 *
 * Operations and complexity:
 *   enqueue(x) O(n)  finds the correct sorted position by shifting
 *   dequeue()  O(1)  removes index 0
 *   peek()     O(1)
 *
 * NOTE: java.util.PriorityQueue does the same job with a binary heap in
 * O(log n) per operation. It is used inside Graph.java for Dijkstra.
 */
public class PriorityQueueCustom<T> {

    private ArrayList<T> items;
    private Comparator<T> comparator;      // decides which element comes first

    public PriorityQueueCustom(Comparator<T> comparator) {
        items = new ArrayList<T>();
        this.comparator = comparator;
    }

    /** Insert the element at its sorted position (highest priority first). */
    public void enqueue(T item) {
        int index = 0;
        while (index < items.size() && comparator.compare(items.get(index), item) <= 0) {
            index++;
        }
        items.add(index, item);
    }

    /** Remove and return the element with the highest priority. */
    public T dequeue() {
        if (isEmpty()) {
            return null;                    // priority queue underflow
        }
        return items.remove(0);
    }

    /** Read the element with the highest priority without removing it. */
    public T peek() {
        if (isEmpty()) {
            return null;
        }
        return items.get(0);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int size() {
        return items.size();
    }

    public void clear() {
        items = new ArrayList<T>();
    }

    public ArrayList<T> toArrayList() {
        return new ArrayList<T>(items);
    }

    /** Display the pending requests, highest priority first. */
    public void display() {
        if (isEmpty()) {
            System.out.println("   (no pending request)");
            return;
        }
        for (int i = 0; i < items.size(); i++) {
            String marker = (i == 0) ? "   <- NEXT" : "";
            System.out.println("   " + (i + 1) + ". " + items.get(i) + marker);
        }
    }
}
