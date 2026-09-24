export interface VivaQuestion {
  q: string;
  tag: string;
  a: string[];
  extra?: string;
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    q: "What is a Graph?",
    tag: "Graph",
    a: [
      "A graph is a non-linear data structure made of a finite set of vertices (nodes) and a set of edges that connect pairs of vertices.",
      "In this project each location (Ahmedabad, Rajkot, Surat …) is a vertex and each road between two locations is an edge whose weight is the distance in kilometres.",
      "Because every road can be travelled in both directions, the graph is undirected. As it carries weights it is also a weighted graph.",
    ],
    extra: "V = number of locations, E = number of roads. The sample network has V = 7 and E = 8.",
  },
  {
    q: "Why is an adjacency list used instead of an adjacency matrix?",
    tag: "Adjacency List",
    a: [
      "An adjacency list stores only the edges that really exist, so it needs O(V + E) memory. An adjacency matrix always needs O(V²) memory, most of which is wasted on a sparse road network.",
      "Finding all neighbours of a city takes O(degree) with a list, which is exactly what Dijkstra needs; with a matrix you must scan all V entries even when a city has only two roads.",
      "The list also grows dynamically when the user adds a new location at run time.",
    ],
    extra: "Trade-off: an adjacency matrix answers 'is there an edge between A and B?' in O(1), while a list needs O(degree).",
  },
  {
    q: "What is Dijkstra's algorithm?",
    tag: "Dijkstra",
    a: [
      "Dijkstra's algorithm is a greedy algorithm that finds the shortest path from a source vertex to every other vertex in a weighted graph with non-negative edge weights.",
      "It keeps a tentative distance for every vertex (initially ∞, source = 0), repeatedly picks the unvisited vertex with the smallest tentative distance using a priority queue, and relaxes its edges.",
      "Relaxation means: if dist[current] + weight(current, neighbour) < dist[neighbour], then update dist[neighbour] and remember current as its previous vertex.",
      "When the destination is finalised, the path is rebuilt by walking backwards through the previous[] array.",
    ],
    extra: "In the sample network the shortest route from Ahmedabad to Surat is Ahmedabad → Vadodara → Surat = 110 + 150 = 260 km, because no direct edge exists.",
  },
  {
    q: "Why is a Priority Queue used?",
    tag: "Priority Queue",
    a: [
      "A priority queue always returns the element with the highest priority, not the one that arrived first.",
      "It is used twice in this project: (1) inside Dijkstra to always expand the closest unfinalised city, and (2) to serve transport requests in the order Emergency (1) → Senior Citizen (2) → Regular (3).",
      "Implemented as a binary min-heap, insertion and extraction are O(log n), so even with thousands of requests the most urgent one is found instantly.",
    ],
    extra: "If two requests have the same priority, the one with the smaller id (earlier arrival) is served first — a stable FIFO tie-break.",
  },
  {
    q: "What is the difference between a Queue and a Priority Queue?",
    tag: "Queue vs Priority Queue",
    a: [
      "Queue — FIFO. The element inserted first is removed first. Order depends only on arrival time. Used for normal passengers waiting for a bus.",
      "Priority Queue — order depends on the priority of the element. The element with the highest priority is removed first, even if it arrived last. Used for emergency transport requests.",
      "Queue operations are O(1); a heap-based priority queue needs O(log n) for insert and extract.",
      "Real life example: a normal queue is the line at a ticket counter; a priority queue is the emergency ward of a hospital.",
    ],
  },
  {
    q: "Why is a Stack used?",
    tag: "Stack",
    a: [
      "A stack is LIFO — the last element pushed is the first one popped. Recently searched routes behave exactly like this: the user normally wants the most recent search on top.",
      "Every successful Dijkstra search is pushed; menu option 13 displays the stack (top first) and can pop the last search.",
      "push(), pop() and peek() are all O(1), and reversing a list or evaluating an expression / backtracking are the other classic uses of a stack.",
    ],
  },
  {
    q: "Why is a Linked List used?",
    tag: "Linked List",
    a: [
      "Trip history grows and shrinks at run time, and its size is unknown in advance. A linked list allocates memory node by node, so there is no fixed size and no wastage.",
      "Inserting at the head or tail is O(1) — no shifting of elements like an array based implementation — and deleting a node only requires re-linking pointers.",
      "Each node stores the trip data plus a reference to the next node, and the list is traversed from head until next == null.",
    ],
    extra: "Disadvantage: no random access. Reaching the i-th node takes O(i), whereas an array needs O(1).",
  },
  {
    q: "What is time complexity? Why do we study it?",
    tag: "Complexity",
    a: [
      "Time complexity describes how the running time of an algorithm grows when the input size n grows. It is written in Big-O notation, which gives an upper bound and ignores constant factors.",
      "It lets us compare algorithms independently of hardware or programming language: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).",
      "Space complexity measures the extra memory an algorithm needs in the same way.",
    ],
  },
  {
    q: "What is the time complexity of Dijkstra's algorithm in this implementation?",
    tag: "Complexity",
    a: [
      "With a binary-heap priority queue the complexity is O((V + E) log V): every vertex is extracted once (V × log V) and every edge may cause one insertion (E × log V).",
      "The web version of this project uses exactly this implementation, so the complexity is O((V + E) log V) with O(V) extra space for dist[], previous[] and visited.",
      "If an array were scanned instead of a heap to find the minimum, it would become O(V²). Using a Fibonacci heap the theoretical best is O(E + V log V).",
      "The Java version of this project uses java.util.PriorityQueue, which is also a binary min-heap, so it is O((V + E) log V) as well.",
    ],
  },
  {
    q: "What is the difference between BFS and Dijkstra?",
    tag: "BFS vs Dijkstra",
    a: [
      "BFS is used for unweighted graphs; it finds the path with the fewest number of edges by exploring level by level with an ordinary FIFO queue.",
      "Dijkstra works on weighted graphs with non-negative weights; it always expands the vertex with the smallest total distance using a priority queue.",
      "Running BFS on a weighted graph can give a wrong answer: BFS from Ahmedabad to Surat returns the route with the fewest cities, while Dijkstra returns the route with the smallest number of kilometres.",
      "This project shows both results side by side so the difference can be demonstrated live. (If all weights are equal, BFS and Dijkstra give the same path.)",
    ],
  },
  {
    q: "Where is searching used in this project?",
    tag: "Searching",
    a: [
      "Menu option 11 performs a linear search over the location list to find every city matching the typed text — O(n) because the list is unsorted.",
      "The trip history linked list is searched linearly by passenger name.",
      "A binary search is performed on the alphabetically sorted transport catalogue to find an operator by exact name in O(log n).",
      "Searching also happens internally: before adding a route or a passenger the program searches the graph to validate the location, and Dijkstra searches the adjacency list of every visited vertex.",
    ],
  },
  {
    q: "Where is sorting used in this project?",
    tag: "Sorting",
    a: [
      "Menu option 12 sorts the transport options by distance, travel time or ticket price using quick sort — O(n log n) on average.",
      "The catalogue must be sorted by operator name before binary search can be applied.",
      "Bubble sort (O(n²)) is also implemented so the two algorithms can be compared by counting comparisons.",
      "Sorting is also used for presentation: the distance table of Dijkstra is displayed in ascending order.",
    ],
  },
  {
    q: "Why does Dijkstra fail with negative edge weights?",
    tag: "Dijkstra",
    a: [
      "Dijkstra finalises a vertex as soon as it is extracted from the priority queue, assuming its distance can never improve. That assumption is only true when all weights are non-negative.",
      "With a negative edge a later, longer-looking path could still become cheaper, so the finalised answer would be wrong.",
      "The Bellman-Ford algorithm handles negative weights in O(V · E) and can also detect negative cycles.",
    ],
  },
  {
    q: "What happens if the source and destination are not connected?",
    tag: "Edge case",
    a: [
      "The distance of the destination stays ∞ (Integer.MAX_VALUE in Java) and the program reports that no route is available instead of printing a wrong path.",
      "This is why the algorithm checks isReachable() before building the path and before a trip record is stored in the linked list.",
    ],
  },
  {
    q: "How is invalid input handled?",
    tag: "Validation",
    a: [
      "Menu choices are read with a readInt() helper that catches NumberFormatException and asks again until a valid number is entered.",
      "A location is rejected if the name is blank, shorter than two characters, or already present in the graph.",
      "A route is rejected if either city is unknown, if the source equals the destination, or if the distance is zero or negative.",
      "A passenger or request is rejected when the name is empty or the destination does not exist in the network.",
    ],
  },
];
