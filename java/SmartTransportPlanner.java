import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;

/**
 * SmartTransportPlanner.java   (MAIN CLASS)
 *
 * A menu driven console application for the college Data Structures project.
 * It uses:
 *
 *   Graph (adjacency list) + Dijkstra's algorithm   -> shortest route
 *   Queue (custom, FIFO)                            -> waiting passengers
 *   PriorityQueueCustom                             -> emergency requests
 *   LinkedList (custom)                             -> trip history
 *   Stack (custom, LIFO)                            -> recently searched routes
 *   Searching (linear + binary)                     -> menu option 11
 *   Sorting (quick sort + bubble sort)              -> menu option 12
 *
 * No external library is used anywhere in the project.
 *
 * HOW TO COMPILE AND RUN
 * ----------------------
 *   javac *.java
 *   java SmartTransportPlanner
 *
 * Tested with JDK 8 and above.
 */
public class SmartTransportPlanner {

    private static Scanner scanner = new Scanner(System.in);

    // ---------------------------------------------------------- data structures
    private Graph graph = new Graph();
    private Queue<Passenger> passengerQueue = new Queue<Passenger>();
    private PriorityQueueCustom<TransportRequest> requestQueue = new PriorityQueueCustom<TransportRequest>();
    private LinkedList<TripRecord> tripHistory = new LinkedList<TripRecord>();
    private Stack<String> recentRoutes = new Stack<String>();
    private ArrayList<TransportOption> transportOptions = new ArrayList<TransportOption>();

    // ------------------------------------------------------------- counters
    private int nextPassengerId = 101;
    private int nextRequestId = 1;
    private int nextTripId = 1;

    // ---------------------------------- result of the last Dijkstra search
    private String lastSource = "";
    private String lastDestination = "";
    private DijkstraResult lastResult = null;

    // --------------------------------------------------- operator name tables
    private static final String[] BUS_OPERATORS = { "GSRTC Volvo", "Shree Ram Travels", "Patel Roadways" };
    private static final String[] TRAIN_OPERATORS = { "Shatabdi Express", "Intercity Express", "Duronto Express" };
    private static final String[] TAXI_OPERATORS = { "City Cabs", "Rajwadi Travels", "Quick Ride Taxi" };
    private static final String[] METRO_OPERATORS = { "Metro Link Express", "Mega Metro", "Rapid Metro" };

    public static void main(String[] commandLineArguments) {
        SmartTransportPlanner application = new SmartTransportPlanner();
        application.loadSampleData();
        application.runMenu();
    }

    // =====================================================================
    //                              SAMPLE DATA
    // =====================================================================

    /** Loads a small Gujarat network so the project can be demonstrated at once. */
    private void loadSampleData() {
        System.out.println();
        System.out.println("*************************************************************");
        System.out.println("        SMART TRANSPORT PLANNER USING DATA STRUCTURES        ");
        System.out.println("*************************************************************");
        System.out.println("Loading sample data ...");

        String[] cities = { "Ahmedabad", "Rajkot", "Surat", "Vadodara",
                            "Bhavnagar", "Gandhinagar", "Jamnagar" };
        for (int i = 0; i < cities.length; i++) {
            graph.addLocation(cities[i]);
        }

        graph.addRoute("Ahmedabad", "Rajkot", 215);
        graph.addRoute("Ahmedabad", "Vadodara", 110);
        graph.addRoute("Ahmedabad", "Gandhinagar", 30);
        graph.addRoute("Rajkot", "Jamnagar", 90);
        graph.addRoute("Rajkot", "Bhavnagar", 170);
        graph.addRoute("Vadodara", "Surat", 150);
        graph.addRoute("Vadodara", "Bhavnagar", 200);
        graph.addRoute("Surat", "Bhavnagar", 170);

        passengerQueue.enqueue(new Passenger(101, "Rahul", "Ahmedabad", "Rajkot"));
        passengerQueue.enqueue(new Passenger(102, "Priya", "Ahmedabad", "Surat"));
        passengerQueue.enqueue(new Passenger(103, "Sanjay", "Ahmedabad", "Jamnagar"));

        requestQueue.enqueue(new TransportRequest(1, "Meena Desai", "Ahmedabad", "Jamnagar",
                TransportRequest.EMERGENCY, "Medical emergency - ambulance escort"));
        requestQueue.enqueue(new TransportRequest(2, "Kiran Shah", "Ahmedabad", "Surat",
                TransportRequest.SENIOR_CITIZEN, "Wheelchair assistance"));
        requestQueue.enqueue(new TransportRequest(3, "Amit Patel", "Rajkot", "Bhavnagar",
                TransportRequest.REGULAR, "Standard booking"));

        refreshTransportOptions();

        System.out.println("Loaded " + graph.getLocationCount() + " locations, "
                + graph.getRouteCount() + " routes, 3 waiting passengers and "
                + "3 transport requests.");
        System.out.println("*************************************************************");
    }

