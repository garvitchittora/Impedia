import React from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import AdminLoginPic from '../../assets/Login/adminLogin.svg'

const AdminLogin = () => {

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');

    const [openAlert, setOpenAlert] = React.useState(false);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        axios.post('/admin/auth',body)
        .then((res)=>{
            if(res.status === 200 || res.status === 201){
                alert("Login Successful")
            }
            console.log("ok");
            setOpenAlert(true);
            let data = res.data;
            localStorage.setItem('key',data.authKey);
            console.log(data.authKey);
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 403)
                setOpenAlert(true);
        });
    }

    return (
        <>
            <LoginPage 
                actor="Admin"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={AdminLoginPic}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
        </>
    )
}

export default AdminLogin;
