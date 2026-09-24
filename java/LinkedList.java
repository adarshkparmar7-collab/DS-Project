import java.util.ArrayList;

/**
 * LinkedList.java   (CUSTOM SINGLY LINKED LIST)
 *
 * Used to store the trip history dynamically. The number of trips is not
 * known in advance, and the list has to grow at run time, which is exactly
 * what a linked list is good at.
 *
 * Structure:   head -> [node] -> [node] -> ... -> null
 *
 * Operations and complexity:
 *   addLast(x)   O(1)   we always keep the tail reference
 *   addFirst(x)  O(1)
 *   removeFirst() O(1)
 *   reverse()    O(n)
 *   search(x)    O(n)   linear search, node by node
 *   display()    O(n)
 */
class ListNode<T> {

    T data;              // the value stored in this node
    ListNode<T> next;    // reference to the next node (null = end of list)

    ListNode(T data) {
        this.data = data;
        this.next = null;
    }
}

public class LinkedList<T> {

    private ListNode<T> head;
    private ListNode<T> tail;
    private int size;

    public LinkedList() {
        head = null;
        tail = null;
        size = 0;
    }

    /** Insert a new node at the END of the list. */
    public void addLast(T data) {
        ListNode<T> node = new ListNode<T>(data);
        if (head == null) {              // list was empty
            head = node;
            tail = node;
        } else {
            tail.next = node;            // link the old tail to the new node
            tail = node;                 // move the tail forward
        }
        size++;
    }

    /** Insert a new node at the BEGINNING of the list. */
    public void addFirst(T data) {
        ListNode<T> node = new ListNode<T>(data);
        node.next = head;
        head = node;
        if (tail == null) {              // list was empty
            tail = node;
        }
        size++;
    }

    /** Remove and return the first node of the list. */
    public T removeFirst() {
        if (head == null) {
            return null;                 // list underflow
        }
        T data = head.data;
        head = head.next;
        if (head == null) {              // list became empty
            tail = null;
        }
        size--;
        return data;
    }

    /** Remove and return the LAST node (must walk up to the second last). */
    public T removeLast() {
        if (head == null) {
            return null;
        }
        if (head == tail) {              // only one node
            T data = head.data;
            head = null;
            tail = null;
            size = 0;
            return data;
        }
        ListNode<T> current = head;
        while (current.next != tail) {   // stop at the second last node
            current = current.next;
        }
        T data = tail.data;
        tail = current;
        tail.next = null;
        size--;
        return data;
    }

    /** Reverse the whole list by re-linking every node. */
    public void reverse() {
        if (head == null || head == tail) {
            return;                      // 0 or 1 node: nothing to do
        }
        ListNode<T> previous = null;
        ListNode<T> current = head;
        tail = head;
        while (current != null) {
            ListNode<T> next = current.next;   // remember the rest of the list
            current.next = previous;           // reverse the current link
            previous = current;
            current = next;
        }
        head = previous;
    }

    /** LINEAR SEARCH: walk from head to null and compare every node. */
    public boolean contains(T key) {
        ListNode<T> current = head;
        while (current != null) {
            if (current.data.equals(key)) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public void clear() {
        head = null;
        tail = null;
        size = 0;
    }

    /** Copy the data of every node into an ArrayList (used for printing). */
    public ArrayList<T> toArrayList() {
        ArrayList<T> result = new ArrayList<T>();
        ListNode<T> current = head;
        while (current != null) {
            result.add(current.data);
            current = current.next;
        }
        return result;
    }

    /** Print the list like a diagram:  head -> [ A ] -> [ B ] -> null */
    public void displayLinks() {
        if (head == null) {
            System.out.println("   head -> null   (no trip recorded yet)");
            return;
        }
        System.out.print("   head");
        ListNode<T> current = head;
        while (current != null) {
            System.out.print(" -> [ " + current.data + " ]");
            current = current.next;
        }
        System.out.println(" -> null");
    }
}
