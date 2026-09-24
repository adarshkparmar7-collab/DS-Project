export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface DocSection {
  id: string;
  number: number;
  title: string;
  blocks: Block[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction",
    blocks: [
      {
        type: "p",
        text: "The Smart Transport Planner is a menu-driven application that plans road journeys between cities using fundamental Data Structures. Locations are modelled as vertices of a graph, roads as weighted edges, and Dijkstra's algorithm finds the cheapest (shortest) route between any two locations. The system also manages the day-to-day working of a transport service: passengers waiting in a queue, emergency requests handled by a priority queue, trip history maintained in a linked list and recently searched routes remembered on a stack.",
      },
      {
        type: "p",
        text: "The project deliberately avoids external libraries — every data structure (graph, queue, priority queue, stack and linked list) and every algorithm (Dijkstra, BFS, linear search, binary search, quick sort, bubble sort) is implemented from scratch so that the underlying concepts can be demonstrated and explained during a viva.",
      },
    ],
  },
  {
    id: "problem",
    number: 2,
    title: "Problem Statement",
    blocks: [
      {
        type: "p",
        text: "Travellers and transport operators have to answer the same set of questions every day: which route is shortest, how far is it, which service is cheapest or fastest, who is waiting, and who must be served first. Doing this manually on a map is slow and error prone, especially when the network keeps growing.",
      },
      {
        type: "ul",
        items: [
          "There is no single place where locations, roads, passengers and transport services are stored together.",
          "Finding the shortest route on a growing network by hand becomes impossible.",
          "Passengers are served in an arbitrary order — emergency cases are not distinguished from regular ones.",
          "Travel history and previously searched routes are not recorded, so the operator cannot answer queries quickly.",
          "Transport options are unsorted, so comparing them by distance, time or price is difficult.",
        ],
      },
    ],
  },
  {
    id: "objectives",
    number: 3,
    title: "Objectives",
    blocks: [
      {
        type: "ol",
        items: [
          "To represent a transport network as a graph using an adjacency list.",
          "To implement Dijkstra's shortest path algorithm with a priority queue and display the complete route with its total distance.",
          "To manage waiting passengers using a FIFO queue (enqueue, dequeue, display).",
          "To process transport requests according to priority — Emergency → Senior Citizen → Regular — using a priority queue.",
          "To store and display trip history dynamically using a custom singly linked list.",
          "To remember recently searched routes using a stack and allow the last search to be displayed or removed.",
          "To search locations, passengers and transport records using linear and binary search.",
          "To sort transport options by distance, travel time or ticket price using quick sort (and bubble sort for comparison).",
          "To validate all user input and display a clear result after every operation.",
        ],
      },
    ],
  },
  {
    id: "proposed",
    number: 4,
    title: "Proposed System",
    blocks: [
      {
        type: "p",
        text: "The proposed system is a single application that stores the transport network in a graph and exposes fifteen menu operations to the user. All operations work on the same in-memory data structures, so an update made through one option is instantly visible through every other option.",
      },
      {
        type: "code",
        text: `                 +----------------------------------------------+
   user  --->    |        Smart Transport Planner (menu)         |
                 +----------------------------------------------+
                    |            |            |           |
             Graph +       Queue +     Priority     Stack +
           Dijkstra     (passengers)  Queue +      (recent
             (routes)                 (requests)    routes)
                    |            |            |           |
                    +------+-----+-----+------+-----+-----+
                           |                 |           |
                    Searching           Sorting     Linked List
                 (locations/options)  (options)   (trip history)`,
      },
      {
        type: "ul",
        items: [
          "Sample Gujarat network (7 locations, 8 routes) is loaded automatically for easy demonstration.",
          "New locations and routes can be added at run time; the adjacency list and the transport catalogue update immediately.",
          "Every completed trip (from the queue or from the priority queue) is appended to the linked list history.",
          "The operator can compare Dijkstra (shortest distance) with BFS (fewest stops) to understand the difference.",
        ],
      },
    ],
  },
  {
    id: "features",
    number: 5,
    title: "Features",
    blocks: [
      {
        type: "table",
        head: ["#", "Menu option", "Data structure / algorithm used"],
        rows: [
          ["1", "Add Location", "Graph — insert vertex into adjacency list"],
          ["2", "Add Route", "Graph — insert weighted edge (both directions)"],
          ["3", "Display Transport Network", "Graph — adjacency list traversal"],
          ["4", "Find Shortest Route", "Dijkstra's algorithm + priority queue"],
          ["5", "Display Route Distance", "Dijkstra result + path reconstruction"],
          ["6", "Add Passenger", "Queue — enqueue"],
          ["7", "Display Passenger Queue", "Queue — traversal, front/rear pointers"],
          ["8", "Process Passenger", "Queue — dequeue + linked list insert"],
          ["9", "Add Transport Request", "Priority queue — insert by priority"],
          ["10", "Process Priority Request", "Priority queue — extract-min"],
          ["11", "Search Location", "Linear search"],
          ["12", "Sort Transport Options", "Quick sort / bubble sort + binary search"],
          ["13", "View Recent Routes", "Stack — push, pop, peek"],
          ["14", "View Passenger / Trip History", "Linked list — traversal, reverse"],
          ["15", "Exit", "Terminates the menu loop"],
        ],
      },
      {
        type: "ul",
        items: [
          "Input validation: empty names, duplicate locations, unknown cities, negative distances and non-numeric menu choices are rejected with a clear message.",
          "Live statistics: number of locations, routes, waiting passengers, pending requests and recorded trips.",
          "Sample data included so the project can be demonstrated immediately.",
        ],
      },
    ],
  },
  {
    id: "ds",
    number: 6,
    title: "Data Structures Used",
    blocks: [
      {
        type: "table",
        head: ["Data structure", "Where it is used", "Key operations", "Complexity"],
        rows: [
          [
            "Graph (adjacency list)",
            "Locations and roads of the transport network",
            "addLocation, addRoute, getNeighbours",
            "O(V + E) space, O(degree) neighbour scan",
          ],
          [
            "Priority Queue (min-heap)",
            "Dijkstra's frontier + emergency transport requests",
            "enqueue, dequeue, peek",
            "O(log n) insert / extract",
          ],
          [
            "Queue (FIFO)",
            "Passengers waiting for a bus or train",
            "enqueue, dequeue, peekFront",
            "O(1) each",
          ],
          [
            "Linked List (singly)",
            "Trip / passenger history",
            "addLast, addFirst, removeFirst, reverse, traversal",
            "O(1) insert at ends, O(n) search",
          ],
          [
            "Stack (LIFO)",
            "Recently searched routes",
            "push, pop, peek, isEmpty",
            "O(1) each",
          ],
          [
            "Array / ArrayList",
            "Transport options, distance table, visited set",
            "get, set, contains",
            "O(1) access",
          ],
        ],
      },
      {
        type: "p",
        text: "HashMap (Java) / Map (TypeScript) is used only as the container of the adjacency list, because a hash map gives O(1) lookup of a vertex's edge list. No third-party library is used anywhere in the project.",
      },
    ],
  },
  {
    id: "algorithms",
    number: 7,
    title: "Algorithms Used",
    blocks: [
      {
        type: "table",
        head: ["Algorithm", "Purpose", "Time complexity", "Space"],
        rows: [
          ["Dijkstra's algorithm", "Shortest route between two locations", "O((V + E) log V)", "O(V)"],
          ["Breadth First Search", "Route with the fewest stops (comparison)", "O(V + E)", "O(V)"],
          ["Linear search", "Search locations / passenger records", "O(n)", "O(1)"],
          ["Binary search", "Search operator in the sorted catalogue", "O(log n)", "O(1)"],
          ["Quick sort", "Sort transport options by distance / time / price", "O(n log n) average", "O(n) for the copy"],
          ["Bubble sort", "Same sorting, kept for comparison", "O(n²)", "O(1) extra"],
          ["Heapify (up / down)", "Restores the min-heap after insert / delete", "O(log n)", "O(1)"],
        ],
      },
    ],
  },
  {
    id: "flow",
    number: 8,
    title: "System Flow",
    blocks: [
      {
        type: "code",
        text: `START
  |
  v
Load sample data (locations + routes into the graph)
  |
  v
+-------------------> Display menu (1 - 15) <----------------------+
|                                                                     |
|   1. Add Location  -----> validate name -----> insert vertex       |
|   2. Add Route     -----> validate cities ---> insert edge         |
|   3. Display Network --> print adjacency list                      |
|   4. Find Shortest  ----> Dijkstra -----> print path + distance    |
|                            |                                       |
|                            +------> push on the stack (13)         |
|   5. Display Distance -> print the last Dijkstra result            |
|   6. Add Passenger  -----> enqueue into the passenger queue        |
|   7. Display Queue  -----> traverse from front to rear             |
|   8. Process Passenger -> dequeue ----> Dijkstra ----> addLast     |
|                                                   into linked list |
|   9. Add Request    -----> insert into the priority queue          |
|  10. Process Request -> extract highest priority -> linked list    |
|  11. Search Location --> linear search over the vertex list        |
|  12. Sort Options   ----> quick sort / bubble sort + binary search |
|  13. Recent Routes  ----> display / pop the stack                  |
|  14. Trip History   ----> traverse the linked list                 |
|                                                                     |
+---------------- choice != 15 --------------------------------------+
  |
  v
STOP`,
      },
    ],
  },
  {
    id: "classes",
    number: 9,
    title: "Class Structure",
    blocks: [
      {
        type: "p",
        text: "All fourteen .java files are part of this repository in the java/ folder. They share the default package, so they can be compiled together with a single command: javac *.java and executed with java SmartTransportPlanner. Two helper scripts (compile-and-run.bat for Windows and compile-and-run.sh for Linux/macOS) do this in one click, and README.md plus sample-output.txt are provided in the same folder.",
      },
      {
        type: "code",
        text: `java/
 |- Edge.java                  adjacency list entry (neighbour + weight)
 |- Route.java                 one two-way road, listed once
 |- DijkstraResult.java        path + total distance + visited order
 |- Graph.java                 adjacency list, Dijkstra, BFS
 |- Queue.java                 custom FIFO queue
 |- PriorityQueueCustom.java   custom priority queue
 |- Stack.java                 custom LIFO stack
 |- LinkedList.java            custom singly linked list (+ ListNode)
 |- Passenger.java             queue entity
 |- TransportRequest.java      priority queue entity (Comparable)
 |- TripRecord.java            history node data
 |- TransportOption.java       transport service record
 |- SearchSort.java            searching + sorting utilities
 |- SmartTransportPlanner.java MAIN class - 15 option Scanner menu
 |- README.md, sample-output.txt, compile-and-run.bat/.sh`,
      },
      {
        type: "table",
        head: ["Class", "Responsibility", "Important members"],
        rows: [
          [
            "Edge",
            "One adjacency-list entry",
            "String city, int distance",
          ],
          [
            "Graph",
            "Adjacency list + Dijkstra + BFS",
            "Map<String, List<Edge>> adjacencyList, addLocation(), addRoute(), shortestPath(), bfs()",
          ],
          [
            "DijkstraResult",
            "Output of the shortest path algorithm",
            "List<String> path, int totalDistance, isReachable()",
          ],
          [
            "Queue<T>",
            "Custom FIFO queue",
            "enqueue(), dequeue(), peekFront(), size()",
          ],
          [
            "PriorityQueueCustom<T>",
            "Custom priority queue",
            "enqueue(), dequeue(), peek(), Comparator<T>",
          ],
          [
            "Stack<T>",
            "Custom LIFO stack",
            "push(), pop(), peek(), display()",
          ],
          [
            "LinkedList<T> / ListNode<T>",
            "Custom singly linked list",
            "addLast(), addFirst(), removeFirst(), reverse(), toArrayList()",
          ],
          [
            "Passenger",
            "Queue entity",
            "id, name, source, destination",
          ],
          [
            "TransportRequest",
            "Priority queue entity",
            "id, passengerName, source, destination, priority (1/2/3), compareTo()",
          ],
          [
            "TripRecord",
            "Linked list node data",
            "passenger, source, destination, distance, route, transportType, fare",
          ],
          [
            "TransportOption",
            "Service record for sorting/searching",
            "name, type, source, destination, distance, timeMinutes, price",
          ],
          [
            "SearchSort",
            "Static searching and sorting utilities",
            "linearSearch(), binarySearchByName(), quickSort(), bubbleSort(), comparators",
          ],
          [
            "SmartTransportPlanner",
            "Main class — menu, sample data, coordination",
            "main(), runMenu(), loadSampleData(), readInt(), readText()",
          ],
        ],
      },
    ],
  },
  {
    id: "algorithm-explanation",
    number: 10,
    title: "Algorithm Explanation",
    blocks: [
      { type: "p", text: "Dijkstra's algorithm (greedy, weighted shortest path)" },
      {
        type: "ol",
        items: [
          "Set dist[city] = ∞ for every location and dist[source] = 0.",
          "Insert the source into a min-heap priority queue with key 0.",
          "Remove the closest unfinalised city from the heap (greedy choice) and mark it visited.",
          "For every neighbour of that city compute candidate = dist[current] + edgeWeight.",
          "If candidate < dist[neighbour], update dist[neighbour], set previous[neighbour] = current and push the neighbour into the heap. This is called edge relaxation.",
          "Repeat until the destination is finalised or the heap becomes empty.",
          "Rebuild the route by walking backwards from destination to source through the previous[] array.",
        ],
      },
      {
        type: "code",
        text: `while (!pq.isEmpty()) {
    Edge current = pq.poll();                 // closest unfinalised city
    if (visited.contains(current.city)) continue;
    visited.add(current.city);
    if (current.city.equals(destination)) break;

    for (Edge edge : graph.getNeighbours(current.city)) {
        if (visited.contains(edge.city)) continue;
        int newDistance = distance.get(current.city) + edge.distance;
        if (newDistance < distance.get(edge.city)) {     // relaxation
            distance.put(edge.city, newDistance);
            previous.put(edge.city, current.city);
            pq.add(new Edge(edge.city, newDistance));
        }
    }
}`,
      },
      {
        type: "p",
        text: "Priority queue for requests — every request carries a priority number (1 = Emergency, 2 = Senior Citizen, 3 = Regular). The min-heap keeps the request with the smallest number at the root, so extract-min always returns the most urgent request. If two requests share the same priority, the smaller id (earlier arrival) is served first — a stable FIFO tie-break.",
      },
      {
        type: "p",
        text: "Quick sort — the last element is chosen as the pivot; smaller or equal elements are moved to its left and larger ones to its right (partition), then both halves are sorted recursively. Average complexity is O(n log n), worst case O(n²) when the array is already sorted.",
      },
      {
        type: "p",
        text: "Binary search — the catalogue must first be sorted by name. The middle element is compared with the key; if it does not match, half of the remaining range is discarded, giving O(log n) lookups.",
      },
    ],
  },
  {
    id: "sample-input",
    number: 11,
    title: "Sample Input",
    blocks: [
      {
        type: "code",
        text: `Choice: 4
Enter source: Ahmedabad
Enter destination: Rajkot

Choice: 4
Enter source: Ahmedabad
Enter destination: Surat

Choice: 6
Enter passenger name: Rahul
Enter boarding location: Ahmedabad
Enter destination: Rajkot

Choice: 9
Enter passenger name: Meena Desai
Enter source: Ahmedabad
Enter destination: Jamnagar
Priority (1 = Emergency, 2 = Senior Citizen, 3 = Regular): 1

Choice: 12
Sort by -> 1.Distance  2.Travel Time  3.Ticket Price: 3

Choice: 11
Enter location name (or part of it): abad`,
      },
    ],
  },
  {
    id: "sample-output",
    number: 12,
    title: "Sample Output",
    blocks: [
      {
        type: "code",
        text: `--------- DIJKSTRA'S SHORTEST PATH ---------
Source         : Ahmedabad
Destination    : Rajkot
Shortest Route : Ahmedabad -> Rajkot
Total Distance : 215 km
---------------------------------------------

--------- DIJKSTRA'S SHORTEST PATH ---------
Source         : Ahmedabad
Destination    : Surat
Shortest Route : Ahmedabad -> Vadodara -> Surat
Total Distance : 260 km
---------------------------------------------

--------- PASSENGER QUEUE (FIFO) ---------
  Passenger ID: 101 | Name: Rahul | Ahmedabad -> Rajkot
  Passenger ID: 102 | Name: Priya | Ahmedabad -> Surat
Total waiting passengers: 2
-------------------------------------------

----- RECENTLY SEARCHED ROUTES (STACK - LIFO) -----
  2. Ahmedabad -> Rajkot (215 km)
  1. Ahmedabad -> Surat (260 km)   <- TOP
Total searches: 2
---------------------------------------------------

----- PASSENGER / TRIP HISTORY (LINKED LIST) -----
  Rahul | Ahmedabad | Rajkot | 215 km | Bus
  head -> [ Rahul | Ahmedabad | Rajkot | 215 km | Bus ] -> null
--------------------------------------------------

Serving highest priority request: #1 Meena Desai [Emergency]
Ahmedabad -> Rajkot -> Jamnagar
Route  : Ahmedabad -> Rajkot -> Jamnagar
Fare   : Rs.1175`,
      },
      {
        type: "p",
        text: "Note how the second search returns an indirect route: Ahmedabad → Vadodara → Surat (110 + 150 = 260 km). There is no direct road in the sample network, so Dijkstra builds the route through Vadodara — exactly the behaviour required when an indirect route is shorter.",
      },
    ],
  },
  {
    id: "advantages",
    number: 13,
    title: "Advantages",
    blocks: [
      {
        type: "ul",
        items: [
          "Shortest route is computed in milliseconds even for a large network because of the O((V + E) log V) implementation.",
          "Adjacency list saves memory: only existing roads are stored (O(V + E) instead of O(V²) for a matrix).",
          "Priority handling guarantees that emergency cases are never delayed behind regular bookings.",
          "History and recent searches allow instant re-querying without repeating work.",
          "Every data structure is implemented from scratch, so the project is an excellent demonstration of DSA concepts.",
          "Console menu is simple to operate, requires no installation and runs on any machine with a JVM.",
          "New locations and routes can be added at run time without changing the code.",
        ],
      },
    ],
  },
  {
    id: "limitations",
    number: 14,
    title: "Limitations",
    blocks: [
      {
        type: "ul",
        items: [
          "Dijkstra does not work with negative edge weights (Bellman-Ford would be required).",
          "Data is stored in memory only — everything is lost when the program exits.",
          "Travel time is estimated from distance and an average speed; live traffic, halts and tolls are not considered.",
          "The priority queue is a sorted-insert list in the Java version, so insertion is O(n) instead of O(log n).",
          "Only one weight (distance) is used for optimisation; a real planner must also optimise time, cost and comfort together (multi-criteria).",
          "No authentication or multi-user support — it is a single operator console.",
        ],
      },
    ],
  },
  {
    id: "future",
    number: 15,
    title: "Future Scope",
    blocks: [
      {
        type: "ul",
        items: [
          "Store the network and history in a file or database (JDBC) so data persists between runs.",
          "Add A* search with GPS coordinates as a heuristic for faster routing on large networks.",
          "Support weighted multi-criteria routing (fastest, cheapest, fewest changes) using Dijkstra on different weight functions.",
          "Add real-time tracking of vehicles and dynamic edge weights based on traffic.",
          "Provide a graphical user interface (JavaFX / Swing) or a web dashboard with an interactive map.",
          "Introduce seat availability, booking, cancellation and fare calculation with discounts.",
          "Add Bellman-Ford to detect negative cycles (e.g. reward points) and Floyd-Warshall for all-pairs shortest paths.",
          "Support multiple transport modes in one journey (bus + metro combination) using a multi-layer graph.",
        ],
      },
    ],
  },
  {
    id: "conclusion",
    number: 16,
    title: "Conclusion",
    blocks: [
      {
        type: "p",
        text: "The Smart Transport Planner shows how the core Data Structures studied in class combine to solve a real-world problem. A graph models the road network, Dijkstra's algorithm answers the shortest-route question, a queue keeps the passenger flow fair, a priority queue puts emergencies first, a linked list keeps a dynamic travel history and a stack remembers what the user just searched. Searching and sorting make the catalogue of transport options usable.",
      },
      {
        type: "p",
        text: "Building the project from scratch (without any external library) made the practical difference between O(1), O(log n), O(n) and O(n²) very clear: choosing the right structure is what turns an unusable program into a responsive planner. The design is modular, so new features such as persistence, live traffic or a GUI can be added without changing the existing data structures.",
      },
    ],
  },
];
