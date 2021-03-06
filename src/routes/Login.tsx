import { FunctionComponent, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';
import User from '../entities/User';

type LoginProps = {};

export const Login: FunctionComponent<LoginProps> = () => {
    const loginState = useContext(LoginContext);
    const [user, setUser] = useState(User.createEmpty());
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = (event: any) => {
        event.preventDefault();
        if (!loginState.state.isLogged) {
            FetchAPI.postUserLogin(user).then(() => {
                loginState.setUsername(user.e_mail);
                loginState.setIsLogged(true);
                navigate("/", {replace: false});
            }).catch(() => {
                setError(true);
            })
        }
    }

    let loginForm = !loginState.state.isLogged ? (<>
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

    let userMessage = loginState.state.isLogged ? (<>
        You are logged in as {loginState.state.username}.
    </>) : (<></>);

    let errorMessage = error ? (<p style={{color:"red"}}>
        Invalid username or password!
    </p>) : (<p></p>);

    return (
        <>
            {userMessage}
            {loginForm}
            {errorMessage}
        </>
    );
}

export default Login;
