import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { refresh } from '../Common'
import FetchAPI from '../FetchAPI';
import ReactSession from '../ReactSession';
import User from '../entities/User';

type LoginProps = {};

export const Login: FunctionComponent<LoginProps> = () => {
    const [user, setUser] = useState(User.createEmpty());

    let isLogged = ReactSession.checkValue('username');

    const handleLoginSubmit = (event: any) => {
        event.preventDefault();
        if (!isLogged) {
            FetchAPI.fetchPost('user/login/', user).then(
                (json: any) => {
                    ReactSession.setValue('username', json['e_mail']);
                    refresh();
                }
            )
        }
    }

    let loginForm = !isLogged ? (<>
        <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="formLoginUsername">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="text" placeholder="Enter e-mail" className="w-25" onChange={e => user.modifyUser(setUser, 'e_mail', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" className="w-25" onChange={e => user.modifyUser(setUser, 'password', e.target.value)}/>
            </Form.Group>
            <Button type="submit" variant="primary" className="mb-3">
                Log In
            </Button>
        </Form>
    </>) : (<></>);

    let userMessage = isLogged ? (<>
        You are logged in as {ReactSession.getValue('username')}.
    </>) : (<></>);

    return <>
        <div className="p-5">
            {userMessage}
            {loginForm}
        </div>
    </>;
}

export default Login;
