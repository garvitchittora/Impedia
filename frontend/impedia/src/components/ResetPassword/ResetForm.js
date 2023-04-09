import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  IconButton,
  FilledInput,
  Collapse,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@material-ui/icons";
import back1 from "../../assets/Login/login-1.svg";
import back2 from "../../assets/Login/login-2.svg";
import back3 from "../../assets/Login/login-3.svg";
import ImpediaLogo from "../../assets/Logo-Impedia.png";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  loginPage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  bg1: {
    position: "absolute",
    height: "25vh",
    left: "-2%",
    top: "-2%",
    zIndex: "-1",
    [theme.breakpoints.down("xs")]: {
      left: "-10%",
    },
  },
  bg2: {
    position: "absolute",
    right: "0",
    top: "-5%",
    height: "35vh",
    zIndex: "-1",
    [theme.breakpoints.down("xs")]: {
      right: "-5%",
    },
  },
  bg3: {
    position: "absolute",
    left: "0",
    right: "0",
    marginLeft: "auto",
    marginRight: "auto",
    bottom: "-20%",
    height: "30vh",
    zIndex: "-1",
  },
  logo: {
    width: "300px",
  },
  loginContainer: {
    width: "95vw",
    height: "100vh",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    verticalAlign: "middle",
    position: "absolute",
    left: "2.5vw",
    [theme.breakpoints.down("xs")]: {
      top: "5vh",
    },
  },
  formName: {
    fontSize: "25px",
    textAlign: "center",
    padding: "5px 0",
    fontWeight: "600",
  },
  logoStyle: {
    color: "red",
    fontSize: "40px",
    textAlign: "center",
    fontWeight: "bold",
  },
  GridContainerWrapper: {
    paddingTop: "30px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "95vw",
    maxWidth: "30rem",
    margin: "auto",
  },
  formWrapper: {
    border: "1px solid #B0B0B0",
    maxWidth: "1200px",
    display: "flex",
    padding: "2% 3%",
    alignItems: "center",
    borderRadius: "15px",
    margin: "0",
    marginBottom: "30px",
  },
  formCover: {
    flex: "50%",
  },
  formInputs: {
    padding: "10px",
    width: "100%",
    maxWidth: "80vw",
  },
  fieldInput: {
    width: "100%",
  },
  forgotButton: {
    width: "15rem",
    padding: "2%",
  },
  passwordInput: {
    width: "100%",
  },
  formButton: {
    width: "15rem",
    maxWidth: "90vw",
    margin: "15% auto",
  },
  profileAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: "100px",
  },
  profileInputLabel: {
    padding: "0px",
    height: "16px",
    width: "16px",
  },
  profileInputBadge: {
    cursor: "pointer",
    fontSize: "16px",
  },
  profileInputField: {
    display: "none",
  },
  textCenter: {
    textAlign: "center",
  },
  loginImageContainer: {
    flex: "35%",
  },
  loginImage: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const ResetForm = (props) => {
  const classes = useStyles();

  const handleChange = (event) => {
    if (event.target.name === "email") {
      props.setEmailValues(event.target.value);
    } else if (event.target.name === "userType") {
      props.setTypeValues(event.target.value);
    }
  };

  return (
    <div className={classes.loginPage}>
      <img src={back1} className={classes.bg1} alt="login-bg-1" />
      <img src={back2} className={classes.bg2} alt="login-bg-2" />
      <img src={back3} className={classes.bg3} alt="login-bg-3" />

      {/* The Form */}
      <div className={classes.loginContainer}>
        <div>
          <Link to="/">
            <div className={classes.textCenter}>
              <img
                src={ImpediaLogo}
                className={classes.logo}
                alt="impedia-logo"
              />
            </div>
          </Link>
          <Typography className={classes.formName} color="error">
            Reset Password
          </Typography>
        </div>
        <div className={classes.formWrapper}>
          <div className={classes.formCover}>
            <form
              className={classes.formContainer}
              onSubmit={props.submitFunction}
            >
              <div className={classes.formInputs}>
                <FormControl className={classes.fieldInput} variant="filled" error>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <FilledInput
                    id="email"
                    name="email"
                    value={props.EmailValues}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>

              <div className={classes.formInputs}>
                <FormControl className={classes.fieldInput} variant="filled" error>
                  <InputLabel id="type">User Type</InputLabel>
                  <Select
                    labelId="type"
                    id="userType"
                    name="userType"
                    value={props.TypeValues}
                    onChange={handleChange}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Authority">Authority</MenuItem>
                    <MenuItem value="Student">Member</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className={classes.failureLoginAlert}>
                <Collapse in={props.openAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          props.setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    severity="error"
                  >
                    <AlertTitle>
                      <strong>Failed !</strong>
                    </AlertTitle>
                    Such an account doesn't exist.
                  </Alert>
                </Collapse>
              </div>

              <div className={classes.failureLoginAlert}>
                <Collapse in={props.successAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          props.setSuccessAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    severity="success"
                  >
                    <AlertTitle>
                      <strong>Success !</strong>
                    </AlertTitle>
                    You must have recieved an email with the link to reset your password. The link will only be valid for 1 hour.
                  </Alert>
                </Collapse>
              </div>
              <div>
                <Button
                  className={classes.formButton}
                  variant="contained"
                  color="secondary"
                  type="submit"
                  id="submit-login"
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
          <div className={classes.loginImageContainer}>
            <img
              src={props.loginImage}
              alt="login-side"
              className={classes.loginImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
