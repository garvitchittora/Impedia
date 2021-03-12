import React from 'react';

import { baseUrl } from '../../urlConstants';
import LoginPage from './LoginPage';
import AuthorityLoginPic from '../../assets/Login/authLogin.svg'

const AuthorityLogin = () => {

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
                actor="Authority"
                EmailValues={EmailValues} 
                PasswordValues={PasswordValues}
                setEmailValues={setEmailValues}
                setPasswordValues={setPasswordValues}
                submitFunction={submitFunction}
                loginImage={AuthorityLoginPic}
            />
        </>
    )
}

export default AuthorityLogin;
