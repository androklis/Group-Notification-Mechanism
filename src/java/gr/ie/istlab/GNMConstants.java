package gr.ie.istlab;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import java.util.HashMap;

/**
 *
 * @author Androklis Gregoriou
 */
public class GNMConstants {

    public static GoogleCredential SERVICE_GOOGLE_CREDENTIAL = null;

    public static HashMap<String, GoogleCredential> GOOGLE_CREDENTIALS = new HashMap<>();

//    public static void main(String[] args) {
//
//        BufferedReader br = null;
//        try {
//            Gson gson = new Gson();
//
//            br = new BufferedReader(
//                    new FileReader(GNMConstants.class.getClassLoader().getResource("gr/ie/istlab/cs/GNM-client_secrets.json").toString().replace("file:/", "").replaceAll("%20", " ").trim()));
//            ClientSecrets clientSecretsObj = gson.fromJson(br, ClientSecrets.class);
//            System.out.println("client_id: " + clientSecretsObj.getWeb().getClientId());
//            System.out.println("project_id: " + clientSecretsObj.getWeb().getProjectId());
//            System.out.println("token_uri: " + clientSecretsObj.getWeb().getTokenUri());
//            System.out.println("auth_provider_x509_cert_url: " + clientSecretsObj.getWeb().getAuthProviderX509CertUrl());
//            System.out.println("client_secret: " + clientSecretsObj.getWeb().getClientSecret());
//            System.out.println("redirect_uris:");
//            List<String> redirectUris = clientSecretsObj.getWeb().getRedirectUris();
//            for (int i = 0; i < redirectUris.size(); i++) {
//                System.out.println(redirectUris.get(i));
//            }
//            System.out.println("javascript_origins:");
//            List<String> javascriptOrigins = clientSecretsObj.getWeb().getJavascriptOrigins();
//            for (int i = 0; i < javascriptOrigins.size(); i++) {
//                System.out.println(javascriptOrigins.get(i));
//            }
//        } catch (FileNotFoundException ex) {
//            Logger.getLogger(GNMConstants.class.getName()).log(Level.SEVERE, null, ex);
//        } finally {
//            try {
//                br.close();
//            } catch (IOException ex) {
//                Logger.getLogger(GNMConstants.class.getName()).log(Level.SEVERE, null, ex);
//            }
//        }
//
//    }
}
