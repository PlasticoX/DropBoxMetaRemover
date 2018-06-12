<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>


<head>
  <meta charset=="utf-8">
  <title>DropBox Metadata Remover</title>

  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="css/bootstrap.css">

  <!-- Optional theme -->
  <link rel="stylesheet" href="css/bootstrap-theme.css">
 
  <style>
    html, body {
      height: 100%;
    }
    #actions {
      margin: 2em 0;
    }

    /* Mimic table appearance */
    div.table {
      display: table;
    }
    div.table .file-row {
      display: table-row;
    }
    div.table .file-row > div {
      display: table-cell;
      vertical-align: top;
      border-top: 1px solid #ddd;
      padding: 8px;
    }
    div.table .file-row:nth-child(odd) {
      background: #f9f9f9;
    }

    /* The total progress gets shown by event listeners */
    #total-progress {
      opacity: 0;
      transition: opacity 0.3s linear;
    }

    /* Hide the progress bar when finished */
    #previews .file-row.dz-success .progress {
      opacity: 0;
      transition: opacity 0.3s linear;
    }

    /* Hide the delete button initially */
    #previews .file-row .primary,
    #previews .file-row .delete {
      display: none;
    }

    /* Hide the start and cancel buttons and show the delete button */

    #previews .file-row.dz-success .start,
    #previews .file-row.dz-success .cancel {
      display: none;
    }
    
    #previews .file-row.dz-success .primary,
    #previews .file-row.dz-success .delete {
      display: block;
    }

  </style>

<script src="js/dropzone.js"></script>

</head>
<body>
	
	<div class="container" id="container">
	 <br>

     <br>

    <center>
    	<h1>Dropbox Meta Remover</h1>
	    <br>
	
	    <br>
	 </center>   
	 <h2 class="lead">Step 1 - Select files to cleanse</h2>
	
    
    <div id="actions" class="row">

      <div class="col-lg-7">
        <!-- The fileinput-button span is used to style the file input field as button -->
        <span class="btn btn-success fileinput-button">
            <i class="glyphicon glyphicon-plus"></i>
            <span>Add files...</span>
        </span>
        <button type="submit" class="btn btn-primary start">
            <i class="glyphicon glyphicon-upload"></i>
            <span>Start upload</span>
        </button>
        <button type="reset" class="btn btn-warning cancel">
            <i class="glyphicon glyphicon-ban-circle"></i>
            <span>Cancel upload</span>
        </button>
      </div>

      <div class="col-lg-5">
        <!-- The global file processing state -->
        <span class="fileupload-process">
          <div id="total-progress" class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
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
            <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
            </div>
        </div>
        <div>
          <button class="btn btn-primary start">
              <i class="glyphicon glyphicon-upload"></i>
              <span>Start</span>
          </button>
          <button data-dz-remove class="btn btn-warning cancel">
              <i class="glyphicon glyphicon-ban-circle"></i>
              <span>Cancel</span>
          </button>
          <button data-dz-remove class="btn btn-danger delete">
            <i class="glyphicon glyphicon-trash"></i>
            <span>Delete</span>
          </button>
          <button data-dz-remove class="btn btn-primary primary">
            <i class="glyphicon glyphicon-filter"></i>
            <span>Remove metadata</span>
          </button>
        </div>
      </div>

    </div>
 
 <script src="js/mydropzone.js"></script>
	
</body>
</html>