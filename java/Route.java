/**
 * Route.java
 *
 * A single road of the transport network, used when we want to display or
 * process every road only once (the adjacency list stores each two-way road
 * twice - once for each direction).
 *
 * Used by: Graph.getUniqueRoutes(), SmartTransportPlanner (transport options).
 */
public class Route {

    private String from;
    private String to;
    private int distance;

    public Route(String from, String to, int distance) {
        this.from = from;
        this.to = to;
        this.distance = distance;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public int getDistance() {
        return distance;
    }

    @Override
    public String toString() {
        return from + " <-> " + to + " = " + distance + " km";
    }
}
