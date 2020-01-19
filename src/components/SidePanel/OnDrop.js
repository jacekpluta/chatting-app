import React, { useState, useMemo, useEffect, useRef } from "react";
import { Image as SemanticImage, Grid, Button } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out"
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

export default function OnDrop(props) {
  const [files, setFiles] = useState([]);

  const { saveAvatar } = props;
  const imageRef = useRef();

  const [crop, setCrop] = useState({
    x: 20,
    y: 10,
    width: 30,
    height: 10
  });

  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const acceptedFilesItems = acceptedFiles.map(file => (
    <ol key={file.path}>
      <h4>File is accepted</h4>
      <h5>
        {file.path} - {file.size} bytes
      </h5>
    </ol>
  ));

  const rejectedFilesItems = rejectedFiles.map(file => (
    <ol key={file.path}>
      <h4 align="center">File is rejected</h4>
      <h5 align="center">
        {file.path} - {file.size} bytes
      </h5>
    </ol>
  ));

  const handleOnCrop = crop => {
    setCrop(crop);
  };

  const handleImageLoaded = image => {};

  const handleOnCropComplete = (crop, pixelCrop) => {
    const image = imageRef.current;
    const originalImage = files[0].preview;
    image64toCanvasRef(image, originalImage, crop);
  };

  const handleAvatarChange = () => {
    const originalImage = files[0].preview;
    const fileExtension = extractImageFileExtensionFromBase64(originalImage);
    const imageData64 = imageRef.current.toDataURL("image/" + fileExtension);
    saveAvatar(imageData64);
  };

  function extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring(
      "data:image/".length,
      base64Data.indexOf(";base64")
    );
  }

  function image64toCanvasRef(canvasRef, image64, pixelCrop) {
    const canvas = canvasRef; // document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = image64;
    image.onload = function() {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
    };
  }

  const cropFile = () => {
    if (files[0]) {
      return (
        <ReactCrop
          crop={crop}
          src={files[0].preview}
          onChange={handleOnCrop}
          onImageLoaded={handleImageLoaded}
          onComplete={handleOnCropComplete}
        ></ReactCrop>
      );
    }
  };

  return (
    <Grid centered stackable columns={2}>
      <Grid.Row centered>
        <section style={style}>
          <div
            style={files[0] ? { display: "none" } : { display: "block" }}
            {...getRootProps({ className: "dropzone" })}
          >
            <input {...getInputProps()} />
            <p>
              Drag 'n' drop some files here, or click to select files (Only
              *.jpeg and *.png images will be accepted)
            </p>
          </div>
          <aside>
            <p style={{ textAlign: "center" }}>Crop preview</p>

            <SemanticImage>
              <canvas ref={imageRef}></canvas>
              <Button
                style={files[0] ? { display: "block" } : { display: "none" }}
                onClick={handleAvatarChange}
              >
                Change avatar
              </Button>
            </SemanticImage>
          </aside>
          <aside>
            {acceptedFilesItems ? acceptedFilesItems && cropFile() : ""}
            {rejectedFilesItems ? rejectedFilesItems : ""}
          </aside>
        </section>
      </Grid.Row>
    </Grid>
  );
}
