      // Get the template HTML and remove it from the doument
      var previewNode = document.querySelector("#template");
      previewNode.id = "";
      var previewTemplate = previewNode.parentNode.innerHTML;
      previewNode.parentNode.removeChild(previewNode);
      
   // Loaded via <script> tag, create shortcut to access PDF.js exports.
      var pdfjsLib = window['pdfjs-dist/build/pdf'];

      // The workerSrc property shall be specified.
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
      
      
      var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
        url: 'UploadServlet', // Set the url
        thumbnailWidth: 80,
        thumbnailHeight: 80,
        parallelUploads: 20,
        previewTemplate: previewTemplate,
        acceptedFiles: 'image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.ms-word.document.macroEnabled.12,application/vnd.ms-word.template.macroEnabled.12,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.ms-powerpoint.slideshow.macroEnabled.12,application/vnd.ms-powerpoint.presentation.macroEnabled.12,application/vnd.openxmlformats-officedocument.spreadsheetml.template,application/vnd.ms-excel.template.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.template,application/vnd.ms-powerpoint.template.macroEnabled.12,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.spreadsheet',
        autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: "#previews", // Define the container to display the previews
        clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.
        transformFile: function(file, done) {
        	
        	removedata(file).then((result) => {
                // Handle the compressed image file.
                done(result)
              }).catch((err) => {
                // Handle the error
                throw err
              })
           
          }
      });

      
      myDropzone.on("addedfile", function(file) {
        // Hookup the start button
        file.previewElement.querySelector(".start").onclick = function() {  myDropzone.enqueueFile(file); };
        
        
        //Aqui tengo que checar las extensiones de los archivos permitidos y las diferentes formas que desplegamos
        
        const ext = getFileExtension(file);
        
        
        if(ext in OFFICEPROPS.mimeTypes){
          
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
                    	file.previewTemplate.querySelector("[data-tagline]").appendChild(tabla);
                    }
                    
                    appendData(metadata.editable);
                   });
               
        }else if(ext=='jpg' || ext == "tiff"){
        
        	    EXIF.enableXmp();
                EXIF.getData(file, function() {
                let metadata  = EXIF.getAllTags(this);
                
                if(metadata.hasOwnProperty("thumbnail")){
                    delete metadata['thumbnail'];
                }
                
                    var createTableRow = (name,value) => {
                        var row = document.createElement("TR");
                        var cellName = document.createElement("TD"), txtName = document.createTextNode(splitInitCap(name));
                        var cellValue = document.createElement("TD"), txtValue = document.createTextNode(value);
                    
                        if(value)
                        {
                        	if(name != 'undefined' || value.length<100 )
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
                        
                        cellName.appendChild(txtName);
                        row.appendChild(cellName);
                   	    cellValue.appendChild(txtValue);
                        row.appendChild(cellValue);
                        thead.appendChild(row);
                        tabla.appendChild(thead);
                        var tbody = document.createElement("tbody");
                     	
                    	for(key in metadata){
                            var data = metadata[key];
                            tbody.appendChild(createTableRow(key,data));
                        }
                    	
                    	tabla.appendChild(tbody);
                    	
                    	//Aqui appendearemos la tabla completa
                    	file.previewTemplate.querySelector("[data-tagline]").appendChild(tabla);
                    }
                    
                    appendData(metadata);
                    
                });
        	
        }else if(ext=='pdf'){
        	
        	getBase64(file).then(function(data){
        		pdfjsLib.getDocument(data).then(function (pdfDoc_) {
                    pdfDoc = pdfDoc_;   
                    pdfDoc.getMetadata().then(function(metadata) {
                    	
                    	 var createTableRow = (name,value) => {
                             var row = document.createElement("TR");
                             var cellName = document.createElement("TD"), txtName = document.createTextNode(splitInitCap(name));
                             var cellValue = document.createElement("TD"), txtValue = document.createTextNode(value);
                         
                             if(value)
                             {
                            	 
                            	if( typeof(value) != 'object')  
                            	{
                            		if(name != 'undefined'|| value.length<100 )
                                 	{
                                 		
                                 		 cellName.appendChild(txtName);
                                         row.appendChild(cellName);
                                    	 
                                         cellValue.appendChild(txtValue);
                                         row.appendChild(cellValue);
                                 	}	
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
                             
                             cellName.appendChild(txtName);
                             row.appendChild(cellName);
                        	 cellValue.appendChild(txtValue);
                             row.appendChild(cellValue);
                             thead.appendChild(row);
                             tabla.appendChild(thead);
                             var tbody = document.createElement("tbody");
                          	
                         	for(key in metadata){
                                 var data = metadata[key];
                                 tbody.appendChild(createTableRow(key,data));
                             }
                         	
                         	tabla.appendChild(tbody);
                         	
                         	//Aqui appendearemos la tabla completa
                         	file.previewTemplate.querySelector("[data-tagline]").appendChild(tabla);
                         }
                         
                         appendData(metadata.info);
                        
                    }).catch(function(err) {
                       console.log('Error getting meta data');
                       console.log(err);
                    });
                 
                }).catch(function(err) {
                    console.log('Error getting PDF from ' + err);
                    console.log(err);
                });
        	});
        	
         	
    }else{
           log.console("That file format is not supported"); 
          }
      });
      
    
      function getBase64(file) {
    	  return new Promise((resolve, reject) => {
    	    const reader = new FileReader();
    	    reader.readAsDataURL(file);
    	    reader.onload = () => resolve(reader.result);
    	    reader.onerror = error => reject(error);
    	  });
    	}
      
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
      
      function processImg(image, trgHeight, trgWidth, srcWidth, srcHeight, orientation) {
    	    var canvas = document.createElement('canvas');
    	    canvas.width = trgWidth;
    	    canvas.height = trgHeight;

    	    var img = new Image;
    	    img.src = image;
    	    var ctx = canvas.getContext("2d");

    	    if (orientation == 2) ctx.transform(-1, 0, 0, 1, trgWidth, 0);
    	    if (orientation == 3) ctx.transform(-1, 0, 0, -1, trgWidth, trgHeight);
    	    if (orientation == 4) ctx.transform(1, 0, 0, -1, 0, trgHeight);
    	    if (orientation == 5) ctx.transform(0, 1, 1, 0, 0, 0);
    	    if (orientation == 6) ctx.transform(0, 1, -1, 0, trgHeight, 0);
    	    if (orientation == 7) ctx.transform(0, -1, -1, 0, trgHeight, trgWidth);
    	    if (orientation == 8) ctx.transform(0, -1, 1, 0, 0, trgWidth);

    	    ctx.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, trgWidth, trgHeight);
    	    ctx.fill();

    	    return canvas.toDataURL();
    	}
      
      
      async function removedata(file){
    	
      	const ext = getFileExtension(file);
      	if(ext in OFFICEPROPS.mimeTypes){
      		  
      	  return await OFFICEPROPS.removeData(file).then(function(zip){
  	    	return zip;
	        }).then(e=>{
	        	return e;
	        });
      		
      	}else if(ext=='pdf'){
      		return file;
      	}else if(ext=='jpg' || ext == "tiff"){
      		
      		
      		console.log("Entro a las imagenes");
      		
      		var trgHeight = 200;
      		var trgWidth = 200;
      		
      		 var reader = new FileReader();
      	    reader.onload = (function () {
      	        return (function (e) {
      	            var image = new Image();
      	            image.onload = function () {
      	                (function (file, uri) {
      	                    EXIF.getData(file, function () {
      	                        var imgToSend = processImg(
      	                        uri,
      	                        trgHeight, trgWidth,
      	                        this.width, this.height,
      	                        EXIF.getTag(file, 'Orientation'));

      	                        console.log(imgToSend);
      	                       
      	                    });
      	                })(file, e.target.result);
      	            };
      	            image.src = e.target.result;
      	        })
      	    })(file);
      	 	
      	    reader.readAsDataURL(file)
      	    
      	    console.log(file);
      	    
      		return file;
      	}
    	
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
  
	    formData.append('id',document.querySelector("#idfolder").value );
	    
      });
      
      myDropzone.on("success" , function(file, response)
      {
    	  var el = document.createElement("html");
    	  el.innerHTML = response;
    	  var y = el.getElementsByTagName('h3')[0]; 
    	  var mensaje = document.createElement("p");
    	  mensaje.setAttribute('class', 'text-success');
      	  mensaje.innerHTML = y.innerHTML;
    	  file.previewTemplate.querySelector("[data-dz-success]").appendChild(mensaje);
          return file.previewElement.classList.add("dz-success");
      });
      
      myDropzone.on("complete", function(file) {
    	  
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