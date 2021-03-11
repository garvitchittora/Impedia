import React from 'react';
import {
    makeStyles,
    Grid,
    FormControl,
    InputLabel,
    Input,
    Button,
    Typography,
} from '@material-ui/core';
import { baseUrl } from '../../urlConstants';

const useStyles = makeStyles(theme => ({
    formName: {
        color: "red",
        fontSize: "25px",
        textAlign: "center",
        padding: "30px 0",
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
        width: "90vw",
        maxWidth: "30rem",
        margin: "auto"
    },
    formWrapper: {
        border: "1px solid #B0B0B0",
        display: "flex",
        padding: "5%",
        alignItems: "center",
        borderRadius: "15px",
        maxWidth: "70%",
        margin: "auto",
        marginBottom:"30px",
    },
    formInputs: {
        padding: "10px",
        width: "100%"
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
    blacklogo: {
        color: "black"
    },
    yellowLogo: {
        color: "red"
    }

}));

const StudentRegister = () => {
    const classes = useStyles();

    const [EmailValues, setEmailValues] = React.useState('');
    const [SemValues, setSemValues] = React.useState('');
    const [SectionValues, setSectionValues] = React.useState('');
    const [BranchValues, setBranchValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');
    const [NameValues, setNameValues] = React.useState('');

    const handleChange = (event) => {
        if (event.target.name === "email") {
            setEmailValues(event.target.value);
        }
        else if (event.target.name === "sem") {
            setSemValues(event.target.value);
        }
        else if (event.target.name === "section") {
            setSectionValues(event.target.value);
        }
        else if (event.target.name === "branch") {
            setBranchValues(event.target.value);
        }
        else if (event.target.name === "password") {
            setPasswordValues(event.target.value);
        }
        else if (event.target.name === "name") {
            setNameValues(event.target.value);
        }
    }

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
            semester:SemValues,
            branch:BranchValues,
            section:SectionValues,
            name:NameValues,
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${baseUrl}/student/register`, requestOptions);
        const data = await response.json();
        console.log(data);
    }

    return (
        <>
            <Grid container justify="center" className={classes.GridContainerWrapper}>
                <Grid item xs={12} md={6} className={classes.textCenter}>
                    <img src="/image/login.svg" alt="login"/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div>
                        <div className={classes.textCenter}>
                            <Typography className={classes.logoStyle}>
                                <span className={classes.blacklogo}>Impe</span><span className={classes.yellowLogo}>dia</span>
                            </Typography>
                        </div>
                        <Grid item>
                            <Typography className={classes.formName}>
                                Student Registration
                            </Typography>
                        </Grid>
                    </div>
                    <div className={classes.formWrapper}>
                        <form className={classes.formContainer} onSubmit={submitFunction}>

                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="email">
                                        Email
        </InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="sem">
                                        Sem
        </InputLabel>
                                    <Input
                                        id="sem"
                                        name="sem"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="section">
                                        Section
        </InputLabel>
                                    <Input
                                        id="section"
                                        name="section"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="branch">
                                        Branch
        </InputLabel>
                                    <Input
                                        id="branch"
                                        name="branch"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="name">
                                        Name
        </InputLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.formInputs}>
                                <FormControl className={classes.fieldInput}>
                                    <InputLabel htmlFor="password">
                                        Password
        </InputLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        onChange={handleChange}
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
                </Grid>
            </Grid>
        </>
    )
}

export default StudentRegister;