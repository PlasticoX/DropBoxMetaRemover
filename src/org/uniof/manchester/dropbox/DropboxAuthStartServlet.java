package org.uniof.manchester.dropbox;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.uniof.manchester.dropbox.utilities.Common;
import org.uniof.manchester.dropbox.utilities.Common.DatabaseException;
import org.uniof.manchester.dropbox.utilities.DropboxAuth;

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.json.JsonReader;

/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/dropbox-auth-start")
public class DropboxAuthStartServlet extends HttpServlet {
	
	
	private static final long serialVersionUID = 1L;
	ResourceBundle propsDR=ResourceBundle.getBundle("dataremover");
	private final Common common;
    private final DropboxAuth dropboxAuth;
	/**
	 * @throws DatabaseException 
	 * @throws IOException 
	 * @see HttpServlet#HttpServlet()
	 */
	  
	public DropboxAuthStartServlet() throws IOException, DatabaseException{
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
		this.dropboxAuth = new DropboxAuth(common);
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
		
		// TODO Auto-generated method stub
		System.out.println("Ya llegue hasta el servlet de auth start");
		
		dropboxAuth.doStart(request, response);
		

		/*RequestDispatcher requestDispatcher = request.getRequestDispatcher("/indexRuben.jsp");
		requestDispatcher.forward(request, response);*/
	}



}
