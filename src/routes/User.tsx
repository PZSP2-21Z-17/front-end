import React, { FunctionComponent, useContext } from 'react';

import { LoginContext } from '../Context';

type UserProps = {};

export const User: FunctionComponent<UserProps> = () => {
    const loginState = useContext(LoginContext);

    let isLogged = loginState.state.isLogged;

    return isLogged ?
        (<p>This is your user page. You are logged in as {loginState.state.username}.</p>) :
        (<p>Log in to view your user page.</p>);
}

export default User;
