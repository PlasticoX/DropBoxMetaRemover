/**
 * Chooser (Drop Box)
 * https://www.dropbox.com/developers/dropins/chooser/js
 */
options = {
    success: function(files) {
      files.forEach(function(file) {
    	  
    	  var a   = document.createElement('a');
    	  a.href = file.link;
    	  
    	  alert("file.link "+ file.isDir + "nombre "+ file.name + " id " + file.id );
        
      });
    },
    cancel: function() {
     
    	alert("You need to select a folder")
    	//optional
    },
    linkType: "preview", // "preview" or "direct"
    multiselect: false, // true or false
    extensions: ['.png'],
    folderselect: true,
};


