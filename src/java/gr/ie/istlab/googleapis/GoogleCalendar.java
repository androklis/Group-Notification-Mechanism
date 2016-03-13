package gr.ie.istlab.googleapis;

import com.google.gdata.client.calendar.CalendarService;

public class GoogleCalendar {

    // Singleton instance of GoogleCalendar class
    private static GoogleCalendar instance = null;

    // Calendar Service instance
    private static CalendarService calendarService;

    /**
     * GoogleCalendar constructor.
     *
     */
    private GoogleCalendar() {

        calendarService = new CalendarService("Group Notification Mechanism");
    }

    /**
     * Returns the Singleton instance for GoogleCalendar. If instance is null,
     * an instance is created.
     *
     * @return GoogleCalendar singleton instance
     */
    public static GoogleCalendar getInstance() {
        if (instance == null) {
            instance = new GoogleCalendar();
        }
        return instance;
    }

}
