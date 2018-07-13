package org.uniof.manchester.dropbox.utilities;

/**
 * A database record for a user of our web app.
 */
public class User
{
    public String username;

    /**
     * If this user has allowed us (the Web File Browser app) to "link" to his Dropbox
     * account, then we save the Dropbox <em>access token</em> here.  This access token
     * will let us use the Dropbox API with his account.
     */
    public String dropboxAccessToken;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDropboxAccessToken() {
		return dropboxAccessToken;
	}

	public void setDropboxAccessToken(String dropboxAccessToken) {
		this.dropboxAccessToken = dropboxAccessToken;
	}
    
    
}