    /**
     * Builds the transport catalogue from the roads of the graph.
     * For every road a Bus, a Train, a Taxi and (for short distances) a Metro
     * service is created, so that the sorting option has real data to sort.
     */
    private void refreshTransportOptions() {
        transportOptions = new ArrayList<TransportOption>();

        ArrayList<Route> routes = graph.getUniqueRoutes();
        for (int r = 0; r < routes.size(); r++) {

            Route route = routes.get(r);
            String from = route.getFrom();
            String to = route.getTo();
            int kilometres = route.getDistance();

            // Bus : medium speed, medium price
            transportOptions.add(new TransportOption(
                    BUS_OPERATORS[r % BUS_OPERATORS.length], "Bus", from, to,
                    kilometres, travelMinutes(kilometres, 55), ticketPrice(kilometres, 30, 1.6)));

            // Train : fast, available only for longer distances
            if (kilometres >= 60) {
                transportOptions.add(new TransportOption(
                        TRAIN_OPERATORS[r % TRAIN_OPERATORS.length], "Train", from, to,
                        kilometres, travelMinutes(kilometres, 88), ticketPrice(kilometres, 45, 1.15)));
            }

            // Taxi : fast but expensive
            transportOptions.add(new TransportOption(
                    TAXI_OPERATORS[r % TAXI_OPERATORS.length], "Taxi", from, to,
                    kilometres, travelMinutes(kilometres, 72), ticketPrice(kilometres, 80, 5.4)));

            // Metro : available only inside a short city corridor
            if (kilometres <= 120) {
                transportOptions.add(new TransportOption(
                        METRO_OPERATORS[r % METRO_OPERATORS.length], "Metro", from, to,
                        kilometres, travelMinutes(kilometres, 62), ticketPrice(kilometres, 20, 0.9)));
            }
        }
    }

    /** distance / speed converted to minutes. */
    private int travelMinutes(int kilometres, int averageSpeed) {
        return (int) Math.round((kilometres * 60.0) / averageSpeed);
    }

    /** base fare + price per kilometre. */
    private int ticketPrice(int kilometres, int baseFare, double pricePerKilometre) {
        return (int) Math.round(baseFare + kilometres * pricePerKilometre);
    }

    // =====================================================================
    //                             THE MAIN MENU
    // =====================================================================

    private void runMenu() {
        int choice = 0;
        do {
            printMenu();
            choice = readInt("Enter your choice (1-15): ");
            System.out.println();

            switch (choice) {
                case 1:  addLocation();            break;
                case 2:  addRoute();               break;
                case 3:  graph.display();          break;
                case 4:  findShortestRoute();      break;
                case 5:  displayRouteDistance();   break;
                case 6:  addPassenger();           break;
                case 7:  displayPassengerQueue();  break;
                case 8:  processPassenger();       break;
                case 9:  addTransportRequest();    break;
                case 10: processPriorityRequest(); break;
                case 11: searchLocation();         break;
                case 12: sortTransportOptions();   break;
                case 13: displayRecentRoutes();    break;
                case 14: displayTripHistory();     break;
                case 15: exitMessage();            break;
                default: System.out.println("Invalid choice! Please enter a number from 1 to 15.");
            }
        } while (choice != 15);
    }

