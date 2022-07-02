import {
    ChatIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    MailIcon,
    PencilIcon,
    PhoneIcon,
} from '@heroicons/react/solid'
import axios from 'axios'
import { Button, Card, Badge } from 'flowbite-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditFee from '../components/edit-fee'
import ExtendDueDate from '../components/extend-due-date'
import Modal from '../components/modal'
import Rupee from '../components/rupee'
import UpdateJoiningDate from '../components/update-joining-date'
import { config } from '../config/config'
import ListStudentClasses from './list-student-classes'
import StudentPaymentDetails from './student-payment-details'

const ViewStudent = () => {
    const state = useLocation()
    const [student, setStudent] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [openDateModal, setOpenDateModal] = useState(false)
    const [editFeeModal, setEditFeeModal] = useState(false)

    const togglePaymentModal = () => {
        setOpenModal(!openModal)
    }

    const toggleFeeModal = () => {
        setEditFeeModal(!editFeeModal)
    }

    const fetchStudentData = (student_id) => {
        axios
            .get(config.api.getStudent + `/${student_id}`)
            .then(({ data }) => setStudent(data))
            .catch((err) => console.log(err))
            .finally(() => openDateModal && setOpenDateModal(false))
    }

    useEffect(() => {
        fetchStudentData(state?.state?.student?.id)
    }, [state])

    return (
        Object.keys(student).length > 0 && (
            <>
                <div className="w-full p-6 bg-gradient-to-r from-blue-500 to-sky-500 space-y-2 ">
                    <div>
                        <p className="font-medium text-white">
                            ID: {student.id}
                        </p>
                        <h1 className="font-black text-3xl text-white my-1">
                            {student.first_name} {student.last_name}
                        </h1>
                        <p className="text-sm text-white flex items-center justify-start">
                            <MailIcon
                                className="w-4 h-4 text-white mr-2"
                                fill="currentColor"
                            />
                            {student.email}
                        </p>
                        <div className="flex space-x-4 items-center justify-start">
                            <p className="text-sm text-white flex items-center">
                                <PhoneIcon
                                    className="w-4 h-4 text-white mr-2"
                                    fill="currentColor"
                                />
                                {student.phone}
                            </p>
                            <p className="text-sm text-white flex items-center">
                                <ChatIcon
                                    className="w-4 h-4 text-white mr-2"
                                    fill="currentColor"
                                />
                                {student.whatsapp}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4">
                    <div className="flex space-x-4">
                        <div className="w-1/3 space-y-4">
                            <Card title="Address">
                                <p className="text-sm text-gray-600">
                                    {student.address_one},{' '}
                                    {student.address_two
                                        ? student.address_two + ', '
                                        : null}
                                    {student.city}, {student.district},{' '}
                                    {student.state} - {student.pincode}
                                </p>
                            </Card>
                            <Card>
                                <table className="w-full">
                                    <tbody className="text-sm text-slate-600">
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Account Status
                                            </td>
                                            <td className="p-1">
                                                {student.status === 0 &&
                                                    'Pending Activation'}
                                                {student.status === 1 &&
                                                    'Active'}
                                                {student.status === 2 &&
                                                    'Rejected'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Joining Date
                                            </td>
                                            <td className="p-1 flex">
                                                <p>
                                                    {moment(
                                                        student.created_at
                                                    ).format('LL')}
                                                </p>
                                                <PencilIcon
                                                    className="w-4 h-4 ml-2 text-gray-400 hover:text-sky-500 cursor-pointer hover:scale-125"
                                                    fill="currentColor"
                                                    onClick={() =>
                                                        setOpenDateModal(
                                                            !openDateModal
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Email verified
                                            </td>
                                            <td className="p-1">
                                                {student.email_verified ? (
                                                    <CheckCircleIcon
                                                        className="w-5 h-5 text-green-400"
                                                        fill="currentColor"
                                                    />
                                                ) : (
                                                    <ExclamationCircleIcon
                                                        className="w-5 h-5 text-red-400"
                                                        fill="currentColor"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Phone verified
                                            </td>
                                            <td className="p-1">
                                                {student.phone_verified ? (
                                                    <CheckCircleIcon
                                                        className="w-5 h-5 text-green-400"
                                                        fill="currentColor"
                                                    />
                                                ) : (
                                                    <ExclamationCircleIcon
                                                        className="w-5 h-5 text-red-400"
                                                        fill="currentColor"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Aadhar number
                                            </td>
                                            <td className="p-1">
                                                {student.aadhar_number}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                            <Card>
                                <table className="w-full">
                                    <tbody className="text-sm text-slate-600">
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Fee
                                            </td>
                                            <td className="p-1">
                                                <Rupee />
                                                {student.fee}/-
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Payment
                                            </td>
                                            <td className="p-1">
                                                Every{' '}
                                                {student.gap > 1 && student.gap}{' '}
                                                {student.period}
                                                {student.gap > 1 && 's'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 font-semibold">
                                                Payment Status
                                            </td>
                                            <td className="p-1">
                                                {moment().isBefore(
                                                    student.next_due
                                                ) ? (
                                                    <Badge color="success">
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        color="failure"
                                                        className="inline"
                                                    >
                                                        Unpaid
                                                    </Badge>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pt-3">
                                                <Button
                                                    className="w-full btn-sm btn-info"
                                                    onClick={togglePaymentModal}
                                                    size="xs"
                                                >
                                                    Extend payment due
                                                </Button>
                                            </td>
                                            <td className="pt-3">
                                                <Button
                                                    className="w-full btn-sm btn-info"
                                                    onClick={toggleFeeModal}
                                                    size="xs"
                                                >
                                                    Edit Fee
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        <div className="w-2/3 space-y-4">
                            <Card title={'Class details'}>
                                <ListStudentClasses id={student.id} />
                            </Card>
                            <Card title={'Payment details'}>
                                <StudentPaymentDetails id={student.id} />
                            </Card>
                        </div>
                    </div>
                    {openModal && (
                        <Modal setOpenModal={setOpenModal}>
                            <ExtendDueDate
                                payment_id={student.payment_id}
                                currentDue={student.next_due}
                                callback={togglePaymentModal}
                            />
                        </Modal>
                    )}
                    {editFeeModal && (
                        <Modal setOpenModal={setEditFeeModal}>
                            <EditFee
                                feeData={{
                                    fee: String(student.fee),
                                    gap: String(student.gap),
                                    period: student.period,
                                }}
                                student_id={student.id}
                                payment_id={student.payment_id}
                                currentDue={student.next_due}
                                lastPaymentTime={student.order_created_at}
                                callback={toggleFeeModal}
                            />
                        </Modal>
                    )}
                    {openDateModal && (
                        <Modal setOpenModal={setOpenDateModal}>
                            <UpdateJoiningDate
                                joining_date={student.created_at}
                                student_id={student.id}
                                callback={() => fetchStudentData(student.id)}
                            />
                        </Modal>
                    )}
                </div>
            </>
        )
    )
}

export default ViewStudent
