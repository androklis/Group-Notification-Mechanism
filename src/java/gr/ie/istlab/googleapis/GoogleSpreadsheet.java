package gr.ie.istlab.googleapis;

import static gr.ie.istlab.GNMConstants.SERVICE_GOOGLE_CREDENTIAL;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.data.PlainTextConstruct;
import com.google.gdata.data.spreadsheet.CellEntry;
import com.google.gdata.data.spreadsheet.CellFeed;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.data.spreadsheet.ListFeed;
import com.google.gdata.data.spreadsheet.SpreadsheetEntry;
import com.google.gdata.data.spreadsheet.WorksheetEntry;
import com.google.gdata.util.ServiceException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.MessagingException;

/**
 * A helper class for GoogleSpreadsheet API.
 *
 * @author Androklis Gregoriou
 *
 */
public class GoogleSpreadsheet {

    private static GoogleSpreadsheet instance = null; // Singleton instance of GoogleSpreadsheet class

    private static SpreadsheetService spreadsheetService; // Google Spreadsheet instance

    private SpreadsheetEntry spreadsheet; // Google Spreadsheet Entry instance

    /**
     *
     * GoogleSpreadsheet constructor.
     *
     */
    private GoogleSpreadsheet() {

        spreadsheetService = new SpreadsheetService("Group Notification Mechanism");
        spreadsheetService.setOAuth2Credentials(SERVICE_GOOGLE_CREDENTIAL);

    }

    /**
     * Returns the Singleton instance for GoogleSpreadsheet. If instance is
     * null, an instance is created.
     *
     * @return GoogleSpreadsheet singleton instance
     */
    public static GoogleSpreadsheet getInstance() {
        if (instance == null) {
            instance = new GoogleSpreadsheet();
        }
        // Set HTTP timeout for 2 minutes for larger feed
        spreadsheetService.setConnectTimeout(2 * 60000);

        spreadsheetService.setReadTimeout(2 * 60000);
        return instance;
    }

