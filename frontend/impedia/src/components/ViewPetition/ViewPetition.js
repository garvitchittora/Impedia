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
    Badge,
    FormControlLabel
} from '@material-ui/core';
import {
    Telegram as SendIcon,
    ThumbUp as UpvoteIcon,
    KeyboardArrowDown as DownIcon,
    ExpandLess as UpIcon,
    Create as SignIcon,
    Close as CloseIcon,
    Reply as ReplyIcon,
    Cancel as CancelIcon,
    ThumbUp as Support,
    ThumbDown as NoSupport
} from '@material-ui/icons';
import {
    Alert,
    AlertTitle
} from '@material-ui/lab';
import CommentBg from '../../assets/Comments/background.svg';
import ViewComments from '../Comments/ViewComments';
import axios from 'axios';
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
        [theme.breakpoints.down("md")]:{
            flexDirection:"column"
        }
    },
    mentions:{
        display:"flex",
        justifyContent:"space-around",
        fontWeight:"600",
        marginBottom:"20px",
        [theme.breakpoints.down("md")]:{
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
        [theme.breakpoints.down("md")]:{
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
        flex:"30%",
        minHeight:"70vh",
        margin:"0 10px",
        borderRadius:"10px",
        display:"flex",
        flexDirection:"column",
        alignSelf:"stretch",
        background: `url(${CommentBg})`,
        backgroundSize:"cover",
        maxHeight:"150vh",
        [theme.breakpoints.down("md")]:{
            maxHeight:"80vh",
            width:"90vw",
            margin:"5vh auto"
        }
    },
    commentHeading:{
        width:"80%",
        alignSelf:"flex-start",
        margin:"0 auto",
        padding:"10px",
        fontWeight:"800",
        textAlign:"center",
        borderBottom:"2px solid black"
    },
    comments:{
        alignSelf:"stretch"
    },
    newComment:{
        alignSelf:"flex-end",
        marginTop:"auto",
        fontWeight:"600",
        width:"100%"
    },
    replyingTo:{
        fontSize:"12px",
        backgroundColor:"rgba(174,174,174,0.6)",
        margin:"auto",
        borderTopLeftRadius:"10px",
        borderTopRightRadius:"10px",
        padding:"5px",
        overflow:"hidden",
        maxWidth:"350px",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis"
    },
    replyIcon:{
        fontSize:"12px"
    },
    replySectionNewComment:{
        display:"flex"
    },
    cancelReplyIcon:{
        cursor:"pointer"
    },
    supportOption:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        // backgroundColor:"#e2e2e2"
    },
    support:{
        color:"green"
    },
    nosupport:{
        color:"red"
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
    const [newComment, setNewComment] = useState("");
    const [supportValue, setSupportValue] = useState("support");
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState();

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

    useEffect(()=>{
        const Token = cookies.user['key'];
        const config = {
            headers: {
              authorization: Token,
            }
        }
        axios.get(`/petition/${petitionId}/replies`, config)
        .then(res=>res.data)
        .then(data=>{
            console.log(data);
            setComments(data);
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
        
        axios.post(`/petition/${petitionId}/sign`,{},config)
        .then(res=>{
            if(res.status === 200 || res.status === 201 || res.status===204){
                setSuccessAlert(true);
                setReload((prev)=>!prev);
            }
            else{
                setFailureAlert(true);
            }
        })
        
        
    }

    const submitComment = () => {
        const Token = cookies.user['key'];
            const config = {
                headers: {
                  Authorization: Token,
                }
            }
        const body={
            content:newComment,
            replyToId: replyTo ? replyTo.id : petitionId,
            support: supportValue === "support" ? true : false
        }

        axios.post(`/reply`,body,config)
        .then(res=>{
            if(res.status === 200 || res.status === 201 || res.status===204){
                setNewComment("");
                setReplyTo();
                setReload((prev)=>!prev);
            }
            // else{
            //     setFailureAlert(true);
            // }
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
                                FROM : <span className={classes.colored}>{`${data.petitionFromId.email || ""} | ${data.petitionFromId.name}`}</span>
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

                        <ViewComments className={classes.comments} comments={comments} setReplyTo={setReplyTo}/>

                        <div className={classes.newComment}>
                            {replyTo ? (<div className={classes.replySectionNewComment}>
                                <div className={classes.replyingTo}>
                                    <ReplyIcon className={classes.replyIcon}/> {`${replyTo.replyById['name']} | ${replyTo.content}`} 
                                </div>
                                <CancelIcon className={classes.cancelReplyIcon} onClick={() => {setReplyTo()}}/>
                            </div>) : ("") }

                            <TextField 
                            variant="filled"
                            fullWidth
                            label="New Comment"
                            error
                            multiline
                            rows={3}
                            rowsMax={5}
                            value={newComment}
                            onChange={(e)=>{setNewComment(e.target.value)}}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><SendIcon className={classes.sendIcon} onClick={submitComment}/></InputAdornment>,
                            }}
                            />

                            <div className={classes.supportOption} >
                                <FormControlLabel 
                                    value="support" 
                                    control={
                                        <Support 
                                            className={supportValue==="support"?classes.support:""}
                                            onClick={()=>{setSupportValue("support")}}
                                        />
                                    } 
                                />
                                <FormControlLabel 
                                    value="no-support" 
                                    control={
                                        <NoSupport 
                                            className={supportValue==="no-support"?classes.nosupport:""}
                                            onClick={()=>{setSupportValue("no-support")}}
                                        />
                                    } 
                                />
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    ))
}

export default ViewAppeal;