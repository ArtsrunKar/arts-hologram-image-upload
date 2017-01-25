import React from 'react';
import Dropzone from 'react-dropzone';

var DropzoneCom = React.createClass({
  getInitialState: function () {
    window.sessionStorage.removeItem('Uploaded Images');
       return {
         files: []
       };
   },

   onDrop: function (acceptedFiles) {
     this.setState({
       files: acceptedFiles
     });

     var images = [];

     acceptedFiles.foreach(function(file){
       window.sessionStorage.setItem(file['name'], file);
     });
   },

   onOpenClick: function () {
     this.dropzone.open();
   },

   render: function () {
       return (
           <div>
               <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
                   <div>Try dropping some files here, or click to select files to upload.</div>
               </Dropzone>
               <button type="button" onClick={this.onOpenClick}>
                   Open Dropzone
               </button>
               {this.state.files.length > 0 ? <div>
               <h2>Uploading {this.state.files.length} files...</h2>
               <div>
                 {this.state.files.map((file) => <img className="dropzone-preview" src={file.preview} />)}
               </div>
               </div> : null}
           </div>
       );
   }
});

export default DropzoneCom
