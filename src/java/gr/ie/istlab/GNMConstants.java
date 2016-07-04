package gr.ie.istlab;

import com.fasterxml.jackson.core.JsonFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.repackaged.com.google.api.client.http.HttpTransport;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Helper class for global instances of final and static variables.
 *
 * @author Androklis Gregoriou
 *
 */
public class GNMConstants {

    public static GoogleCredential SERVICE_GOOGLE_CREDENTIAL = null;

    public static HashMap<String, GoogleCredential> GOOGLE_CREDENTIALS = new HashMap<>();

    /**
     *
     * @param userEmail
     * @param refreshToken
     */
    public static void storeData(String userEmail, String refreshToken) {
        Key key = KeyFactory.createKey("GNMRT", userEmail);
        Entity entity = new Entity(key);
        entity.setProperty("refreshToken", refreshToken);
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();
        service.put(entity);
    }

    /**
     *
     * @param userEmail
     * @return
     * @throws EntityNotFoundException
     */
    public static String getRefreshTokenFromEntity(String userEmail) throws EntityNotFoundException {
        Key key = KeyFactory.createKey("GNMRT", userEmail);
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();

        return service.get(key).getProperty("refreshToken").toString();
    }

    /**
     *
     * @return
     */
    public static Iterable<Entity> getAllEntities() {
        Query q = new Query("GNMRT");
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();

        PreparedQuery pq = service.prepare(q);

        return pq.asIterable();
    }

}
