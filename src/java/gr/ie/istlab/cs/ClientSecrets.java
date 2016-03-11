
package gr.ie.istlab.cs;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class ClientSecrets {

    @SerializedName("web")
    @Expose
    private Web web;

    /**
     * 
     * @return
     *     The web
     */
    public Web getWeb() {
        return web;
    }

    /**
     * 
     * @param web
     *     The web
     */
    public void setWeb(Web web) {
        this.web = web;
    }

    public ClientSecrets withWeb(Web web) {
        this.web = web;
        return this;
    }

}
