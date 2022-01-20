import { FunctionComponent, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';
import User from '../entities/User';

type RegisterProps = {};

export const Register: FunctionComponent<RegisterProps> = () => {
    const loginState = useContext(LoginContext);
    const [user, setUser] = useState(User.createEmpty());
    const [confirmPass, setConfirmPass] = useState('');
    const [goodPass, setGoodPass] = useState(true);
    const navigate = useNavigate();

    const validateForm = () => {
        return (confirmPass === user.password);
    }

    const handleRegisterSubmit = (event: any) => {
        event.preventDefault();
        if (!loginState.state.isLogged) {
            if (validateForm()) {
                FetchAPI.postUserRegister(user).then(() => {
                    loginState.setUsername(user.e_mail);
                    loginState.setIsLogged(false);
                    FetchAPI.postUserLogin(user).then(() => {
                        navigate("/", {replace: false});
                    })
                })
            } else {
                setGoodPass(false);
            }
        }
    }

    let registerForm = !loginState.state.isLogged ? (<>
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

    let noBuenoPasswordMessage = !loginState.state.isLogged && !goodPass ? (<>
        Passwords don't match!
    </>) : (<></>);

    let userMessage = loginState.state.isLogged ? (<>
        You are logged in as {loginState.state.username}.
    </>) : (<></>);

    return (
        <>
            {registerForm}
            {noBuenoPasswordMessage}
            {userMessage}
        </>
    );
}

export default Register;