    private void printMenu() {
        System.out.println();
        System.out.println("========= SMART TRANSPORT PLANNER =========");
        System.out.println("1.  Add Location");
        System.out.println("2.  Add Route");
        System.out.println("3.  Display Transport Network");
        System.out.println("4.  Find Shortest Route");
        System.out.println("5.  Display Route Distance");
        System.out.println("6.  Add Passenger");
        System.out.println("7.  Display Passenger Queue");
        System.out.println("8.  Process Passenger");
        System.out.println("9.  Add Transport Request");
        System.out.println("10. Process Priority Request");
        System.out.println("11. Search Location");
        System.out.println("12. Sort Transport Options");
        System.out.println("13. View Recent Routes");
        System.out.println("14. View Passenger/Trip History");
        System.out.println("15. Exit");
        System.out.println("==========================================");
    }

    // =====================================================================
    //                       1. ADD LOCATION  (graph vertex)
    // =====================================================================

    private void addLocation() {
        String name = readText("Enter new location name: ");
        if (graph.addLocation(name)) {
            System.out.println("Location added to the graph (new vertex) : " + name.trim());
            System.out.println("Total locations now : " + graph.getLocationCount());
        } else {
            System.out.println("Invalid or duplicate location name!");
        }
    }

    // =====================================================================
    //                        2. ADD ROUTE  (graph edge)
    // =====================================================================

    private void addRoute() {
        String from = readText("Enter source location      : ").trim();
        String to = readText("Enter destination location : ").trim();
        int distance = readInt("Enter distance in km       : ");

        if (graph.addRoute(from, to, distance)) {
            System.out.println("Route added to the adjacency list : " + from + " <-> " + to
                    + " (" + distance + " km)");
            refreshTransportOptions();
            System.out.println("Transport options refreshed. Total options : " + transportOptions.size());
        } else {
            System.out.println("Route NOT added. Please check:");
            System.out.println("   * both locations must already exist (use option 1 first)");
            System.out.println("   * source and destination must be different");
            System.out.println("   * distance must be greater than zero");
        }
    }

    // =====================================================================
    //                4. FIND SHORTEST ROUTE   (Dijkstra + Stack push)
    // =====================================================================

    private void findShortestRoute() {
        String source = readText("Enter source location      : ").trim();
        String destination = readText("Enter destination location : ").trim();

        if (!graph.contains(source) || !graph.contains(destination)) {
            System.out.println("Source or destination is not present in the transport network!");
            return;
        }

        DijkstraResult result = graph.shortestPath(source, destination);
        lastSource = source;
        lastDestination = destination;
        lastResult = result;

        System.out.println();
        System.out.println("---------- DIJKSTRA'S SHORTEST PATH ----------");
        System.out.println("Source          : " + source);
        System.out.println("Destination     : " + destination);

        if (result.isReachable()) {
            System.out.println("Shortest Route  : " + joinPath(result.getPath()));
            System.out.println("Total Distance  : " + result.getTotalDistance() + " km");
            System.out.println("Roads travelled : " + result.getHopCount());
            System.out.println("Cities visited  : " + result.getVisitedOrder().size());
            if (result.getHopCount() > 1) {
                System.out.println("(an indirect route through intermediate cities was shorter)");
            }
            // the search is remembered on the STACK (menu option 13)
            recentRoutes.push(source + " -> " + destination + " ("
                    + result.getTotalDistance() + " km)");
        } else {
            System.out.println("No route available between these two locations.");
        }
        System.out.println("----------------------------------------------");

        // ---- comparison with BFS, useful during the viva ----
        ArrayList<String> bfsPath = graph.breadthFirstSearch(source, destination);
        if (!bfsPath.isEmpty()) {
            System.out.println("(BFS would give the fewest stops : " + joinPath(bfsPath) + ")");
        }
    }

    // =====================================================================
    //                      5. DISPLAY ROUTE DISTANCE
    // =====================================================================

