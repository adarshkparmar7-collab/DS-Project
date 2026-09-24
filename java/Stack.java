import java.util.ArrayList;

/**
 * Stack.java   (CUSTOM STACK - LIFO : Last In First Out)
 *
 * Used to remember the routes that the user searched recently.
 * The latest searched route is always on the TOP of the stack.
 *
 * Operations and complexity:  push O(1), pop O(1), peek O(1)
 */
public class Stack<T> {

    private ArrayList<T> items;

    public Stack() {
        items = new ArrayList<T>();
    }

    /** Insert an element on the top of the stack. */
    public void push(T item) {
        items.add(item);
    }

    /** Remove and return the top element of the stack. */
    public T pop() {
        if (isEmpty()) {
            System.out.println("Stack underflow! There is no recent route to remove.");
            return null;
        }
        return items.remove(items.size() - 1);
    }

    /** Read the top element without removing it. */
    public T peek() {
        if (isEmpty()) {
            return null;
        }
        return items.get(items.size() - 1);
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

    /** Display the stack, top element first. */
    public void display() {
        if (isEmpty()) {
            System.out.println("   (stack is empty)");
            return;
        }
        for (int i = items.size() - 1; i >= 0; i--) {
            String marker = (i == items.size() - 1) ? "   <- TOP" : "";
            System.out.println("   " + (items.size() - i) + ". " + items.get(i) + marker);
        }
    }
}
