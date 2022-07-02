import { SearchIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { Avatar, Button, Table, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddCategoryDropdown from '../components/add-category-dropdown'
import Badge from '../components/badge'
import Modal from '../components/modal'
import ProfilePicture from '../components/profile-picture'
import { config } from '../config/config'

const ListTrainers = () => {
    const [error, setError] = useState(null)
    const [trainers, setTrainers] = useState([])
    const [showActions, setShowActions] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [slectedUsers, setSlectedUsers] = useState([])
    const defaultCategory = { name: 'Select a category', disabled: true }
    const [categories, setCategories] = useState([defaultCategory])
    const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const [searchKey, setSearchKey] = useState('')

    const fetchAllTrainers = () => {
        axios
            .get(config.api.fetchAllTrainers)
            .then(({ data }) => {
                if (data) {
                    data.map((d) => (d.isChecked = false))
                    setTrainers(data)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchCategories = async () => {
        try {
            const url = config.api.getCategory + '/trainer'
            const { data } = await axios.get(url)
            if (data.length) setCategories((state) => [...state, ...data])
        } catch (error) {
            console.log(error)
        }
    }

    const addToCategory = async () => {
        try {
            const url = config.api.addUserToCategory + '/trainer'
            const { data } = await axios.post(url, {
                cat_id: selectedCategory.id,
                user_list: slectedUsers.map((user) => user.id),
            })
            if (data) fetchAllTrainers()
        } catch (error) {}
    }

    const handleAllChecked = (e) => {
        const trainersCheckbox = trainers
        trainersCheckbox.forEach((o) => (o.isChecked = e.target.checked))
        setTrainers([...trainersCheckbox])
    }

    const handleCheckboxChange = (e) => {
        const trainersCheckbox = trainers
        trainersCheckbox.forEach((o) => {
            if (+o.id === +e.target.value) {
                o.isChecked = e.target.checked
            }
        })
        setTrainers([...trainersCheckbox])
    }

    const triggerModal = async () => {
        const usersToAdd = trainers.filter((u) => u.isChecked)
        setSlectedUsers(usersToAdd)
        setOpenModal(true)
    }

    const deleteTrainer = (trainer_id) => {
        axios
            .delete(config.api.deleteTrainer + `/${trainer_id}`)
            .then(() => fetchAllTrainers())
            .catch(() => setError('Unable to delete the trainer'))
    }

    useEffect(() => {
        fetchAllTrainers()
        fetchCategories()
    }, [])

    useEffect(() => {
        console.log(trainers)
        const checkedItem = trainers.filter((t) => t.isChecked)
        setShowActions(checkedItem.length > 0)
        if (openModal) setOpenModal(false)
    }, [trainers])

    return (
        <div className="py-4 px-6">
            <div className="py-4 w-full flex-row items-center justify-between">
                <div>
                    <h4 className="font-semibold text-gray-500">
                        All trainers
                    </h4>
                </div>
                {showActions && (
                    <div className="inline-flex space-x-2" role="group">
                        <Button color="light" size="xs" onClick={triggerModal}>
                            <UserGroupIcon
                                className="w-4 h-4 mr-2 text-cyan-500"
                                fill="currentColor"
                            />
                            Add Category
                        </Button>
                        <Button color="light" size="xs">
                            <TrashIcon
                                className="w-4 h-4 mr-2 text-red-500"
                                fill="currentColor"
                            />
                            Delete
                        </Button>
                    </div>
                )}
            </div>
            <div className="w-full mb-5">
                <TextInput
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="bg-white"
                    icon={SearchIcon}
                    placeholder="Search trainer"
                />
            </div>
            <div className="w-full max-h-[75vh] table-card overflow-y-scroll">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell className="thead">
                            <input
                                id="checkbox-table-1"
                                type="checkbox"
                                className="checkbox"
                                onChange={handleAllChecked}
                            />
                            <label for="checkbox-table-1" className="sr-only">
                                checkbox
                            </label>
                        </Table.HeadCell>
                        <Table.HeadCell className="thead"></Table.HeadCell>
                        <Table.HeadCell className="thead">Name</Table.HeadCell>
                        <Table.HeadCell className="thead">
                            Category
                        </Table.HeadCell>
                        <Table.HeadCell className="thead">
                            Status
                        </Table.HeadCell>
                        <Table.HeadCell className="thead">
                            Action
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {trainers
                            .filter((t) => {
                                const name = `${t.first_name} ${t.last_name}`
                                return name
                                    .toLowerCase()
                                    .includes(searchKey.toLowerCase())
                            })
                            .map((trainer, key) => (
                                <Table.Row key={key}>
                                    <Table.Cell className="w-4 py-[12px]">
                                        <div className="flex items-center">
                                            <input
                                                name="checkbox"
                                                type="checkbox"
                                                className="checkbox"
                                                checked={trainer.isChecked}
                                                value={trainer.id}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="w-2 px-[0px] py-[12px]">
                                        <Avatar rounded={true} />
                                    </Table.Cell>
                                    <Table.Cell className="py-[12px]">
                                        <Link
                                            to={`/dashboard/trainers/view/${trainer.id}`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-slate-900 group-hover:text-sky-500">
                                                    {trainer.first_name}{' '}
                                                    {trainer.last_name}
                                                </p>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {trainer.email}
                                                </p>
                                            </div>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell className="py-[12px]">
                                        {trainer.categories
                                            .slice(0, 2)
                                            .map((category, key) => (
                                                <Badge
                                                    key={key}
                                                    color="gray"
                                                    message={category.name}
                                                />
                                            ))}
                                        {trainer.categories.length > 2 && (
                                            <Badge
                                                color="gray"
                                                message={`+${
                                                    trainer.categories.length -
                                                    1
                                                }`}
                                            />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="py-[12px]">
                                        <div className="flex justify-start">
                                            {trainer.invite_status === 1 &&
                                                trainer.status === 0 && (
                                                    <Badge
                                                        color="yellow"
                                                        message="Invite sent"
                                                    />
                                                )}
                                            {trainer.status === 0 ? (
                                                <Badge
                                                    color="red"
                                                    message="Inactive"
                                                />
                                            ) : (
                                                <Badge
                                                    color="green"
                                                    message="Active"
                                                />
                                            )}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="py-[12px]">
                                        <div className="flex justify-center">
                                            <TrashIcon
                                                className="h-5 w-5 text-red-400 hover:text-red-600 cursor-pointer hover:scale-110"
                                                onClick={() =>
                                                    deleteTrainer(trainer.id)
                                                }
                                            />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </div>
            {openModal && (
                <Modal setOpenModal={setOpenModal}>
                    <AddCategoryDropdown
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        onClick={addToCategory}
                    />
                </Modal>
            )}
        </div>
    )
}

export default ListTrainers
