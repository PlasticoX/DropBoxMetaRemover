      // Get the template HTML and remove it from the doument
      var previewNode = document.querySelector("#template");
      previewNode.id = "";
      var previewTemplate = previewNode.parentNode.innerHTML;
      previewNode.parentNode.removeChild(previewNode);
      
      
      var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
        url: 'UploadServlet', // Set the url
        thumbnailWidth: 80,
        thumbnailHeight: 80,
        parallelUploads: 20,
        previewTemplate: previewTemplate,
        acceptedFiles: 'image/* , application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document , application/msword , application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: "#previews", // Define the container to display the previews
        clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
      });

      myDropzone.on("addedfile", function(file) {
        // Hookup the start button
        file.previewElement.querySelector(".start").onclick = function() {  myDropzone.enqueueFile(file); };
        
        
        //Aqui tengo que checar las extensiones de los archivos permitidos y las diferentes formas que desplegamos
        
        
        
        //Aqui empieza el desmadre
           
        
        
        //Asi creamos la tabla para los de office
       
        OFFICEPROPS.getData(file).then(function(metadata){

                var createTableRow = (name,value) => {
                    var row = document.createElement("TR");
                    var cellName = document.createElement("TD"), txtName = document.createTextNode(splitInitCap(name));
                    var cellValue = document.createElement("TD"), txtValue = document.createTextNode(value);
                
                    //Eliminamos los valores nulos
                    if(value)
                    {
                    	if(value !== "")
                    	{
                    		cellName.appendChild(txtName);
                            row.appendChild(cellName);
                       	 
                            cellValue.appendChild(txtValue);
                            row.appendChild(cellValue);
                    	}	
                    }	
                    
                    
                    return row;
                }
                var appendData = (metadata) => {
                    
                	var tabla = document.createElement("table");
                	tabla.setAttribute('class', 'table');
                	var thead = document.createElement("thead");
                	var row = document.createElement("TR");
                	var cellName = document.createElement("TH"), txtName = document.createTextNode("Property");
                    var cellValue = document.createElement("TH"), txtValue = document.createTextNode("Value");
                    
                    cellName.setAttribute("scope","col");
                    cellName.setAttribute("class","col-md-auto");
                    
                    cellValue.setAttribute("scope","col");
                    cellValue.setAttribute("class","col-md-auto");
                    
                    cellName.appendChild(txtName);
                    row.appendChild(cellName);
               	    cellValue.appendChild(txtValue);
                    row.appendChild(cellValue);
                    thead.appendChild(row);
                    tabla.appendChild(thead);
                    var tbody = document.createElement("tbody");
                 	
                	for(key in metadata){
                        var data = metadata[key];
                        tbody.appendChild(createTableRow(key,data.value));
                    }
                	
                	tabla.appendChild(tbody);
                	
                	//Aqui appendearemos la tabla completa
                	document.querySelector("#tablon").appendChild(tabla);
                	console.log(document.querySelector("#tablon").innerHTML);
                	
                }
                
                appendData(metadata.editable);
                
             	//Limpiamos
            	//document.querySelector("#tablon").innerHTML='';
           
                //appendData(metadata.readOnly);
            });
           
        
        
        
        
        
        
        
        
        
        //var mytable = Dropzone.createElement("<table class='table'><thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr></thead><tbody><tr><td>1</td><td>Markoantonio</td><td>Otto</td><td>@mdo</td></tr><tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr><td>3</td><td>Larry</td><td>the Bird</td><td>@twitter</td></tr></tbody></table>");
        //document.querySelector("#tablon").appendChild(mytable);
    
        
        
        //var removeButton  = Dropzone.createElement("<button class='btn btn-danger btn-xs btn-block' style='margin-top:5px;'>Remove file</button>");
        //var _this = this;
        //var ext = getFileExtension(file);
        //ext = ''+ext.toLowerCase();

        //console.log("extension "+ext);
        
        //if(ext != "png" && ext != "jpg" && ext != "JPG" && ext != "gif" && ext != "bmp")
        //    _this.removeFile(file);
        /*
        removeButton.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            _this.removeFile(file);
        });*/

        //file.previewElement.find('.dz-progress').hide();
        //file.previewElement.appendChild(removeButton);
        
        
        
      });
      
      function getFileExtension(file){
          return file.name.split('.').pop().toLowerCase();
      }
      
      function splitInitCap(str){   
          return (str[0].toUpperCase()+
                  str.substring(1))
                  .replace(/[A-Z]{2,}[a-z]/g,e=>`${e.slice(0,-2)} ${e.slice(-2)}`)
                  .replace(/[A-Z][a-z]+/g,e=>" "+e)
                  .replace(/[a-z][A-Z]+/g,e=>`${e[0]} ${e.slice(1)}`)
                  .replace(/ +/g," ")
                  .trim();
      }
      
      async function removedata(file){
    	  return await OFFICEPROPS.removeData(file).then(function(zip){
    	    	return zip;
          }).then(e=>{
          	return e;
          });
      }

      // Update the total progress bar
      myDropzone.on("totaluploadprogress", function(progress) {
        document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
      });

      myDropzone.on("sending", function(file, xhr , formData) {
        // Show the total progress bar when upload starts
        document.querySelector("#total-progress").style.opacity = "1";
        // And disable the start button
        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
        
        OFFICEPROPS.getData(file).then(function(zip){
	    	console.log(zip)
      })

        let removed = removedata(file);
        
        OFFICEPROPS.getData(removed).then(function(zip){
	    	console.log(zip)
      })
        console.log('new removed file added XX ', removed);
	    formData.append('id',document.querySelector("#idfolder").value );
	    
      });
      
      myDropzone.on("complete", function(file) {
          
    	  //showData();
    	  
      });
      
      // Hide the total progress bar when nothing's uploading anymore
      myDropzone.on("queuecomplete", function(progress) {
        document.querySelector("#total-progress").style.opacity = "0";
      });

      // Setup the buttons for all transfers
      // The "add files" button doesn't need to be setup because the config
      // `clickable` has already been specified.
      
      document.querySelector("#actions .start").onclick = function() {
        myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
      };
      
      document.querySelector("#actions .cancel").onclick = function() {
        myDropzone.removeAllFiles(true);
      };
      
      Dropzone.autoDiscover = false;