<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="org.uniof.manchester.dropbox.utilities.User"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset=="utf-8">
<title>DropBox Metadata Remover</title>

<style>
    form {display: inline-block;}
    
    p {font-size: 26px !important;}

    
</style>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="css/bootstrap.css">
<!-- Optional theme -->
<link rel="stylesheet" href="css/bootstrap-theme.css">
<!-- Personal theme -->
<link rel="stylesheet" href="css/indexstyle.css">
<script src="js/dropzone.js"></script>
<script src="js/dropboxchooser.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js"></script>
<script src="https://cdn.jsdelivr.net/npm/officeprops@1.1.0/src/officeprops.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js"></script>
<script src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="tbwtoqi0zw6sf0y"></script>

<script>
window.onload = function() {
	var button = Dropbox.createChooseButton(options);
	if(null != document.getElementById("dropbox-container"))
	{document.getElementById("dropbox-container").appendChild(button);}
	}
</script>

</head>
<body>
	<% 
User user = (User) request.getAttribute("user"); 

// verificamos que traiga un usuario

if (user != null)
{
	String userName = user.getUsername();
	
	  //Si trae un usuario verificamos que traiga token osea que su cuenta este linked 
	  if (user.getDropboxAccessToken() != null) {

	   //Aqui va todo el contenido en caso de que ya este linkeada la cuenta y conectado a dropbox
		  
	%>
	<div class="container" id="container">
		<br>
	
		<center><h1>Dropbox Metadata Remover</h1></center>

		<div class="page-header">
			
			<div class="alert alert-light text-right" role="alert"> <i
					class="glyphicon glyphicon-user"></i>  <%=userName.toUpperCase()%>
			</div>
		
			<div id="dropboxactions" class="row">
				<div class="col-2 pull-right" >
						<form  action="${pageContext.request.contextPath}/dropbox-unlink" method='POST' >
							<button type="submit" class="btn btn-info unlink-dropbox"> <i
								class="glyphicon glyphicon-link"></i> <span>Unlink Dropbox Account</span>
							</button>
						</form>
						
						<form  action="${pageContext.request.contextPath}/logout" method='POST' >
							<button type="submit" class="btn btn-danger logout">
									<i class="glyphicon glyphicon-log-out"></i> <span>Logout</span>
							</button>
						</form>	
				</div>
			</div>
		</div>
		
		<div class="well">
		<h2><b>Select files</b> </h2><br>
			<p class="text-justify">
				This application can cleanse the selected documents from their <b>metadata</b>
				<i>(data that provides information about other data)</i> and upload
				clean documents to the Dropbox platform.<br> 
				<div class="span12 text-center">
				    <p><b>Supported files</b></p>
				</div>
				<br>
				<div class="row">
					<div class="col-md-12">
						<table class="table text-center">
							<thead>
								<tr>
									<th class="text-center">Word</th>
									<th class="text-center">Excel</th>
									<th class="text-center">PowerPoint</th>
									<th class="text-center">Images</th>
									<th class="text-center">PDF's</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>.docx</td>
									<td>.xlsx</td>
									<td>.pptx</td>
									<td>JPG</td>
									<td>PDF</td>
								</tr>
								<tr>
									<td>.dotx</td>
									<td>.xlsm</td>
									<td>.ppsx</td>
									<td>TIFF</td>			
									<td></td>
								</tr>
								<tr>
								    <td>.docm</td>
									<td>.xlsb</td>
									<td>.ppsm</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
								    <td>.dotm</td>
									<td>.xltx</td>
									<td>.pptm</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>.xltm</td>
									<td>.potx</td>
									<td>.odp</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
								    <td>.odt</td>
									<td>.ods</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
		</div>

		<div id="actions" class="row">

			<div class="col-lg-7">
				<!-- The fileinput-button span is used to style the file input field as button -->
				<span class="btn btn-success fileinput-button"> <i
					class="glyphicon glyphicon-plus"></i> <span>Add files...</span>
				</span>
				<button type="submit" class="btn btn-primary start">
					<i class="glyphicon glyphicon-upload"></i> <span>Start
						multi-upload</span>
				</button>
				<button type="reset" class="btn btn-warning cancel">
					<i class="glyphicon glyphicon-ban-circle"></i> <span>Cancel
						multi-upload</span>
				</button>
				<label class="btn btn-default" id="dropbox-container" ><i class="glyphicon glyphicon-folder-close"></i>
    			</label>
    		</div>

			<div class="col-lg-5">
				<!-- The global file processing state -->
				<span class="fileupload-process">
					<div id="total-progress" class="progress progress-striped active"
						role="progressbar" aria-valuemin="0" aria-valuemax="100"
						aria-valuenow="0">
						<div class="progress-bar progress-bar-success" style="width: 0%;"
							data-dz-uploadprogress></div>
					</div>
				</span>
			</div>
		</div>
		
		<div  class="row">
			<div class="col-lg-12">
			    <label class="col-sm-3 control-label"><b>Dropbox Folder: </b></label>
			      <div class="col-sm-9">
			      <input type="text" class="form-control" id="dropboxpath" aria-describedby="folder in dropbox" value="/" readonly>
			      	<input type="hidden" class="form-control" id="idfolder"  value="/" />
			    </div>
			</div>
		</div>

		<br>
		<br>

		<div class="table table-striped files" id="previews">

			<div id="template" class="file-row">
				<!-- This is used as the file preview template -->
				<div>
					<span class="preview"><img data-dz-thumbnail /></span>
				</div>
				<div>
					<p class="name" data-dz-name></p>
					<strong class="error text-danger" 1></strong>
				</div>
				<div class="row">
					<div class="col-md-12 tablon" id="tablon" data-tagline>
						<!-- Aqui va la tabla creada dinamicamente desde el script -->
					</div>
				</div>
				<div>
					<p class="size" data-dz-size></p>
					<div class="progress progress-striped active" role="progressbar"
						aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
						<div class="progress-bar progress-bar-success" style="width: 0%;"
							data-dz-uploadprogress></div>
					</div>
				</div>
				<div>
					<button class="btn btn-primary start">
						<i class="glyphicon glyphicon-upload"></i> <span>Start</span>
					</button>
					<button data-dz-remove class="btn btn-warning cancel">
						<i class="glyphicon glyphicon-ban-circle"></i> <span>Cancel</span>
					</button>
					<button data-dz-remove class="btn btn-danger delete">
						<i class="glyphicon glyphicon-trash"></i> <span>Delete</span>
					</button>
				</div>
			</div>

		</div>
	</div>
	<script src="js/mydropzone.js"></script>


	<% 	  
	  } else {
		  // They haven't linked their Dropbox account.  Display the "Link" form.
    %>
    
    
    <div class="container" id="container">
		<br>
			
		<center>
			<h1>Dropbox Metadata Remover</h1>
			<br> <br>
		</center>

		<div class="page-header">
			
			<div class="alert alert-light text-right" role="alert"> <i
					class="glyphicon glyphicon-user"></i>  <%=userName.toUpperCase()%>
			</div>
		
			<div id="dropboxactions" class="row">
				<div class="col-2 pull-right" >
						<form  action="${pageContext.request.contextPath}/dropbox-auth-start" method='POST' >
							<button type="submit" class="btn btn-info unlink-dropbox"> <i
								class="glyphicon glyphicon-link"></i> <span>Link to your Dropbox account</span>
							</button>
						</form>
						
						<form  action="${pageContext.request.contextPath}/logout" method='POST' >
							<button type="submit" class="btn btn-danger logout">
									<i class="glyphicon glyphicon-log-out"></i> <span>Logout</span>
							</button>
						</form>	
				</div>
			</div>
		</div>
	</div>	
   
	<% 	  
	  }
   } else {
	%>
	
	    <div class="container" id="container">
		<br>
			
		<center>
			<h1>Dropbox Metadata Remover</h1>
			<br> <br>
		</center>

			<div class="page-header">
				
				<div class="alert alert-light text-right" role="alert"> <i
						class="glyphicon glyphicon-user"></i> No user is logged in
				</div>
				<form  action="${pageContext.request.contextPath}/" method='POST' >
						<button type="submit" class="btn btn-danger login">
							<i class="glyphicon glyphicon-log-in"></i> <span>Login</span>
								</button>
				</form>	
				
	
			</div>
	</div>
	<% 
}
%>
</body>
</html>
