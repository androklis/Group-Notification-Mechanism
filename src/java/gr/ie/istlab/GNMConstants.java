package gr.ie.istlab;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
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

}
