import React, { useEffect, useState } from "react";
import {
  makeStyles,
  TextField,
  InputAdornment,
  FormControlLabel,
} from "@material-ui/core";
import {
  Reply as ReplyIcon,
  Cancel as CancelIcon,
  Telegram as SendIcon,
  ThumbUp as Support,
  ThumbDown as NoSupport,
} from "@material-ui/icons";
import axios from "axios";
import ViewComments from "../Comments/ViewComments";
import TopBar from "../TopBar/TopBar";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useCookies } from "react-cookie";
import { useHistory } from 'react-router-dom';
import Loader from '../../assets/loader.svg';

const useStyles = makeStyles((theme) => ({
  loader: {
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  container: {
    margin: "2% 0",
  },
  body: {
    width: "95vw",
    margin: "40px auto 0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mentions: {
    display: "flex",
    justifyContent: "space-evenly",
    fontWeight: "600",
    margin: "30px auto",
    width: "80vw",
    [theme.breakpoints.down("md")]: {
      width: "100vw",
      // justifyContent: "center",
      // alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  colored: {
    color: "#FF1E56",
  },
  fromto: {
    backgroundColor: "#dddddd",
    padding: "20px",
    borderRadius: "20px",
    maxWidth: "500px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    margin: "10px 0",
    textAlign: "center",
    color: "black",
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
      margin: "10px auto",
    },
  },
  extrainfo: {
    margin: "0 10px",
    display: "flex",
    flexDirection: "column",
    fontWeight: "600",
  },
  date: {
    alignSelf: "flex-end",
  },
  APsection: {
    flex: "70%",
    margin: "0 20px",
    height: "100%",
    bottom: "0",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      margin: "0 10px",
      width: "90vw",
    },
  },
  contentBody: {
    padding: "25px",
    border: "2px solid #E2E2E2",
    borderRadius: "20px",
    height: "100%",
    margin: "0 auto",
    [theme.breakpoints.down("md")]: {
      padding: "15px",
    },
  },
  title: {
    fontSize: "35px",
    fontWeight: "600",
    borderBottom: "4px solid #DDD",
  },
  content: {
    // height:"70vh",
    // overflow:"scroll"
    overflow: "auto"
  },
  commentsSection: {
    border: "2px solid #AAA",
    flex: "30%",
    minHeight: "70vh",
    margin: "0 20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    // backgroundColor: "#f9f6f7",
    maxHeight: "150vh",
    [theme.breakpoints.down("md")]: {
      maxHeight: "80vh",
      width: "90vw",
      margin: "5vh auto",
    },
  },
  commentHeading: {
    width: "80%",
    alignSelf: "flex-start",
    margin: "0 auto",
    padding: "10px",
    fontWeight: "800",
    textAlign: "center",
    borderBottom: "2px solid black",
  },
  comments: {
    alignSelf: "stretch",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  },
  newComment: {
    alignSelf: "flex-end",
    marginTop: "auto",
    fontWeight: "600",
    width: "100%",
  },
  replyingTo: {
    fontSize: "12px",
    backgroundColor: "rgba(174,174,174,0.6)",
    margin: "auto",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    padding: "5px",
    overflow: "hidden",
    maxWidth: "350px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  replyIcon: {
    fontSize: "12px",
  },
  replySectionNewComment: {
    margin: "auto",
    display: "flex",
  },
  cancelReplyIcon: {
    cursor: "pointer",
  },
  supportOption: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor:"#e2e2e2"
  },
  support: {
    color: "green",
  },
  nosupport: {
    color: "red",
  },
  sendIcon: {
    cursor: "pointer",
    color: "#f44336"
  },
  resolvedButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "linear-gradient(87.74deg, #FFAC41 4.75%, #FF1E56 140.54%)",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  resolvedButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    display: "grid",
  }
}));

