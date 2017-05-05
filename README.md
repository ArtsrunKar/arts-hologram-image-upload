# Hologram Image Upload

React image uploader with dropzone and cropper function, which used [React Dropzone](https://github.com/okonet/react-dropzone) and [React Image Crop](https://github.com/DominicTobias/react-image-crop).

This project still under active development, please feel free to open issues or pull request.

[![npm]( 	http://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/hologram-image-upload)

## Demo
https://hologram.sardo.work/

## Features
- Using dropzone to upload multiple image files
- Crop and preview image  

## Installation
```bash
npm install hologram-image-upload --save
```

## Usage
```js
import Hologram from 'hologram-image-upload';
```
then require dist/Hologram.css:

 ```html
<link rel=stylesheet type="text/css" href="dist/css/Hologram.css">
 ```

After version 2.0, you will not need require css file of react crop and bootstrap anymore.

## Props

#### uploader (required)
The post url of your upload handler.

```jsx
<Hologram uploader="upload.php"/>
```

#### maxFiles (optional)
If files more than this number, it will not be uploaded.  Default Number is 10.

```js
var maxFiles = 10;
<Hologram uploader="upload.php" maxFiles={maxFiles}/>
```

#### dropzoneConfig (optional)
Config of React Dropzone.
https://github.com/okonet/react-dropzone

```jsx
var dropzoneConfig = {
            style : {
                textAlign: 'center',
                padding: '2.5em 0',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff'
            }
    }

<Hologram uploader="upload.php" dropzoneConfig={dropzoneConfig}/>
```


#### cropperConfig (optional)
Config of React Image Crop.
https://github.com/DominicTobias/react-image-crop

```jsx
var crop = {
	x: 20,
	y: 10,
}

<Hologram uploader="upload.php" cropperConfig={crop} />
```

#### onComplete(result) (optional)
Callback function which trigger when image uploaded.
It will pass a object which contain http response, you can use it to handler the result of upload.  

## Contributing

You can clone this repository then start develop at sandbox, or feel free to open issue on github.

Build package:

```bash
npm run build
```

Watch package change and build it:

```bash
npm run watch
```
