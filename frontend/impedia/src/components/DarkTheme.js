import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Button,
    Grow,
    Paper 
} from '@material-ui/core'
import {
    Brightness5 as Light,
    Brightness4 as Dark
} from '@material-ui/icons';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
    button:{
        position:"absolute",
        right:"0",
        top:"130px",
        zIndex:"3000",
        // border: "2px solid black",
        // borderRadius:"10px"
    },
    paper:{
        position:"absolute",
        right:"0",
        top:"160px",
        zIndex:"3000",
        padding:"5px"
    }
  }));

const DarkTheme = () => {
    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['theme']);
    const [hover,setHover] = useState(false);

    const addClass = () => {
        let body = document.body;
        body.classList.add("dark");
    }
    const removeClass = () => {
        let body = document.body;
        body.classList.remove("dark");
    }
    
    useEffect(()=> {
        if(!cookies.theme){
            setCookie("theme","light",{path: "/"});
        }
        if(cookies.theme==="dark"){
            addClass();
        }
    },[])

    const enterText= () => {
        setHover(true);
    }
    const deleteText= () => {
        setHover(false);
    }

    const changeTheme = (e) => {
        let body = document.body;
        let inputs = document.getElementsByTagName("input");
        let textareas = document.getElementsByTagName("textarea");
        console.log(textareas);
        console.log(inputs);
        if(cookies.theme === "light"){
            setCookie('theme', "dark");
            addClass();
        }
        else{
            setCookie('theme', "light");
            removeClass();
        }
    }

    return (
        <div>
            <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={cookies.theme==="light"?<Light />:<Dark />}
            onMouseEnter={enterText}
            onMouseLeave={deleteText}
            onClick={changeTheme}
            >
            </Button>
            <Grow direction="down" in={hover} mountOnEnter unmountOnExit>
            <Paper elevation={10} className={classes.paper}>
                {cookies.theme==="dark"?"Dark":"Light"} Theme
            </Paper>
            </Grow>
        </div>
    )
}

export default DarkTheme;