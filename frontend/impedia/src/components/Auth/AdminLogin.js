import React from 'react';

import { baseUrl } from '../../urlConstants';
import LoginPage from './LoginPage';
import AdminLoginPic from '../../assets/Login/adminLogin.svg'

const AdminLogin = () => {

    const [EmailValues, setEmailValues] = React.useState('');
    const [PasswordValues, setPasswordValues] = React.useState('');

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            password: PasswordValues,
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${baseUrl}/admin/auth`, requestOptions);
        const data = await response.json();
        localStorage.setItem('key',data.authKey);
        console.log(data.authKey);
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
            />
        </>
    )
}

export default AdminLogin;
