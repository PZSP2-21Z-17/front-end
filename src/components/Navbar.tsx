import { FunctionComponent, useContext } from 'react';
import { Link } from 'react-router-dom';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';

type NavbarProps = {};

export const Navbar: FunctionComponent<NavbarProps> = () => {
    const loginState = useContext(LoginContext);

    const logout = () => {
        FetchAPI.postUserLogout().then((json: any) => {
            loginState.setUsername(null);
            loginState.setIsLogged(false);
        });
    }

    const navBar = loginState.state.isLogged ? (<>
        <li className="nav-item">
            <Link className="nav-link" to="#">You are logged in as {loginState.state.username}.</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/user">User</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => logout()}>Logout</Link>
        </li>
    </>) : (<>
        <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
        </li>
    </>)

    return (
        <header className="navbar navbar-expand navbar-dark bg-dark px-3">
            <Link className="navbar-brand mb-2" to="/">Front end</Link>
            <div className="d-flex flex-row-reverse w-100 mb-2">
                <ul className="navbar-nav">
                    {navBar}
                </ul>
            </div>
        </header>
    )
}

export default Navbar;
