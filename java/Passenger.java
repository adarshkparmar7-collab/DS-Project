/**
 * Passenger.java
 *
 * A passenger waiting in the normal FIFO queue.
 * Stored inside Queue<Passenger>.
 */
public class Passenger {

    private int id;                 // 101, 102, 103 ...
    private String name;
    private String source;          // boarding location
    private String destination;     // where the passenger wants to go

    public Passenger(int id, String name, String source, String destination) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.destination = destination;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    /** Example: "Passenger ID: 101 | Name: Rahul | Ahmedabad -> Rajkot" */
    @Override
    public String toString() {
        return "Passenger ID: " + id + " | Name: " + name
                + " | " + source + " -> " + destination;
    }
}
