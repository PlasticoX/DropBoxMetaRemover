package org.uniof.manchester.dropbox;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.uniof.manchester.dropbox.utilities.Common;
import org.uniof.manchester.dropbox.utilities.Common.DatabaseException;
import org.uniof.manchester.dropbox.utilities.MimeTypeUtils;
import org.uniof.manchester.dropbox.utilities.User;

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.DbxException;
import com.dropbox.core.json.JsonReader;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.Metadata;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfName;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;


/**
 * Servlet implementation class UploadServlet
 */

@WebServlet("/UploadServlet")
@SuppressWarnings("unchecked")
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	ResourceBundle propsDR=ResourceBundle.getBundle("dataremover");
	private final Common common;
	
	/**
	 * @throws DatabaseException 
	 * @throws IOException 
	 * @see HttpServlet#HttpServlet()
	 */
	public UploadServlet() throws IOException, DatabaseException {
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

		if(ServletFileUpload.isMultipartContent(request))
		{
			//Autentication dropbox
			if (!common.checkPost(request, response)) return;
			User user = common.requireLoggedInUser(request, response);
			if (user == null) return;

			DbxClientV2 dbxClient = requireDbxClient(request, response, user);
			if (dbxClient == null) return;

			try
			{
				List<FileItem> multiparts = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
				String targetPath = "";

				//For de propiedades
				for(FileItem item : multiparts)
				{
					if (item.isFormField())
					{
						String value = item.getString();
						String name = item.getFieldName();

						if(name.equals("id"))
						{
							if(!value.equals("/"))
							{
								targetPath = getTargetFolderPath(value , dbxClient);
							}
						}
					}
				}

				//For de archivos
				for(FileItem item : multiparts)
				{
					if(!item.isFormField())
					{

						//Aqui empieza el desmadre de nuevo, otra vez a ver de que tipo son
						String fileName = item.getName();
						String contentType = MimeTypeUtils.getContentTypeByFileName(fileName);
						
						//Para PDFS
						if(MimeTypeUtils.getPdfs().contains(contentType))
						{
							InputStream nuevo = null;
							File singleNuevo = new File(fileName);
							
							try {
								String fullTargetPath = targetPath + "/" + fileName;
								singleNuevo = removePDFMetadata(item.getInputStream(), singleNuevo);
								nuevo = new FileInputStream(singleNuevo);
								dbxClient.files().upload(fullTargetPath).uploadAndFinish(nuevo);
								request.setAttribute("message", "File uploaded successfully to Dropbox!");
							}         
							catch (Exception i)
							{
								System.out.println(i);
							}finally {
								nuevo.close();
								singleNuevo.delete();
						    }
						}
						else if(MimeTypeUtils.getDocsword().contains(contentType))	
						{
							String fullTargetPath = targetPath + "/" + fileName;
							dbxClient.files().upload(fullTargetPath).uploadAndFinish(item.getInputStream());
							request.setAttribute("message", "File uploaded successfully to Dropbox!");
						}
						else if (MimeTypeUtils.getImages().contains(contentType))
						{
							String fullTargetPath = targetPath + "/" + fileName;
							dbxClient.files().upload(fullTargetPath).uploadAndFinish(item.getInputStream());
							request.setAttribute("message", "File uploaded successfully to Dropbox!");
											}
						else
						{
							request.setAttribute("message", "Not supported content type");
						}


					}
				}
			}
			catch(Exception ex)
			{
				request.setAttribute("message", "File upload failed due to : " + ex);
				System.out.println("File upload failed due to : " + ex);
			}
		}
		else
		{
			request.setAttribute("message", "Sorry this servlet only handles file upload request.");
		}
		request.getRequestDispatcher("/result.jsp").forward(request, response);
	}

	private DbxClientV2 requireDbxClient(HttpServletRequest request, HttpServletResponse response, User user)
			throws IOException, ServletException
	{

		if (user.dropboxAccessToken == null) {
			common.pageSoftError(response, "This page requires a user whose has linked to their Dropbox account.  Current user hasn't linked us to their Dropbox account.");
			return null;
		}

		return new DbxClientV2(common.getRequestConfig(request),
				user.dropboxAccessToken,
				common.dbxAppInfo.getHost());
	}

	private static String getTargetFolderPath(String value, DbxClientV2 dbxClient ) throws IOException {

		String path = "";

		try {

			Metadata megametadata = dbxClient.files().getMetadata(value);
			path = megametadata.getPathDisplay();

		}catch (DbxException ex) {

			System.out.println("getTargetFolderPath failed due to : " + ex);
		}

		return path;
	}

	public File removePDFMetadata(InputStream resource, File singleFile) throws IOException, DocumentException
	{
		Files.copy(resource, singleFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
		byte[] original = Files.readAllBytes(singleFile.toPath());
		PdfReader reader = new PdfReader(original);
		reader.getCatalog().remove(PdfName.METADATA);
		reader.removeUnusedObjects();

		PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(singleFile));
		
		Map<String, String> info = reader.getInfo();

		info.put("Title", null);
		info.put("Author", null);
		info.put("Subject", null);
		info.put("Keywords", null);
		info.put("Creator", null);
		info.put("Producer", null);
		info.put("CreationDate", null);
		info.put("ModDate", null);
		info.put("Trapped", null);

		stamper.setMoreInfo((HashMap<String, String>) info);
		stamper.close();
		reader.close();

		return singleFile;

	}


}
