import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import FetchAPI from '../FetchAPI';

type LoginInterfaceProps = {
    
};

export const LoginInterface: FunctionComponent<LoginInterfaceProps> = () => {
    const [form, setForm] = useState({});

    const setField = (key: any, value: any) => {
        setForm({...form, [key]: value})
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        FetchAPI.fetchPost('login/', form, () => {});
    }

    let loginForm = (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formLoginUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" className="w-25" onChange={e => setField('username', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" className="w-25" onChange={e => setField('password', e.target.value)}/>
            </Form.Group>
            <Button type="submit" variant="primary" className="mb-3">
                Log In
            </Button>
        </Form>
    )

    return <>
        <div className="p-5">
        {loginForm}
        </div>
    </>;
}

export default LoginInterface;
