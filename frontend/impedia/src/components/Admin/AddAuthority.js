import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Button,
    TextField
} from '@material-ui/core';
import {
    Autocomplete,
    createFilterOptions
} from '@material-ui/lab';
import axios from 'axios';
import DomainPic from '../../assets/Admin/addAuthoritiesPage.svg';
import addAuthIcon from '../../assets/Admin/addAuth.svg';
import TopBar from '../TopBar/TopBar';
import {useCookies} from 'react-cookie';
import  { useHistory} from 'react-router-dom';
import SuccessAlert from '../Alert/SuccessAlert';
import ErrorAlert from '../Alert/ErrorAlert';

const filter = createFilterOptions();


const useStyles = makeStyles(theme => ({
    setDomainPage:{
        margin: "2% 0"
    },
    Domainbody:{
        display:"flex",
        width:"90%",
        margin:"5% auto",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column",
            margin:"15% auto",
        }
    },
    group:{
        background:"red"
    },
    domainArea:{
        flex:"50%",
        display:"flex",
        flexWrap:"wrap",
        alignItems:"center"
    },
    domainTextArea:{
        flex:"100%",
        display:"flex",
        alignItems:"center",
    },
    textField:{
        width: "90% !important",
        margin:"auto 5%",
    },
    domainIcon:{
        width:"100px",
        backgroundColor:"#FFAC41",
        padding:"20px",
        borderRadius:"25px",
        [theme.breakpoints.down("md")]:{
           width:"50px"
        },
        [theme.breakpoints.down("sm")]:{
            display:"none"
         }
    },
    button:{
        margin:"auto",
        [theme.breakpoints.down("sm")]:{
            margin:"2% auto"
         }
    },
    submitButton:{
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        width:"200px",
        fontWeight:"800",
        padding:"5%",
        fontSize:"16px"
    },
    sidePic:{
        flex:"50%",
        textAlign:"center",
        [theme.breakpoints.down("sm")]:{
            margin:"5% auto"
        }
    },
    domainPic:{
        maxWidth:"100%"
    },
    labelColor:{
        color:"rgb(244, 67, 54)"
    },
    formWrapper:{
        width:"100%"
    }

}));

const AddAuthority = () => {
    const classes = useStyles();
    const [cookies] = useCookies(['user']);
    const [authEmails, setAuthEmails] = useState([]);
    const history = useHistory();

    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if(! cookies.user || cookies.user["type"] !== "ADMIN"){
            return history.push("/login/admin");
        }
    }, []);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            emailIds: authEmails.map((id)=>{
                if(id.inputValue){
                    return id.inputValue;
                }
                else{
                    return id;
                }
            }),
        }
        console.log(body);
        const Token = cookies.user['key'];
        const config = {
            headers: {
              authorization: Token,
            }
        }

        axios.post(`/admin/addauthorities`,body,config)
        .then((res)=>{
            console.log(res);
            if(res.status === 200 || res.status === 201){
                setAuthEmails([]);
                setAlertMessage("Authorities added Successfully !")
                setOpenSuccessAlert(true);
            }else{
                setAlertMessage("There was some error ! Please try again")
                setOpenErrorAlert(true);
            } 
        })
        .catch((err)=>{
            console.log(err.response.data);
            if(err.response.status === 400){
                setAlertMessage("One or more emails in the list already exist !")
                setOpenErrorAlert(true)
            }
            else{
                setAlertMessage("There was some error ! Please try again")
                setOpenErrorAlert(true);
            }
        });
        setReload((prev)=>!prev);
    }

    console.log(authEmails);

    return (
        <>
            <div className={classes.setDomainPage}>
                <SuccessAlert open={openSuccessAlert} setOpen={setOpenSuccessAlert} message={alertMessage} />
                <ErrorAlert open={openErrorAlert} setOpen={setOpenErrorAlert} message={alertMessage} />
                <TopBar useCase="Add Authority" actor="ADMIN"/>

                <div className={classes.Domainbody}>
                    <div className={classes.domainArea}>
                        <div className={classes.formWrapper}>
                            <div className={classes.domainTextArea}>
                                <div className={classes.icon} >
                                    <img src={addAuthIcon} alt="doamin" className={classes.domainIcon} />
                                </div>
                                    <Autocomplete
                                        className={classes.textField}
                                        fullWidth
                                        multiple
                                        key={reload}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
                                            if (typeof newValue === 'string') {
                                                setAuthEmails(newValue);
                                            } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                                setAuthEmails(newValue.inputValue);
                                            } else {
                                                setAuthEmails(newValue);
                                            }
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            // Suggest the creation of a new value
                                            if (params.inputValue !== '') {
                                            filtered.push({
                                                inputValue: params.inputValue,
                                                title: `Add "${params.inputValue}"`,
                                            });
                                            }

                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        handleHomeEndKeys
                                        id="tags-filled"
                                        options={[]}
                                        getOptionLabel={(option) => {
                                            // Value selected with enter, right from the input
                                            if (typeof option === 'string') {
                                            return option;
                                            }
                                            // Add "xxx" option created dynamically
                                            if (option.inputValue) {
                                            return option.inputValue;
                                            }
                                            // Regular option
                                            return option;
                                        }}
                                        renderOption={(option) => option.title}
                                        style={{ width: 300 }}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField 
                                                error 
                                                fullWidth 
                                                {...params} 
                                                label="Add Authorities" 
                                                variant="filled" 
                                                multiline
                                                rowsMax={10}
                                                helperText={`Type the email ID and click on 'Add ... or press Enter' |\n Multiple IDs allowed*`}
                                            />
                                        )}
                                        />
                            </div>
                        </div>
                        
                        <div className={classes.button}>
                            <Button variant="contained" className={classes.submitButton} onClick={submitFunction}>
                                ADD
                            </Button>
                        </div>
                    </div>
                    

                    <div className={classes.sidePic}>
                        <img src={DomainPic} className={classes.domainPic} alt="Set/Update Domain" />
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default AddAuthority;