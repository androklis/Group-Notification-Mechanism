package gr.ie.istlab.googleapis;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

public class GoogleCalendar {

    // Singleton instance of GoogleCalendar class
    private static GoogleCalendar instance = null;

    private Calendar calendarService;

    /**
     * GoogleCalendar constructor.
     *
     */
    private GoogleCalendar() {
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

    public String addEvent(String calendarId, String userEmail, String summary, String description, String guests, String start, String end) {

        calendarService = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(userEmail)).setApplicationName("Group Notification Mechanism").build();

        Event event = new Event().setSummary(summary).setDescription(description);

        event.setStart(new EventDateTime().setDateTime(new DateTime(start.split(" ")[0] + "T" + start.split(" ")[1] + ":00")));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(end.split(" ")[0] + "T" + end.split(" ")[1] + ":00")));

        ArrayList<EventAttendee> attendees = new ArrayList<>();

        for (String guest : guests.split(",")) {
            attendees.add(new EventAttendee().setEmail(guest));
        }

        event.setAttendees(attendees);

        try {
            event = calendarService.events().insert(calendarId, event).execute();
            return event.getId();
        } catch (IOException ex) {
            Logger.getLogger(GoogleCalendar.class.getName()).log(Level.SEVERE, null, ex);
            return "0";
        }
    }

    public void deleteEvent(String userEmail, String calendarId, String eventId) {
        calendarService = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(userEmail)).setApplicationName("Group Notification Mechanism").build();
        try {
            calendarService.events().delete(calendarId, eventId).execute();
        } catch (IOException ex) {
            Logger.getLogger(GoogleCalendar.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
