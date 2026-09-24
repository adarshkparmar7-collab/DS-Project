import java.util.ArrayList;

/**
 * DijkstraResult.java
 *
 * Simple holder class for the output of Dijkstra's shortest path algorithm.
 * A "data transfer object" keeps the main class clean and makes the result
 * easy to reuse: menu option 4 stores it, menu option 5 prints it again.
 *
 * totalDistance = -1  means the destination is not reachable.
 */
public class DijkstraResult {

    private ArrayList<String> path;          // complete route, source first
    private int totalDistance;               // sum of all edge weights
    private ArrayList<String> visitedOrder;  // order in which cities were finalised

    public DijkstraResult(ArrayList<String> path, int totalDistance, ArrayList<String> visitedOrder) {
        this.path = path;
        this.totalDistance = totalDistance;
        this.visitedOrder = visitedOrder;
    }

    public ArrayList<String> getPath() {
        return path;
    }

    public int getTotalDistance() {
        return totalDistance;
    }

    public ArrayList<String> getVisitedOrder() {
        return visitedOrder;
    }

    /** True when a route between the two cities really exists. */
    public boolean isReachable() {
        return totalDistance >= 0 && !path.isEmpty();
    }

    /** Number of roads travelled (edges of the path). */
    public int getHopCount() {
        if (path.isEmpty()) {
            return 0;
        }
        return path.size() - 1;
    }
}
