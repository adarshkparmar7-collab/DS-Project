import java.util.ArrayList;

/**
 * Queue.java   (CUSTOM QUEUE - FIFO : First In First Out)
 *
 * Used to manage passengers who are waiting for a bus or a train.
 * The passenger who joins the queue first is served first.
 *
 * A moving "front" index is used so that dequeue() never has to shift all
 * the remaining elements, which makes both operations O(1).
 *
 * Operations and complexity:
 *   enqueue(x)  O(1)   insert at the rear
 *   dequeue()   O(1)   remove from the front
 *   peekFront() O(1)   read the front element without removing it
 */
public class Queue<T> {

    private ArrayList<T> items;    // the storage of the queue
    private int front;             // index of the current front element

    public Queue() {
        items = new ArrayList<T>();
        front = 0;
    }

    /** Insert an element at the rear of the queue. */
    public void enqueue(T item) {
        items.add(item);
    }

    /** Remove and return the element at the front of the queue. */
    public T dequeue() {
        if (isEmpty()) {
            return null;                       // queue underflow
        }
        T item = items.get(front);
        front++;
        // when the queue becomes empty we reset the array to free memory
        if (front == items.size()) {
            items = new ArrayList<T>();
            front = 0;
        }
        return item;
    }

    /** Read the front element without removing it. */
    public T peekFront() {
        if (isEmpty()) {
            return null;
        }
        return items.get(front);
    }

    /** Read the rear (last inserted) element without removing it. */
    public T peekRear() {
        if (isEmpty()) {
            return null;
        }
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() {
        return front >= items.size();
    }

    public int size() {
        return items.size() - front;
    }

    /** Remove every element. */
    public void clear() {
        items = new ArrayList<T>();
        front = 0;
    }

    /** Copy the waiting elements into an ArrayList so we can print them. */
    public ArrayList<T> toArrayList() {
        ArrayList<T> copy = new ArrayList<T>();
        for (int i = front; i < items.size(); i++) {
            copy.add(items.get(i));
        }
        return copy;
    }

    /** Display the queue from front to rear. */
    public void display() {
        if (isEmpty()) {
            System.out.println("   (queue is empty)");
            return;
        }
        for (int i = front; i < items.size(); i++) {
            String marker = (i == front) ? "   <- FRONT" : "";
            System.out.println("   " + (i - front + 1) + ". " + items.get(i) + marker);
        }
    }
}
