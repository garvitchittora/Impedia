import React, { useEffect, useState } from "react";
import {
  makeStyles,
  TextField,
  Tabs,
  Tab,
  AppBar,
  Typography,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Collapse,
  IconButton,
} from "@material-ui/core";
import { Autocomplete, Alert, AlertTitle } from "@material-ui/lab";
import { Close as CloseIcon, Send as SendIcon } from "@material-ui/icons";
import axios from "axios";
import TopBar from "../../TopBar/TopBar";
import ReactMarkdown from "react-markdown/with-html";
import gfm from "remark-gfm";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
  createAPPage: {
    margin: "2% 0",
  },
  APSuccessAlert: {
    width: "80vw",
    position: "fixed",
    top: "5%",
    margin: "auto",
    left: "10vw",
    zIndex: "100",
  },
  editor: {
    width: "70vw",
    maxWidth: "1200px",
    margin: "5% auto",
    [theme.breakpoints.down("sm")]: {
      width: "85vw",
    },
  },
  markdownEditor: {
    marginTop: "20px",
    border: " 2px solid #E2E2E2",
    borderRadius: "10px",
    padding: "10px",
  },
  inputs: {
    margin: "2% 0",
  },
  previewMD: {
    marginTop: "20px",
    border: " 2px solid #E2E2E2",
    borderRadius: "10px",
    padding: "10px",
  },
  previewTitle: {
    fontWeight: "600",
    fontSize: "35px",
  },
  APTo: {
    margin: "50px auto",
  },
  APToText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: "20px",
  },
  APToOptions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  APOption: {
    margin: "10px 40px",
  },
  optionSelectorDisabled: {
    opacity: "0.4",
  },
  button: {
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      margin: "2% auto",
    },
    textAlign: "center",
  },
  submitButton: {
    background:
      "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
    width: "200px",
    fontWeight: "800",
    padding: "1%",
    fontSize: "16px",
  },
  APFailureAlert: {
    width: "60vw",
    margin: "auto",
    left: "20vw",
    zIndex: "100",
    marginBottom: "10px",
  },
}));

