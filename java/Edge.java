/**
 * Edge.java
 *
 * One entry of the adjacency list of the Graph.
 * It stores the neighbour city (destination vertex of the edge) and the
 * weight of the edge (road distance in kilometres).
 *
 * Used by: Graph (adjacency list), Dijkstra's algorithm.
 */
public class Edge {

    String city;      // neighbour vertex
    int distance;     // edge weight in kilometres

    public Edge(String city, int distance) {
        this.city = city;
        this.distance = distance;
    }

    public String getCity() {
        return city;
    }

    public int getDistance() {
        return distance;
    }

    /** Example: "Rajkot (215 km)" */
    @Override
    public String toString() {
        return city + " (" + distance + " km)";
    }
}
