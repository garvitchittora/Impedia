import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    TextField,
    InputAdornment
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Telegram';
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
        flex:"25%",
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
    }
}));

const ViewAppeal = (props) => {
    const classes = useStyles();

    const appealId = props.routerProps.match.params.id;
    console.log(appealId);

    const [data, setData] = useState([]);
    const [cookies] = useCookies(['user']);

    useEffect(()=>{
        const Token = cookies.user['key'];
            const config = {
                headers: {
                  authorization: Token,
                }
            }
        axios.get(`/appeal/${appealId}`, config)
        .then(res=>res.data)
        .then(data=>{
            console.log(data);
            setData(data);
        })
    },[])
    
    return (data.length === 0 ? ("Loading") : (
        <>
            <div className={classes.container}>
                <TopBar useCase="Appeal" actor={cookies.user['type']}/>

                <div className={classes.body} >
                    <div className={classes.APsection}>
                        <div className={classes.mentions}>
                            <div className={classes.fromto}>
                                FROM : <span className={classes.colored}>{`${data.appealFromId.email} | ${data.appealFromId.name}`}</span>
                            </div>
                            <div className={classes.fromto}>
                                TO : <span className={classes.colored}>{`${data.appealToId.email||"Group"} | ${data.appealToId.name}`}</span>
                            </div>
                        </div>
                        <div className={classes.extrainfo}>
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