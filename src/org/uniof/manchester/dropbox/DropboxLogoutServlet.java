package org.uniof.manchester.dropbox;

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

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.json.JsonReader;

/**
 * Servlet implementation class DropboxLogoutServlet
 */
@WebServlet("/logout")
public class DropboxLogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	
	ResourceBundle propsDR=ResourceBundle.getBundle("dataremover");
	private final Common common;
    /**
     * @throws DatabaseException 
     * @throws IOException 
     * @see HttpServlet#HttpServlet()
     */
    public DropboxLogoutServlet() throws IOException, DatabaseException {
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
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	    if (!common.checkPost(request, response)) return;
	    	request.getSession().removeAttribute("logged-in-username");
	    	RequestDispatcher requestDispatcher = request.getRequestDispatcher("/index.jsp");
			requestDispatcher.forward(request, response);
	    	
	        //response.sendRedirect("/index.jsp");
	}

}
