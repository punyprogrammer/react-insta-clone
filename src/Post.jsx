import React, { useState, useEffect } from "react";
import { projectFirestore, projectStorage } from "./firebaseConfig";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import "./Post.css";
const Post = ({ username, caption, imageUrl, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  //use effect to fetch posts
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = projectFirestore
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .limit(4)
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    projectFirestore
      .collection("posts")
      .doc(postId)
      .collection("comments")

      .add({
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Amardeep"
          src="https://images.unsplash.com/photo-1542190891-2093d38760f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
        />
        <h3>{username}</h3>
      </div>
      <img src={imageUrl} alt="" className="post__image" />
      <div className="post__text">
        <strong>{username}</strong>
        {caption}
      </div>

      <div className="commentsContainer">
        {comments.map((comment) => (
          <p className="single ">
            <strong>{comment.username}</strong>
            <p className="commentText">{comment.text}</p>
          </p>
        ))}
      </div>
      {user &&  (
        <form className="post__commentBox  ">
          <input
            type="text"
            className="post__input"
            placeholder="Add your comment...."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