    /**
     * Adds a new worksheet in Google Spreadsheet.
     *
     * @param userEmail {String} - User's email to be used as worksheet's title
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public void addWorksheet(String userEmail) throws MalformedURLException, IOException,
            ServiceException {

        spreadsheet = spreadsheetService.getEntry(new URL("https://spreadsheets.google.com/feeds/spreadsheets/1N8H9qP5eNKHwwr3tIWxHv8cD19nc1mhQ_zRcEZt20sE"), SpreadsheetEntry.class);

        WorksheetEntry worksheet = new WorksheetEntry();
        worksheet.setTitle(new PlainTextConstruct(userEmail));
        worksheet.setColCount(10);
        worksheet.setRowCount(1);

        URL worksheetFeedUrl = spreadsheet.getWorksheetFeedUrl();
        spreadsheetService.insert(worksheetFeedUrl, worksheet);

        initializeWorksheet(userEmail);

    }

    /**
     * Initializes a worksheet with first row as header row. Called when a new
     * worksheet is added to Google Spreadsheet.
     *
     * @param userEmail {String} - User's email to get user's worksheet
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    private void initializeWorksheet(String userEmail) throws MalformedURLException,
            IOException, ServiceException {

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL cellFeedUrl = worksheet.getCellFeedUrl();
        CellFeed cellFeed = spreadsheetService.getFeed(cellFeedUrl,
                CellFeed.class);

        CellEntry cellEntry = new CellEntry(1, 1, "UUID");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 2, "CALENDAR_ID");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 3, "EVENT_ID");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 4, "EVENT_TIMESTAMP");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 5, "ACCESS_ROLE");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 6, "RECIPIENTS");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 7, "SUBJECT");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 8, "MESSAGE");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 9, "TIMESTAMP");
        cellFeed.insert(cellEntry);
        cellEntry = new CellEntry(1, 10, "STATUS");
        cellFeed.insert(cellEntry);

        worksheet.setEtag("*");

        worksheet.update();

    }

    /**
     * Adds a new Notification Scheme to user's worksheet on Google Spreadsheet
     * and returns the uuid of the new scheme.
     *
     *
     * @param calendarId {String} - The id of the calendar for the new
     * scheme/event
     * @param eventId {String} - The id of the event if new scheme comes from an
     * event
     * @param accessRole {String} - 1 if user is event owner or 0 if not
     * @param userEmail {String} - User's email to get user's worksheet
     * @param to {String} - A String of email addresses seperated by a comma
     * @param subject {String} - The subject of the email
     * @param message {String} - The message of the email
     * @param eventTimestamp {String} - Start and End timestamp, in yyyy-MM-dd
     * HH-dd - yyyy-MM-dd HH-dd format, of the event
     * @param timestamp {String} - Scheme timestamp, in yyyy-MM-dd HH:mm format,
     * that email must be sent
     * @return created scheme's uuid
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public String addScheme(String calendarId, String eventId, String accessRole, String userEmail, String to, String subject, String message,
            String eventTimestamp, String timestamp) throws MalformedURLException, IOException,
            ServiceException {

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL listFeedUrl = worksheet.getListFeedUrl();

        ListEntry row = new ListEntry();
        String uuid = UUID.randomUUID().toString();
        row.getCustomElements().setValueLocal("UUID", uuid);
        row.getCustomElements().setValueLocal("CALENDARID", calendarId);
        row.getCustomElements().setValueLocal("EVENTID", eventId);
        row.getCustomElements().setValueLocal("EVENTTIMESTAMP", eventTimestamp);
        row.getCustomElements().setValueLocal("ACCESSROLE", accessRole);
        row.getCustomElements().setValueLocal("RECIPIENTS", to);
        row.getCustomElements().setValueLocal("SUBJECT", subject);
        row.getCustomElements().setValueLocal("MESSAGE", message);
        row.getCustomElements().setValueLocal("TIMESTAMP", "'" + timestamp);
        row.getCustomElements().setValueLocal("STATUS", "PENDING");

        spreadsheetService.insert(listFeedUrl, row);
        return uuid;

    }

    /**
     * Returns user's worksheet from Google Spreasheet.
     *
     * @param userEmail {String} - User's email to get user's worksheet
     * @return user's worksheet from Google Spreasheet
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public WorksheetEntry getWorksheet(String userEmail)
            throws MalformedURLException, IOException, ServiceException {

        List<WorksheetEntry> worksheets;
        worksheets = getAllWorksheets();
        if (worksheets.size() > 0) {

            for (WorksheetEntry worksheet : worksheets) {
                if (userEmail.equals(worksheet.getTitle().getPlainText())) {
                    return worksheet;
                }
            }
        }
        return null;

    }

    /**
     * Returns a list of all worksheets on Google Spreasheet.
     *
     * @return a list of all worksheets on Google Spreasheet
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    private List<WorksheetEntry> getAllWorksheets()
            throws MalformedURLException, IOException, ServiceException {

        spreadsheet = spreadsheetService.getEntry(new URL("https://spreadsheets.google.com/feeds/spreadsheets/1N8H9qP5eNKHwwr3tIWxHv8cD19nc1mhQ_zRcEZt20sE"), SpreadsheetEntry.class);

        return spreadsheet.getWorksheets();

    }

    /**
     * Performs a full-text search on cells with tag "timestamp" and "status".
     * If "status" is "PENDING" and "timestamp" is the same as when the method
     * is called, then a notification email is to be sent. This method is called
     * by a cron task, so notifications are sent to recipients even if user is
     * not active.
     *
     * @param fullTextSearchString {String} - Full text search string, with
     * space-separated keywords
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     * @throws EntityNotFoundException
     */
    public void checkWorksheet(String fullTextSearchString) throws IOException,
            ServiceException, EntityNotFoundException {

        for (WorksheetEntry worksheet : getAllWorksheets()) {
            URL listFeedUrl = worksheet.getListFeedUrl();
            ListFeed listFeed = (ListFeed) spreadsheetService.getFeed(listFeedUrl, ListFeed.class);

            for (ListEntry listEntry : listFeed.getEntries()) {
                if ("PENDING".equals(listEntry.getCustomElements().getValue("status"))) {
                    if ((fullTextSearchString).equals(listEntry.getCustomElements().getValue("timestamp"))) {
                        try {
                            GoogleMail.getInstance().sendMessage(
                                    GoogleMail.getInstance().createEmail(
                                            worksheet.getTitle().getPlainText(),
                                            listEntry.getCustomElements().getValue("recipients").split(","),
                                            listEntry.getCustomElements().getValue("subject"),
                                            listEntry.getCustomElements().getValue("message")),
                                    worksheet.getTitle().getPlainText(), listEntry.getCustomElements().getValue("uuid"));
                            break;
                        } catch (MessagingException ex) {
                            Logger.getLogger(GoogleSpreadsheet.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
            }
        }
    }

    /**
     * Returns all Notification Schemes for specified user from worksheet.
     *
     * @param userEmail {String} - User's email to get user's worksheet
     * @return all Notification Schemes from worksheet for the user as a
     * JsonArray
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public JsonArray getSchemes(String userEmail) throws IOException, ServiceException {

        JsonArray jsonArray = new JsonArray();

        ListFeed feed = spreadsheetService.getFeed(getWorksheet(userEmail)
                .getListFeedUrl(), ListFeed.class
        );

        for (ListEntry entry : feed.getEntries()) {

            JsonObject jsonObject = new JsonObject();

            for (String tag : entry.getCustomElements().getTags()) {
                jsonObject.addProperty(tag, entry.getCustomElements().getValue(tag));
            }
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }

    /**
     * Updates the column with tag "status" of a worksheet. If an email is sent
     * the status will be updated to "Sent".
     *
     * @param userEmail {String} - User's email to get user's worksheet
     * @param uuid {String} - Universally Unique Identifier (UUID) for the row
     * to be updated
     * @param status {String} - The status to be updated. If an email is sent
     * the status will be "Sent", otherwise it will be "Pending"
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public void updateSchemeStatus(String userEmail, String uuid, String status)
            throws MalformedURLException, IOException, ServiceException {

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL listFeedUrl = worksheet.getListFeedUrl();
        ListFeed listFeed = spreadsheetService.getFeed(listFeedUrl, ListFeed.class);

        for (ListEntry listEntry : listFeed.getEntries()) {
            if (uuid.equals(listEntry.getTitle().getPlainText())) {
                listEntry.getCustomElements().setValueLocal(
                        "Timestamp",
                        "'"
                        + listEntry.getCustomElements().getValue(
                                "Timestamp"));
                listEntry.getCustomElements().setValueLocal("Status", status);

                listEntry.update();
            }
        }
    }

    /**
     * Finds if a Notification Scheme with given uuid to user's worksheet on
     * Google Spreadsheet, is associated with an event and if user has the
     * proper rights to delete the event. Then the event is deleted.
     *
     *
     * @param uuid {String} - Unique Identifier for the scheme
     * @param userEmail {String} - User's email to get user's worksheet
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    private void getSchemeWithEvent(String uuid, String userEmail)
            throws MalformedURLException, IOException, ServiceException {

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL listFeedUrl = worksheet.getListFeedUrl();
        ListFeed listFeed = spreadsheetService.getFeed(listFeedUrl, ListFeed.class);

        for (ListEntry listEntry : listFeed.getEntries()) {
            if (uuid.equals(listEntry.getTitle().getPlainText())) {
                if ("1".equals(listEntry.getCustomElements().getValue("ACCESSROLE"))) {
                    GoogleCalendar.getInstance().deleteEvent(userEmail, listEntry.getCustomElements().getValue("CALENDARID"), listEntry.getCustomElements().getValue("EVENTID"));
                }
            }
        }
    }

    /**
     * Deletes a Notification Scheme based on given uuid.
     *
     * @param uuid {String} - Universally Unique Identifier (UUID) for the row
     * to be deleted
     * @param userEmail {String} - User's email to get user's worksheet
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public void deleteScheme(String uuid, String userEmail) throws MalformedURLException,
            IOException, ServiceException {

        getSchemeWithEvent(uuid, userEmail);

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL listFeedUrl = worksheet.getListFeedUrl();
        ListFeed listFeed = spreadsheetService.getFeed(listFeedUrl, ListFeed.class);

        for (ListEntry listEntry : listFeed.getEntries()) {
            if (uuid.equals(listEntry.getTitle().getPlainText())) {
                listEntry.delete();
            }
        }

    }

    /**
     * Edits a Notification Scheme to user's worksheet on Google Spreadsheet.
     * Also updates the event if an event is associated with the scheme.
     *
     *
     * @param uuid {String} - Unique Identifier for the scheme to be edited
     * @param calendarId {String} - The id of the calendar for the scheme/event
     * @param eventId {String} - The id of the event if scheme is also an event
     * @param userEmail {String} - User's email to get user's worksheet
     * @param to {String} - A String of email addresses seperated by a comma
     * @param subject {String} - The subject of the email
     * @param message {String} -The message of the email
     * @param eventTimestamp {String} - Start and End timestamp, in yyyy-MM-dd
     * HH-dd - yyyy-MM-dd HH-dd format, of the event
     * @param timestamp {String} - Scheme timestamp, in yyyy-MM-dd HH:mm format,
     * that email must be sent
     * @return the calendar Id if event is about to be moved to another calendar
     *
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     */
    public String editScheme(String uuid, String calendarId, String eventId, String userEmail, String to, String subject, String message,
            String eventTimestamp, String timestamp) throws MalformedURLException, IOException,
            ServiceException {

        String fromCalendar = "";

        WorksheetEntry worksheet = getWorksheet(userEmail);

        URL listFeedUrl = worksheet.getListFeedUrl();
        ListFeed listFeed = spreadsheetService.getFeed(listFeedUrl, ListFeed.class);

        for (ListEntry listEntry : listFeed.getEntries()) {
            if (uuid.equals(listEntry.getTitle().getPlainText())) {

                if (!calendarId.equals(listEntry.getCustomElements().getValue("CALENDARID"))) {
                    fromCalendar = listEntry.getCustomElements().getValue("CALENDARID");
                    listEntry.getCustomElements().setValueLocal("CALENDARID", calendarId);
                }

                listEntry.getCustomElements().setValueLocal("EVENTID", eventId);
                listEntry.getCustomElements().setValueLocal("EVENTTIMESTAMP", eventTimestamp);
                listEntry.getCustomElements().setValueLocal("RECIPIENTS", to);
                listEntry.getCustomElements().setValueLocal("SUBJECT", subject);
                listEntry.getCustomElements().setValueLocal("MESSAGE", message);
                listEntry.getCustomElements().setValueLocal("TIMESTAMP", "'" + timestamp);
                listEntry.getCustomElements().setValueLocal("STATUS", "PENDING");

                listEntry.update();
                break;
            }
        }
        return fromCalendar;
    }

}
