import React, { useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import ImpediaBanner from "../../assets/Home/impediaBanner.svg";
import AuthorityImage from "../../assets/Home/authority.svg";
import StudentImage from "../../assets/Home/student.svg";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
  BannerImg: {
    width: "100%",
    maxHeight: "100vh",
  },
  linkTag: {
    textDecoration: "none",
    color: "inherit",
    "&::after": {
      content: "",
      display: "block",
      width: "100%",
      height: "3px",
      background: "rgba(255, 30, 86, 0.99)",
      transition: "width .3s",
    },
    "&:hover": {
      "&::after": {
        width: "100%",
      },
    },
  },
  headingText: {
    fontWeight: "700",
    fontSize: "20px",
    color: "#1D1D1D",
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
    },
  },
  navWrapper: {
    width: "100%",
  },
  navDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
    top: "20px",
    width: "calc(100%/12*7)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  SectionWrapper: {
    padding: "50px 20px",
  },
  StudentImgWrapper: {
    textAlign: "center",
  },
  StudentImg: {
    padding: "30px",
    maxWidth: "100%",
  },
  SectionHeading: {
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "29.26px",
    letterSpacing: "0.05em",
    textAlign: "left",
    marginBottom: "20px",
  },
  SectionText: {
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "29px",
    letterSpacing: "0.05em",
    textAlign: "left",
  },
  SectionHeading2: {
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "29.26px",
    letterSpacing: "0.05em",
    textAlign: "right",
    marginBottom: "20px",
  },
  SectionText2: {
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "29px",
    letterSpacing: "0.05em",
    textAlign: "right",
  },
  SectionTextWrapper: {
    padding: "0 40px",
  },
  SectionLinkWrapper:{
      display:"flex",
      flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop:"20px",
  },
  SectionLinkTag:{
    textDecoration: "none",
    color: "#000000",
    background: "linear-gradient(87.22deg, #FFAC41 10.57%, rgba(255, 30, 86, 0.74) 133.29%)",
    padding:"10px 20px",
    borderRadius:"50px",
  },
  SectionLinkText:{
    fontWeight:"600",
  },
  footerSection:{
    background: "#FFAC41 94%",
    textAlign:"center",
    padding:"30px"
  },
  FooterText:{
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "center",
    marginBottom:"15px"
  },
  GithubIcon:{
    fontSize:"35px",
  }
}));

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Grid item md={4}></Grid>
        <Grid item md={8}>
          <div className={classes.navWrapper}>
            <div className={classes.navDiv}>
              <Link to="/login/admin" className={classes.linkTag}>
                <Typography className={classes.headingText}>ADMIN</Typography>
              </Link>
              <Link to="/login/authority" className={classes.linkTag}>
                <Typography className={classes.headingText}>
                  AUTHORITY
                </Typography>
              </Link>
              <Link to="/login/student" className={classes.linkTag}>
                <Typography className={classes.headingText}>STUDENT</Typography>
              </Link>
            </div>
          </div>
        </Grid>
      </Grid>
      <div>
        <img
          className={classes.BannerImg}
          src={ImpediaBanner}
          alt="Impedia Banner"
        />
      </div>
      <div className={classes.SectionWrapper}>
        <Grid container>
          <Grid item md={4} className={classes.StudentImgWrapper}>
            <img
              className={classes.StudentImg}
              src={StudentImage}
              alt="Student Image"
            />
          </Grid>
          <Grid item md={8} className={classes.SectionTextWrapper}>
            <Typography className={classes.SectionHeading}>STUDENT</Typography>
            <Typography className={classes.SectionText}>
              Create Appeals and Petitions directly to authorities / group of
              authorities. Sign and support other petitions. Chat directly with
              the Authorities on the raised issues
            </Typography>
            <div className={classes.SectionLinkWrapper}>
              <Link to="/login/student" className={classes.SectionLinkTag}>
                <Typography className={classes.SectionLinkText}>LOGIN</Typography>
              </Link>
              <Link to="/register/student" className={classes.SectionLinkTag}>
                <Typography className={classes.SectionLinkText}>REGISTER</Typography>
              </Link>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={8} className={classes.SectionTextWrapper}>
            <Typography className={classes.SectionHeading2}>
              Authority
            </Typography>
            <Typography className={classes.SectionText2}>
              View the Appeals and Petitions raised by the students. Chat
              directly with them on the issue. Post a decision on the Appeals/
              Petitions
            </Typography>
            <div className={classes.SectionLinkWrapper}>
              <Link to="/login/authority" className={classes.SectionLinkTag}>
                <Typography className={classes.SectionLinkText}>LOGIN</Typography>
              </Link>
            </div>
          </Grid>
          <Grid item md={4} className={classes.StudentImgWrapper}>
            <img
              className={classes.StudentImg}
              src={AuthorityImage}
              alt="Student Image"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={4} className={classes.StudentImgWrapper}>
            <img
              className={classes.StudentImg}
              src={StudentImage}
              alt="Student Image"
            />
          </Grid>
          <Grid item md={8} className={classes.SectionTextWrapper}>
            <Typography className={classes.SectionHeading}>ADMIN</Typography>
            <Typography className={classes.SectionText}>
              Add Authority to the platform, Create Authority groups, Edit Authority groups, Change allowed email domain name.
            </Typography>
            <div className={classes.SectionLinkWrapper}>
              <Link to="/login/admin" className={classes.SectionLinkTag}>
                <Typography className={classes.SectionLinkText}>LOGIN</Typography>
              </Link>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={classes.footerSection}>
        <Typography className={classes.FooterText}>
        All Rights Reserved.
        <br></br>© Team Impedia  
        </Typography>
        <a href="https://github.com/garvitchittora/Impedia" className={classes.linkTag}>
            <GitHubIcon className={classes.GithubIcon}></GitHubIcon>
        </a>
      </div>
    </>
  );
};

export default Home;
