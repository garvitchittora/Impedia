import React from 'react';
import {
    Grid,
    makeStyles, Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ImpediaLogo from "../assets/Logo-Impedia.png";

const useStyles = makeStyles((theme) => ({
    background: {
        background: "#FFAC41",
        color: "white",
        height: "100vh",
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
        },
      },
    wrapper: {
        display: "grid",
        alignItems: "center",
        padding: "20px",
        height: "100vh",
        justifyContent: "center",
    },
    wrapperImage: {
        display: "grid",
        alignItems: "center",
        padding: "20px",
        height: "100vh",
        justifyContent: "center",
        background: "white",
    },
    StudentImg:{
        width: "100%",
    },
    GetStarted: {
        cursor: "pointer",
        background: "rgba(255, 30, 86, 0.74)",
        textDecoration: "none",
        color: "white",
        padding: "10px 20px",
        borderRadius: "50px",
        textAlign: "center",
        maxWidth: "200px",
        margin: "auto"
    }
}))

const GetStarted = () => {
    const classes = useStyles();

    return (
        <div className={classes.background}>
        <Grid container item className={classes.roleDesc}>
          <Grid item md={4} className={classes.wrapperImage}>
            <img
              className={classes.StudentImg}
              src={ImpediaLogo}
              alt="Logo"
            />
          </Grid>
          <Grid item md={8} className={classes.wrapper}>
            <div>
            <Typography className={classes.SectionHeading}>
            Getting started guide:
            </Typography>
            <Typography className={classes.SectionText}>
            <br></br>
            1. Register your organization with basic details like name, logo and your email domain
            <br></br>
            2. Add users with admin privileges 
            <br></br>
            3. The admins add authorities, to whom your organization’s members can make appeals and petitions.
            <br></br>
            4. The members register themselves with the organization’s email domain and can then make appeals and petitions. Appeals are individual problems whereas petitions are for a group of individuals, so people can support a petition, removing the need for multiple appeals.
            <br></br>
            5. Members and authorities can add their replies on an appeal or a petition and try to resolve them.

            <br></br>
            <br></br>
          <Link
          data-testid="student-login-button-2"
          to="/"
        >
          <Typography className={classes.GetStarted}>
            Home
          </Typography>
        </Link>
            </Typography>
            </div>
            
          </Grid>
        </Grid>
      </div>
    )
}

export default GetStarted;