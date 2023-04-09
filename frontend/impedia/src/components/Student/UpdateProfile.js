import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  MenuItem,
  Collapse,
  IconButton
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
 Close as CloseIcon,
} from "@material-ui/icons";
import axios from "axios";
import SuccessAlert from "../Alert/SuccessAlert";
import ErrorAlert from "../Alert/ErrorAlert";
import TopBar from "../TopBar/TopBar";
import { useCookies } from "react-cookie";
import ProfileDetails from "../../assets/Profile/prof_details.svg";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
  },
  container: {
    margin: "2% 0",
  },
  submitButton: {
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    width: "200px",
    fontWeight: "800",
    padding: "1%",
    fontSize: "16px",
    border: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
  updatePhoto: {
    maxWidth: "30vw",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "40vw",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  form__items: {
    width: "60%",
    margin: ".8rem",
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      margin: ".5rem",
    },
  },
  updateForm: {
    margin: 0,
    marginTop: "2rem",
    padding: "2rem",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
  },
  loader: {
    position: "absolute",
    top: "-.8rem",
  },
}));

const UpdateProfile = () => {
  const classes = useStyles();
  const [cookies] = useCookies(["user"]);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    semester: "",
    branch: "",
    section: "",
  });
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [changepassSuccessAlert, setChangePassSuccessAlert] = useState(false);
  const [changepassErrorAlert, setChangePassErrorAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!cookies.user || cookies.user["type"] !== "STUDENT") {
      return history.push("/login/member");
    }
  }, []);

  const section = [
    {
      value: "A",
      label: "A",
    },
    {
      value: "B",
      label: "B",
    },
    {
      value: "C",
      label: "C",
    },
    {
      value: "D",
      label: "D",
    },
    {
      value: "E",
      label: "E",
    },
  ];

  const branch = [
    {
      value: "IT",
      label: "IT",
    },
    {
      value: "ECE",
      label: "ECE",
    },
    {
      value: "IT-BI",
      label: "IT-BI",
    },
  ];

  useEffect(() => {
    if(cookies.user){
      setKey(cookies.user["key"]);
    }
  }, []);

  useEffect(() => {
    if (key) {
      const exec = async () => {
        const config = {
          headers: {
            authorization: key,
          },
        };
        const res = await axios.get("/student/profile", config);
        setUserData(res.data);
      };
      exec();
    }
  }, [key]);

  const updateUserData = async () => {
    setError("");
    if (!userData.semester || !userData.branch || !userData.section) {
      setError("Please fill all the required fields");
      setOpenErrorAlert(true);
      return;
    }

    if (userData.semester > 8) {
      setError("Please enter a value between 1-8 for semester");
      setOpenErrorAlert(true);
      return;
    }
    const config = {
      headers: {
        authorization: key,
      },
    };
    const student = await axios.put("/student/profile", userData, config);

    student.status === 200
      ? setOpenSuccessAlert(true)
      : setOpenErrorAlert(true);
    openErrorAlert && setError(student.data.error);
  };

  const changePassword = (e) => {
    e.preventDefault();

        const body = {
            email: userData.email,
            type: "Student"
        }
        
        axios.post('/reset-password/trigger',body)
        .then((res)=>{
            if(res.status === 200){
                setChangePassSuccessAlert(true);
            }
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 404)
                setChangePassErrorAlert(true);
        });
  }

  return (
    <>
      {key !== null ? (
        <div className={`${classes.root} ${classes.container}`}>
          <TopBar actor="STUDENT" useCase="Update Profile" />

          <SuccessAlert
            open={openSuccessAlert}
            setOpen={setOpenSuccessAlert}
            message="Your information was updated."
          />
          <ErrorAlert
            open={openErrorAlert}
            setOpen={setOpenErrorAlert}
            message={error}
          />

          <Grid container spacing={3} className={classes.updateForm}>
            <Grid
              container
              item
              xs={12}
              sm={6}
              direction="column"
              alignItems="center"
            >
              <h3>{userData.email}</h3>
              <TextField
                error
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                label="Name"
                fullWidth
                variant="filled"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
              <TextField
                required
                error
                type="number"
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                InputProps={{ inputProps: { min: 1, max: 8 } }}
                label="Semester"
                variant="filled"
                value={userData.semester}
                onChange={(e) =>
                  setUserData({ ...userData, semester: e.target.value })
                }
              />
              <TextField
                required
                error
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                select
                label="Branch"
                variant="filled"
                value={userData.branch}
                onChange={(e) =>
                  setUserData({ ...userData, branch: e.target.value })
                }
              >
                {branch.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                error
                className={classes.form__items}
                InputLabelProps={{ shrink: true }}
                label="Section"
                select
                variant="filled"
                value={userData.section}
                onChange={(e) =>
                  setUserData({ ...userData, section: e.target.value })
                }
              >
                {section.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                className={`${classes.submitButton} ${classes.form__items}`}
                onClick={updateUserData}
                variant="contained"
              >
                Update Details
              </Button>
              <br /><br />
              <Button
                className={`${classes.submitButton} ${classes.form__items}`}
                onClick={changePassword}
                variant="contained"
              >
                Change Password
              </Button>
              <div className={classes.failureLoginAlert}>
                <Collapse in={changepassErrorAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setChangePassErrorAlert(false);
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
                    There was an error sending the mail !
                  </Alert>
                </Collapse>
              </div>

              <div className={classes.failureLoginAlert}>
                <Collapse in={changepassSuccessAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setChangePassSuccessAlert(false);
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
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm={6}
              justify="center"
              alignItems="center"
            >
              <img
                src={ProfileDetails}
                alt="task update"
                className={classes.updatePhoto}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        <Redirect to="/login/member" />
      )}
    </>
  );
};

export default UpdateProfile;
