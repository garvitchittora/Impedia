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
        fontSize: "25px"
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "90vw",
        maxWidth: "30rem"
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
    }
}));

const StudentLogin = () => {
    const classes = useStyles();
    
    const [EmailValues,setEmailValues] = React.useState('');
    const [PasswordValues,setPasswordValues] = React.useState('');

    const handleChange = (event) => {
        if(event.target.name === "email"){
            setEmailValues(event.target.value);
        }
        else if(event.target.name === "password"){
            setPasswordValues(event.target.value);
        }
    }
    
    const submitFunction = async (e) => {
        e.preventDefault();
        
        const body = { 
            email: EmailValues,
            password: PasswordValues,
        }

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${baseUrl}/admin/auth`, requestOptions);
        const data = await response.json();
        console.log(data);    
    }

    return (
        
        <Grid container direction="column" justify="center" spacing={5} alignItems="center">
            <Grid item>
                <Typography className={classes.formName}>
                    Student Login
                </Typography>
            </Grid>
            <Grid item>
                <form className={classes.formContainer} onSubmit={submitFunction}>

                    <div className={classes.formInputs}>
                        <FormControl className={classes.fieldInput}>
                            <InputLabel htmlFor="name">
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
                            <InputLabel htmlFor="name">
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
                            Login
                        </Button>
                    </div>
                </form>
            </Grid>
        </Grid>
    )
}

export default StudentLogin;
