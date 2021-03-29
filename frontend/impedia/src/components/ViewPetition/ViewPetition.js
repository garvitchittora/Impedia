import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    TextField,
    InputAdornment,
    Collapse,
    Chip,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    Fab,
    IconButton,
    Badge
} from '@material-ui/core';
import {
    Telegram as SendIcon,
    ThumbUp as UpvoteIcon,
    KeyboardArrowDown as DownIcon,
    ExpandLess as UpIcon,
    Create as SignIcon,
    Close as CloseIcon,
    AirlineSeatReclineExtraOutlined
} from '@material-ui/icons';
import {
    Alert,
    AlertTitle
} from '@material-ui/lab';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopBar from '../TopBar/TopBar';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import {useCookies} from 'react-cookie';

const useStyles = makeStyles(theme => ({
    container:{
        margin:"2% 0"
    },
    Alert:{
        width:"80vw",
        position:"fixed",
        top:"5%",
        margin:"auto",
        left:"10vw",
        zIndex:"100"
    },
    body:{
        width:"95vw",
        margin:"40px auto 0",
        display:"flex",
        justifyContent:"space-around",
        alignItems:"flex-start",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column"
        }
    },
    mentions:{
        display:"flex",
        justifyContent:"space-around",
        fontWeight:"600",
        marginBottom:"20px",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column"
        }
    },
    colored:{
        color:"#FF1E56"
    },
    fromto:{
        backgroundColor:"#dddddd",
        padding:"20px",
        borderRadius:"20px",
        maxWidth:"500px",
        overflow:"hidden",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis",
        margin:"10px 0",
        textAlign:"center",
        [theme.breakpoints.down("xs")]:{
            maxWidth:"80vw"
        }
    },
    extrainfo:{
        margin:"0 10px",
        display:"flex",
        flexDirection:"column",
        fontWeight:"600"
    },
    date:{
        alignSelf:"flex-end"
    },
    APsection:{
        flex:"70%",
        margin:"0 10px",
        height:"100%",
        bottom:"0",
        [theme.breakpoints.down("sm")]:{
            width:"90vw"
        }
    },
    contentBody:{
        padding:"25px",
        border: "2px solid #E2E2E2",
        borderRadius:"20px",
        height:"100%"
    },
    title:{
        fontSize:"35px",
        fontWeight:"600",
        borderBottom:"4px solid #DDD"
    },
    content:{
        // height:"70vh",
        // overflow:"scroll"
    },
    commentsSection:{
        border:"2px solid #AAA",
        flex:"15%",
        minHeight:"70vh",
        margin:"0 10px",
        borderRadius:"10px",
        display:"flex",
        flexDirection:"column",
        alignSelf:"stretch",
        [theme.breakpoints.down("sm")]:{
            width:"90vw",
            margin:"5vh auto"
        }
    },
    commentHeading:{
        width:"80%",
        margin:"0 auto auto",
        padding:"10px",
        fontWeight:"800",
        textAlign:"center",
        borderBottom:"2px solid black"
    },
    newComment:{
        alignSelf:"flex-end"
    },
    sendIcon:{
        cursor:"pointer"
    },
    upvoteCount:{
        fontWeight:"600",
        display:"flex",
        alignItems:"center"
    },
    updownIcon:{
        cursor:"pointer"
    },
    chipLi:{
        display:"inline-block",
        margin:"10px 10px 0 0"
    },
    signeesDown:{
        margin:"5px 0",
        listStyle:"none"
    },
    signPetition:{
        position:"absolute",
        marginLeft:"-45px",
        marginTop:"-45px",
        // backgroundColor:"#FFAC41",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        cursor:"pointer",
        userSelect:"none"
    },
    signIcon:{
        // userSelect:"none",
        // '&:active':{
        //     userSelect:"none"
        // }
    }
}));

