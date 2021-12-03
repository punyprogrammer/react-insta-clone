import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";
import "./ImageUpload.css";

import { projectStorage, projectFirestore } from "./firebaseConfig";
const ImageUpload = ({ ...user }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    console.log(user);
    const uploadTask = projectStorage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        projectStorage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post images in thedb
            projectFirestore.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: user.user.displayName,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div class="imageupload">
      <progress value={progress} max="100"></progress>
      <input
        type="text"
        placeholder="Enter  a Caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
