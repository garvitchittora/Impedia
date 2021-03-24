import React, { useEffect, useState } from 'react';
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
    IconButton
} from '@material-ui/core';
import {
    Autocomplete,
    Alert,
    AlertTitle
} from '@material-ui/lab';
import {
    Close as CloseIcon
 } from '@material-ui/icons';
import axios from 'axios';
import TopBar from '../TopBar/TopBar';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';


const useStyles = makeStyles(theme => ({
    createAppealPage:{
        margin:"2% 0"
    },
    appealSuccessAlert:{
        width:"80vw",
        position:"fixed",
        top:"5%",
        margin:"auto",
        left:"10vw",
        zIndex:"100"
    },
    editor:{
        width:"95vw",
        maxWidth:"1200px",
        margin:"5% auto",
    },
    markdownEditor:{
        marginTop:"20px",
        border:" 2px solid #E2E2E2",
        borderRadius: "10px",
        padding: "10px"
    },
    inputs:{
        margin:"2% 0"
    },
    previewMD:{
        marginTop:"20px",
        border:" 2px solid #E2E2E2",
        borderRadius: "10px",
        padding: "10px"
    },
    previewTitle:{
        fontWeight:"600",
        fontSize:"35px"
    },
    appealTo:{
        margin:"50px auto"
    },
    appealToText:{
        textAlign:"center",
        fontWeight:"600",
        fontSize:"20px"
    },
    appealToOptions:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center"
    },
    appealOption:{
        margin:"10px 40px"
    },
    optionSelectorDisabled:{
        opacity:"0.4"
    },
    button:{
        margin:"auto",
        [theme.breakpoints.down("sm")]:{
            margin:"2% auto"
         },
         textAlign:"center"
    },
    submitButton:{
        background: "linear-gradient(85.98deg, #FFA41B 0.54%, rgba(255, 30, 86, 0.99) 130.83%)",
        width:"200px",
        fontWeight:"800",
        padding:"1%",
        fontSize:"16px"
    },
    appealFailureAlert:{
        width:"60vw",
        margin:"auto",
        left:"20vw",
        zIndex:"100",
        marginBottom:"10px"
    }
}));

