import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { refresh } from '../Common'
import FetchAPI from '../FetchAPI';
import ReactSession from '../ReactSession';
import User from '../entities/User';

type RegisterProps = {};

export const Register: FunctionComponent<RegisterProps> = () => {
    const [user, setUser] = useState(User.createEmpty());
    const [confirmPass, setConfirmPass] = useState('');
    const [goodPass, setGoodPass] = useState(true);

    let isLogged = ReactSession.checkValue('username');

    const validateForm = () => {
        return (confirmPass === user.password);
    }

    const handleRegisterSubmit = (event: any) => {
        event.preventDefault();
        if (!isLogged) {
            if (validateForm()) {
                FetchAPI.fetchPost('user/register/', user).then(
                    (json: any) => {
                        ReactSession.setValue('username', json['e_mail']);
                        refresh();
                    }
                )
            } else {
                setGoodPass(false);
            }
        }
    }

    let registerForm = !isLogged ? (<>
        <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="formRegisterUsername">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" placeholder="Enter e-mail" className="w-25" onChange={e => user.modifyUser(setUser, 'e_mail', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterFirstName">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" className="w-25" onChange={e => user.modifyUser(setUser, 'first_name', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterLastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" className="w-25" onChange={e => user.modifyUser(setUser, 'last_name', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" className="w-25" onChange={e => user.modifyUser(setUser, 'password', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPasswordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" className="w-25" onChange={e => setConfirmPass(e.target.value)}/>
            </Form.Group>
            <Button type="submit" variant="primary" className="mb-3">
                Register
            </Button>
        </Form>
    </>) : (<></>);

    let noBuenoPasswordMessage = !isLogged && !goodPass ? (<>
        Passwords don't match!
    </>) : (<></>);

    let userMessage = isLogged ? (<>
        You are logged in as {ReactSession.getValue('username')}.
    </>) : (<></>);

    return <>
        <div className="p-5">
            {registerForm}
            {noBuenoPasswordMessage}
            {userMessage}
        </div>
    </>;
}

export default Register;
