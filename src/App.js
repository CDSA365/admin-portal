import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'

// VIEWS
import Login from './views/login'
import Register from './views/register'
import Home from './views/home'
import Authenticate from './views/authenticate'
import AuthSetup from './views/auth-setup'
import WebFont from 'webfontloader'
import AddNewTrainers from './views/add-new-trainers'
import { PrivateOutlet } from './components/PrivateRoute'
import ListTrainers from './views/list-trainers'
import ErrorPage from './views/ErrorPage'
import EmailVerify from './views/email-verify'
import Category from './views/category'
import ViewTrainer from './views/view-trainer'
import AddNewClasses from './views/add-new-classes'
import ListClasses from './views/list-classes'
import ListStudents from './views/list-students'
import ViewStudent from './views/view-student'
import EditClass from './views/edit-class'
import ViewClass from './views/view-class'
import ViewLeads from './views/view-leads'
import AttendanceReport from './views/attendance-report'
import Payments from './views/payments'
import Announcements from './views/announcements'
import ForgotPassword from './views/forgot-password'
import ResetPassword from './views/reset-password'
import ViewLeadDetail from './views/view-lead-detail'
import ViewCategory from './views/view-category'
import ListUsers from './views/list-users'

// ROUTE PATHS
const path = {
    login: '/login',
    register: '/register',
    authSetup: '/auth-setup',
    auth: '/authenticate',
    pageNotFound: '/page-not-found',
    dashboard: '/dashboard',
    addTrainers: '/dashboard/trainers/add-new',
    viewAllTrainers: '/dashboard/trainers/view-all',
    emailVerify: '/email/verify/:token',
    viewCategory: '/dashboard/category/:entity/view/:cat_id',
    editCategory: '/dashboard/category/:entity/edit/:cat_id',
    trainerCat: '/dashboard/category/:entity',
    viewTrainer: '/dashboard/trainers/view/:id',
    addClass: '/dashboard/classes/add-new',
    listClasses: '/dashboard/classes/view-all',
    editClasses: '/dashboard/classes/edit/:id',
    listStudents: '/dashboard/students/view-all',
    viewStudent: '/dashboard/students/view/:id',
    viewClass: '/dashboard/classes/view/:slug',
    viewLeads: '/dashboard/leads',
    viewAttendanceReport: '/dashboard/students/attendance',
    paymentsPage: '/dashboard/payments',
    announcements: '/dashboard/announcements',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password/:token',
    viewLeadDetail: '/dashboard/leads/view/:id',
    users: '/dashboard/users',
}

// APPLICATION
const App = () => {
    useEffect(() => {
        WebFont.load({
            google: {
                families: [
                    'Montserrat:400,700',
                    'Source Sans Pro:400,700',
                    'sans-serif',
                ],
            },
        })
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path={path.login} element={<Login />} />
                <Route exact path={path.register} element={<Register />} />
                <Route exact path={path.authSetup} element={<AuthSetup />} />
                <Route exact path={path.auth} element={<Authenticate />} />
                <Route exact path={path.pageNotFound} element={<ErrorPage />} />
                <Route
                    exact
                    path={path.emailVerify}
                    element={<EmailVerify />}
                />
                <Route
                    exact
                    path={path.forgotPassword}
                    element={<ForgotPassword />}
                />
                <Route
                    exact
                    path={path.resetPassword}
                    element={<ResetPassword />}
                />
                <Route element={<PrivateOutlet />}>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path={path.users} element={<ListUsers />} />
                    <Route
                        exact
                        path={path.addTrainers}
                        element={<AddNewTrainers />}
                    />
                    <Route
                        exact
                        path={path.viewAllTrainers}
                        element={<ListTrainers />}
                    />
                    <Route
                        exact
                        path={path.viewCategory}
                        element={<ViewCategory />}
                    />
                    <Route
                        exact
                        path={path.editCategory}
                        element={<Category />}
                    />
                    <Route
                        exact
                        path={path.trainerCat}
                        element={<Category />}
                    />
                    <Route
                        exact
                        path={path.viewTrainer}
                        element={<ViewTrainer />}
                    />
                    <Route
                        exact
                        path={path.addClass}
                        element={<AddNewClasses />}
                    />
                    <Route
                        exact
                        path={path.listClasses}
                        element={<ListClasses />}
                    />
                    <Route
                        exact
                        path={path.editClasses}
                        element={<EditClass />}
                    />
                    <Route
                        exact
                        path={path.listStudents}
                        element={<ListStudents />}
                    />
                    <Route
                        exact
                        path={path.viewStudent}
                        element={<ViewStudent />}
                    />
                    <Route
                        exact
                        path={path.viewClass}
                        element={<ViewClass />}
                    />
                    <Route
                        exact
                        path={path.viewLeadDetail}
                        element={<ViewLeadDetail />}
                    />
                    <Route
                        exact
                        path={path.viewLeads}
                        element={<ViewLeads />}
                    />
                    <Route
                        exact
                        path={path.viewAttendanceReport}
                        element={<AttendanceReport />}
                    />
                    <Route
                        exact
                        path={path.paymentsPage}
                        element={<Payments />}
                    />
                    <Route
                        exact
                        path={path.announcements}
                        element={<Announcements />}
                    />
                </Route>
                <Route
                    path="*"
                    element={<Navigate to={path.pageNotFound} replace={true} />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
