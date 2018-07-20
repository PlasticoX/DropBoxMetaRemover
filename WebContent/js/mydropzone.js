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
        
      });
      
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