const ViewAppeal = (props) => {
    const classes = useStyles();

    const petitionId = props.routerProps.match.params.id;
    // console.log(appealId);
    const [cookies] = useCookies(['user']);
    const [data, setData] = useState([]);
    const [open,setOpen] = useState(false);
    const [signed, setSigned] = useState();
    const [signMsg, setSignMsg] = useState();
    const [actor, setActor] = useState();
    const [reload, setReload] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sucessAlert,setSuccessAlert] = useState(false);
    const [failureAlert,setFailureAlert] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
      };
    const handleDialogClose = () => {
        setDialogOpen(false);
      };

    const SigneeCard = (data) => {
        return (<li key={data.id} className={classes.chipLi}>
            <Chip
            //   icon={icon}
              label={data.email}
            //   onDelete={data.label === 'React' ? undefined : handleDelete(data)}
              className={classes.chip}
            />
        </li>)
    }

    const handleUpDown = () => {
        setOpen((prev)=>!prev);
    }

    useEffect(()=>{
        const Token = cookies.user['key'];
            const config = {
                headers: {
                  authorization: Token,
                }
            }
        axios.get(`/petition/${petitionId}`, config)
        .then(res=>res.data)
        .then(data=>{
            console.log(data);
            setData(data);
            setActor(cookies.user['type']);
            let userId = cookies.user['email'];
            let signeeMail = data.signees.map((signee)=>signee.email);
            if(signeeMail.findIndex((el) => el===userId) >=0 ){
                setSigned(true);
                setSignMsg("Signed");
            }else{
                setSigned(false);
                setSignMsg();
            }
        })
    },[reload])

    const submitSign = () => {
        handleDialogClose();
        const Token = cookies.user['key'];
            const config = {
                headers: {
                  Authorization: Token,
                }
            }
        console.log(config);
        
        axios.post(`/petition/${petitionId}/sign`,{},config)
        .then(res=>{
            if(res.status === 200 || res.status === 201 || res.status===204){
                setSuccessAlert(true);
                setReload(true);
            }
            else{
                setFailureAlert(true);
            }
        })
        
        
    }
    
    return (data.length === 0 ? ("Loading") : (
        <>
            <div className={classes.container}>
                {/* Alerts */}
                <div className={classes.Alert}>
                        <Collapse in={sucessAlert}>
                            <Alert
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setSuccessAlert(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            severity="success"
                            variant="filled"
                            >
                            <AlertTitle><strong>Successful !</strong></AlertTitle>
                                You signed for this Petition.
                            </Alert>
                        </Collapse>
                    </div>   

                    <div className={classes.Alert}>
                            <Collapse in={failureAlert}>
                                <Alert
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setFailureAlert(false);
                                    }}
                                    >
                                    <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                severity="error"
                                >
                                <AlertTitle><strong>Error !</strong></AlertTitle>
                                    Some Error occurred. Please try again.
                                </Alert>
                            </Collapse>
                        </div>       
                    {/* Alerts End */}
                <TopBar useCase="Petition" actor={actor} />

                <div className={classes.body} >
                    <div className={classes.APsection}>
                        <div className={classes.mentions}>
                            <div className={classes.fromto}>
                                FROM : <span className={classes.colored}>{`${data.petitionFromId.email} | ${data.petitionFromId.name}`}</span>
                            </div>
                            <div className={classes.fromto}>
                                TO : <span className={classes.colored}>{`${data.petitionToId.email||"Group"} | ${data.petitionToId.name}`}</span>
                            </div>
                        </div>
                        <div className={classes.extrainfo}>
                            <div className={classes.signees}>
                                <div className={classes.upvoteCount}>
                                    <UpvoteIcon /> &nbsp; {data.signees.length} &nbsp; &nbsp; {open? <UpIcon className={classes.updownIcon} onClick={handleUpDown}/> : <DownIcon className={classes.updownIcon} onClick={handleUpDown}/>}
                                </div>
                                <Collapse in={open} timeout="auto" unmountOnExit className={classes.signeesDown}>
                                    {data.signees.map(SigneeCard)}
                                </Collapse>
                            </div>
                            <div className={classes.date}>
                                {new Date(data.dateTime).toLocaleString()}
                            </div>
                        </div>
                        <div className={classes.contentBody}>
                                {actor === "STUDENT" && (
                                <Badge badgeContent={signMsg} color="error">
                                    <Fab color="secondary" disabled={signed} aria-label="edit" className={classes.signPetition} onClick={handleDialogOpen}>
                                        <SignIcon className={classes.signIcon}/>
                                    </Fab>
                                </Badge>
                                )}
                            <Dialog
                                open={dialogOpen}
                                onClose={handleDialogClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Are you sure you want to sign this petition?"}</DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Once you sign a petition, you cannot unsign it! Note that you will be visible publicly in the Signees List. 
                                    Click on Agree if you wish to continue.
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleDialogClose} color="secondary">
                                    Disagree
                                </Button>
                                <Button onClick={submitSign} color="secondary" autoFocus>
                                    Agree
                                </Button>
                                </DialogActions>
                            </Dialog>
                            <div className={classes.title}>
                                {data.title}
                            </div>
                            <div className={classes.content}>
                                <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={data.content} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.commentsSection}>
                        <div className={classes.commentHeading}>
                            COMMENTS
                        </div>
                        <TextField 
                            className={classes.newComment} 
                            variant="filled"
                            fullWidth
                            label="New Comment"
                            error
                            multiline
                            rows={3}
                            rowsMax={5}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><SendIcon className={classes.sendIcon}/></InputAdornment>,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    ))
}

export default ViewAppeal;