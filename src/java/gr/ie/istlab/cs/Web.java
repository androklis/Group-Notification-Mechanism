
package gr.ie.istlab.cs;

import java.util.ArrayList;
import java.util.List;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Web {

    @SerializedName("client_id")
    @Expose
    private String clientId;
    @SerializedName("project_id")
    @Expose
    private String projectId;
    @SerializedName("auth_uri")
    @Expose
    private String authUri;
    @SerializedName("token_uri")
    @Expose
    private String tokenUri;
    @SerializedName("auth_provider_x509_cert_url")
    @Expose
    private String authProviderX509CertUrl;
    @SerializedName("client_secret")
    @Expose
    private String clientSecret;
    @SerializedName("redirect_uris")
    @Expose
    private List<String> redirectUris = new ArrayList<String>();
    @SerializedName("javascript_origins")
    @Expose
    private List<String> javascriptOrigins = new ArrayList<String>();

    /**
     * 
     * @return
     *     The clientId
     */
    public String getClientId() {
        return clientId;
    }

    /**
     * 
     * @param clientId
     *     The client_id
     */
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public Web withClientId(String clientId) {
        this.clientId = clientId;
        return this;
    }

    /**
     * 
     * @return
     *     The projectId
     */
    public String getProjectId() {
        return projectId;
    }

    /**
     * 
     * @param projectId
     *     The project_id
     */
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public Web withProjectId(String projectId) {
        this.projectId = projectId;
        return this;
    }

    /**
     * 
     * @return
     *     The authUri
     */
    public String getAuthUri() {
        return authUri;
    }

    /**
     * 
     * @param authUri
     *     The auth_uri
     */
    public void setAuthUri(String authUri) {
        this.authUri = authUri;
    }

    public Web withAuthUri(String authUri) {
        this.authUri = authUri;
        return this;
    }

    /**
     * 
     * @return
     *     The tokenUri
     */
    public String getTokenUri() {
        return tokenUri;
    }

    /**
     * 
     * @param tokenUri
     *     The token_uri
     */
    public void setTokenUri(String tokenUri) {
        this.tokenUri = tokenUri;
    }

    public Web withTokenUri(String tokenUri) {
        this.tokenUri = tokenUri;
        return this;
    }

    /**
     * 
     * @return
     *     The authProviderX509CertUrl
     */
    public String getAuthProviderX509CertUrl() {
        return authProviderX509CertUrl;
    }

    /**
     * 
     * @param authProviderX509CertUrl
     *     The auth_provider_x509_cert_url
     */
    public void setAuthProviderX509CertUrl(String authProviderX509CertUrl) {
        this.authProviderX509CertUrl = authProviderX509CertUrl;
    }

    public Web withAuthProviderX509CertUrl(String authProviderX509CertUrl) {
        this.authProviderX509CertUrl = authProviderX509CertUrl;
        return this;
    }

    /**
     * 
     * @return
     *     The clientSecret
     */
    public String getClientSecret() {
        return clientSecret;
    }

    /**
     * 
     * @param clientSecret
     *     The client_secret
     */
    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public Web withClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
        return this;
    }

    /**
     * 
     * @return
     *     The redirectUris
     */
    public List<String> getRedirectUris() {
        return redirectUris;
    }

    /**
     * 
     * @param redirectUris
     *     The redirect_uris
     */
    public void setRedirectUris(List<String> redirectUris) {
        this.redirectUris = redirectUris;
    }

    public Web withRedirectUris(List<String> redirectUris) {
        this.redirectUris = redirectUris;
        return this;
    }

    /**
     * 
     * @return
     *     The javascriptOrigins
     */
    public List<String> getJavascriptOrigins() {
        return javascriptOrigins;
    }

    /**
     * 
     * @param javascriptOrigins
     *     The javascript_origins
     */
    public void setJavascriptOrigins(List<String> javascriptOrigins) {
        this.javascriptOrigins = javascriptOrigins;
    }

    public Web withJavascriptOrigins(List<String> javascriptOrigins) {
        this.javascriptOrigins = javascriptOrigins;
        return this;
    }

}
