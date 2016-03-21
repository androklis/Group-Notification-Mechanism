package gr.ie.istlab.googleapis;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.gdata.util.ServiceException;
import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A helper class for GMail API.
 *
 * @author Androklis Gregoriou
 *
 */
public class GoogleMail {

    // Singleton instance of GoogleMail class
    private static GoogleMail instance = null;

    // Gmail Service instance
    private Gmail gmailService;

    /**
     * GoogleMail constructor.
     *
     */
    private GoogleMail() {

    }

    /**
     * Returns the Singleton instance for GoogleMail. If instance is null, an
     * instance is created.
     *
     * @return GoogleMail singleton instance
     */
    public static GoogleMail getInstance() {
        if (instance == null) {
            instance = new GoogleMail();
        }
        return instance;
    }

    /**
     * Create and return MimeMessage using the parameters provided.
     *
     * @param recipients {String[]} - Email addresses of the receivers.
     * @param from {String} - Email address of the sender, the mailbox account.
     * @param subject {String} - Subject of the email.
     * @param bodyText {String} - Body text of the email.
     * @return MimeMessage to be used to send email.
     * @throws MessagingException The base class for all exceptions thrown by
     * the Messaging classes
     */
    public MimeMessage createEmail(String from, String[] recipients, String subject,
            String bodyText) throws MessagingException {

        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);

        email.setFrom(new InternetAddress(from));

        for (String recipient : recipients) {
            email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(recipient));
        }

        email.setSubject(subject);

        email.setContent(bodyText, "text/html; charset=utf-8");

        return email;
    }

    /**
     * Create and returns a Message from a MimeMessage email.
     *
     * @param email {MimeMessage} - Email to be set to raw of message
     * @return Message containing base64url encoded email
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     * @throws MessagingException The base class for all exceptions thrown by
     * the Messaging classes
     */
    public static Message createMessageWithEmail(MimeMessage email)
            throws MessagingException, IOException {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        email.writeTo(bytes);
        String encodedEmail = Base64.encodeBase64URLSafeString(bytes
                .toByteArray());
        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }

    /**
     * Send an email from the user's mailbox to its recipient.
     *
     * @param email {MimeMessage} - MimeMessage to be used to send email
     * @param from {String} - User's email address. The special value "me" can
     * be used to indicate the authenticated user
     * @param uuid {String} - Universally Unique Identifier (UUID) to update
     * GoogleSpreadsheet's workspace scheme if email is sent
     * @return
     *
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     *
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     */
    public String sendMessage(MimeMessage email, String from, String uuid) throws MalformedURLException, IOException, ServiceException {

        gmailService = new Gmail.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), GOOGLE_CREDENTIALS.get(from)).setApplicationName("Group Notification Mechanism").build();

        try {
            Message message = createMessageWithEmail(email);
            message = gmailService.users().messages().send(from, message).execute();

            GoogleSpreadsheet.getInstance().updateScheme(from, uuid, message.get("labelIds").toString().replace("[", "").replace("]", "").trim());
            return message.get("labelIds").toString().replace("[", "").replace("]", "").trim();
        } catch (IOException | MessagingException ex) {
            Logger.getLogger(GoogleMail.class.getName()).log(Level.SEVERE, null, ex);
            return "Error Sending";
        }
    }
}
