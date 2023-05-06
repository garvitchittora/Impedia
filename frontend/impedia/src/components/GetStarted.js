import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import ImpediaLogo from "../assets/Logo-Impedia.png";

const useStyles = makeStyles((theme) => ({
  background: {
    background: "#FFAC41",
    color: "black",
  },
  SectionHeading: {
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  SectionText: {
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: "0.05em",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      textAlign: "justify",
      fontSize: "15px",
      lineHeight: "24px",
      color: "black",
    },
  },
  wrapper: {
    display: "grid",
    alignItems: "center",
    padding: "20px",
    justifyContent: "center",
  },
  wrapperImage: {
    display: "grid",
    alignItems: "center",
    padding: "20px",
    height: "100vh",
    justifyContent: "center",
    background: "white",
    [theme.breakpoints.down("sm")]: {
      height: "50vh",
      padding: "0 40px",
    },
  },
  StudentImg: {
    width: "100%",
  },

  SectionLinkWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "20px",
    marginTop: "20px",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
  },
  SectionLinkTag: {
    textDecoration: "none",
    background: "rgba(255, 30, 86, 0.74)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "50px",
    marginRight: "30px",
    transition: "all 0.15s ease-in",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    "&:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.12)",
      transform: "translateY(-1.5px) scale(1.05)",
    },
    "&:active": {
      boxShadow: "0 1px 15px rgba(0,0,0,0.20), 0 10px 10px rgba(0,0,0,0.12)",
      transform: "translateY(1px) scale(1)",
    },
    [theme.breakpoints.down("md")]: {
      marginRight: "10px",
    },
  },
  SectionLinkText: {
    fontWeight: "600",
  },
}));

const GetStarted = () => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <Grid container item className={classes.roleDesc}>
        <Grid item md={4} className={classes.wrapperImage}>
          <img className={classes.StudentImg} src={ImpediaLogo} alt="Logo" />
        </Grid>
        <Grid
          item
          md={8}
          className={`${classes.wrapper} ${classes.background}`}
        >
          <div>
            <Typography className={classes.SectionHeading}>
              Getting started guide:
            </Typography>
            <Typography className={classes.SectionText}>
              <br></br>
              1. <Link to="/register/admin">
                Register your organization
              </Link>{" "}
              with basic details like name, logo and your email domain
              <br></br>
              2. This simultaneously registers an admin user who overlooks the
              organization.
              <br></br>
              3. The admins add authorities, to whom your organization’s members
              can make appeals and petitions. The authorities will be sent their
              login details via email.
              <br></br>
              4.{" "}
              <Link to="/register/member">
                The members register themselves
              </Link>{" "}
              with the organization’s email domain and can then make appeals and
              petitions. Appeals are individual problems whereas petitions are
              for a group of individuals, so people can support a petition,
              removing the need for multiple appeals.
              <br></br>
              5. Members and authorities can add their replies on an appeal or a
              petition and try to resolve them.
              <br></br>
              <br></br>
              Impedia gives you a centralized appeal/request platform that your
              organization members can use to communicate with the authorities.
              We aim to remove all the endless spamming and CC'ing that comes
              with any requests made within an organization.
              <br></br>
              The use cases for Impedia are immense. Some of the usecases
              include:
              <br></br>
              1. Access Requests handling in Tech companies
              <br></br>
              2. Suggestions/Grievances handling in various companies
              <br></br>
              3. Bug reporting tool in tech companies
              <br></br>
              4. Internal Tech Support tool
              <br></br>
              and much much more.
              <div className={classes.SectionLinkWrapper}>
                <Link
                  className={classes.SectionLinkTag}
                  data-testid="student-login-button-2"
                  to="/"
                >
                  <Typography className={classes.SectionLinkText}>
                    Home
                  </Typography>
                </Link>
              </div>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default GetStarted;
