/* eslint
react/forbid-prop-types: 'warn',
no-restricted-syntax: 'warn'
*/

import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import ReactDropzone from 'react-dropzone';
import ModalCom from './Modal';
import LoadModalCom from './LoadModal';
import '../css/Hologram.scss';

const disableClick = true;

function convert(file) {
  return new Promise((resolve) => {
    const image = new Image();
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    image.src = file.preview;
    image.crossOrigin = 'anonymous';
    image.onload = function () {
      // Get image information
      canvas.width = image.width;
      canvas.height = image.height;
      canvasContext.drawImage(image, 0, 0, image.width, image.height);

      // Use canvas to get the dataUrl of image
      const dataUrl = canvas.toDataURL(file.type);

      const newFile = {
        name: file.name,
        key: file.key,
        size: file.size,
        preview: dataUrl,
        type: file.type,
      };
      resolve(newFile);
    };
  });
}

class Dropzone extends React.Component {
  static propTypes = {
    cropperConfig: PropTypes.object,
    dropzoneConfig: PropTypes.object,
    maxFiles: PropTypes.number,
    uploader: PropTypes.string,
    onComplete: PropTypes.func,
    uploadFunction: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    uploadFunction: null,
    maxFiles: -1,
    uploader: '',
    cropperConfig: {},
    dropzoneConfig: {
      accept: 'image/*',
      style: {
        width: '100%',
        padding: '2.5em 0',
        background: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        color: '#fff',
      },
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      error: {},
    };
    this.onOpenZone = this.onOpenZone.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  onOpenClick() {
    this.dropzone.open();
  }
  onDrop(acceptedFiles) {
    const files = this.state.files;

    for (const acceptedFile of acceptedFiles) {
      const file = {
        name: acceptedFile.name,
        key: Math.random().toString(36).substring(1),
        size: acceptedFile.size,
        preview: acceptedFile.preview,
        origin: acceptedFile.preview,
        type: acceptedFile.type,
      };

      if (files.length < this.props.maxFiles || this.props.maxFiles === -1) {
        files.push(file);
      } else {
        break;
      }
    }

    this.setState({ files });
  }
  onUpdate(updateFile) {
    const files = this.state.files;
    const fileIndex = files.findIndex((file => file.key === updateFile.key));
    files[fileIndex] = updateFile;
    this.setState({ files });
  }

  // Upload converted file by JSON format to server
  onUpload() {
    this.setState({ uploading: true });
    const files = this.state.files;
    const funList = [];
    const uploadedFile = [];
    for (const file of files) {
      if (this.props.uploadFunction) {
        funList.push(this.customUpload(file));
      } else {
        funList.push(this.upload(file));
      }
      uploadedFile.push({ key: file.key, name: file.name });
    }

    Promise.all(funList)
    .then((res) => {
      this.setState({ uploading: false });
      this.props.onComplete({ response: res, files: uploadedFile });
    })
    .catch((err) => {
      console.log('There are some error!', err);
      this.setState({ uploading: false });
    });
  }

  // Open dropzone without click dropzone
  onOpenZone() {
    this.dropzone.open();
  }
  removeFile(file) {
    const newList = this.state.files.filter(mFile => file !== mFile);
    this.setState({
      files: newList,
    });
  }

  // Upload file to upload hanlder by superagent
  upload(file) {
    const uploader = this.props.uploader;
    return new Promise((resolve, reject) => {
      convert(file)
      .then((newFile) => {
        const data = JSON.stringify(newFile);
        request.post(uploader).send(data).end((err, res) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
      });
    });
  }

  customUpload(file) {
    const uploaderFunc = this.props.uploadFunction;
    return new Promise((resolve, reject) => {
      convert(file)
      .then((newFile) => {
        uploaderFunc(file, newFile)
          .then((res) => {
            resolve(res);
          })
          .catch(err => reject(err));
      });
    });
  }

  render() {
    return (
      <div className="dropzone-wrapper">
        <LoadModalCom
          uploading={this.state.uploading}
        />
        <div className="dropzone">
          <ReactDropzone
            {... this.props.dropzoneConfig}
            ref={(node) => { this.dropzone = node; }}
            onDrop={this.onDrop}
            disableClick={disableClick}
          >
            <div className="help">
              Drop images into the dropzone and click &quot;upload&quot; button to upload.
            </div>
            {this.state.files.length > 0 ?
              <div className="images-area">
                { this.state.files.length < this.props.maxFiles || this.props.maxFiles === -1 ?
                  <button className="hologram-btn" type="button" onClick={this.onOpenZone}>Add Images</button>
                  : null }
                <div className="clearfix" />
                <div className="images">
                  {this.state.files.map(file => (
                    <ModalCom
                      key={file.key}
                      file={file}
                      removeFile={this.removeFile}
                      cropperConfig={this.props.cropperConfig}
                      cropperUpdate={this.onUpdate}
                    />
                    ))}
                </div>
                <div className="button-wrapper">
                  <button className="hologram-btn upload-btn" type="button" onClick={this.onUpload}>
                    Upload
                  </button>
                </div>
              </div>
               : <button className="hologram-btn" type="button" onClick={this.onOpenClick}>Add Images</button>
              }
          </ReactDropzone>
        </div>
      </div>
    );
  }
}

export default Dropzone;
