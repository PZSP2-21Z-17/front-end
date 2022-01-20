import { FunctionComponent } from 'react';
import { Link, Outlet, matchPath, useLocation } from 'react-router-dom';
import { JournalText, Question, Hash, BookHalf } from 'react-bootstrap-icons';

import Navbar from './Navbar';

type MainLayoutProps = {};

export const MainLayout: FunctionComponent<MainLayoutProps> = () => {
    const location = useLocation();
    const shouldUsePadding = !matchPath(location.pathname, '/exams');

    return (
    <div id="container" className="container-fluid vh-100 p-0 d-flex flex-column">
        <Navbar />
        <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
            <nav className="bg-secondary" style={{ minWidth: '240px', maxWidth: '240px' }}>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link className="nav-link link-light" to="/subjects">
                        <BookHalf className="me-2" />
                            Subjects
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-light" to="/exams">
                        <JournalText className="me-2" />
                            Exams
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-light" to="/tasks">
                            <Question className="me-2" />
                            Tasks
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-light" to="/tags">
                            <Hash className="me-2" />
                            Tags
                        </Link>
                    </li>
                </ul>
            </nav>
            <main className="flex-grow-1">
                <div className={shouldUsePadding ? 'p-5' : 'd-flex h-100'}
                    style={shouldUsePadding ? { overflow: "auto", height: "100%" } : {}}>
                    <Outlet />
                </div>
            </main>
        </div>
    </div>
    )
}

export default MainLayout;
