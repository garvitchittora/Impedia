import React from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import StudentLoginPic from '../../assets/Login/studentLogin.svg'

const StudentLogin = () => {

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/student/auth',body)
        .then((res)=>{
            let data = res.data;

            if(res.status === 200 || res.status === 201){
                alert("Login Successfully")
            }else{
                alert("Failed")
            } 

            localStorage.setItem('key',data.authKey);
            console.log(data.authKey);
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return (
        <>
            <LoginPage 
                actor="Student"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={StudentLoginPic}
            />
        </>
    )
}

export default StudentLogin;
