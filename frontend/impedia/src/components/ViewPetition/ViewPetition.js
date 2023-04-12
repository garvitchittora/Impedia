import React, { useEffect, useState } from "react";
import {
  makeStyles,
  TextField,
  InputAdornment,
  Collapse,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Fab,
  Badge,
  FormControlLabel,
} from "@material-ui/core";
import {
  Telegram as SendIcon,
  ThumbUp as UpvoteIcon,
  KeyboardArrowDown as DownIcon,
  ExpandLess as UpIcon,
  Create as SignIcon,
  Reply as ReplyIcon,
  Cancel as CancelIcon,
  ThumbUp as Support,
  ThumbDown as NoSupport,
  Gavel as DecideIcon,
} from "@material-ui/icons";
import SuccessAlert from "../Alert/SuccessAlert";
import ErrorAlert from "../Alert/ErrorAlert";
import ViewComments from "../Comments/ViewComments";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useCookies } from "react-cookie";
import { useHistory } from 'react-router-dom';
import Loader from '../../assets/loader.svg';

const useStyles = makeStyles((theme) => ({
  loader:{
    display:"block",
    position:"absolute",
    top:"50%",
    left:"50%",
    transform: "translate(-50%, -50%)"
  },
  container: {
    margin: "2% 0",
  },
  Alert: {
    width: "80vw",
    position: "fixed",
    top: "5%",
    margin: "auto",
    left: "10vw",
    zIndex: "100",
  },
  body: {
    width: "95vw",
    margin: "40px auto 0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      flexDirection: "column",
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
    color:"black",
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
    overflow:"auto"
  },
  commentsSection: {
    border: "2px solid #AAA",
    flex: "30%",
    minHeight: "70vh",
    margin: "0 10px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    maxHeight: "150vh",
    // backgroundColor: "#f9f6f7",
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
    display: "flex",
  },
  cancelReplyIcon: {
    cursor: "pointer",
  },
  supportOption: {
    display: "flex",
    flexDirection: "row",
    padding: "5px",
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
    color:"#f44336"
  },
  upvoteCount: {
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
  },
  updownIcon: {
    cursor: "pointer",
  },
  chipLi: {
    display: "inline-block",
    margin: "10px 10px 0 0",
  },
  signeesDown: {
    margin: "5px 0",
    listStyle: "none",
  },
  signPetition: {
    position: "absolute",
    marginLeft: "-45px",
    marginTop: "-45px",
    // backgroundColor:"#FFAC41",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    cursor: "pointer",
    userSelect: "none",
  },
  signIcon: {
    // userSelect:"none",
    // '&:active':{
    //     userSelect:"none"
    // }
  },
  decisionSection:{
    marginBottom:"20px",
    display:"flex",
    justifyContent:"space-between"
  },
  currentDecision:{
    display: "flex",
    alignItems: "center",
    height:"30px",
    padding: "10px 20px",
    borderRadius: "15px",
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    letterSpacing: "3px",
    fontWeight:"800",
    textTransform:"uppercase"
  },
  decideIcon:{
    marginRight:"30px"
  },
  Approved:{
    background:"#81b214"
  },
  Rejected:{
    background:"#ec0101"
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

  const petitionId = props.routerProps.match.params.id;
  // console.log(appealId);
  const [cookies] = useCookies(["user"]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [signed, setSigned] = useState();
  const [signMsg, setSignMsg] = useState();
  const [actor, setActor] = useState();
  const [reload, setReload] = useState(false);
  const [signdialogOpen, setSignDialogOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureAlert, setFailureAlert] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [supportValue, setSupportValue] = useState("support");
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState();
  const [emptyReply, setEmptyReply] = useState(false);
  const [decisiondialogOpen, setDecisionDialogOpen] = useState(false);
  const [decided, setDecided] = useState(false);
  const [decideMsg, setDecideMsg] = useState();
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

  const handleSignDialogOpen = () => {
    setSignDialogOpen(true);
  };
  const handleSignDialogClose = () => {
    setSignDialogOpen(false);
  };

  const handleDecisionDialogOpen = () => {
    setDecisionDialogOpen(true);
  };
  const handleDecisionDialogClose = () => {
    setDecisionDialogOpen(false);
  };

  const SigneeCard = (data) => {
    return (
      <li key={data.id} className={classes.chipLi}>
        <Chip
          //   icon={icon}
          label={data.email}
          //   onDelete={data.label === 'React' ? undefined : handleDelete(data)}
          className={classes.chip}
        />
      </li>
    );
  };

  const handleUpDown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (cookies.user) {
      const Token = cookies.user["key"];
      const config = {
        headers: {
          authorization: Token,
        },
      };
      axios
        .get(`/petition/${petitionId}`, config)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setData(data);
          setActor(cookies.user["type"]);
          let userId = cookies.user["email"];
          let signeeMail = data.signees.map((signee) => signee.email);
          if (signeeMail.findIndex((el) => el === userId) >= 0) {
            setSigned(true);
            setSignMsg("Signed");
          } else {
            setSigned(false);
            setSignMsg();
          }
          if(data.decision === "Approved" || data.decision === "Rejected"){
            setDecided(true);
            setDecideMsg("Decided");
          }
        })
        .catch(err => {
          if(err.response.status === 400 || err.response.status === 401 || err.response.status === 404 || err.response.status === 403){
            history.push("/error");
          }
        });
    }
  }, [reload]);

  useEffect(() => {
    if (cookies.user) {
      const Token = cookies.user["key"];
      const config = {
        headers: {
          authorization: Token,
        },
      };
      axios
        .get(`/petition/${petitionId}/replies`, config)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          setComments(data);
        });
    }
  }, [reload]);

  const submitSign = () => {
    handleSignDialogClose();
    const Token = cookies.user["key"];
    const config = {
      headers: {
        Authorization: Token,
      },
    };

    axios.post(`/petition/${petitionId}/sign`, {}, config).then((res) => {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        setSuccessAlert(true);
        setSuccessMessage("You signed for this Petition.")
        setReload((prev) => !prev);
      } else {
        setFailureAlert(true);
      }
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
      replyToId: replyTo ? replyTo.id : petitionId,
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

  const submitDecision = (decision) => {
    const Token = cookies.user["key"];
    const config = {
      headers: {
        Authorization: Token,
      },
    };
    const body = {
      decision
    };
    handleDecisionDialogClose();
    axios.post(`/petition/${petitionId}/decision`, body, config).then((res) => {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        setSuccessAlert(true);
        setReload((prev) => !prev);
        setSuccessMessage("The Decision was Posted.")
      }
      else{
          setFailureAlert(true);
      }
    });
  }

  const markAsResolved = () => {
    const Token = cookies.user['key'];
    const config = {
      headers: {
        authorization: Token,
      },
    };
    axios
      .post(`/petition/${petitionId}/resolve`, {}, config)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      });
  };

  return data.length === 0 ? (
    <img src={Loader} alt="loading" className={classes.loader} />
  ) : (
    <>
      <div className={classes.container}>
        {/* Alerts */}
        <SuccessAlert
          open={successAlert}
          setOpen={setSuccessAlert}
          message={successMessage}
        />
        <ErrorAlert
          open={failureAlert}
          setOpen={setFailureAlert}
          message="Some Error occurred. Please try again."
        />
        {/* Alerts End */}
        <TopBar useCase="Petition" actor={actor} />

        <div className={classes.mentions}>
          <div className={classes.fromto}>
            FROM :{" "}
            <span className={classes.colored}>{`${data.petitionFromId.email || ""
              } | ${data.petitionFromId.name}`}</span>
          </div>
          <div className={classes.fromto}>
            TO :{" "}
            <span className={classes.colored}>{`${data.petitionToId.email || "Group"
              } | ${data.petitionToId.name}`}</span>
          </div>
          <div className={classes.resolvedButtonWrapper}>
            <button className={classes.resolvedButton} onClick={() => {
              markAsResolved();
            }}>Mark as resolved</button>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.APsection}>
            <div className={classes.decisionSection} >
              <div className={`${classes.currentDecision} ${classes[data.decision]}`} >
                {data.decision ? data.decision : "Pending"}
              </div>
              <div>
                {actor === "AUTHORITY" && (
                    <Badge badgeContent={decideMsg} color="error" className={classes.decideIcon}>
                      <Fab
                        color="secondary"
                        disabled={decided}
                        aria-label="edit"
                        onClick={handleDecisionDialogOpen}
                      >
                        <DecideIcon />
                      </Fab>
                    </Badge>
                  )}
                  <Dialog
                    open={decisiondialogOpen}
                    onClose={handleDecisionDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Post a Decision on this Petition"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You can either Approve or Reject a Petition. Note that, once posted, the decision cannot be changed.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDecisionDialogClose} color="secondary">
                        Cancel
                      </Button>
                      <Button onClick={() => {submitDecision("Approved")}} color="secondary" autoFocus>
                        Approve
                      </Button>
                      <Button onClick={() => {submitDecision("Rejected")}} color="secondary" autoFocus>
                        Reject
                      </Button>
                    </DialogActions>
                  </Dialog>
              </div>
            </div>
            <div className={classes.extrainfo}>
              <div className={classes.signees}>
                <div className={classes.upvoteCount}>
                  <UpvoteIcon /> &nbsp; {data.signees.length} &nbsp; &nbsp;{" "}
                  {open ? (
                    <UpIcon
                      className={classes.updownIcon}
                      onClick={handleUpDown}
                    />
                  ) : (
                    <DownIcon
                      className={classes.updownIcon}
                      onClick={handleUpDown}
                    />
                  )}
                </div>
                <Collapse
                  in={open}
                  timeout="auto"
                  unmountOnExit
                  className={classes.signeesDown}
                >
                  {data.signees.map(SigneeCard)}
                </Collapse>
              </div>
              <div className={classes.date}>
                {new Date(data.dateTime).toLocaleString("en-Us", dateoptions)} |{" "}
                {new Date(data.dateTime).toLocaleTimeString("en-Us", {
                  hour12: true,
                })}
              </div>
            </div>
            <div className={classes.contentBody}>
              {actor === "STUDENT" && (
                <Badge badgeContent={signMsg} color="error">
                  <Fab
                    color="secondary"
                    disabled={signed || decided}
                    aria-label="edit"
                    className={classes.signPetition}
                    onClick={handleSignDialogOpen}
                  >
                    <SignIcon className={classes.signIcon} />
                  </Fab>
                </Badge>
              )}
              <Dialog
                open={signdialogOpen}
                onClose={handleSignDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure you want to sign this petition?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Once you sign a petition, you cannot unsign it! Note that
                    you will be visible publicly in the Signees List. Click on
                    Agree if you wish to continue.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSignDialogClose} color="secondary">
                    Disagree
                  </Button>
                  <Button onClick={submitSign} color="secondary" autoFocus>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
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
