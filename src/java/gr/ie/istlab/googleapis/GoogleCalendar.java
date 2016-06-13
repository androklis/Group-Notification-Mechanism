package gr.ie.istlab.googleapis;

import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;

import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A helper class for GoogleCalendar API.
 *
 * @author Androklis Gregoriou
 *
 */
public class GoogleCalendar {

    private static GoogleCalendar instance = null;// Singleton instance of GoogleCalendar class

    private Calendar calendarService; // Calendar Service instance

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

    /**
     * Adds a new event to selected calendar on Google Calendar and returns the
     * id of the new event.
     *
     *
     * @param calendarId {String} - The id of the calendar for the new
     * scheme/event
     * @param summary {String} - Event summary to be placed as event title
     * @param description {String} - Event description to be placed as event
     * description
     * @param guests {String} - A String of comma separated email addresses, to
     * be used as event attendees
     * @param start {String} - Event start timestamp with yyyy-MM-dd HH:mm
     * format
     * @param end {String} - Event end timestamp with yyyy-MM-dd HH:mm format
     * @param timeZoneOffset {String} - Time zone offset in seconds
     * @param userEmail {String} - Event creator
     * @return created event's id
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     */
    public String addEvent(String calendarId, String userEmail, String summary, String description, String guests, String start, String end, String timeZoneOffset) throws IOException {

        calendarService = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(userEmail)).setApplicationName("Group Notification Mechanism").build();

        Event event = new Event().setSummary(summary).setDescription(description);

        event.setStart(new EventDateTime().setDateTime(new DateTime(start.split(" ")[0] + "T" + start.split(" ")[1] + ":00" + timeZoneOffset + ":00")));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(end.split(" ")[0] + "T" + end.split(" ")[1] + ":00" + timeZoneOffset + ":00")));

        ArrayList<EventAttendee> attendees = new ArrayList<>();

        for (String guest : guests.split(",")) {
            attendees.add(new EventAttendee().setEmail(guest));
        }

        event.setAttendees(attendees);

        event = calendarService.events().insert(calendarId, event).execute();
        return event.getId();
    }

    /**
     * Deletes an event based on given calendar id and event id.
     *
     *
     * @param userEmail {String} - User's email to get user's worksheet
     * @param calendarId {String} - The id of the calendar where the event is in
     * @param eventId {String} - The id of the event that has to be deleted
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     */
    public void deleteEvent(String userEmail, String calendarId, String eventId) throws IOException {
        calendarService = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(userEmail)).setApplicationName("Group Notification Mechanism").build();

        calendarService.events().delete(calendarId, eventId).execute();
    }

    /**
     * Edits a Notification Scheme to user's worksheet on Google Spreadsheet.
     * Also updates the event if an event is associated with the scheme.
     *
     *
     * @param fromCalendarId {String} - The id of the calendar where the event
     * is in
     * @param toCalendarId {String} - The id of the calendar for the event to be
     * moved into
     * @param eventId {String} - The id of the event to be updated
     * @param userEmail {String} - Event creator
     * @param summary {String} - Event summary to be placed as event title
     * @param description {String} - Event description to be placed as event
     * description
     * @param guests {String} - A String of comma separated email addresses, to
     * be used as event attendees
     * @param start {String} - Event start timestamp with yyyy-MM-dd HH:mm
     * format
     * @param end {String} - Event end timestamp with yyyy-MM-dd HH:mm format
     * @param timeZoneOffset {String} - Time zone offset in seconds
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     */
    public void updateEvent(String fromCalendarId, String toCalendarId, String eventId, String userEmail, String summary, String description, String guests, String start, String end, String timeZoneOffset) throws IOException {

        calendarService = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(userEmail)).setApplicationName("Group Notification Mechanism").build();

        Event event;

        if (!"".equals(fromCalendarId) && fromCalendarId != null) {
            event = calendarService.events().get(fromCalendarId, eventId).execute();
        } else {
            event = calendarService.events().get(toCalendarId, eventId).execute();
        }
        event.setSummary(summary).setDescription(description);

        event.setStart(new EventDateTime().setDateTime(new DateTime(start.split(" ")[0] + "T" + start.split(" ")[1] + ":00" + timeZoneOffset + ":00")));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(end.split(" ")[0] + "T" + end.split(" ")[1] + ":00" + timeZoneOffset + ":00")));

        ArrayList<EventAttendee> attendees = new ArrayList<>();

        for (String guest : guests.split(",")) {
            attendees.add(new EventAttendee().setEmail(guest));
        }

        event.setAttendees(attendees);

        Event updatedEvent = calendarService.events().update(fromCalendarId, event.getId(), event).execute();

        if (!"".equals(fromCalendarId) && fromCalendarId != null) {
            calendarService.events().move(fromCalendarId, updatedEvent.getId(), toCalendarId).execute();
        }
    }

}
