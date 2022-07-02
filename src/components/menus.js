import React from 'react'
import {
    AcademicCapIcon,
    BookOpenIcon,
    CalendarIcon,
    ChevronRightIcon,
    CreditCardIcon,
    PlusIcon,
    SpeakerphoneIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
} from '@heroicons/react/solid'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Menus = () => {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div>
            <ul className="list-none">
                <li className="p-2">
                    <div className="w-full font-semibold">
                        <p>Trainers</p>
                    </div>
                    <div>
                        <ul className="py-2">
                            <Link to="dashboard/trainers/add-new">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <PlusIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Add New </p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/trainers/view-all">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <AcademicCapIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>All Trainers</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/category/trainer">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <UserGroupIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Trainer Category</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                        </ul>
                    </div>
                </li>
                <li className="p-2">
                    <div className="w-full font-semibold">
                        <p>Students</p>
                    </div>
                    <div>
                        <ul className="py-2">
                            {/* <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                <div className="flex justify-start items-center space-x-2">
                                    <PlusIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                    <p>Add New </p>
                                </div>
                                <ChevronRightIcon className="h-5 w-5" />
                            </li> */}
                            <Link to="/dashboard/students/view-all">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <UserIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>All Students</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="/dashboard/category/student">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <UserGroupIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Student Category</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                        </ul>
                    </div>
                </li>
                <li className=" p-2">
                    <div className="w-full font-semibold">
                        <p>Classes</p>
                    </div>
                    <div>
                        <ul className="py-2">
                            <Link to="dashboard/classes/add-new">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <PlusIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Add New </p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/classes/view-all">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <BookOpenIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>All Classes</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/category/class">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <UserGroupIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Class Category</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                        </ul>
                    </div>
                </li>
                <li className=" p-2">
                    <div className="w-full font-semibold">
                        <p>Dashboard</p>
                    </div>
                    <div>
                        <ul className="py-2">
                            {currentUser && currentUser.role === 'super' && (
                                <Link to="dashboard/users">
                                    <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                        <div className="flex justify-start items-center space-x-2">
                                            <UserIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                            <p>Users</p>
                                        </div>
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </li>
                                </Link>
                            )}
                            <Link to="dashboard/leads">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <UsersIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Leads</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/announcements">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <SpeakerphoneIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Announcements</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            <Link to="dashboard/students/attendance">
                                <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                    <div className="flex justify-start items-center space-x-2">
                                        <CalendarIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                        <p>Attendance Report</p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </li>
                            </Link>
                            {currentUser && currentUser.role === 'super' && (
                                <Link to="dashboard/payments">
                                    <li className="p-2 group flex justify-between text-sm text-gray-400 hover:bg-sky-500 hover:text-white rounded-sm">
                                        <div className="flex justify-start items-center space-x-2">
                                            <CreditCardIcon className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                                            <p>Payments</p>
                                        </div>
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Menus
