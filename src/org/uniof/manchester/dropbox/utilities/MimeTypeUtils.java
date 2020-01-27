package org.uniof.manchester.dropbox.utilities;

import java.net.FileNameMap;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;


public class MimeTypeUtils {

	private static final Map<String, String> fileExtensionMap;
	private static final List<String> docsword;
	private static final List<String> pdfs;
	private static final List<String> images;





	static {
		fileExtensionMap = new HashMap<String, String>();
		// MS Office
		fileExtensionMap.put("doc", "application/msword");
		fileExtensionMap.put("dot", "application/msword");
		fileExtensionMap.put("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		fileExtensionMap.put("dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template");
		fileExtensionMap.put("docm", "application/vnd.ms-word.document.macroEnabled.12");
		fileExtensionMap.put("dotm", "application/vnd.ms-word.template.macroEnabled.12");
		fileExtensionMap.put("xls", "application/vnd.ms-excel");
		fileExtensionMap.put("xlt", "application/vnd.ms-excel");
		fileExtensionMap.put("xla", "application/vnd.ms-excel");
		fileExtensionMap.put("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		fileExtensionMap.put("xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template");
		fileExtensionMap.put("xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12");
		fileExtensionMap.put("xltm", "application/vnd.ms-excel.template.macroEnabled.12");
		fileExtensionMap.put("xlam", "application/vnd.ms-excel.addin.macroEnabled.12");
		fileExtensionMap.put("xlsb", "application/vnd.ms-excel.sheet.binary.macroEnabled.12");
		fileExtensionMap.put("ppt", "application/vnd.ms-powerpoint");
		fileExtensionMap.put("pot", "application/vnd.ms-powerpoint");
		fileExtensionMap.put("pps", "application/vnd.ms-powerpoint");
		fileExtensionMap.put("ppa", "application/vnd.ms-powerpoint");
		fileExtensionMap.put("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
		fileExtensionMap.put("potx", "application/vnd.openxmlformats-officedocument.presentationml.template");
		fileExtensionMap.put("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow");
		fileExtensionMap.put("ppam", "application/vnd.ms-powerpoint.addin.macroEnabled.12");
		fileExtensionMap.put("pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12");
		fileExtensionMap.put("potm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12");
		fileExtensionMap.put("ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12");
		// Open Office
		fileExtensionMap.put("odt", "application/vnd.oasis.opendocument.text");
		fileExtensionMap.put("ott", "application/vnd.oasis.opendocument.text-template");
		fileExtensionMap.put("oth", "application/vnd.oasis.opendocument.text-web");
		fileExtensionMap.put("odm", "application/vnd.oasis.opendocument.text-master");
		fileExtensionMap.put("odg", "application/vnd.oasis.opendocument.graphics");
		fileExtensionMap.put("otg", "application/vnd.oasis.opendocument.graphics-template");
		fileExtensionMap.put("odp", "application/vnd.oasis.opendocument.presentation");
		fileExtensionMap.put("otp", "application/vnd.oasis.opendocument.presentation-template");
		fileExtensionMap.put("ods", "application/vnd.oasis.opendocument.spreadsheet");
		fileExtensionMap.put("ots", "application/vnd.oasis.opendocument.spreadsheet-template");
		fileExtensionMap.put("odc", "application/vnd.oasis.opendocument.chart");
		fileExtensionMap.put("odf", "application/vnd.oasis.opendocument.formula");
		fileExtensionMap.put("odb", "application/vnd.oasis.opendocument.database");
		fileExtensionMap.put("odi", "application/vnd.oasis.opendocument.image");
		fileExtensionMap.put("oxt", "application/vnd.openofficeorg.extension");

		//PDF
		fileExtensionMap.put("pdf", "application/pdf");

		//JPG
		fileExtensionMap.put("jpg", "image/jpg");
		fileExtensionMap.put("jpeg","image/jpeg");

		//TIFF
		fileExtensionMap.put("tiff", "image/tiff");


	}

	static 

	{
		docsword = new ArrayList<String>();
		docsword.add("application/msword");
		docsword.add("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		docsword.add("application/vnd.openxmlformats-officedocument.wordprocessingml.template");
		docsword.add("application/vnd.ms-word.document.macroEnabled.12");
		docsword.add("application/vnd.ms-word.template.macroEnabled.12");
		docsword.add("application/vnd.ms-excel");
		docsword.add("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		docsword.add("application/vnd.openxmlformats-officedocument.spreadsheetml.template");
		docsword.add("application/vnd.ms-excel.sheet.macroEnabled.12");
		docsword.add("application/vnd.ms-excel.template.macroEnabled.12");
		docsword.add("application/vnd.ms-excel.addin.macroEnabled.12");
		docsword.add("application/vnd.ms-excel.sheet.binary.macroEnabled.12");
		docsword.add("application/vnd.ms-powerpoint");
		docsword.add("application/vnd.openxmlformats-officedocument.presentationml.presentation");
		docsword.add("application/vnd.openxmlformats-officedocument.presentationml.template");
		docsword.add("application/vnd.openxmlformats-officedocument.presentationml.slideshow");
		docsword.add("application/vnd.ms-powerpoint.addin.macroEnabled.12");
		docsword.add("application/vnd.ms-powerpoint.presentation.macroEnabled.12");
		docsword.add("application/vnd.ms-powerpoint.slideshow.macroEnabled.12");
		docsword.add("application/vnd.oasis.opendocument.text");
		docsword.add("application/vnd.oasis.opendocument.text-template");
		docsword.add("application/vnd.oasis.opendocument.text-web");
		docsword.add("application/vnd.oasis.opendocument.text-master");
		docsword.add("application/vnd.oasis.opendocument.graphics");
		docsword.add("application/vnd.oasis.opendocument.graphics-template");
		docsword.add("application/vnd.oasis.opendocument.presentation");
		docsword.add("application/vnd.oasis.opendocument.presentation-template");
		docsword.add("application/vnd.oasis.opendocument.spreadsheet");
		docsword.add("application/vnd.oasis.opendocument.spreadsheet-template");
		docsword.add("application/vnd.oasis.opendocument.chart");
		docsword.add("application/vnd.oasis.opendocument.formula");
		docsword.add("application/vnd.oasis.opendocument.database");
		docsword.add("application/vnd.oasis.opendocument.image");
		docsword.add("application/vnd.openofficeorg.extension");
	}

	static 
	{
		pdfs = new ArrayList<String>();
		pdfs.add("application/pdf");
	}

	static 
	{
		images = new ArrayList<String>();
		images.add("image/jpg");
		images.add("image/jpeg");
		images.add("image/tiff");
	}



	public static String getContentTypeByFileName(String fileName) {
		// 1. first use java's buildin utils
		FileNameMap mimeTypes = URLConnection.getFileNameMap();
		String contentType = mimeTypes.getContentTypeFor(fileName);
		// 2. nothing found -> lookup our in extension map to find types like ".doc" or ".docx"
		if (StringUtils.isBlank(contentType)) {
			String extension = FilenameUtils.getExtension(fileName);
			contentType = fileExtensionMap.get(extension);
		}
		return contentType;
	}

	public static List<String> getDocsword() {
		return docsword;
	}



	public static List<String> getPdfs() {
		return pdfs;
	}



	public static List<String> getImages() {
		return images;
	}
}