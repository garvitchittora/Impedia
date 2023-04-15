import React, { useState } from 'react';
import axios from 'axios';
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
} from '@material-ui/core';
import {
    Visibility,
    VisibilityOff,
    Close as CloseIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from "@material-ui/lab";
import back1 from '../../assets/Login/login-1.svg';
import back2 from '../../assets/Login/login-2.svg';
import back3 from '../../assets/Login/login-32.svg';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import LoginSidePic from '../../assets/Login/loginSidePic.svg';
import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    loginPage: {
        position: "absolute",
        height: "100%",
        width: "100%",
        overflowX: "hidden",
    },
    bg1: {
        position: "absolute",
        height: "25vh",
        left: "-2%",
        top: "-2%",
        zIndex: "-1",
        [theme.breakpoints.down("xs")]: {
            top: "-12%",
            left: "-15%",
        }
    },
    bg2: {
        position: "absolute",
        right: "0",
        top: "-5%",
        height: "35vh",
        zIndex: "-1",
        [theme.breakpoints.down("xs")]: {
            top: "-12%",
            right: "-10%",
        }
    },
    bg3: {
        position: "absolute",
        left: "0",
        right: "0",
        marginLeft: "auto",
        marginRight: "auto",
        bottom: "-30%",
        height: "15vh",
        zIndex: "-1"
    },
    logo: {
        width: "300px"
    },
    loginContainer: {
        width: "95vw",
        margin: "5% auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        verticalAlign: "middle",
        position: "absolute",
        left: "2.5vw",
        [theme.breakpoints.down("xs")]: {
            top: "10vh",
        }
    },
    formName: {
        fontSize: "25px",
        textAlign: "center",
        padding: "5px 0",
        fontWeight: "600"
    },
    logoStyle: {
        color: "red",
        fontSize: "40px",
        textAlign: "center",
        fontWeight: "bold",
    },
    GridContainerWrapper: {
        paddingTop: "30px"
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "95vw",
        maxWidth: "30rem",
        margin: "auto"
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
        flex: "50%"
    },
    formInputs: {
        padding: "10px",
        width: "100%",
        maxWidth: "80vw"
    },
    fieldInput: {
        width: "100%"
    },
    forgotButton: {
        width: "15rem",
        padding: "2%"
    },
    passwordInput: {
        width: "100%"
    },
    formButton: {
        width: "15rem",
        maxWidth: "90vw",
        margin: "15% auto"
    },
    profileAvatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        borderRadius: "100px"
    },
    profileInputLabel: {
        padding: "0px",
        height: "16px",
        width: "16px"
    },
    profileInputBadge: {
        cursor: "pointer",
        fontSize: "16px"
    },
    profileInputField: {
        display: "none"
    },
    textCenter: {
        textAlign: "center",
    },
    loginImageContainer: {
        flex: "35%"
    },
    loginImage: {
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            display: "none",
        }
    }

}));

const AdminRegister = () => {
    const classes = useStyles();
    const history = useHistory();

    const [OrgNameValues, setOrgNameValues] = React.useState('');
    const [EmailDomainValues, setEmailDomainValues] = React.useState('');
    const [LogoValues, setLogoValues] = React.useState('');
    const [NameValues, setNameValues] = React.useState('');
    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');
    const [domainAlert, setDomainAlert] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const clickShowPassword = () => {
        setShowPassword((prev) => (!prev));
    }
    const mouseDownPassword = (e) => {
        e.preventDefault();
    }

    const handleChange = (event) => {
        if (event.target.name === "emailAdmin") {
            setEmailValues(event.target.value);
        }
        else if (event.target.name === "password") {
            setPasswordValues(event.target.value);
        }
        else if (event.target.name === "name") {
            setNameValues(event.target.value);
        }
        else if (event.target.name === "orgName") {
            setOrgNameValues(event.target.value);
        }
        else if (event.target.name === "emailDomain") {
            setEmailDomainValues(event.target.value);
        }
        else if (event.target.name === "logo") {
            setLogoValues(event.target.value);
        }
    }

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
            name: NameValues,
            organizationName: OrgNameValues,
            emailDomain: EmailDomainValues,
            logo: LogoValues
        }

        axios.post('/organization/register', body)
            .then((res) => {
                console.log(res);
                if (res.status === 200 || res.status === 201) {
                    return history.push("/login/admin");
                } else {
                    alert("Failed");
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    setDomainAlert(true);
                }
            });
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
                            <img src={ImpediaLogo} className={classes.logo} alt="impedia-logo" />
                        </div>
                    </Link>
                    <Typography className={classes.formName} color="error">
                        Organisation Registration
                    </Typography>
                </div>
                <div className={classes.formWrapper}>
                    <div className={classes.formCover}>
                        <form className={classes.formContainer} onSubmit={submitFunction}>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="orgName">
                                        Organisation Name
                                    </InputLabel>
                                    <FilledInput
                                        required
                                        id="orgName"
                                        name="orgName"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="emailDomain">
                                        Email Domain (eg: razorpay.com)
                                        </InputLabel>
                                    <FilledInput
                                        required
                                        id="emailDomain"
                                        name="emailDomain"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.failureLoginAlert}>
                                <Collapse in={domainAlert}>
                                    <Alert
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setDomainAlert(false);
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
                                            This domain is not approved by the Admin for Members Registration.
                                    </Alert>
                                </Collapse>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="logo">
                                        Logo
                                    </InputLabel>
                                    <FilledInput
                                        id="logo"
                                        name="logo"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="name">
                                        Admin Name
                                    </InputLabel>
                                    <FilledInput
                                        required
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="emailAdmin">
                                        Admin Email
                                        </InputLabel>
                                    <FilledInput
                                        required
                                        id="emailAdmin"
                                        name="emailAdmin"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput} variant="filled" error>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <FilledInput
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={PasswordValues}
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
                            <div >
                                <Button className={classes.formButton} variant="contained" color="secondary" type="submit">
                                    Register
                                    </Button>
                            </div>
                        </form>
                    </div>
                    <div className={classes.loginImageContainer}>
                        <img src={LoginSidePic} alt="login-side" className={classes.loginImage} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminRegister;