import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { config } from '../config/config'
import moment from 'moment'
import { LightningBoltIcon, SaveIcon } from '@heroicons/react/solid'
import Placeholder from '../components/placeholder'
import Badge from '../components/badge'
import ListStudentCategories from '../components/list-student-categories'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import { ToggleSwitch } from '../components/switch'
import weekends from 'react-multi-date-picker/plugins/highlight_weekends'

const formDataDefaults = {
    type: 'phone',
    recurring: false,
    date: [],
    start: moment().format('HH:mm'),
    end: moment().add(1, 'hour').format('HH:mm'),
}

const AddNewClasses = () => {
    const { state, pathname } = useLocation()
    const [trainers, setTrainers] = useState([])
    const [categories, setCategories] = useState([])
    const [showButton, setShowButton] = useState(false)
    const [recurringDate, setRecurringDate] = useState()
    const [isRecurring, setIsRecurring] = useState(false)
    const [formData, setFormData] = useState(() => {
        if (!state) {
            return formDataDefaults
        } else {
            let timeFormat = 'yyyy-MM-DDThh:mm'
            return {
                id: state.class.id,
                title: state.class.title,
                description: state.class.description,
                type: state.class.type,
                recurring: state.class.recurring,
                start: moment(state.class.start_time).format(timeFormat),
                end: moment(state.class.end_time).format(timeFormat),
                video_link: state.class.video_link,
            }
        }
    })
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const handleChange = (e) => {
        setFormData((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    const getTrainerName = (id) => {
        const trainer = trainers.find((t) => +t.id === +id)
        return trainer ? trainer.first_name + ' ' + trainer.last_name : ''
    }

    const getCategoryName = (id) => {
        const category = categories.find((c) => +c.id === +id)
        return category ? category.name : ''
    }

    const createClass = () => {
        const data = { ...formData, status: 1 }
        axios
            .post(config.api.createClass, data)
            .then(({ data }) => setFormData(formDataDefaults))
            .catch((err) => console.log(err))
    }

    const publishLater = () => {
        const data = { ...formData, status: 0 }
        axios
            .post(config.api.createClass, data)
            .then(({ data }) => setFormData({}))
            .catch((err) => console.log(err))
    }

    const handlerecurranceChange = (key, value) => {
        setIsRecurring(value)
        setFormData((state) => ({ ...state, [key]: value }))
    }

    const convertTime = (value, railway = true) => {
        const dateTime = moment(value, 'HH:mm').toDate()
        const formatedTime = moment(dateTime).format(
            railway ? 'HH:mm' : 'hh:mm A'
        )
        return formatedTime
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target
        const dateTime = moment(value, 'HH:mm').toDate()
        const formatedTime = moment(dateTime).format('HH:mm')
        setFormData((state) => ({ ...state, [name]: formatedTime }))
    }

    useEffect(() => {
        axios
            .get(config.api.fetchTrainers)
            .then(({ data }) => setTrainers(data))
        axios
            .get(`${config.api.getCategory}/class`)
            .then(({ data }) => setCategories(data))
    }, [])

    useEffect(() => {
        if (pathname.includes('add-new')) {
            setFormData(formDataDefaults)
        }
    }, [pathname])

    useEffect(() => {
        console.log(formData)
        let videoLinkOk = false

        if (formData.type === 'video') {
            if (formData.video_link) videoLinkOk = true
        } else {
            videoLinkOk = true
        }

        if (
            formData.title &&
            formData.description &&
            formData.type &&
            formData.start &&
            formData.end &&
            formData.trainer &&
            videoLinkOk &&
            formData.date.length
        ) {
            setShowButton(true)
        } else {
            setShowButton(false)
        }
    }, [formData])

    useEffect(() => {
        const dateTime = moment(formData.start, 'HH:mm').toDate()
        const endTime = moment(dateTime).add(1, 'hour').format('HH:mm')
        setFormData((state) => ({ ...state, end: endTime }))
    }, [formData.start])

    useEffect(() => {
        if (recurringDate instanceof DateObject) {
            let date = recurringDate.toDate()
            setFormData((state) => ({
                ...state,
                date: [moment(date).format()],
            }))
        } else {
            let date = recurringDate?.map((rd) => moment(rd.toDate()).format())
            setFormData((state) => ({
                ...state,
                date: date || [],
            }))
        }
    }, [recurringDate])

    return (
        <div className="px-6 py-4">
            <div className="flex space-x-6">
                <div className="w-2/3">
                    <div className="flex w-full py-4">
                        <h4 className="font-semibold text-gray-500">
                            Add new class
                        </h4>
                    </div>
                    <div className="card space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Class Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Eg:- Computer Science"
                                value={formData.title ?? ''}
                                onChange={handleChange}
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Enter the title of the class
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Class Description
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                className="form-control"
                                placeholder="Categroy description."
                                value={formData.description ?? ''}
                                onChange={handleChange}
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Enter a description for the class
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Class Type
                                </label>
                                <select
                                    name="type"
                                    className="form-control"
                                    value={formData.type ?? 'phone'}
                                    onChange={handleChange}
                                >
                                    <option value="phone">Phone</option>
                                    <option value="video">Video</option>
                                </select>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Choose the type of class
                                </p>
                            </div>
                            <div className="w-1/2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Video Link
                                    </label>
                                    <input
                                        type="text"
                                        name="video_link"
                                        className="form-control"
                                        value={formData.video_link ?? ''}
                                        onChange={handleChange}
                                        disabled={formData.type !== 'video'}
                                    />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Enter link to the video
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="w-2/12">
                                <ToggleSwitch
                                    label={'Recurring'}
                                    className="block"
                                    name="recurring"
                                    value={formData.recurring || false}
                                    action={(k, v) =>
                                        handlerecurranceChange(k, v)
                                    }
                                />
                            </div>
                            <div className="w-4/12">
                                <label
                                    htmlFor="recurrence_start"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Date
                                </label>
                                <DatePicker
                                    multiple={isRecurring}
                                    plugins={[
                                        weekends(),
                                        <DatePanel
                                            markFocused
                                            focusedClassName="bg-red-500"
                                        />,
                                    ]}
                                    placeholder="YYYY/MM/DD"
                                    value={recurringDate}
                                    minDate={new Date()}
                                    weekDays={weekDays}
                                    sort
                                    name="recurring_dates"
                                    onChange={(value) =>
                                        setRecurringDate(value)
                                    }
                                    inputClass="form-control"
                                    containerClassName="block"
                                />
                            </div>
                            <div className="w-3/12">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    name="start"
                                    className="form-control"
                                    value={convertTime(formData.start)}
                                    onChange={handleTimeChange}
                                />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Class start time
                                </p>
                            </div>
                            <div className="w-3/12">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    name="end"
                                    className="form-control"
                                    min={convertTime(formData.start)}
                                    value={convertTime(formData.end)}
                                    onChange={handleTimeChange}
                                />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Class end time
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="w-1/2">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Choose Trainer
                                </label>
                                <select
                                    className="form-control"
                                    name="trainer"
                                    onChange={handleChange}
                                >
                                    <option value={null}>Select trainer</option>
                                    {trainers.map((trainer, i) => (
                                        <option value={trainer.id} key={i}>
                                            {trainer.first_name +
                                                ' ' +
                                                trainer.last_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Assign a trainer to the class. If no
                                    trainers listed, please create a trainer{' '}
                                    <Link
                                        to="/dashboard/trainers/add-new"
                                        className="underline text-blue-500"
                                    >
                                        here
                                    </Link>
                                </p>
                            </div>
                            <div className="w-1/2">
                                <ListStudentCategories
                                    handleChange={handleChange}
                                    formData={formData}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Choose Class Category
                            </label>
                            <select
                                className="form-control"
                                name="category"
                                onChange={handleChange}
                            >
                                <option value={null}>Select category</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Assign this class to category. If no categories
                                listed, please create a category{' '}
                                <Link
                                    to="/dashboard/category/class"
                                    className="underline text-blue-500"
                                >
                                    here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="flex w-full py-4">
                        <h4 className="font-semibold text-gray-500">Preview</h4>
                    </div>
                    <div className="card">
                        {Object.keys(formData).length > 0 ? (
                            <div className="flex flex-col space-y-6">
                                {formData.title && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Title
                                        </h4>
                                        <p className="font-bold">
                                            {formData.title}
                                        </p>
                                    </div>
                                )}
                                {formData.description && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Description
                                        </h4>
                                        <p className="font-normal">
                                            {formData.description}
                                        </p>
                                    </div>
                                )}
                                {formData.type && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Class Type{' '}
                                            <Badge
                                                color="red"
                                                message={formData.type}
                                                className="capitalize"
                                            />
                                        </h4>
                                    </div>
                                )}
                                {formData.start && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Start Time
                                        </h4>
                                        <p className="font-normal">
                                            {convertTime(formData.start, false)}
                                        </p>
                                    </div>
                                )}
                                {formData.end && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            End Time
                                        </h4>
                                        <p className="font-normal">
                                            {convertTime(formData.end, false)}
                                        </p>
                                    </div>
                                )}
                                {formData.trainer && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Assigned To
                                        </h4>
                                        <p className="font-normal">
                                            {getTrainerName(formData.trainer)}
                                        </p>
                                    </div>
                                )}
                                {formData.category && (
                                    <div>
                                        <h4 className="text-slate-500">
                                            Category
                                        </h4>
                                        <p className="font-normal">
                                            {getCategoryName(formData.category)}
                                        </p>
                                    </div>
                                )}
                                {showButton && (
                                    <div className="space-y-4">
                                        <button
                                            className="btn btn-danger w-full"
                                            onClick={createClass}
                                        >
                                            <LightningBoltIcon className="w-5 h-5 mr-2" />
                                            Publish class
                                        </button>
                                        <button
                                            className="btn btn-gray w-full"
                                            onClick={publishLater}
                                        >
                                            <SaveIcon className="w-5 h-5 mr-2" />{' '}
                                            Save and publish later
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Placeholder message="Enter class details to preview" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewClasses
