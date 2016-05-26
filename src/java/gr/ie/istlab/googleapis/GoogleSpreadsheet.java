package gr.ie.istlab.googleapis;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.UUID;

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
import static gr.ie.istlab.GNMConstants.SERVICE_GOOGLE_CREDENTIAL;

public class GoogleSpreadsheet {

    private static GoogleSpreadsheet instance = null;

    private static SpreadsheetService spreadsheetService;

    private SpreadsheetEntry spreadsheet;

    private GoogleSpreadsheet() {

        spreadsheetService = new SpreadsheetService("Group Notification Mechanism");
        spreadsheetService.setOAuth2Credentials(SERVICE_GOOGLE_CREDENTIAL);

    }

    public static GoogleSpreadsheet getInstance() {
        if (instance == null) {
            instance = new GoogleSpreadsheet();
        }
        return instance;
    }

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

    public void initializeWorksheet(String userEmail) throws MalformedURLException,
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

    private List<WorksheetEntry> getAllWorksheets()
            throws MalformedURLException, IOException, ServiceException {

        spreadsheet = spreadsheetService.getEntry(new URL("https://spreadsheets.google.com/feeds/spreadsheets/1N8H9qP5eNKHwwr3tIWxHv8cD19nc1mhQ_zRcEZt20sE"), SpreadsheetEntry.class);

        return spreadsheet.getWorksheets();

    }

//    public void checkWorksheet(String fullTextSearchString) throws IOException,
//            ServiceException, MessagingException {
//
//        for (WorksheetEntry worksheet : getAllWorksheets()) {
//            ListQuery query = new ListQuery(worksheet.getListFeedUrl());
//            query.setFullTextQuery(fullTextSearchString);
//            ListFeed feed = spreadsheetService.query(query, ListFeed.class);
//
//            feed.getEntries().stream().filter((entry) -> (GOOGLE_CREDENTIALS.get(entry.getTitle().getPlainText()) != null)).forEach((entry) -> {
//                entry.getCustomElements().getTags().stream().filter((tag) -> ("timestamp".equals(tag)
//                        && (fullTextSearchString.split(" ")[1] + " " + fullTextSearchString
//                        .split(" ")[2]).equals(entry
//                        .getCustomElements().getValue(tag)))).forEach((_item) -> {
//                    GoogleMail
//                            .getInstance()
//                            .sendMessage(
//                                    GoogleMail
//                                    .getInstance()
//                                    .createEmail(
//                                            worksheet
//                                            .getTitle()
//                                            .getPlainText(),
//                                            (entry.getCustomElements()
//                                            .getValue(
//                                                    "recipients")
//                                            .split(", ")),
//                                            entry.getCustomElements()
//                                            .getValue(
//                                                    "subject"),
//                                            entry.getCustomElements()
//                                            .getValue(
//                                                    "message")),
//                                    worksheet.getTitle().getPlainText(),
//                                    entry.getCustomElements().getValue(
//                                            "uuid"));
//                });
//            });
//        }
//
//    }
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
                    listEntry.getCustomElements().setValueLocal("CALENDARID", calendarId);
                    fromCalendar = listEntry.getCustomElements().getValue("CALENDARID");
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
