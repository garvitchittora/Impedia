import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
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
  forgot: {
    textAlign:"center",
    '& a' :{
      color: "#f44336"
    },
    marginBottom: "1rem"
    
  }
}));

const LoginPage = (props) => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const clickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const mouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleChange = (event) => {
    if (event.target.name === "email") {
      props.setEmailValues(event.target.value);
    } else if (event.target.name === "password") {
      props.setPasswordValues(event.target.value);
    }
  };

  const getRegisterURL = (actor) => {
    if (actor == "Members") {
      return "/register/member";
    } else if (actor == "Admin") {
      return "/register/admin";
    } else {
      return "";
    }
  }

  const getRegisterText = (actor) => {
    if (actor == "Members") {
      return " Register your account with your org email address.";
    } else if (actor == "Admin") {
      return " Register your organization here.";
    } else {
      return " Ask your org admin to add you as an authority then check your email.";
    }
  }

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
            {props.actor} Login
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
                    required
                    id="email"
                    name="email"
                    value={props.EmailValues}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              <div className={classes.formInputs}>
                <FormControl className={classes.fieldInput} variant="filled" error>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <FilledInput
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={props.PasswordValues}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={clickShowPassword}
                          onMouseDown={mouseDownPassword}
                          color="secondary"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
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
                    Wrong username or password. Try again
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
                  Login
                </Button>
                
                <div className={classes.forgot} >
                  Don't have an account?
                  <Link to={getRegisterURL(props.actor)} >
                    {getRegisterText(props.actor)}
                  </Link>
                </div>
              
                <div className={classes.forgot} >
                  <Link to="/reset-password/trigger" >
                    Forgot Password ?
                  </Link>
                </div>
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

export default LoginPage;