const ViewAppeal = (props) => {
  const classes = useStyles();

  const appealId = props.routerProps.match.params.id;
  console.log(appealId);

  const [data, setData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [supportValue, setSupportValue] = useState("support");
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState();
  const [reload, setReload] = useState(false);
  const [cookies] = useCookies(["user"]);
  const [emptyReply, setEmptyReply] = useState(false);
  const history = useHistory();
  const dateoptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  useEffect(() => {
    if (!cookies.user) {
      return history.push("/");
    }
  }, []);

  useEffect(() => {
    if (cookies.user) {
      const Token = cookies.user["key"];
      const config = {
        headers: {
          authorization: Token,
        },
      };
      axios
        .get(`/appeal/${appealId}`, config)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch(err => {
          if (err.response.status === 400 || err.response.status === 401 || err.response.status === 404 || err.response.status === 403) {
            history.push("/error");
          }
        });
    }
  }, []);

  useEffect(() => {
    if (cookies.user) {
      const Token = cookies.user["key"];
      const config = {
        headers: {
          authorization: Token,
        },
      };
      axios
        .get(`/appeal/${appealId}/replies`, config)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setComments(data);
        });
    }
  }, [reload]);

  const markAsResolved = () => {
    const Token = cookies.user['key'];
    const config = {
      headers: {
        authorization: Token,
      },
    };
    axios
      .post(`/appeal/${appealId}/resolve`, {}, config)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      });
  };

  const submitComment = () => {
    if (newComment === "") {
      setEmptyReply(true);
      return;
    }
    setEmptyReply(false);
    const Token = cookies.user["key"];
    const config = {
      headers: {
        Authorization: Token,
      },
    };
    const body = {
      content: newComment,
      replyToId: replyTo ? replyTo.id : appealId,
      support: supportValue === "support" ? true : false,
    };

    axios.post(`/reply`, body, config).then((res) => {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        setNewComment("");
        setReplyTo();
        setReload((prev) => !prev);
      }
      // else{
      //     setFailureAlert(true);
      // }
    });
  };

  return data.length === 0 ? (
    <img src={Loader} alt="loading" className={classes.loader} />
  ) : (
    <>
      <div className={classes.container}>
        <TopBar useCase="Appeal" actor={cookies.user["type"]} />

        <div className={classes.mentions}>
          <div className={classes.fromto}>
            FROM :{" "}
            <span
              className={classes.colored}
            >{`${data.appealFromId.email} | ${data.appealFromId.name}`}</span>
          </div>
          <div className={classes.fromto}>
            TO :{" "}
            <span className={classes.colored}>{`${data.appealToId.email || "Group"
              } | ${data.appealToId.name}`}</span>
          </div>
          <div className={classes.resolvedButtonWrapper}>
            <button className={classes.resolvedButton} onClick={() => {
              markAsResolved();
            }}>Mark as resolved</button>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.APsection}>
            <div className={classes.extrainfo}>
              <div className={classes.date}>
                {new Date(data.dateTime).toLocaleString("en-Us", dateoptions)} |{" "}
                {new Date(data.dateTime).toLocaleTimeString("en-Us", {
                  hour12: true,
                })}
              </div>
            </div>
            <div className={classes.contentBody}>
              <div className={classes.title}>{data.title}</div>
              <div className={classes.content}>
                <ReactMarkdown
                  plugins={[gfm]}
                  allowDangerousHtml
                  children={data.content}
                />
              </div>
            </div>
          </div>
          <div className={classes.commentsSection}>
            <div className={classes.commentHeading}>COMMENTS</div>

            <ViewComments
              className={classes.comments}
              comments={comments}
              setReplyTo={setReplyTo}
            />

            <div className={classes.newComment}>
              <div className={classes.replySectionNewComment}>
                {replyTo ? (
                  <div className={classes.replySectionNewComment}>
                    <div className={classes.replyingTo}>
                      <ReplyIcon className={classes.replyIcon} />{" "}
                      {`${replyTo.replyById["name"]} | ${replyTo.content}`}
                    </div>
                    <CancelIcon
                      className={classes.cancelReplyIcon}
                      onClick={() => {
                        setReplyTo();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <TextField
                variant="filled"
                fullWidth
                label="New Comment"
                error
                multiline
                rows={3}
                rowsMax={5}
                value={newComment}
                helperText={
                  emptyReply ? (
                    <strong>* Please enter something (Empty Field)</strong>
                  ) : (
                    ""
                  )
                }
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon
                        className={classes.sendIcon}
                        onClick={submitComment}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <div className={classes.supportOption}>
                <FormControlLabel
                  value="support"
                  control={
                    <Support
                      className={
                        supportValue === "support" ? classes.support : ""
                      }
                      onClick={() => {
                        setSupportValue("support");
                      }}
                    />
                  }
                />
                <FormControlLabel
                  value="no-support"
                  control={
                    <NoSupport
                      className={
                        supportValue === "no-support" ? classes.nosupport : ""
                      }
                      onClick={() => {
                        setSupportValue("no-support");
                      }}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAppeal;
