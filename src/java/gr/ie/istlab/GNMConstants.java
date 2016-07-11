package gr.ie.istlab;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import java.util.HashMap;

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
     * Stores a refresh token for every user. The token is retrieved from a
     * service to be used to send notifications from user.
     *
     * @param userEmail {String} - User's email to be used as Datastore's key
     * @param refreshToken {String} - User's refresh token to be stored as
     * Datastore's key value
     */
    public static void storeData(String userEmail, String refreshToken) {
        Key key = KeyFactory.createKey("GNMRT", userEmail);
        Entity entity = new Entity(key);
        entity.setProperty("refreshToken", refreshToken);
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();
        service.put(entity);
    }

    /**
     * Returns user's refresh token from user email.
     *
     * @param userEmail {String} - User's email to be used to retrieve user's
     * refresh token from Datastore
     * @return user's refresh token
     *
     * @throws EntityNotFoundException When no Entity with the specified Key
     * could be found.
     */
    public static String getRefreshTokenFromEntity(String userEmail) throws EntityNotFoundException {
        Key key = KeyFactory.createKey("GNMRT", userEmail);
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();

        return service.get(key).getProperty("refreshToken").toString();
    }

    /**
     * Returns all refresh token entities from Datastore.
     *
     * @return all refresh token entities from Datastore
     */
    public static Iterable<Entity> getAllEntities() {
        Query q = new Query("GNMRT");
        DatastoreService service = DatastoreServiceFactory.getDatastoreService();

        PreparedQuery pq = service.prepare(q);

        return pq.asIterable();
    }

}
