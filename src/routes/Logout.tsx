import { Navigate } from 'react-router-dom';

import ReactSession from '../ReactSession';

export const Logout = () => {
    ReactSession.removeValue('username');
    return <Navigate to="/" replace={true} />;
}

export default Logout;
