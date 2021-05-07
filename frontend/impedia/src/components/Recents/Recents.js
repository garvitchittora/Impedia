import React, { useEffect, useState } from "react";
import { makeStyles, Typography, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import UpvoteIcon from "@material-ui/icons/ThumbUp";
const useStyles = makeStyles((theme) => ({
  recentSection: {
    backgroundColor: "#EAE9E9",
    width: "90%",
    margin: "15px auto",
    overflowY: "scroll",
    borderRadius: "5px",
    padding: "10px",
    height: "25vh",
  },
  recentsHeading: {
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: "3px",
    color:"black"
  },
  cardData: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "14px",
    color: "#3D3D3D",
    margin: "15px 0",
    userSelect: "none",
    cursor: "pointer",
  },
  dataTitle: {
    flex: "70%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: "600",
  },
  seperator: {
    flex: "5%",
  },
  upvotes: {
    flex: "25%",
    display: "flex",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    textTransform: "none",
    color: "inherit",
  },
}));

const MAXRETURN = 5;

const Recents = (props) => {
  const classes = useStyles();

  const [data, setData] = useState();

  useEffect(() => {
    if(!props.data){
      return;
    }
    props.data.sort((a, b) => {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });

    setData(props.data.slice(0, MAXRETURN));
  }, [props.data]);

  const makeCard = (obj, ind) => {
    return (
      <Link
        to={`/${props.type.toLowerCase()}/${obj.id}`}
        className={classes.link}
        key={ind}
      >
        <div className={classes.cardData}>
          <div className={classes.dataTitle}>{obj.title}</div>
          {props.type === "PETITIONS" && (
            <>
              <div className={classes.seperator}></div>
              <div className={classes.upvotes}>
                <UpvoteIcon /> &nbsp; {obj.signees.length}
              </div>
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className={classes.recentSection}>
      <Typography className={classes.recentsHeading}>{props.type}</Typography>
      {data ? data.map(makeCard) : <CircularProgress style={{display:"block", margin:"auto"}}/>}
    </div>
  );
};

export default Recents;
