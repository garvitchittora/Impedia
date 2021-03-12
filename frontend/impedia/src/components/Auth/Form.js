// import React, { useState } from 'react';
// import {
//     makeStyles,
//     FormControl,
//     InputLabel,
//     Button,
//     Typography,
//     InputAdornment,
//     IconButton,
//     FilledInput,
//     Select,
//     MenuItem
// } from '@material-ui/core';
// import {
//     Visibility,
//     VisibilityOff
//  } from '@material-ui/icons';
// import LoginSidePic from '../../assets/loginSidePic.svg';

// const useStyles = makeStyles(theme => ({
//     loginContainer:{
//         width:"95vw",
//         height:"100vh",
//         margin:"auto",
//         display:"flex",
//         alignItems:"center",
//         justifyContent:"center",
//         flexDirection:"column",
//         verticalAlign:"middle",
//         position:"absolute",
//         // top:"50vh",
//         left:"2.5vw"
//     },
//     formName: {
//         color: "red",
//         fontSize: "25px",
//         textAlign:"center",
//         padding:"5px 0",
//     },
//     logoStyle:{
//         color: "red",
//         fontSize: "40px",
//         textAlign:"center",
//         fontWeight:"bold",
//     },
//     GridContainerWrapper:{
//         paddingTop:"30px"
//     },
//     formContainer: {
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         width: "95vw",
//         maxWidth: "30rem",
//         margin: "auto"
//     },
//     formWrapper: {
//         border: "1px solid #B0B0B0",
//         display: "flex",
//         padding: "2% 1%",
//         alignItems: "center",
//         borderRadius: "15px",
//         margin: "0",
//         marginBottom:"30px",
//     },
//     formCover:{
//         flex:"60%"
//     },
//     formInputs: {
//         padding: "10px",
//         width: "100%",
//         maxWidth:"80vw"
//     },
//     fieldInput: {
//         width: "100%"
//     },
//     forgotButton: {
//         width: "15rem",
//         padding: "2%"
//     },
//     passwordInput: {
//         width: "100%"
//     },
//     formButton: {
//         width: "15rem",
//         maxWidth: "90vw",
//         margin: "15% auto"
//     },
//     profileAvatar: {
//         width: theme.spacing(12),
//         height: theme.spacing(12),
//         borderRadius: "100px"
//     },
//     profileInputLabel: {
//         padding: "0px",
//         height: "16px",
//         width: "16px"
//     },
//     profileInputBadge: {
//         cursor: "pointer",
//         fontSize: "16px"
//     },
//     profileInputField: {
//         display: "none"
//     },
//     textCenter:{
//         textAlign:"center",
//     },
//     loginImageContainer:{
//         flex:"35%"
//     },
//     loginImage:{
//         // flex:"15%"
//         // height: "20vh",
//         width: "100%"
//     }
// }));

// const Form = (props) => {
//     const classes = useStyles();

//     const [showPassword, setShowPassword] = useState(false);
//     const [age,setActorValue] = useState("Admin");

//     const clickShowPassword = () => {
//         setShowPassword((prev)=>(!prev));
//     }
//     const mouseDownPassword = (e) => {
//         e.preventDefault();
//     }

//     const handleIAMChange = (e) => {
//         setActorValue(e.target.value);
//     }

//     const handleChange = (event) => {
//         if (event.target.name === "email") {
//             props.setEmailValues(event.target.value);
//         }
//         else if (event.target.name === "password") {
//             props.setPasswordValues(event.target.value);
//         }
//     }

//     return(
//             <div className={classes.formWrapper}>
//                 <div className={classes.formCover}>
//                 <form className={classes.formContainer} onSubmit={props.submitFunction}>
//                     <div className={classes.formInputs}>
//                     <FormControl className={classes.fieldInput} variant="filled" className={classes.formControl}>
//                         <InputLabel id="demo-simple-select-filled-label">I am</InputLabel>
//                         <Select
//                         labelId="demo-simple-select-filled-label"
//                         id="demo-simple-select-filled"
//                         value={age}
//                         onChange={handleIAMChange}
//                         >
//                         <MenuItem value="Admin">Admin</MenuItem>
//                         <MenuItem value="Authority">Authority</MenuItem>
//                         <MenuItem value="Student">Student</MenuItem>
//                         </Select>
//                     </FormControl>
//                     </div>
//                     <div className={classes.formInputs}>
//                         <FormControl className={classes.fieldInput} variant="outlined">
//                             <InputLabel htmlFor="email">
//                                 Email
//                             </InputLabel>
//                             <FilledInput
//                                 id="email"
//                                 name="email"
//                                 value={props.EmailValues}
//                                 onChange={handleChange}
//                             />
//                         </FormControl>
//                     </div>
//                     <div className={classes.formInputs}>
//                         <FormControl className={classes.fieldInput} variant="outlined">
//                             <InputLabel htmlFor="password">Password</InputLabel>
//                             <FilledInput
//                                 type={showPassword?'text':'password'}
//                                 id="password"
//                                 value={props.PasswordValues}
//                                 onChange={handleChange}
//                                 endAdornment={
//                                     <InputAdornment position="end">
//                                       <IconButton
//                                         aria-label="toggle password visibility"
//                                         onClick={clickShowPassword}
//                                         onMouseDown={mouseDownPassword}
//                                       >
//                                         {showPassword ? <Visibility /> : <VisibilityOff />}
//                                       </IconButton>
//                                     </InputAdornment>
//                                 }
//                             />
//                         </FormControl>
//                     </div>
//                     <div >
//                         <Button className={classes.formButton} variant="contained" color="secondary" type="submit">
//                             Login
//                         </Button>
//                     </div>
//                 </form>
//                 </div>
//                 <div className={classes.loginImageContainer}>
//                     <img src = {LoginSidePic} alt="login" className={classes.loginImage}/>
//                 </div>
//             </div>
//     )
// }

// export default Form;