    private void displayRouteDistance() {
        System.out.println();
        System.out.println("---------- ROUTE DISTANCE ----------");
        if (lastResult == null || !lastResult.isReachable()) {
            System.out.println("No route has been searched yet. Please use option 4 first.");
            System.out.println("------------------------------------");
            return;
        }
        System.out.println("Source          : " + lastSource);
        System.out.println("Destination     : " + lastDestination);
        System.out.println("Shortest Route  : " + joinPath(lastResult.getPath()));
        System.out.println("Total Distance  : " + lastResult.getTotalDistance() + " km");
        System.out.println("Estimated Time  : " + travelMinutes(lastResult.getTotalDistance(), 60) + " min by road");
        System.out.println("Cheapest Ticket : Rs." + ticketPrice(lastResult.getTotalDistance(), 30, 1.6) + " by bus");
        System.out.println("------------------------------------");
    }

    // =====================================================================
    //                   6/7/8. PASSENGER QUEUE  (custom Queue)
    // =====================================================================

    private void addPassenger() {
        String name = readText("Enter passenger name       : ").trim();
        String source = readText("Enter boarding location    : ").trim();
        String destination = readText("Enter destination location : ").trim();

        if (name.length() < 2) {
            System.out.println("Invalid passenger name!");
            return;
        }
        if (!graph.contains(source) || !graph.contains(destination)) {
            System.out.println("Boarding point or destination is not present in the network!");
            return;
        }

        Passenger passenger = new Passenger(nextPassengerId, name, source, destination);
        nextPassengerId++;
        passengerQueue.enqueue(passenger);            // insert at the rear

        System.out.println("Passenger ENQUEUED (joined the rear of the queue) :");
        System.out.println("   " + passenger);
        System.out.println("Passengers waiting now : " + passengerQueue.size());
    }

    private void displayPassengerQueue() {
        System.out.println();
        System.out.println("---------- PASSENGER QUEUE (FIFO) ----------");
        if (passengerQueue.isEmpty()) {
            System.out.println("   No passenger is waiting.");
        } else {
            passengerQueue.display();
            System.out.println("Total waiting passengers : " + passengerQueue.size());
        }
        System.out.println("--------------------------------------------");
    }

    private void processPassenger() {
        System.out.println();
        System.out.println("---------- PROCESS PASSENGER (DEQUEUE) ----------");
        Passenger passenger = passengerQueue.dequeue();     // remove from the front
        if (passenger == null) {
            System.out.println("   The queue is empty! There is no passenger to process.");
            System.out.println("-------------------------------------------------");
            return;
        }

        System.out.println("   Removed from the FRONT of the queue : " + passenger);

        DijkstraResult result = graph.shortestPath(passenger.getSource(), passenger.getDestination());
        if (!result.isReachable()) {
            System.out.println("   No route found for " + passenger.getName()
                    + ". The passenger is not charged.");
            System.out.println("-------------------------------------------------");
            return;
        }

        String transportType = readTransportType();
        int kilometres = result.getTotalDistance();
        int minutes = travelMinutes(kilometres, averageSpeed(transportType));
        int fare = ticketPrice(kilometres, 30, pricePerKilometre(transportType));

        TripRecord record = new TripRecord(nextTripId, passenger.getName(), passenger.getSource(),
                passenger.getDestination(), kilometres, joinPath(result.getPath()),
                transportType, fare, minutes);
        nextTripId++;

        tripHistory.addLast(record);                 // insert at the tail of the linked list

        System.out.println("   Boarding pass issued :");
        System.out.println("   " + record.detailed());
        System.out.println("   Trip stored in the linked list history.");
        System.out.println("   Passengers still waiting : " + passengerQueue.size());
        System.out.println("-------------------------------------------------");
    }

    // =====================================================================
    //             9/10. PRIORITY TRANSPORT REQUESTS  (Priority Queue)
    // =====================================================================

