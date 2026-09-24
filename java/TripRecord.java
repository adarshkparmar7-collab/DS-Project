/**
 * TripRecord.java
 *
 * One node of the trip history linked list.
 * Created every time a passenger (menu option 8) or a priority request
 * (menu option 10) is processed.
 */
public class TripRecord {

    private int id;
    private String passengerName;
    private String source;
    private String destination;
    private int distance;            // kilometres
    private String route;            // "Ahmedabad -> Rajkot"
    private String transportType;    // Bus / Train / Taxi / Metro
    private int fare;                // rupees
    private int travelMinutes;       // estimated travel time

    public TripRecord(int id, String passengerName, String source, String destination,
                      int distance, String route, String transportType,
                      int fare, int travelMinutes) {
        this.id = id;
        this.passengerName = passengerName;
        this.source = source;
        this.destination = destination;
        this.distance = distance;
        this.route = route;
        this.transportType = transportType;
        this.fare = fare;
        this.travelMinutes = travelMinutes;
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

    public int getDistance() {
        return distance;
    }

    public String getRoute() {
        return route;
    }

    public String getTransportType() {
        return transportType;
    }

    public int getFare() {
        return fare;
    }

    public int getTravelMinutes() {
        return travelMinutes;
    }

    /** Required format of the project:  Rahul | Ahmedabad | Rajkot | 215 km | Bus */
    @Override
    public String toString() {
        return passengerName + " | " + source + " | " + destination
                + " | " + distance + " km | " + transportType;
    }

    /** Longer version with fare and travel time. */
    public String detailed() {
        return "Trip #" + id + " : " + passengerName + " travelled " + route
                + " (" + distance + " km) by " + transportType
                + " in " + travelMinutes + " minutes for Rs." + fare;
    }
}
