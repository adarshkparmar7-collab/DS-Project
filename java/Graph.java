import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * Graph.java
 *
 * The transport network is stored as a GRAPH using an ADJACENCY LIST.
 *
 *   vertex  = a location  (Ahmedabad, Rajkot, Surat, ...)
 *   edge    = a road between two locations, weight = distance in km
 *
 * Internal storage:
 *   Map<String, ArrayList<Edge>> adjacencyList
 *      key   -> location name
 *      value -> list of edges starting from that location
 *
 * Why an adjacency list?
 *   - memory needed is O(V + E) instead of O(V*V) for a matrix
 *   - finding all neighbours of a city takes O(degree) only
 *   - it grows automatically when the user adds a new location
 *
 * This project uses a HashMap only as the container of the adjacency list
 * (it gives O(1) lookup of a vertex's edge list). No external library is used.
 */
public class Graph {

    private Map<String, ArrayList<Edge>> adjacencyList;
    private ArrayList<String> locations;      // keeps the insertion order

    public Graph() {
        adjacencyList = new HashMap<String, ArrayList<Edge>>();
        locations = new ArrayList<String>();
    }

    // =====================================================================
    //                              VERTICES
    // =====================================================================

    /**
     * Add a new location (vertex) to the graph.
     * Returns false when the name is invalid or the location already exists.
     */
    public boolean addLocation(String name) {
        if (name == null) {
            return false;
        }
        String key = name.trim();
        if (key.length() < 2) {                       // invalid input
            return false;
        }
        if (adjacencyList.containsKey(key)) {         // duplicate location
            return false;
        }
        adjacencyList.put(key, new ArrayList<Edge>());
        locations.add(key);
        return true;
    }

    /** Check whether a location exists. */
    public boolean contains(String city) {
        return adjacencyList.containsKey(city);
    }

    /** All locations, in the order they were added. */
    public ArrayList<String> getLocations() {
        return locations;
    }

    /** Number of vertices. */
    public int getLocationCount() {
        return locations.size();
    }

    /** Adjacency list (edge list) of one location. */
    public ArrayList<Edge> getNeighbours(String city) {
        ArrayList<Edge> edges = adjacencyList.get(city);
        if (edges == null) {
            return new ArrayList<Edge>();
        }
        return edges;
    }

    /** How many roads start from this location. */
    public int getDegree(String city) {
        return getNeighbours(city).size();
    }

    // =====================================================================
    //                                EDGES
    // =====================================================================

    /**
     * Add a route (weighted edge) between two existing locations.
     * Every road is two-way, so the edge is inserted in both directions.
     */
    public boolean addRoute(String from, String to, int distance) {
        if (!adjacencyList.containsKey(from) || !adjacencyList.containsKey(to)) {
            return false;                             // unknown location
        }
        if (from.equals(to) || distance <= 0) {
            return false;                             // invalid route
        }
        adjacencyList.get(from).add(new Edge(to, distance));
        adjacencyList.get(to).add(new Edge(from, distance));
        return true;
    }

    /** Remove the road between two locations (both directions). */
    public boolean removeRoute(String from, String to) {
        if (!adjacencyList.containsKey(from) || !adjacencyList.containsKey(to)) {
            return false;
        }
        boolean removed = removeOneDirection(from, to);
        removeOneDirection(to, from);
        return removed;
    }

    private boolean removeOneDirection(String from, String to) {
        ArrayList<Edge> edges = adjacencyList.get(from);
        for (int i = 0; i < edges.size(); i++) {
            if (edges.get(i).getCity().equals(to)) {
                edges.remove(i);
                return true;
            }
        }
        return false;
    }

    /**
     * Every road exactly once.
     * Because a two-way road is stored twice, we only keep the pair where
     * the first city name is alphabetically smaller.
     */
    public ArrayList<Route> getUniqueRoutes() {
        ArrayList<Route> routes = new ArrayList<Route>();
        for (String city : locations) {
            for (Edge edge : getNeighbours(city)) {
                if (city.compareTo(edge.getCity()) < 0) {
                    routes.add(new Route(city, edge.getCity(), edge.getDistance()));
                }
            }
        }
        return routes;
    }

    /** Number of roads (edges) counted only once. */
    public int getRouteCount() {
        return getUniqueRoutes().size();
    }

    /** Total length of all roads, in kilometres. */
    public int getTotalNetworkDistance() {
        int total = 0;
        for (Route route : getUniqueRoutes()) {
            total = total + route.getDistance();
        }
        return total;
    }

    // =====================================================================
    //                         DISPLAY (menu option 3)
    // =====================================================================

    public void display() {
        System.out.println();
        System.out.println("============ TRANSPORT NETWORK (ADJACENCY LIST) ============");
        if (locations.isEmpty()) {
            System.out.println("   (no location added yet)");
        }
        for (String city : locations) {
            System.out.print("   " + city + " -> ");
            ArrayList<Edge> edges = getNeighbours(city);
            if (edges.isEmpty()) {
                System.out.println("null");
            } else {
                for (int i = 0; i < edges.size(); i++) {
                    System.out.print(edges.get(i).getCity()
                            + " (" + edges.get(i).getDistance() + " km)");
                    if (i < edges.size() - 1) {
                        System.out.print(", ");
                    }
                }
                System.out.println();
            }
        }
        System.out.println("============================================================");
        System.out.println("   Locations : " + getLocationCount());
        System.out.println("   Routes    : " + getRouteCount());
        System.out.println("   Network   : " + getTotalNetworkDistance() + " km of road");
        System.out.println("============================================================");
    }

    // =====================================================================
    //               DIJKSTRA'S SHORTEST PATH (menu options 4 and 5)
    // =====================================================================

    /**
     * DIJKSTRA'S ALGORITHM (greedy) using a min-heap priority queue.
     *
     * 1. dist[city] = infinity for every city, dist[source] = 0
     * 2. push the source into the priority queue with key 0
     * 3. take out the closest city that is not finalised yet (greedy choice)
     * 4. for every neighbour compute  candidate = dist[current] + weight
     * 5. if candidate < dist[neighbour]  ->  RELAX the edge (update dist and
     *    previous) and push the neighbour with its new smaller distance
     * 6. repeat until the destination is finalised or the queue is empty
     * 7. rebuild the route by walking backwards through previous[]
     *
     * Time complexity : O((V + E) log V)
     * Space complexity: O(V)
     */
    public DijkstraResult shortestPath(String source, String destination) {

        ArrayList<String> emptyPath = new ArrayList<String>();
        ArrayList<String> emptyOrder = new ArrayList<String>();

        if (!adjacencyList.containsKey(source) || !adjacencyList.containsKey(destination)) {
            return new DijkstraResult(emptyPath, -1, emptyOrder);
        }

        Map<String, Integer> distance = new HashMap<String, Integer>();
        Map<String, String> previous = new HashMap<String, String>();
        Set<String> visited = new HashSet<String>();
        ArrayList<String> visitedOrder = new ArrayList<String>();

        // step 1 : initialise every distance to "infinity"
        for (String city : locations) {
            distance.put(city, Integer.MAX_VALUE);
            previous.put(city, null);
        }
        distance.put(source, 0);

        // The java.util.PriorityQueue is a BINARY MIN-HEAP, so the Edge with
        // the smallest distance is always at the root -> O(log n) operations.
        PriorityQueue<Edge> priorityQueue = new PriorityQueue<Edge>(new Comparator<Edge>() {
            public int compare(Edge first, Edge second) {
                return first.getDistance() - second.getDistance();
            }
        });
        priorityQueue.add(new Edge(source, 0));

        while (!priorityQueue.isEmpty()) {
            Edge current = priorityQueue.poll();          // step 3

            if (visited.contains(current.getCity())) {
                continue;                                 // already finalised
            }
            visited.add(current.getCity());
            visitedOrder.add(current.getCity());

            if (current.getCity().equals(destination)) {
                break;                                    // answer is final
            }

            for (Edge edge : getNeighbours(current.getCity())) {
                if (visited.contains(edge.getCity())) {
                    continue;
                }
                int candidate = distance.get(current.getCity()) + edge.getDistance();

                if (candidate < distance.get(edge.getCity())) {     // relaxation
                    distance.put(edge.getCity(), candidate);
                    previous.put(edge.getCity(), current.getCity());
                    priorityQueue.add(new Edge(edge.getCity(), candidate));
                }
            }
        }

        // no route at all -> report it instead of printing a wrong path
        if (distance.get(destination) == Integer.MAX_VALUE) {
            return new DijkstraResult(emptyPath, -1, visitedOrder);
        }

        // step 7 : rebuild the path from destination back to source
        ArrayList<String> path = new ArrayList<String>();
        String step = destination;
        while (step != null) {
            path.add(0, step);
            step = previous.get(step);
        }
        return new DijkstraResult(path, distance.get(destination), visitedOrder);
    }

    // =====================================================================
    //     BFS (kept only to compare it with Dijkstra during the viva)
    // =====================================================================

    /**
     * Breadth First Search. It ignores the weights and returns the route with
     * the SMALLEST NUMBER OF CITIES, which is not always the shortest route.
     */
    public ArrayList<String> breadthFirstSearch(String source, String destination) {

        ArrayList<String> path = new ArrayList<String>();
        if (!adjacencyList.containsKey(source) || !adjacencyList.containsKey(destination)) {
            return path;
        }

        Set<String> visited = new HashSet<String>();
        Map<String, String> previous = new HashMap<String, String>();
        ArrayList<String> queue = new ArrayList<String>();     // simple FIFO queue

        visited.add(source);
        previous.put(source, null);
        queue.add(source);

        while (!queue.isEmpty()) {
            String current = queue.remove(0);
            if (current.equals(destination)) {
                break;
            }
            for (Edge edge : getNeighbours(current)) {
                if (!visited.contains(edge.getCity())) {
                    visited.add(edge.getCity());
                    previous.put(edge.getCity(), current);
                    queue.add(edge.getCity());
                }
            }
        }

        if (!visited.contains(destination)) {
            return path;
        }
        String step = destination;
        while (step != null) {
            path.add(0, step);
            step = previous.get(step);
        }
        return path;
    }

    /** Total distance of an already known path (-1 if a road is missing). */
    public int getPathDistance(ArrayList<String> path) {
        int total = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            boolean found = false;
            for (Edge edge : getNeighbours(path.get(i))) {
                if (edge.getCity().equals(path.get(i + 1))) {
                    total = total + edge.getDistance();
                    found = true;
                    break;
                }
            }
            if (!found) {
                return -1;
            }
        }
        return total;
    }
}
