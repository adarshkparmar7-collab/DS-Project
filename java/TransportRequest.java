/**
 * TransportRequest.java
 *
 * A request stored in the PRIORITY QUEUE.
 * It implements Comparable so the priority queue knows which request must be
 * served first, even without an external Comparator.
 *
 * Priority levels:
 *    1 = Emergency
 *    2 = Senior Citizen
 *    3 = Regular Passenger
 *
 * A SMALLER number means a HIGHER priority.
 */
public class TransportRequest implements Comparable<TransportRequest> {

    public static final int EMERGENCY = 1;
    public static final int SENIOR_CITIZEN = 2;
    public static final int REGULAR = 3;

    private int id;
    private String passengerName;
    private String source;
    private String destination;
    private int priority;
    private String note;

    public TransportRequest(int id, String passengerName, String source,
                            String destination, int priority, String note) {
        this.id = id;
        this.passengerName = passengerName;
        this.source = source;
        this.destination = destination;
        this.priority = priority;
        this.note = note;
    }

    public int getId() {
        return id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public int getPriority() {
        return priority;
    }

    public String getNote() {
        return note;
    }

    /** Human readable name of the priority number. */
    public String getPriorityName() {
        if (priority == EMERGENCY) {
            return "Emergency";
        } else if (priority == SENIOR_CITIZEN) {
            return "Senior Citizen";
        } else if (priority == REGULAR) {
            return "Regular Passenger";
        }
        return "Unknown";
    }

    /**
     * Lower priority number = more important = must be served earlier.
     * If two requests have the same priority, the one that arrived first
     * (smaller id) is served first. This is a stable FIFO tie-break.
     */
    public int compareTo(TransportRequest other) {
        if (this.priority != other.priority) {
            return this.priority - other.priority;
        }
        return this.id - other.id;
    }

    /** Example: "#1 Meena Desai [Emergency] Ahmedabad -> Jamnagar" */
    @Override
    public String toString() {
        return "#" + id + " " + passengerName + " [" + getPriorityName() + "] "
                + source + " -> " + destination + " (" + note + ")";
    }
}
