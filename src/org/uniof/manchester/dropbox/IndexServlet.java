package org.uniof.manchester.dropbox;

import static com.dropbox.core.util.StringUtil.jq;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ResourceBundle;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.uniof.manchester.dropbox.utilities.Common;
import org.uniof.manchester.dropbox.utilities.Common.DatabaseException;
import org.uniof.manchester.dropbox.utilities.User;

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.json.JsonReader;



/**
 * Servlet implementation class IndexServlet
 */
@WebServlet("/Index")
public class IndexServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	ResourceBundle propsDR=ResourceBundle.getBundle("dataremover");
	private final Common common;
	/**
	 * @throws DatabaseException 
	 * @throws IOException 
	 * @see HttpServlet#HttpServlet()
	 */


	public IndexServlet() throws IOException, DatabaseException {

		String argAppInfo = propsDR.getString("info.argAppInfo");
		String argDatabase = propsDR.getString("info.argDatabase");

		DbxAppInfo dbxAppInfo = null;

		try {
			dbxAppInfo = DbxAppInfo.Reader.readFromFile(argAppInfo);
		} catch (JsonReader.FileLoadException ex) {
			System.err.println("Error loading <app-info-file>: " + ex.getMessage());

		}

		//Base de datos de usuarios
		File dbFile = new File(argDatabase);

		this.common = new Common(new PrintWriter(System.out, true), dbxAppInfo, dbFile);
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String username = request.getParameter("username");
		System.out.println("username :: " +  username);

		if (username == null) {
			response.sendError(400, "Missing field \"username\".");
			return;
		}

		String usernameError = checkUsername(username);
		if (usernameError != null) {
			response.sendError(400, "Invalid username: " + usernameError);
			return;
		}

		User user;

		// Lookup user.  If the user doesn't exist, create it.
		synchronized (common.userDb) {
			user = common.userDb.get(username);
			if (user == null) {
				user = new User();
				user.username = username;
				user.dropboxAccessToken = null;
				common.userDb.put(user.username, user);
				common.saveUserDb();
			}
		}
		
		//Set the attributes on session
		request.getSession().setAttribute("logged-in-username", user.username);
		request.setAttribute("user",user);

		//redirect to the home page
		RequestDispatcher requestDispatcher = request.getRequestDispatcher("/home.jsp");
		requestDispatcher.forward(request, response);

	}

	// Returns 'null' if the username is ok.
	private static String checkUsername(String username) {
		if (username.length() < 3) {
			return "too short (minimum: 3 characters)";
		} else if (username.length() > 64) {
			return "too long (maximum: 64 characters)";
		}

		for (int i = 0; i < username.length(); i++) {
			char c = username.charAt(i);
			if (c >= 'A' && c <= 'Z') continue;
			if (c >= 'a' && c <= 'z') continue;
			if (c >= '0' && c <= '9') continue;
			if (c == '_') continue;
			return "invalid character at position " + (i+1) + ": " + jq(""+c);
		}
		return null;
	}

}