    private void addTransportRequest() {
        String name = readText("Enter passenger name       : ").trim();
        String source = readText("Enter source location      : ").trim();
        String destination = readText("Enter destination location : ").trim();
        int priority = readInt("Priority (1=Emergency, 2=Senior Citizen, 3=Regular): ");

        if (name.length() < 2) {
            System.out.println("Invalid passenger name!");
            return;
        }
        if (priority < 1 || priority > 3) {
            System.out.println("Invalid priority! Please enter 1, 2 or 3.");
            return;
        }
        if (!graph.contains(source) || !graph.contains(destination)) {
            System.out.println("Source or destination is not present in the network!");
            return;
        }

        String note = readText("Short note (press Enter for default): ").trim();
        if (note.length() == 0) {
            note = "Requested from console";
        }

        TransportRequest request = new TransportRequest(nextRequestId, name, source,
                destination, priority, note);
        nextRequestId++;
        requestQueue.enqueue(request);

        System.out.println("Request INSERTED into the priority queue :");
        System.out.println("   " + request);
        System.out.println("Pending requests : " + requestQueue.size());
    }

    private void displayPendingRequests() {
        System.out.println();
        System.out.println("---------- PENDING REQUESTS (PRIORITY ORDER) ----------");
        if (requestQueue.isEmpty()) {
            System.out.println("   No pending transport request.");
        } else {
            requestQueue.display();
            System.out.println("Total pending requests : " + requestQueue.size());
        }
        System.out.println("--------------------------------------------------------");
    }

    private void processPriorityRequest() {
        System.out.println();
        System.out.println("---------- PROCESS PRIORITY REQUEST ----------");
        displayPendingRequests();
        System.out.println();

        TransportRequest request = requestQueue.dequeue();   // highest priority first
        if (request == null) {
            System.out.println("   The priority queue is empty! Nothing to process.");
            System.out.println("----------------------------------------------");
            return;
        }

        System.out.println("   Serving the HIGHEST priority request : " + request);

        DijkstraResult result = graph.shortestPath(request.getSource(), request.getDestination());
        String route;
        int kilometres;
        if (result.isReachable()) {
            route = joinPath(result.getPath());
            kilometres = result.getTotalDistance();
        } else {
            route = request.getSource() + " -> " + request.getDestination() + " (no road)";
            kilometres = 0;
        }

        // an emergency always gets a taxi; other requests travel by train
        String transportType = (request.getPriority() == TransportRequest.EMERGENCY) ? "Taxi" : "Train";
        int minutes = travelMinutes(kilometres, averageSpeed(transportType));
        int fare = ticketPrice(kilometres, 30, pricePerKilometre(transportType));

        TripRecord record = new TripRecord(nextTripId, request.getPassengerName(),
                request.getSource(), request.getDestination(), kilometres, route,
                transportType, fare, minutes);
        nextTripId++;
        tripHistory.addLast(record);

        System.out.println("   " + record.detailed());
        System.out.println("   Trip added to the linked list history.");
        System.out.println("   Requests still pending : " + requestQueue.size());
        System.out.println("----------------------------------------------");
    }

    // =====================================================================
    //                     11. SEARCH  (linear + binary search)
    // =====================================================================

    private void searchLocation() {
        System.out.println();
        String key = readText("Enter location name (or a part of it) to search: ");

        ArrayList<String> found = SearchSort.searchLocations(graph.getLocations(), key);
        System.out.println("---------- SEARCH RESULT (LINEAR SEARCH) ----------");
        if (found.isEmpty()) {
            System.out.println("   No location matched \"" + key + "\".");
        } else {
            for (int i = 0; i < found.size(); i++) {
                String city = found.get(i);
                System.out.println("   Found: " + city + "  (degree " + graph.getDegree(city) + ")");
            }
            System.out.println("   " + found.size() + " location(s) found out of "
                    + graph.getLocationCount() + ".");
        }
        System.out.println("----------------------------------------------------");

        // second part: search a passenger inside the trip history linked list
        String name = readText("Search a passenger in the trip history (Enter to skip): ").trim();
        if (name.length() > 0) {
            ArrayList<TripRecord> trips = SearchSort.searchTrips(tripHistory.toArrayList(), name);
            System.out.println("---------- PASSENGER SEARCH ----------");
            if (trips.isEmpty()) {
                System.out.println("   No trip recorded for \"" + name + "\".");
            } else {
                for (int i = 0; i < trips.size(); i++) {
                    System.out.println("   " + trips.get(i));
                }
            }
            System.out.println("--------------------------------------");
        }
    }

