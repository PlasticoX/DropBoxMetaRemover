<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="org.uniof.manchester.dropbox.utilities.User"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset=="utf-8">
<title>DropBox Metadata Remover</title>


<style>
    form {display: inline-block; }
</style>


<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="css/bootstrap.css">
<!-- Optional theme -->
<link rel="stylesheet" href="css/bootstrap-theme.css">
<!-- Personal theme -->
<link rel="stylesheet" href="css/indexstyle.css">
<script src="js/dropzone.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js"></script>
<script src="https://cdn.jsdelivr.net/npm/officeprops@1.1.0/src/officeprops.js"></script>


<script>
        function showData(){
            var file = document.getElementById("file").files[0];
            OFFICEPROPS.getData(file).then(function(metadata){
                console.log(metadata);
                var createTableRow = (name,value) => {
                    var row = document.createElement("TR");
                    var cellName = document.createElement("TD"), txtName = document.createTextNode(name);
                    cellName.appendChild(txtName);
                    row.appendChild(cellName);
                    var cellValue = document.createElement("TD"), txtValue = document.createTextNode(value);
                    cellValue.appendChild(txtValue);
                    row.appendChild(cellValue);
                    return row;
                }
                var appendData = (metadata) => {
                    for(key in metadata){
                        var data = metadata[key];
                        container.append(createTableRow(key,data.value))
                    }
                }
                var container = document.getElementById("container");
                container.innerHTML='';
                appendData(metadata.editable);
                appendData(metadata.readOnly);
            });
        }    
        
        function removeData(){
            var file = document.getElementById("file").files[0];
            OFFICEPROPS.removeData(file).then(function(zip){
                downloadFile(zip,file.name);
            });
        }
        
        function anonymousAuthor(){
            var file = document.getElementById("file").files[0];
            OFFICEPROPS.getData(file).then(function(metaData){
                metaData.editable.creator.value = "anonymous";
                OFFICEPROPS.editData(file,metaData).then(function(zip){
                    downloadFile(zip,file.name)
                });
            });
        }
        
        function downloadFile(blob,fileName){
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);  
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
	
	System.out.println("Usuario en JSP ::" + user.getUsername());
	System.out.println("Token en JSP ::" + user.getDropboxAccessToken());
	
	%>

	

	<% 
	
	  //Si trae un usuario verificamos que traiga token osea que su cuenta este linked 
	
	  if (user.getDropboxAccessToken() != null) {
		  
		  //Aqui va todo el contenido en caso de que ya este linkeada la cuenta y conectado a dropbox
		  
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
						<form  action="${pageContext.request.contextPath}/dropbox-unlink" method='POST' >
							<button type="submit" class="btn btn-dark unlink-dropbox"> <i
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
		
		<h2>Select Files</h2>
		
			<p class="text-justify">
				This application can cleanse the selected documents from their <b>metadata</b>
				<i>(data that provides information about other data)</i> and upload
				clean documents to the Dropbox platform.<br> <br> <br>
				<b>Supported files</b> 
				<ul type="Circle">
    				<li><b>Office Documents</b></li>
						<ul type="disc">
						  <li>.docx</li>
						  <li>.dotx</li>
						  <li>.docm</li>
						  <li>.dotm</li>
						  <li>.xlsx</li>
						  <li>.xlsm</li>
						  <li>.xlsb</li>
						  <li>.xltx</li>
						  <li>.pptx</li>
						  <li>.ppsx</li>
						  <li>.ppsm</li>
						  <li>.pptm</li>
						  <li>.potm</li>
						  <li>.potx</li>
						  <li>.ods</li>
						  <li>.odt</li>
						  <li>.odp</li>
						 </ul>
    				<li><b>Images</b></li>
	    				<ul type="disc">
						  <li>.jpg</li>
						  <li>.tiff</li>
						 </ul>
    				<li><b>PDF's</b></li>
    					<ul type="disc">
					  		<li>.pdf</li>
						 </ul>
    			</ul>
				
			</p>
			
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

		<div class="table table-striped files" id="previews">

			<div id="template" class="file-row">
				<!-- This is used as the file preview template -->
				<div>
					<span class="preview"><img data-dz-thumbnail /></span>
				</div>
				<div>
					<p class="name" data-dz-name></p>
					<strong class="error text-danger" data-dz-errormessage></strong>
				</div>
				<div class="row">
					<div class="col-md-6">
						<table class="table">
							<thead>
								<tr>
									<th>#</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Username</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Markoantonio</td>
									<td>Otto</td>
									<td>@mdo</td>
								</tr>
								<tr>
									<td>2</td>
									<td>Jacob</td>
									<td>Thornton</td>
									<td>@fat</td>
								</tr>
								<tr>
									<td>3</td>
									<td>Larry</td>
									<td>the Bird</td>
									<td>@twitter</td>
								</tr>
							</tbody>
						</table>
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
					<button class="btn btn-primary primary">
						<i class="glyphicon glyphicon-filter"></i> <span>Remove
							metadata</span>
					</button>
					<button class="btn btn-info info">
						<i class="glyphicon glyphicon-open-file"></i> <span>Upload
							to Dropbox</span>
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
							<button type="submit" class="btn btn-dark unlink-dropbox"> <i
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