const CreateTemplate = (props) => {
  const classes = useStyles();

  const [cookies] = useCookies(["user"]);
  // const [props.openAlert, props.setOpenAlert] = useState(false);
  // const [props.openErrorAlert, props.setOpenErrorAlert] = useState(false);
  const [value, setValue] = useState(0);
  const [openGroup, setOpenGroup] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [optionsGroup, setOptionsGroup] = useState(null);
  const [optionsAuth, setOptionsAuth] = useState(null);
  const loadingGroup = openGroup && optionsGroup === null;
  const loadingAuth = openAuth && optionsAuth === null;

  useEffect(() => {
    let active = true;

    if (loadingGroup === true) {
      return undefined;
    }

    (async () => {
      if (cookies.user) {

        const Token = cookies.user["key"];
        const config = {
          headers: {
            authorization: Token,
          },
        };
        const res = await axios.get("/group", config);
        const dataGroups = res.data;

        if (active) {
          setOptionsGroup(() => {
            return dataGroups.map((option) => {
              let firstLetter = option.name[0].toUpperCase();
              return {
                firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
                ...option,
              };
            });
          });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [loadingGroup]);

  useEffect(() => {
    let active = true;

    if (loadingAuth === true) {
      return undefined;
    }

    (async () => {
      if (cookies.user) {
        const Token = cookies.user["key"];
        const config = {
          headers: {
            authorization: Token,
          },
        };
        const res = await axios.get("/authority", config);
        const dataAuth = res.data;
        if (active) {
          setOptionsAuth(() => {
            return dataAuth.map((option) => {
              let firstLetter = option.name[0].toUpperCase();
              return {
                firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
                optionName:
                  typeof option.name !== "undefined"
                    ? option.name + " | " + option.email
                    : option.email,
                ...option,
              };
            });
          });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingAuth]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAPToChange = (e) => {
    props.setAPTo(e.target.value);
  };

  const handleAPChange = (e) => {
    if (e.target.id === "AP-title") {
      props.setNewAP((prev) => ({
        ...prev,
        title: e.target.value,
      }));
    }
    if (e.target.id === "AP-content") {
      props.setNewAP((prev) => ({
        ...prev,
        content: e.target.value,
      }));
    }
  };

  return (
    <>
      <div className={classes.createAPPage}>
        <div className={classes.APSuccessAlert}>
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
              severity="success"
              variant="filled"
            >
              <AlertTitle>
                <strong>Successful !</strong>
              </AlertTitle>
              Your {props.type} was sent
            </Alert>
          </Collapse>
        </div>
        <TopBar actor="STUDENT" useCase={`Create ${props.type}`} />

        <div className={classes.APTo}>
          <Typography className={classes.APToText}>
            Make {props.type} To :
          </Typography>
          <div>
            <RadioGroup
              className={classes.APToOptions}
              aria-label="AP-To"
              name="APTo"
              value={props.APTo}
              onChange={handleAPToChange}
            >
              <div className={classes.APOption}>
                <FormControlLabel
                  value="Group"
                  control={<Radio />}
                  label="Group"
                />
                <Autocomplete
                  id="authority-groups"
                  style={{ width: 300 }}
                  disabled={props.APTo !== "Group"}
                  open={openGroup}
                  onOpen={() => {
                    setOpenGroup(true);
                  }}
                  onClose={() => {
                    setOpenGroup(false);
                  }}
                  getOptionSelected={(option, value) =>
                    option.name === value.name
                  }
                  getOptionLabel={(option) => option.name}
                  loading={loadingGroup}
                  options={optionsGroup ?  optionsGroup.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  ) : []}
                  groupBy={(option) => option.firstLetter}
                  onChange={(e, v) => {
                    props.setId(v);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error
                      label="Authority Groups"
                      variant="filled"
                      className={
                        props.APTo !== "Group"
                          ? classes.optionSelectorDisabled
                          : ""
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingGroup ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <div className={classes.APOption}>
                <FormControlLabel
                  value="Single Authority"
                  control={<Radio />}
                  label="Single Authority"
                />
                <Autocomplete
                  id="authority"
                  style={{ width: 300 }}
                  disabled={props.APTo !== "Single Authority"}
                  open={openAuth}
                  onOpen={() => {
                    setOpenAuth(true);
                  }}
                  onClose={() => {
                    setOpenAuth(false);
                  }}
                  getOptionSelected={(option, value) =>
                    option.optionName === value.optionName
                  }
                  getOptionLabel={(option) => option.optionName}
                  loading={loadingAuth}
                  options={optionsAuth && optionsAuth.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  ) || []}
                  groupBy={(option) => option.firstLetter}
                  onChange={(e, v) => {
                    props.setId(v);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error
                      label="Authority"
                      variant="filled"
                      className={
                        props.APTo !== "Single Authority"
                          ? classes.optionSelectorDisabled
                          : ""
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingGroup ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </RadioGroup>
          </div>

          <div className={classes.APFailureAlert}>
            <Collapse in={props.openErrorAlert}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      props.setOpenErrorAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                severity="error"
              >
                <AlertTitle>
                  <strong>Error !</strong>
                </AlertTitle>
                Please select someone to send the {props.type} to
              </Alert>
            </Collapse>
          </div>
        </div>

        <div className={classes.editor}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Edit" />
              <Tab label="Preview" />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <div className={classes.markdownEditor}>
              <TextField
                error
                variant="filled"
                id="AP-title"
                label="Title"
                value={props.newAP.title}
                onChange={handleAPChange}
                fullWidth
                className={classes.inputs}
              />

              <TextField
                error
                variant="filled"
                id="AP-content"
                label="Content"
                multiline
                rows={15}
                value={props.newAP.content}
                onChange={handleAPChange}
                fullWidth
                className={classes.inputs}
                helperText="*Markdown and HTML Supported"
              />
            </div>
          )}
          {value === 1 && (
            <div className={classes.previewMD}>
              <Typography className={classes.previewTitle}>
                {props.newAP.title}
              </Typography>
              <ReactMarkdown
                plugins={[gfm]}
                allowDangerousHtml
                children={props.newAP.content}
              />
            </div>
          )}
        </div>

        <div className={classes.APFailureAlert}>
          <Collapse in={props.openErrorAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    props.setOpenErrorAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
            >
              <AlertTitle>
                <strong>Error !</strong>
              </AlertTitle>
              Please select someone to send the {props.type} to
            </Alert>
          </Collapse>
        </div>

        <div className={classes.button}>
          <Button
            variant="contained"
            className={classes.submitButton}
            onClick={props.submitFunction}
          >
            <SendIcon /> &nbsp; SEND
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateTemplate;
