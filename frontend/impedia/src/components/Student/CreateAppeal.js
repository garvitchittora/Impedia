import React from 'react';
import {
    makeStyles,
    TextField,
    Tabs,
    Tab,
    AppBar,
    Typography
} from '@material-ui/core';
import axios from 'axios';
import TopBar from '../TopBar/TopBar';
import ReactMarkdown from 'react-markdown/with-html';
// const gfm = require('remark-gfm')
import gfm from 'remark-gfm';


const useStyles = makeStyles(theme => ({
    createAppealPage:{
        margin:"2% 0"
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
    }
}));

const CreateAppeal = () => {
    const classes = useStyles();

    const [newAppeal, setNewAppeal] = React.useState({
        title:"",
        content:""
    })
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };

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
    return (
        <>
           <div className={classes.createAppealPage} >
               <TopBar actor="STUDENT" useCase="Create Appeal" />

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
           
           </div>
        </>
    )
}

export default CreateAppeal;