    // =====================================================================
    //                12. SORT TRANSPORT OPTIONS  (quick / bubble sort)
    // =====================================================================

    private void sortTransportOptions() {
        System.out.println();
        System.out.println("Available transport options : " + transportOptions.size());
        int key = readInt("Sort by ->  1.Distance  2.Travel Time  3.Ticket Price  : ");

        Comparator<TransportOption> comparator;
        String label;
        if (key == 1) {
            comparator = SearchSort.byDistance();
            label = "DISTANCE";
        } else if (key == 2) {
            comparator = SearchSort.byTime();
            label = "TRAVEL TIME";
        } else if (key == 3) {
            comparator = SearchSort.byPrice();
            label = "TICKET PRICE";
        } else {
            System.out.println("Invalid sort key! Please enter 1, 2 or 3.");
            return;
        }

        int algorithm = readInt("Algorithm ->  1.Quick Sort  2.Bubble Sort  : ");
        ArrayList<TransportOption> sorted;
        if (algorithm == 2) {
            sorted = SearchSort.bubbleSort(transportOptions, comparator);
        } else {
            sorted = SearchSort.quickSort(transportOptions, comparator);
        }

        System.out.println();
        System.out.println("----------- TRANSPORT OPTIONS SORTED BY " + label + " -----------");
        if (sorted.isEmpty()) {
            System.out.println("   (no transport option available)");
        }
        for (int i = 0; i < sorted.size(); i++) {
            System.out.println("   " + (i + 1) + ". " + sorted.get(i));
        }
        System.out.println("--------------------------------------------------------");
        if (!sorted.isEmpty()) {
            System.out.println("   Cheapest  : Rs." + SearchSort.quickSort(transportOptions, SearchSort.byPrice()).get(0).getPrice());
            System.out.println("   Fastest   : " + SearchSort.quickSort(transportOptions, SearchSort.byTime()).get(0).getTimeMinutes() + " min");
        }

        // BINARY SEARCH needs a list that is already sorted by name
        String operator = readText("Binary search an operator by exact name (Enter to skip): ").trim();
        if (operator.length() > 0) {
            ArrayList<TransportOption> byName = SearchSort.quickSort(transportOptions, SearchSort.byName());
            int index = SearchSort.binarySearchByName(byName, operator);
            System.out.println("---------- BINARY SEARCH ----------");
            if (index >= 0) {
                System.out.println("   Found at index " + index + " : " + byName.get(index));
            } else {
                System.out.println("   Operator \"" + operator + "\" not found.");
            }
            System.out.println("-----------------------------------");
        }
    }

    // =====================================================================
    //                     13. RECENT ROUTES  (custom Stack)
    // =====================================================================

    private void displayRecentRoutes() {
        System.out.println();
        System.out.println("---------- RECENTLY SEARCHED ROUTES (STACK - LIFO) ----------");
        if (recentRoutes.isEmpty()) {
            System.out.println("   (stack is empty, no route searched yet)");
        } else {
            recentRoutes.display();                          // top first
            System.out.println("   Top of the stack (peek) : " + recentRoutes.peek());
            System.out.println("   Total searches          : " + recentRoutes.size());
        }
        System.out.println("--------------------------------------------------------------");

        if (recentRoutes.isEmpty()) {
            return;
        }
        String answer = readText("Do you want to remove the last searched route? (yes/no): ").trim();
        if (answer.equalsIgnoreCase("yes") || answer.equalsIgnoreCase("y")) {
            String removed = recentRoutes.pop();
            System.out.println("   pop() removed : " + removed);
            System.out.println("   Searches left : " + recentRoutes.size());
        }
    }

    // =====================================================================
    //                 14. PASSENGER / TRIP HISTORY  (custom LinkedList)
    // =====================================================================

