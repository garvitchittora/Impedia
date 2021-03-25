import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    TextField,
    InputAdornment,
    Collapse,
    Chip
} from '@material-ui/core';
import {
    Telegram as SendIcon,
    ThumbUp as UpvoteIcon,
    KeyboardArrowDown as DownIcon,
    ExpandLess as UpIcon
} from '@material-ui/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopBar from '../TopBar/TopBar';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles(theme => ({
    container:{
        margin:"2% 0"
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
        height:"70vh",
        margin:"0 10px",
        borderRadius:"10px",
        display:"flex",
        flexDirection:"column",
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
    signeesDown:{
        margin:"5px 0",
        listStyle:"none"
    }
}));

const ViewAppeal = (props) => {
    const classes = useStyles();

    const petitionId = props.routerProps.match.params.id;
    // console.log(appealId);

    const [data, setData] = useState([]);
    const [open,setOpen] = useState(false);

    const SigneeCard = (data) => {
        return (<li key={data.id}>
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
        const Token = localStorage.getItem("key");
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
        })
    },[])
    
    return (data.length === 0 ? ("Loading") : (
        <>
            <div className={classes.container}>
                <TopBar useCase="Petition" />

                <div className={classes.body} >
                    <div className={classes.APsection}>
                        <div className={classes.mentions}>
                            <div className={classes.fromto}>
                                FROM : <span className={classes.colored}>{`${data.petitionFromId.email} | ${data.petitionFromId.name}`}</span>
                            </div>
                            <div className={classes.fromto}>
                                TO : <span className={classes.colored}>{`${data.petitionToId.email} | ${data.petitionToId.name}`}</span>
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