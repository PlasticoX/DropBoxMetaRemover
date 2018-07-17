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
        
        
        /*
        var fileM =  OFFICEPROPS.removeData(file).then(function(zip){
            		downloadFile(zip,file.name);
        });
        
        console.log('new removed file added XX ', fileM);
        
        */
        
      });

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
	    formData.append('nombreFolder',document.querySelector("#dropboxpath").value );
	 
	    /*
	    for(var pair of formData.entries()) {
	    	   console.log(pair[0]+ ', '+ pair[1]); 
	    	}*/
	    
      });
     
      /*
      myDropzone.on('addedfile', function (file) {
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

    	                        // Promise
    	                        //    .resolve($.post('http://example.com', {img: imgToSend}))
    	                        //    .then(console.log('Image was sent !'));
    	                    });
    	                })(file, e.target.result);
    	            };
    	            image.src = e.target.result;
    	        })
    	    })(file);
    	    reader.readAsDataURL(file);
    	});

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
    	}*/
      
      
      myDropzone.on("complete", function(file) {
          
    	  //showData();
    	  
    	  //alert("lo actualizo");
    	  //alert("entro a completado");
    	  
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
      
     
          
          
   /*
    * 
    * 
    *  document.querySelector("#actions .dropboxpath").onclick = function() {
      	  console.log("Entro a upload a dropbox para el archivo");
      	  //alert("Aqui va el file browser de dropbox para navegar por tu dropbox");
          };
          
          
    *    document.querySelector("#actions .remove").onclick = function() {
    	  console.log("Entro a removeMetadata para el archivo");
        };
      
       document.querySelector("#actions .upload").onclick = function() {
      	  console.log("Entro a upload a dropbox para el archivo");
          };
            
       document.querySelector("#singleactions .removeM").onclick = function() {
        console.log("Entro a removeMetadata para el archivo");
          };
            
       document.querySelector("#singleactions .uploadT").onclick = function() {
            console.log("Entro a upload a dropbox para el archivo");
            };    
          */
        
      
      document.querySelector("#actions .cancel").onclick = function() {
        myDropzone.removeAllFiles(true);
      };
      
      Dropzone.autoDiscover = false;