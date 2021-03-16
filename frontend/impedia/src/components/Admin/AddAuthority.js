import React from 'react';
import axios from 'axios';
import {
    makeStyles,
    Typography,
    FormControl,
    InputLabel,
    Button,
    FilledInput,
} from '@material-ui/core';
import back1 from '../../assets/Login/login-1.svg';
import back2 from '../../assets/Login/login-2.svg';
import back3 from '../../assets/Login/login-3(2).svg';
import ImpediaLogo from '../../assets/Logo-Impedia.png';
import LoginSidePic from '../../assets/Login/loginSidePic.svg';
import { baseUrl } from '../../urlConstants';

const useStyles = makeStyles(theme => ({
    loginPage: {
        position: "absolute",
        height:"100%",
        width:"100%",
        overflowX: "hidden",
    },
    bg1: {
        position:"absolute",
        height:"25vh",
        left:"-2%",
        top:"-2%",
        zIndex:"-1",
        [theme.breakpoints.down("xs")]: {
            top:"-12%",
            left:"-15%",
          }
    },
    bg2:{
        position:"absolute",
        right:"0",
        top:"-5%",
        height:"35vh",
        zIndex:"-1",
        [theme.breakpoints.down("xs")]: {
            top:"-12%",
            right:"-10%",
          }
    },
    bg3:{
        position:"absolute",
        left:"0",
        right:"0",
        marginLeft:"auto",
        marginRight:"auto",
        bottom:"-30%",
        height:"15vh",
        zIndex:"-1"
    },
    logo:{
        width:"300px"
    },
    loginContainer:{
        width:"95vw",
        margin:"5% auto",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column",
        verticalAlign:"middle",
        position:"absolute",
        left:"2.5vw",
        [theme.breakpoints.down("xs")]: {
            top:"10vh",
          }
    },
    formName: {
        fontSize: "25px",
        textAlign:"center",
        padding:"5px 0",
        fontWeight: "600"
    },
    logoStyle:{
        color: "red",
        fontSize: "40px",
        textAlign:"center",
        fontWeight:"bold",
    },
    GridContainerWrapper:{
        paddingTop:"30px"
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
        maxWidth:"1200px",
        display: "flex",
        padding: "2% 3%",
        alignItems: "center",
        borderRadius: "15px",
        margin: "0",
        marginBottom:"30px",
    },
    formCover:{
        flex:"50%"
    },
    formInputs: {
        padding: "10px",
        width: "100%",
        maxWidth:"80vw"
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
    textCenter:{
        textAlign:"center",
    },
    loginImageContainer:{
        flex:"35%"
    },
    loginImage:{
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            display:"none",
          }
    }

}));

const StudentRegister = () => {
    const classes = useStyles();

    const [EmailValues, setEmailValues] = React.useState('');

    const handleChange = (event) => {
        if (event.target.name === "email") {
            setEmailValues(event.target.value);
        }
    }

    const submitFunction = async (e) => {
        e.preventDefault();
        
        let emailArray = EmailValues.replaceAll(" ","").split(",");

        const body = {
            emailIds: emailArray,
        }
        const AdminToken = localStorage.getItem("key");
        const config = {
            headers: {
              authorization: AdminToken,
            }
        }

        console.log(body)

        axios.post(`/admin/addauthorities`,body,config)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return (
    <div className={classes.loginPage}>
            <img src={back1} className={classes.bg1} alt="login-bg-1"/>
            <img src={back2} className={classes.bg2} alt="login-bg-2"/>
            <img src={back3} className={classes.bg3} alt="login-bg-3"/>

                <div className={classes.loginContainer}>
                    <div>
                        <div className={classes.textCenter}>
                            <img src={ImpediaLogo} className={classes.logo} alt="impedia-logo" />
                        </div>
            
                            <Typography className={classes.formName} color="error">
                                Add Authority
                            </Typography>
                    </div>
                    <div className={classes.formWrapper}>
                        <div className={classes.formCover}>
                            <form className={classes.formContainer} onSubmit={submitFunction}>
                                <div className={classes.formInputs}>
                                    <FormControl className={classes.fieldInput} variant="filled">
                                        <InputLabel htmlFor="email">
                                            Emails
                                        </InputLabel>

                                        <FilledInput
                                            id="email"
                                            name="email"
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </div>
                                <p>* for multiple emails type emails separate by comma(,)</p>
                                <div >
                                    <Button className={classes.formButton} variant="contained" color="secondary" type="submit">
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className={classes.loginImageContainer}>
                            <img src = {LoginSidePic} alt="login-side" className={classes.loginImage}/>
                        </div>
                    </div>
                </div>

        </div>
    )
}

export default StudentRegister;