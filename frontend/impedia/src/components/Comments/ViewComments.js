import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import {
  Reply as ReplyIcon,
  ThumbUp as SupportIcon,
  ThumbDown as NoSupportIcon,
} from "@material-ui/icons";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
  noComments:{
    textAlign:"center",
    marginTop:"30px"
  },
  conatiner: {
    height: "100%",
    overflow: "auto",
  },
  commentContainer: {
    width: "90%",
    margin: "20px auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  support: {
    // position:"absolute",
    // alignSelf:"flex-start",
    marginTop: "-20px",
    marginLeft: "-15px",
  },
  supportIcon: {
    color: "green",
    fontSize: "16",
  },
  nosupportIcon: {
    color: "red",
    fontSize: "16",
  },
  replySection: {
    fontSize: "12px",
    backgroundColor: "rgba(174,174,174,0.6)",
    margin: "auto 10px",
    width: "65vw",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    padding: "5px",
    overflow: "hidden",
    maxWidth: "280px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  comment: {
    flex: "90%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafaf6",
    padding: "20px 10px 10px",
    borderRadius: "15px",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
  },
  contentDark: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#133B5C",
    color:"white",
    padding: "20px 10px 10px",
    borderRadius: "15px",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
  },
  from: {
    fontWeight: "600",
    fontSize: "12px",
    borderBottom: "1px solid #dddddd",
    marginBottom: "10px",
  },
  admin: {
    color: "green",
    fontWeight: "800",
    fontSize: "14px",
  },
  authority: {
    color: "red",
    fontWeight: "800",
    fontSize: "14px",
  },
  dateTime: {
    color: "#30475e",
  },
  replyIcon: {
    cursor: "pointer",
  },
}));

const ViewComments = ({ comments, setReplyTo }) => {
  const [cookies, setCookie] = useCookies(['theme']);
  const classes = useStyles();

  const CommentCard = (comment) => {
    return (
      <div className={classes.commentContainer}>
        <div className={classes.comment}>
          {comment.onToModel === "Reply" ? (
            <div className={classes.replySection}>
              {`${comment.replyToId["replyById"]["name"]} | ${comment.replyToId["content"]}`}
            </div>
          ) : (
            ""
          )}
          <div className={cookies.theme ==="dark"?classes.contentDark:classes.content}>
            <div className={classes.support}>
              {comment.support === true ? (
                <SupportIcon className={classes.supportIcon} />
              ) : (
                <NoSupportIcon className={classes.nosupportIcon} />
              )}
            </div>
            <Typography className={classes.from}>
              <span
                className={
                  comment.onByModel === "Admin"
                    ? classes.admin
                    : comment.onByModel === "Authority"
                    ? classes.authority
                    : ""
                }
              >
                {comment.replyById["name"]}
              </span>{" "}
              |{" "}
              <span className={cookies.theme==="light" ? classes.dateTime : null}>
                {new Date(comment.dateTime).toLocaleString()}
              </span>
            </Typography>
            <Typography>{comment.content}</Typography>
          </div>
        </div>
        <div className={classes.replyOption}>
          <ReplyIcon
            className={classes.replyIcon}
            onClick={() => {
              setReplyTo(comment);
            }}
          />
        </div>
      </div>
    );
  };

  return comments.length === 0 ? (
    <div className={classes.noComments}>No Comments Yet</div>
  ) : (
    <>
      <div className={classes.conatiner}>{comments.map(CommentCard)}</div>
    </>
  );
};

export default ViewComments;
