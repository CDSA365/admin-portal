import axios from 'axios'
import {
    Alert,
    Button,
    Modal,
    Select,
    Spinner,
    Table,
    TextInput,
} from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import CustomBadge from '../components/badge'
import Card from '../components/card'
import { config } from '../config/config'
import {
    InformationCircleIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useSelector } from 'react-redux'
import PaginatedItems from '../components/paginated-items'

const roles = {
    super: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    editor: 'Editor',
}

const formDefaults = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'editor',
}

const ListUsers = () => {
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showDelteModal, setShowDelteModal] = useState(false)
    const [formData, setFormData] = useState(formDefaults)
    const [info, setInfo] = useState(null)
    const [error, setError] = useState(null)
    const [userToDelete, setuserToDelete] = useState(null)
    const [createUserAlert, setCreateUserAlert] = useState(null)
    const [createLoader, setCreateLoader] = useState(false)
    const { currentUser: loggedUser } = useSelector((state) => state.user)

    const fetchUsers = () => {
        const url = config.api.getAllUsers
        axios.get(url).then(({ data }) => setUsers(data))
    }

    const handleChange = (e) => {
        setFormData((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    const goodToInsert = (data) => {
        let errorCount = 0
        Object.values(data).map((value) => {
            if (!value.length) errorCount++
        })
        return errorCount === 0
    }

    const createUser = () => {
        setCreateLoader(true)
        if (goodToInsert(formData)) {
            axios
                .post(config.api.createUser, formData)
                .then(() => {
                    const message = `User created and an invite has been sent to ${formData.email} with temporary password`
                    setInfo(message)
                    error && setError(null)
                    fetchUsers()
                })
                .catch((err) => {
                    info && setInfo(null)
                    setError(err.response.data.message)
                })
                .finally(() => {
                    setShowModal(false)
                    setCreateLoader(false)
                })
        } else {
            setCreateLoader(false)
            setCreateUserAlert('Please fill all the fields')
        }
    }

    const canDelete = (userId) => {
        if (userId === loggedUser.id) {
            return false
        } else if (loggedUser.role !== 'super') {
            return false
        } else {
            return true
        }
    }

    const deleteUser = (id) => {
        axios
            .delete(config.api.deleteUser + `/${id}`)
            .then(() => fetchUsers())
            .finally(() => setShowDelteModal(false))
    }

    const deleteAction = (id) => {
        setuserToDelete(id)
        setShowDelteModal(true)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (!showModal) setFormData(formDefaults)
        if (createUserAlert) setCreateUserAlert(null)
    }, [showModal])

    useEffect(() => {
        if (info) {
            setTimeout(() => {
                setInfo(null)
            }, 10000)
        }
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 10000)
        }
    }, [info, error])

    return (
        <div className="px-6 py-4">
            <div
                className={`notice-area ${
                    (info !== null || error !== null) && 'mb-3'
                }`}
            >
                {info && (
                    <Alert
                        color="success"
                        icon={InformationCircleIcon}
                        onDismiss={() => setInfo(null)}
                    >
                        {info}
                    </Alert>
                )}
                {error && (
                    <Alert
                        color="failure"
                        icon={InformationCircleIcon}
                        onDismiss={() => setInfo(null)}
                    >
                        {error}
                    </Alert>
                )}
            </div>
            <div className="flex justify-end mb-3">
                <Button size="xs" color="light" onClick={setShowModal}>
                    <PlusIcon className="mr-2 h-5 w-5" /> Create new user
                </Button>
            </div>
            <PaginatedItems
                items={users}
                render={(data) => (
                    <Card title={'Users'} bodyClass="p-0">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300 rounded-none">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell className="thead">
                                        Name
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Email
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Phone
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Role
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Action
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {data.map((user, key) => (
                                        <Table.Row key={key}>
                                            <Table.Cell>
                                                {user.first_name}{' '}
                                                {user.last_name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.email}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.phone}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <CustomBadge
                                                    message={roles[user.role]}
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="flex flex-wrap gap-4">
                                                {/* <PencilIcon className="w-5 h-5" /> */}
                                                {canDelete(user.id) && (
                                                    <TrashIcon
                                                        className="w-5 h-5 text-red-400 cursor-pointer"
                                                        onClick={() =>
                                                            deleteAction(
                                                                user.id
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </Card>
                )}
            />

            {/* User creation modal window */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header>Create new user</Modal.Header>
                <Modal.Body>
                    {createUserAlert && (
                        <div className="p-2 mb-2">
                            <Alert
                                color="failure"
                                onDismiss={() => setCreateUserAlert(null)}
                            >
                                {createUserAlert}
                            </Alert>
                        </div>
                    )}
                    <table className="shadow-none">
                        <tbody>
                            <tr>
                                <td className="p-2">Name</td>
                                <td className="p-2">
                                    <div className="w-full flex space-x-3">
                                        <TextInput
                                            type="text"
                                            name="first_name"
                                            placeholder="First Name"
                                            value={formData.first_name || ''}
                                            onChange={handleChange}
                                        />
                                        <TextInput
                                            type="text"
                                            name="last_name"
                                            placeholder="Last Name"
                                            value={formData.last_name || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Email</td>
                                <td className="p-2">
                                    <TextInput
                                        type="email"
                                        name="email"
                                        placeholder="you@email.com"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Phone</td>
                                <td className="p-2">
                                    <TextInput
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Role</td>
                                <td className="p-2">
                                    <Select
                                        id="role"
                                        name="role"
                                        required={true}
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="super">
                                            Super Admin
                                        </option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2"></td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-3 justify-between">
                                        <Button onClick={createUser}>
                                            {createLoader && (
                                                <div className="mr-3">
                                                    <Spinner
                                                        size="sm"
                                                        light={true}
                                                    />
                                                </div>
                                            )}
                                            Create
                                        </Button>
                                        <Button
                                            color="gray"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
            {/* Delete user modal window */}
            <Modal
                popup
                show={showDelteModal}
                size="sm"
                onClose={() => setShowDelteModal(!showDelteModal)}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => deleteUser(userToDelete)}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() =>
                                    setShowDelteModal(!showDelteModal)
                                }
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ListUsers
