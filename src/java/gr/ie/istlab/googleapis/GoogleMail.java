package gr.ie.istlab.googleapis;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
//import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;

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
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.gdata.util.ServiceException;
import gr.ie.istlab.GNMConstants;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A helper class for GMail API.
 *
 * @author Androklis Gregoriou
 *
 */
public class GoogleMail {

    private static GoogleMail instance = null; // Singleton instance of GoogleMail class

    private Gmail gmailService; // Gmail Service instance

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
     *
     * @param userEmail
     * @return
     * @throws IOException
     * @throws GeneralSecurityException
     */
    private Credential generateCredentialWithUserApprovedToken(String userEmail) throws IOException,
            GeneralSecurityException {
        NetHttpTransport netHttpTransport = new NetHttpTransport();
        JacksonFactory jacksonFactory = JacksonFactory.getDefaultInstance();

        GoogleClientSecrets clientSecrets
                = GoogleClientSecrets.load(
                        JacksonFactory.getDefaultInstance(), new InputStreamReader(new FileInputStream(
                                new File("WEB-INF/GNM-client_secrets.json"))));

        try {
            return new GoogleCredential.Builder().setTransport(netHttpTransport).setJsonFactory(jacksonFactory)
                    .setClientSecrets(clientSecrets.getDetails().getClientId(), clientSecrets.getDetails().getClientSecret()).build().setRefreshToken(GNMConstants.getRefreshTokenFromEntity(userEmail));
        } catch (EntityNotFoundException ex) {
            Logger.getLogger(GNMConstants.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    /**
     * Create and return MimeMessage using the parameters provided.
     *
     * @param recipients {String[]} - Email addresses of the receivers.
     * @param from {String} - Email address of the sender, the mailbox account.
     * @param subject {String} - Subject of the email.
     * @param bodyText {String} - Body text of the email.
     * @return MimeMessage to be used to send email.
     *
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

        email.setSubject(subject, "UTF-8");

        email.setContent(bodyText + "<br/><br/><em>This notification was sent from <a href='group-notification-mechanism.appspot.com'>iSTLab Group Notification Mechanism Mashup Web Application</a>.</em>", "text/html; charset=utf-8");

        return email;
    }

    /**
     * Create and returns a Message from a MimeMessage email.
     *
     * @param email {MimeMessage} - Email to be set to raw of message
     * @return Message containing base64url encoded email
     *
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
     * @return Sent message labelId if email is sent or returns the message
     * "Error Sending"
     *
     * @throws ServiceException The ServiceException class is the base exception
     * class used to indicate an error while processing a GDataRequest
     * @throws MalformedURLException Thrown to indicate that a malformed URL has
     * occurred. Either no legal protocol could be found in a specification
     * string or the string could not be parsed
     * @throws IOException Signals that an I/O exception of some sort has
     * occurred. Exceptions produced by failed or interrupted I/O operations
     */
    public String sendMessage(MimeMessage email, String from, String uuid) throws MalformedURLException, IOException, ServiceException {
        try {
            gmailService = new Gmail.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), generateCredentialWithUserApprovedToken(from)).setApplicationName("Group Notification Mechanism").build();

//            email.setHeader("Authorization", "Bearer " + GOOGLE_CREDENTIALS.get(from).getAccessToken());
            Message message = createMessageWithEmail(email);
            message = gmailService.users().messages().send(from, message).execute();

            GoogleSpreadsheet.getInstance().updateSchemeStatus(from, uuid, message.get("labelIds").toString().replace("[", "").replace("]", "").trim());
            return (message.get("labelIds").toString().replace("[", "").replace("]", "")).split(",")[0].trim();
        } catch (MessagingException | GeneralSecurityException ex) {
            Logger.getLogger(GoogleMail.class.getName()).log(Level.SEVERE, null, ex);
            return "Error Sending";
        }
    }
}
