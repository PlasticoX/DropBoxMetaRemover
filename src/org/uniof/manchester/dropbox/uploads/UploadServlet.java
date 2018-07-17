package org.uniof.manchester.dropbox.uploads;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


/**
 * Servlet implementation class UploadServlet
 */

@WebServlet("/UploadServlet")
@SuppressWarnings("unchecked")
public class UploadServlet extends HttpServlet {
	private final String UPLOAD_DIRECTORY = "C:/abc";
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		if(ServletFileUpload.isMultipartContent(request))
		{
			try
			{
				List<FileItem> multiparts = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
				for(FileItem item : multiparts)
				{
					if(!item.isFormField())
					{
			
						
						String name = new File(item.getName()).getName();
						item.write(new File(UPLOAD_DIRECTORY + File.separator + name));
						
						System.out.println("Es un archivo de nombre >> " + name );
					}else if (item.isFormField())
					{
						String name = item.getFieldName();
					    String value = item.getString();
						
						System.out.println("Estos son los datos de la forma nombre >> " + name +  " a ver si es cierta esta mamada valor >> "+ value);
					}
						
				}
				request.setAttribute("message", "File uploaded successfully.");
			}
			catch(Exception ex)
			{
				request.setAttribute("message", "File upload failed due to : " + ex);
			}
		}
		else
		{
			request.setAttribute("message", "Sorry this servlet only handles file upload request.");
		}
		request.getRequestDispatcher("/result.jsp").forward(request, response);
	}

}