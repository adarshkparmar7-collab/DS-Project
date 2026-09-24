/**
 * TransportOption.java
 *
 * One transport service of the catalogue (Bus / Train / Taxi / Metro).
 * These records are the ones that get SEARCHED and SORTED by menu option 12.
 *
 * Fields required by the project:
 *   Transport Name, Source, Destination, Distance, Estimated Time, Ticket Price
 */
public class TransportOption {

    private String name;            // operator name, e.g. "GSRTC Volvo"
    private String type;            // Bus / Train / Taxi / Metro
    private String source;
    private String destination;
    private int distance;           // km
    private int timeMinutes;        // estimated travel time
    private int price;              // ticket price in rupees

    public TransportOption(String name, String type, String source, String destination,
                           int distance, int timeMinutes, int price) {
        this.name = name;
        this.type = type;
        this.source = source;
        this.destination = destination;
        this.distance = distance;
        this.timeMinutes = timeMinutes;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
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

    public int getTimeMinutes() {
        return timeMinutes;
    }

    public int getPrice() {
        return price;
    }

    /** Example: "GSRTC Volvo | Bus | Ahmedabad -> Rajkot | 215 km | 235 min | Rs.375" */
    @Override
    public String toString() {
        return name + " | " + type + " | " + source + " -> " + destination
                + " | " + distance + " km | " + timeMinutes + " min | Rs." + price;
    }
}