    private void displayTripHistory() {
        System.out.println();
        System.out.println("---------- PASSENGER / TRIP HISTORY (LINKED LIST) ----------");
        if (tripHistory.isEmpty()) {
            System.out.println("   No trip recorded yet.");
        } else {
            ArrayList<TripRecord> trips = tripHistory.toArrayList();
            for (int i = 0; i < trips.size(); i++) {
                System.out.println("   " + (i + 1) + ". " + trips.get(i));
            }
            System.out.println("   Total trips : " + trips.size());
        }
        System.out.println("-------------------------------------------------------------");

        System.out.println("   Linked list structure :");
        tripHistory.displayLinks();

        if (tripHistory.size() > 1) {
            String answer = readText("   Reverse the linked list? (yes/no): ").trim();
            if (answer.equalsIgnoreCase("yes") || answer.equalsIgnoreCase("y")) {
                tripHistory.reverse();
                System.out.println("   Reversed linked list :");
                tripHistory.displayLinks();
            }
        }
    }

    // =====================================================================
    //                                15. EXIT
    // =====================================================================

    private void exitMessage() {
        System.out.println();
        System.out.println("*************************************************************");
        System.out.println("                      SESSION SUMMARY                        ");
        System.out.println("*************************************************************");
        System.out.println(" Locations in the graph   : " + graph.getLocationCount());
        System.out.println(" Roads in the graph       : " + graph.getRouteCount());
        System.out.println(" Passengers still waiting : " + passengerQueue.size());
        System.out.println(" Requests still pending   : " + requestQueue.size());
        System.out.println(" Trips recorded           : " + tripHistory.size());
        System.out.println(" Recent searches (stack)  : " + recentRoutes.size());
        System.out.println("*************************************************************");
        System.out.println("   Thank you for using Smart Transport Planner!");
        System.out.println("*************************************************************");
    }

    // =====================================================================
    //                               HELPERS
    // =====================================================================

    /** Joins the path list into "A -> B -> C". */
    private String joinPath(ArrayList<String> path) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < path.size(); i++) {
            builder.append(path.get(i));
            if (i < path.size() - 1) {
                builder.append(" -> ");
            }
        }
        return builder.toString();
    }

    /** Reads a validated transport type from the keyboard. */
    private String readTransportType() {
        while (true) {
            String value = readText("   Transport type (Bus/Train/Taxi/Metro): ").trim();
            String type = value.toUpperCase();
            if (type.equals("BUS") || type.equals("TRAIN") || type.equals("TAXI") || type.equals("METRO")) {
                return type.substring(0, 1) + type.substring(1).toLowerCase();
            }
            System.out.println("   Invalid transport type! Please type Bus, Train, Taxi or Metro.");
        }
    }

    /** Average speed of every transport type in km/h. */
    private int averageSpeed(String transportType) {
        if (transportType.equalsIgnoreCase("Train")) {
            return 88;
        } else if (transportType.equalsIgnoreCase("Taxi")) {
            return 72;
        } else if (transportType.equalsIgnoreCase("Metro")) {
            return 62;
        }
        return 55;                                    // Bus
    }

    /** Price per kilometre of every transport type. */
    private double pricePerKilometre(String transportType) {
        if (transportType.equalsIgnoreCase("Train")) {
            return 1.15;
        } else if (transportType.equalsIgnoreCase("Taxi")) {
            return 5.4;
        } else if (transportType.equalsIgnoreCase("Metro")) {
            return 0.9;
        }
        return 1.6;                                   // Bus
    }

    /** Reads a line of text and never returns null. */
    private static String readText(String message) {
        System.out.print(message);
        String value = scanner.nextLine();
        if (value == null) {
            return "";
        }
        return value;
    }

    /** Reads an integer and keeps asking until the input is a valid number. */
    private static int readInt(String message) {
        while (true) {
            System.out.print(message);
            String line = scanner.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException exception) {
                System.out.println("Invalid number! Please enter digits only.");
            }
        }
    }
}
