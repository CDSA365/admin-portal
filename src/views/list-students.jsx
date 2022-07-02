import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import axios from 'axios'
import { config } from '../config/config'
import {
    BanIcon,
    CheckIcon,
    FolderIcon,
    MailIcon,
    SearchIcon,
    ThumbDownIcon,
    ThumbUpIcon,
    UserGroupIcon,
} from '@heroicons/react/solid'
import moment from 'moment-timezone'
import Modal from '../components/modal'
import AddCategoryDropdown from '../components/add-category-dropdown'
import LoadingPlaceholder from '../components/loading-placeholder'
import Placeholder from '../components/placeholder'
import AddClassDropdown from '../components/add-class-dropdown'
import SetStudentFee from '../components/set-student-fee'
import { Link } from 'react-router-dom'
import { Table, TextInput } from 'flowbite-react'
import Badge from '../components/badge'

const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const ListStudents = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedStudents, setSelectedStudents] = useState([])
    const [targetStudent, setTargetStudent] = useState(null)
    const [openFeeModal, setOpenFeeModal] = useState(false)
    const [openCatModal, setOpenCatModal] = useState(false)
    const [openClassModal, setOpenClassModal] = useState(false)
    const defaultCategory = { name: 'Select a category', disabled: true }
    const [categories, setCategories] = useState([defaultCategory])
    const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState(classes[0])
    const [showLoader, setShowLoader] = useState(true)
    const [students, setStudents] = useState({
        Active: [],
        Pending: [],
        Rejected: [],
        Inactive: [],
    })

    const fetchStudents = () => {
        axios
            .get(config.api.getAllStudents)
            .then(({ data }) => {
                data.map((item) => (item.isChecked = false))
                setStudents({
                    Active: data.filter((o) => o.status === 1),
                    Pending: data.filter((o) => o.status === 0),
                    Rejected: data.filter((o) => o.status === 2),
                    Inactive: data.filter((o) => o.status === 3),
                })
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => setShowLoader(false))
    }

    const handleAllChecked = (e) => {
        let { Pending, Active, Rejected } = students
        switch (selectedIndex) {
            case 0:
                Active.forEach((o) => (o.isChecked = e.target.checked))
                setStudents((state) => ({ ...state, Active: Active }))
                break
            case 1:
                Pending.forEach((o) => (o.isChecked = e.target.checked))
                setStudents((state) => ({ ...state, Pending: Pending }))
                break
            case 2:
                Rejected.forEach((o) => (o.isChecked = e.target.checked))
                setStudents((state) => ({ ...state, Rejected: Rejected }))
                break
            default:
                break
        }
    }

    const handleCheckboxChange = (e) => {
        Object.entries(students).forEach(([key, values]) => {
            values.map((value) => {
                if (+value.id === +e.target.value) {
                    value.isChecked = e.target.checked
                }
                return value
            })
            setStudents((state) => ({ ...state, [key]: values }))
        })
    }

    const handleThumbsUp = (id) => {
        triggerModal('fee', id)
    }

    const rejectStudent = (id) => {
        const url = config.api.updateStudent + `/${id}`
        axios
            .put(url, { status: 2 })
            .then(() => fetchStudents())
            .catch((err) => console.log(err))
    }

    const triggerModal = (modalFor, id = null) => {
        id ? setTargetStudent(id) : setTargetStudent(null)
        switch (modalFor) {
            case 'category':
                fetchCategories().finally(() => setOpenCatModal(true))
                break
            case 'class':
                fetchClasses().finally(() => setOpenClassModal(true))
                break
            case 'fee':
                setOpenFeeModal(true)
                break
            default:
                break
        }
    }

    const fetchCategories = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const url = config.api.getCategory + '/student'
                const { data } = await axios.get(url)
                if (data.length) setCategories([...data])
                resolve(true)
            } catch (error) {
                console.log(error)
                reject(false)
            }
        })
    }

    const fetchClasses = () => {
        return new Promise((resolve, reject) => {
            try {
                axios.get(config.api.fetchAllClasses).then(({ data }) => {
                    setClasses([...data])
                    resolve(true)
                })
            } catch (error) {
                console.log(error)
                reject(false)
            }
        })
    }

    const addToCategory = async () => {
        try {
            const url = config.api.addUserToCategory + '/student'
            const { data } = await axios.post(url, {
                cat_id: selectedCategory.id,
                user_list: targetStudent
                    ? [targetStudent]
                    : selectedStudents.map((user) => user.id),
            })
            if (data) fetchStudents()
        } catch (error) {
            console.log(error)
        } finally {
            if (openCatModal) setOpenCatModal(false)
        }
    }

    const addToClass = () => {
        const url = config.api.addStudentToClass + `/${selectedClass.id}`
        axios
            .post(url, {
                list: targetStudent
                    ? [targetStudent]
                    : selectedStudents.map((ss) => ss.id),
            })
            .catch((err) => console.log(err.response.data))
            .finally(() => {
                if (openClassModal) setOpenClassModal(false)
            })
    }

    const putOnHold = (id) => {
        const url = config.api.updateStudent + `/${id}`
        axios
            .put(url, { status: 3 })
            .then(() => fetchStudents())
            .catch((err) => console.log(err))
    }

    const activateStudent = (id) => {
        const url = config.api.updateStudent + `/${id}`
        axios
            .put(url, { status: 1 })
            .then(() => fetchStudents())
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        Object.values(students).forEach((values) => {
            values.map((value) => (value.isChecked = false))
        })
        setSelectedStudents([])
    }, [selectedIndex])

    useEffect(() => {
        const active = students.Active.filter((o) => o.isChecked)
        const pending = students.Pending.filter((o) => o.isChecked)
        const rejected = students.Rejected.filter((o) => o.isChecked)
        setSelectedStudents([...active, ...pending, ...rejected])
        if (openCatModal) setOpenCatModal(false)
        if (openClassModal) setOpenClassModal(false)
    }, [students])

    return (
        <div className="px-6 py-4">
            <div className="w-full py-4 flex justify-between items-center">
                <h4 className="font-semibold text-gray-500">All Students</h4>
                {selectedStudents.length > 0 && (
                    <div className="flex space-x-1">
                        {selectedIndex === 0 && (
                            <>
                                <button
                                    className="btn btn-gray btn-sm"
                                    onClick={() => triggerModal('category')}
                                >
                                    <FolderIcon className="w-4 h-4 mr-2" />
                                    Add to category
                                </button>
                                <button
                                    className="btn btn-gray btn-sm"
                                    onClick={() => triggerModal('class')}
                                >
                                    <UserGroupIcon className="w-4 h-4 mr-2" />
                                    Add to class
                                </button>
                            </>
                        )}
                        {selectedIndex === 1 && (
                            <>
                                <button className="btn btn-success btn-sm">
                                    <ThumbUpIcon className="w-4 h-4" />
                                </button>
                                <button className="btn btn-danger btn-sm">
                                    <ThumbDownIcon className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        {selectedIndex === 2 && (
                            <>
                                <button className="btn btn-success btn-sm">
                                    <ThumbUpIcon className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="w-full px-2 pb-4 sm:px-0">
                <Tab.Group
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                >
                    <Tab.List className="flex p-1 space-x-1 bg-neutral-200 rounded-md">
                        {Object.keys(students).map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'px-6 py-2.5 text-sm leading-5 font-bold rounded-md',
                                        'focus:outline-none',
                                        selected
                                            ? 'bg-white text-gray-700 shadow'
                                            : 'text-neutral-500 hover:bg-white/[0.45]'
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </Tab.List>
                    <div className="w-full my-3">
                        <TextInput
                            icon={SearchIcon}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search students"
                        />
                    </div>
                    <Tab.Panels className="mt-2">
                        {Object.values(students).map((student, idx) => (
                            <Tab.Panel
                                key={idx}
                                className={classNames(
                                    'rounded-md shadow-none',
                                    'focus:outline-none',
                                    'pt-0 px-0'
                                )}
                            >
                                <Table className="table shadow-none border-0 pb-4">
                                    <Table.Head>
                                        <Table.HeadCell className="thead w-4">
                                            <input
                                                name="select-all"
                                                type="checkbox"
                                                className="checkbox"
                                                onChange={handleAllChecked}
                                            />
                                            <label
                                                htmlFor="select-all"
                                                className="sr-only"
                                            >
                                                checkbox
                                            </label>
                                        </Table.HeadCell>
                                        <Table.HeadCell className="thead">
                                            Name
                                        </Table.HeadCell>
                                        <Table.HeadCell className="thead">
                                            Categories
                                        </Table.HeadCell>
                                        <Table.HeadCell className="thead">
                                            Joining Date
                                        </Table.HeadCell>
                                        <Table.HeadCell className="thead">
                                            Action
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {!showLoader ? (
                                            student.length > 0 ? (
                                                student
                                                    .filter((s) => {
                                                        const name = `${s.first_name} ${s.last_name}`
                                                        return name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchTerm.toLowerCase()
                                                            )
                                                    })
                                                    .map((std) => (
                                                        <Table.Row>
                                                            <Table.Cell className="px-4 py-2">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        name="select-one"
                                                                        type="checkbox"
                                                                        className="checkbox"
                                                                        checked={
                                                                            std.isChecked
                                                                        }
                                                                        value={
                                                                            std.id
                                                                        }
                                                                        onChange={
                                                                            handleCheckboxChange
                                                                        }
                                                                    />
                                                                </div>
                                                            </Table.Cell>
                                                            <Link
                                                                to={`/dashboard/students/view/${std.id}`}
                                                                state={{
                                                                    student:
                                                                        std,
                                                                }}
                                                                className="group"
                                                            >
                                                                <Table.Cell className="px-4 py-2 flex flex-col">
                                                                    <span className="group-hover:text-sky-600">
                                                                        {
                                                                            std.first_name
                                                                        }{' '}
                                                                        {
                                                                            std.last_name
                                                                        }
                                                                    </span>
                                                                    <span className="text-sm text-gray-400 flex space-x-2 items-center ">
                                                                        <MailIcon className="w-4 h-4" />
                                                                        <span>
                                                                            {
                                                                                std.email
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </Table.Cell>
                                                            </Link>
                                                            <Table.Cell className="px-4 py-2">
                                                                {std.categories.map(
                                                                    (cat) => (
                                                                        <Badge
                                                                            color="blue"
                                                                            message={
                                                                                cat.name
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell className="px-4 py-2">
                                                                {moment(
                                                                    std.created_at
                                                                ).format('LL')}
                                                            </Table.Cell>
                                                            <Table.Cell className="px-4 py-2 w-4">
                                                                <span className="flex space-x-1">
                                                                    {std.status ===
                                                                        0 && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() =>
                                                                                    handleThumbsUp(
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ThumbUpIcon className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() =>
                                                                                    rejectStudent(
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ThumbDownIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {std.status ===
                                                                        1 && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-info btn-sm"
                                                                                onClick={() =>
                                                                                    Table.RowiggerModal(
                                                                                        'category',
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FolderIcon className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() =>
                                                                                    triggerModal(
                                                                                        'class',
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <UserGroupIcon className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() =>
                                                                                    putOnHold(
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <BanIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {std.status ===
                                                                        2 && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() =>
                                                                                    handleThumbsUp(
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <UserGroupIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {std.status ===
                                                                        3 && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() =>
                                                                                    activateStudent(
                                                                                        std.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CheckIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))
                                            ) : (
                                                <Table.Row>
                                                    <Table.Cell
                                                        colSpan={6}
                                                        className="p-4"
                                                    >
                                                        <Placeholder
                                                            message={
                                                                'No students to list'
                                                            }
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        ) : (
                                            [...Array(8)].map((key) => (
                                                <Table.Row key={key}>
                                                    {[...Array(6)].map(
                                                        (key) => (
                                                            <Table.Cell
                                                                className="p-4"
                                                                key={key}
                                                            >
                                                                <LoadingPlaceholder />
                                                            </Table.Cell>
                                                        )
                                                    )}
                                                </Table.Row>
                                            ))
                                        )}
                                    </Table.Body>
                                </Table>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
            {openCatModal && (
                <Modal setOpenModal={setOpenCatModal}>
                    <AddCategoryDropdown
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        onClick={addToCategory}
                    />
                </Modal>
            )}
            {openClassModal && (
                <Modal setOpenModal={setOpenClassModal}>
                    <AddClassDropdown
                        classes={classes}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        onClick={addToClass}
                    />
                </Modal>
            )}
            {openFeeModal && (
                <Modal setOpenModal={setOpenFeeModal}>
                    <SetStudentFee
                        id={targetStudent}
                        callback={fetchStudents}
                        setOpenFeeModal={setOpenFeeModal}
                    />
                </Modal>
            )}
        </div>
    )
}

export default ListStudents
