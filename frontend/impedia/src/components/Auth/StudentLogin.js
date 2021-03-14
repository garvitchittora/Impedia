import React from 'react';
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

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`/admin/auth`, requestOptions);
        const data = await response.json();
        localStorage.setItem('key',data.authKey);
        console.log(data.authKey);
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
