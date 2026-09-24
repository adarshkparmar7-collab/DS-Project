# Smart Transport Planner Using Data Structures

A college **Data Structures and Algorithms** project. It is a menu driven
console application that plans routes inside a transport network using
fundamental data structures implemented **from scratch** (no external library).

---

## 1. How to compile and run

All files stay in the **same folder** (default package), so no classpath is needed.

```bash
javac *.java
java SmartTransportPlanner
```

Requirement: JDK 8 or above. Nothing else has to be installed.

---

## 2. Files of the project

| File | What it contains | Data structure / algorithm |
|---|---|---|
| `Edge.java` | One adjacency list entry (neighbour city + weight) | Graph |
| `Route.java` | One two-way road, listed only once | Graph helper |
| `DijkstraResult.java` | Path, total distance, visited order | Result holder |
| `Graph.java` | Adjacency list, `addLocation`, `addRoute`, `display`, `shortestPath`, `breadthFirstSearch` | **Graph + Dijkstra + BFS** |
| `Queue.java` | `enqueue`, `dequeue`, `peekFront`, `display` | **Custom Queue (FIFO)** |
| `PriorityQueueCustom.java` | `enqueue`, `dequeue`, `peek` with a `Comparator` | **Custom Priority Queue** |
| `Stack.java` | `push`, `pop`, `peek`, `display` | **Custom Stack (LIFO)** |
| `LinkedList.java`, `ListNode.java` | `addLast`, `addFirst`, `removeFirst`, `removeLast`, `reverse`, `contains` | **Custom Singly Linked List** |
| `Passenger.java` | Passenger waiting in the queue | Entity class |
| `TransportRequest.java` | Request with priority 1/2/3, implements `Comparable` | Entity class |
| `TripRecord.java` | One trip of the history | Entity class |
| `TransportOption.java` | Bus / Train / Taxi / Metro service | Entity class |
| `SearchSort.java` | `searchLocations`, `searchTrips`, `binarySearchByName`, `quickSort`, `bubbleSort` | **Searching + Sorting** |
| `SmartTransportPlanner.java` | The 15 option `Scanner` menu, sample data, session summary | **Main class** |

Extra helper files:

| File | Purpose |
|---|---|
| `README.md` | This document |
| `sample-output.txt` | A complete sample session of the program |
| `compile-and-run.bat` | Double click to compile and run on Windows |
| `compile-and-run.sh` | `chmod +x compile-and-run.sh && ./compile-and-run.sh` on Linux/macOS |

---

## 3. Menu

```
========= SMART TRANSPORT PLANNER =========
1.  Add Location              -> Graph   : insert a vertex
2.  Add Route                 -> Graph   : insert a weighted edge
3.  Display Transport Network -> Graph   : print the adjacency list
4.  Find Shortest Route       -> Dijkstra's algorithm + Stack push
5.  Display Route Distance    -> result of the last Dijkstra search
6.  Add Passenger             -> Queue   : enqueue
7.  Display Passenger Queue   -> Queue   : traverse front to rear
8.  Process Passenger         -> Queue   : dequeue + LinkedList addLast
9.  Add Transport Request     -> Priority queue : enqueue
10. Process Priority Request  -> Priority queue : dequeue (highest first)
11. Search Location           -> Linear search (+ binary search in 12)
12. Sort Transport Options    -> Quick sort / Bubble sort
13. View Recent Routes        -> Stack   : display / pop
14. View Passenger/Trip History -> Linked list : traverse / reverse
15. Exit                      -> print the session summary
==========================================
```

---

## 4. Sample network (loaded automatically)

Locations: Ahmedabad, Rajkot, Surat, Vadodara, Bhavnagar, Gandhinagar, Jamnagar

| From | To | Distance |
|---|---|---|
| Ahmedabad | Rajkot | 215 km |
| Ahmedabad | Vadodara | 110 km |
| Ahmedabad | Gandhinagar | 30 km |
| Rajkot | Jamnagar | 90 km |
| Rajkot | Bhavnagar | 170 km |
| Vadodara | Surat | 150 km |
| Vadodara | Bhavnagar | 200 km |
| Surat | Bhavnagar | 170 km |

Passengers already waiting: `101 Rahul`, `102 Priya`, `103 Sanjay`
Requests already pending: `#1 Meena Desai (Emergency)`,
`#2 Kiran Shah (Senior Citizen)`, `#3 Amit Patel (Regular)`

---

## 5. Data structures used and their complexity

| Data structure | Used for | Key operations | Complexity |
|---|---|---|---|
| Graph (adjacency list) | Locations and roads | `addLocation`, `addRoute`, `getNeighbours` | space `O(V+E)`, neighbours `O(degree)` |
| Dijkstra's algorithm | Shortest route | min-heap priority queue | `O((V+E) log V)` |
| Queue (FIFO) | Waiting passengers | `enqueue`, `dequeue` | `O(1)` |
| Priority Queue | Emergency requests | `enqueue`, `dequeue` | `O(n)` insert (sorted list), `O(1)` extract |
| Linked List (singly) | Trip history | `addLast`, `reverse`, `contains` | `O(1)` insert, `O(n)` search |
| Stack (LIFO) | Recent searches | `push`, `pop`, `peek` | `O(1)` |
| Linear search | Locations, passengers | `searchLocations`, `searchTrips` | `O(n)` |
| Binary search | Operator lookup | `binarySearchByName` | `O(log n)` |
| Quick sort | Transport options | `quickSort` | `O(n log n)` average |
| Bubble sort | Transport options | `bubbleSort` | `O(n^2)` |

---

## 6. Sample session

See `sample-output.txt` for a complete run.

```
Enter your choice (1-15): 4
Enter source location      : Ahmedabad
Enter destination location : Surat

---------- DIJKSTRA'S SHORTEST PATH ----------
Source          : Ahmedabad
Destination     : Surat
Shortest Route  : Ahmedabad -> Vadodara -> Surat
Total Distance  : 260 km
Roads travelled : 2
Cities visited  : 4
(an indirect route through intermediate cities was shorter)
----------------------------------------------
```

There is no direct road between Ahmedabad and Surat, so Dijkstra builds the
route through Vadodara (110 + 150 = 260 km).

---

## 7. Important notes for the viva

* An **adjacency list** is used because a road network is *sparse*:
  `O(V+E)` memory instead of `O(V^2)` for an adjacency matrix.
* **Dijkstra** is greedy and needs **non-negative** weights.
  With negative weights the Bellman-Ford algorithm would be required.
* The **priority queue** of requests uses priority numbers
  `1 Emergency < 2 Senior Citizen < 3 Regular`, so a *smaller* number is
  served first; equal priorities are broken by the request id (FIFO).
* **BFS** gives the fewest *cities*, **Dijkstra** gives the fewest
  *kilometres* — option 4 prints both so the difference can be shown.
* `Queue`, `Stack`, `LinkedList` and `PriorityQueueCustom` are all written
  from scratch; `java.util.PriorityQueue` is used only inside Dijkstra.
