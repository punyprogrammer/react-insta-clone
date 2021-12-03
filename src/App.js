import "./App.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { projectFirestore, projectAuth } from "./firebaseConfig";
import { Input, makeStyles, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { blue } from "@material-ui/core/colors";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 8,
  },
  signup: {
    backgroundColor: "#fafafa",
  },
}));
function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  console.log(user);

  const classes = useStyles();
  //auth useEffect
  useEffect(() => {
    const unsubscribe = projectAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //if user is logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //the user has logged out
        setUser(null);
      }
    });
    return () => {
      //perform cleanup some actions
      unsubscribe();
    };
  }, [user, username]);
  //post updating useEffect
  useEffect(() => {
    projectFirestore
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  //signup function
  const signUp = (e) => {
    e.preventDefault();
    projectAuth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  //signin function
  const signIn = (e) => {
    e.preventDefault();
    projectAuth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err));
    setOpenSignIn(false);
  };

  return (
    //login modal
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              alt=""
              className="app__headerImage__modal"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            />
            <TextField
              type="text"
              label="username"
              placholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              type="email"
              placholder="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              placholder="password"
              label="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              style={{
                marginTop: 20,
                borderRadius: 6,
                backgroundColor: "#5b9aa0",
                padding: "3px 6px",
                fontSize: "18px",
                color: "#fff",
                fontWeight: 400,
              }}
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              alt=""
              className="app__headerImage__modal"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            />

            <TextField
              type="email"
              placholder="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              placholder="password"
              label="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              style={{
                marginTop: 20,
                borderRadius: 6,
                backgroundColor: "#5b9aa0",
                padding: "3px 6px",
                fontSize: "18px",
                color: "#fff",
                fontWeight: 400,
              }}
              type="submit"
              onClick={signIn}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
        {user ? (
          <Button onClick={() => projectAuth.signOut()}>LogOut</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      {/* Sign up and sign out functionality */}
      <div className="posts">
        <div className="posts__left">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              imageUrl={post.imageUrl}
              caption={post.caption}
              user={user}
            ></Post>
          ))}
        </div>
        <div className="posts__right">
          <InstagramEmbed
            url="https://www.instagram.com/p/B7HrszBHhMO/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload user={user} />
      ) : (
        <h3>You need to login to upload images </h3>
      )}
    </div>
  );
}

export default App;
