import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import DashboardFooter from '../components/footer'
import Header from '../components/header'
import NotAuthorzied from '../components/not-authorized'
import Sidebar from '../components/sidebar'

const Dashboard = () => {
    const { currentUser: user } = useSelector((state) => state.user)
    const { pathname } = useLocation()

    const isRestricted = (path, role) => {
        const restrictedPath = ['payments', 'users']
        const foundInPath = restrictedPath.some((s) => path.includes(s))
        return role !== 'super' && foundInPath ? true : false
    }

    return (
        <div className={`grid grid-cols-10 max-h-screen`}>
            <div className={`col-span-2 relative overflow-hidden`}>
                <Sidebar className="flex-1 overflow-y-scroll" />
            </div>
            <div className={`col-span-8`}>
                <div className="h-screen overflow-y-scroll bg-slate-50">
                    <Header className="bg-white" />
                    {isRestricted(pathname, user.role) ? (
                        <NotAuthorzied />
                    ) : (
                        <div className="bg-slate-50 min-h-full">
                            <Outlet />
                        </div>
                    )}
                    <DashboardFooter />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
