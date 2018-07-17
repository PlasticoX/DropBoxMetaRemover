/**
 * Chooser (Drop Box)
 * https://www.dropbox.com/developers/dropins/chooser/js
 */
options = {
    success: function(files) {
      files.forEach(function(file) {
    	  
    	  if(!file.isDir)
    	  {
    		  alert("Please select a folder")
    	  }else
    	  {
    		  //alert("file.link >>"+ file.isDir + " >> nombre >> "+ file.name + " >> id >>" + file.id );
    		  document.querySelector("#dropboxpath").value = "/" + file.name + "/";
    		  document.querySelector("#idfolder").value = file.id;
    	  }	  
        
      });
    },
    cancel: function() {
     
    	alert("You need to select a folder from Dropbox")
    	//optional
    },
    linkType: "preview", // "preview" or "direct"
    multiselect: false, // true or false
    extensions: ['.vx3'],
    folderselect: true,
};