const CreateAppeal = () => {
    const classes = useStyles();

    const [openAlert, setOpenAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);

    const [newAppeal, setNewAppeal] = useState({
        title:"Sample Title",
        content:"Sample Content"
    })
    const [value, setValue] = useState(0);

    const [appealTo, setAppealTo] = useState("");

    const[sendToId,setId] = useState();

    const [openGroup, setOpenGroup] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const [optionsGroup, setOptionsGroup] = useState([]);
    const [optionsAuth, setOptionsAuth] = useState([]);
    const loadingGroup = openGroup && optionsGroup.length === 0;
    const loadingAuth = openAuth && optionsAuth.length === 0;

    useEffect(() => {
        let active = true;
        
        if (loadingGroup === true) {
          return undefined;
        }
    
        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }
            const res = await axios.get("/group", config)
            const dataGroups = res.data;
    
            if (active) {
                setOptionsGroup(() => {
                    return dataGroups.map((option) => {
                        let firstLetter = option.name[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            ...option,
                        }
                    })
                });
            }
        })();
    
        return () => {
          active = false;
        };
    }, [loadingGroup]);

    useEffect( ()=>{
        let active = true;

        if (loadingAuth === true) {
            return undefined;
          }

        (async () => {
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }
            const res = await axios.get("/authority", config)
            const dataAuth = res.data;
            if (active) {
                setOptionsAuth(() => {
                    return dataAuth.map((option) => {
                        let firstLetter = option.email[0].toUpperCase();
                        return {
                            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                            optionName: typeof option.name!=="undefined" ? (option.name + " | " + option.email) : (option.email) ,
                            ...option,
                        }
                    })
                });
            }
        })();

        return () => {
            active = false;
          };
    },[loadingAuth])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const handleAppealToChange = (e) => {
        setAppealTo(e.target.value);
    }

    const handleAppealChange = (e) => {
        if(e.target.id==="appeal-title"){
            setNewAppeal((prev)=> ({
                ...prev,
                title: e.target.value
            }))
        }
        if(e.target.id==="appeal-content"){
            setNewAppeal((prev)=> ({
                ...prev,
                content: e.target.value
            }))
        }
    }

    const submitFunction = (e) => {
        e.preventDefault();

        if(typeof sendToId !== "undefined" && sendToId !== null){
            const AdminToken = localStorage.getItem("key");
            const config = {
                headers: {
                  authorization: AdminToken,
                }
            }

            const body = {
                ...newAppeal,
                petitionToId: sendToId.id,
            }

            axios.post("/student/createpetition", body, config)
            .then((res) => {
                console.log(res);
                if(res.status === 201){
                    setOpenAlert(true);
                }
            })
        }
        else{
            setOpenErrorAlert(true);
        }
    }   

    return (
        <>
           <div className={classes.createAppealPage} >
                <div className={classes.appealSuccessAlert}>
                    <Collapse in={openAlert}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenAlert(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity="success"
                        variant="filled"
                        >
                        <AlertTitle><strong>Successful !</strong></AlertTitle>
                            Your Petition was sent
                        </Alert>
                    </Collapse>
                </div>                
               <TopBar actor="STUDENT" useCase="Create Petition" />

                <div className={classes.appealTo}>
                    <Typography className={classes.appealToText}>
                        Make Petition To :
                    </Typography>
                    <div >

                    <RadioGroup className={classes.appealToOptions} aria-label="Appeal-To" name="appealTo" value={appealTo} onChange={handleAppealToChange}>
                        <div className={classes.appealOption}>
                            <FormControlLabel value="Group" control={<Radio />} label="Group" />
                                <Autocomplete
                                    id="authority-groups"
                                    style={{ width: 300 }}
                                    disabled={appealTo!=="Group"}
                                    open={openGroup}
                                    onOpen={() => {
                                    setOpenGroup(true);
                                    }}
                                    onClose={() => {
                                    setOpenGroup(false);
                                    }}
                                    getOptionSelected={(option, value) => option.name === value.name}
                                    getOptionLabel={(option) => option.name}
                                    loading={loadingGroup}
                                    options={optionsGroup.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={(option) => option.firstLetter}
                                    onChange={(e,v)=>{setId(v)}}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error
                                        label="Authority Groups"
                                        variant="filled"
                                        className={appealTo!=="Group" ? classes.optionSelectorDisabled : ""}
                                        InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                            {loadingGroup ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                        }}
                                    />
                                    )}
                                />
                        </div>

                        <div className={classes.appealOption}>
                            <FormControlLabel value="Single Authority" control={<Radio />} label="Single Authority" />
                                <Autocomplete
                                    id="authority"
                                    style={{ width: 300 }}
                                    disabled={appealTo!=="Single Authority"}
                                    open={openAuth}
                                    onOpen={() => {
                                    setOpenAuth(true);
                                    }}
                                    onClose={() => {
                                    setOpenAuth(false);
                                    }}
                                    getOptionSelected={(option, value) => option.optionName === value.optionName}
                                    getOptionLabel={(option) => option.optionName}
                                    loading={loadingAuth}
                                    options={optionsAuth.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={(option) => option.firstLetter}
                                    onChange={(e,v)=>{setId(v)}}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error
                                        label="Authority"
                                        variant="filled"
                                        className={appealTo!=="Single Authority" ? classes.optionSelectorDisabled : ""}
                                        InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                            {loadingGroup ? <CircularProgress color="inherit" size={20} /> : null}
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

                    <div className={classes.appealFailureAlert}>
                        <Collapse in={openErrorAlert}>
                            <Alert
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenErrorAlert(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            severity="error"
                            >
                            <AlertTitle><strong>Error !</strong></AlertTitle>
                                Please select someone to send the Petition to
                            </Alert>
                        </Collapse>
                    </div>       
                </div>
               

           <div className={classes.editor} >
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
                            id="appeal-title"
                            label="Title"
                            value={newAppeal.title}
                            onChange={handleAppealChange}
                            fullWidth
                            className={classes.inputs}
                        />

                        <TextField 
                            error
                            variant="filled"
                            id="appeal-content"
                            label="Content"
                            multiline
                            rows={15}
                            value={newAppeal.content}
                            onChange={handleAppealChange}
                            fullWidth
                            className={classes.inputs}
                            helperText="*Markdown and HTML Supported"
                        />
                    </div>
                )}
                {value === 1 && (
                    <div className={classes.previewMD}>
                        <Typography className={classes.previewTitle}>
                            {newAppeal.title}
                        </Typography>
                        <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={newAppeal.content} />
                    </div>
                )}
           </div>

           <div className={classes.appealFailureAlert}>
                <Collapse in={openErrorAlert}>
                    <Alert
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenErrorAlert(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="error"
                    >
                    <AlertTitle><strong>Error !</strong></AlertTitle>
                        Please select someone to send the Petition to
                    </Alert>
                </Collapse>
            </div>  

           <div className={classes.button}>
                <Button variant="contained" className={classes.submitButton} onClick={submitFunction}>
                     CREATE PETITION
                </Button>
            </div>
           
           </div>
        </>
    )
}

export default CreateAppeal;