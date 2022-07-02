import { TrashIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { Button } from 'flowbite-react'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import Card from '../components/card'
import { config } from '../config/config'
import { capitalize } from '../helpers/helper'

const Announcements = () => {
    const timeFormat = 'yyyy-MM-DDTHH:mm'
    const [announcements, setAnnouncements] = useState([])
    const [formData, setFormData] = useState({
        entity: 'STUDENT',
        start_time: moment().tz('Asia/Kolkata').format(timeFormat),
        end_time: moment().tz('Asia/Kolkata').add(1, 'day').format(timeFormat),
        message: '',
    })

    const fetchAnnouncements = () => {
        axios
            .get(config.api.getAnnouncements)
            .then(({ data }) => setAnnouncements(data))
            .finally(() =>
                setFormData((state) => ({
                    ...state,
                    entity: 'STUDENT',
                    message: '',
                }))
            )
    }

    const handleChange = (e) => {
        setFormData((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    const makeAnnouncement = () => {
        axios
            .post(config.api.makeAnnouncement, formData)
            .then(() => fetchAnnouncements())
            .catch((err) => console.log(err))
    }

    const deleteAnnouncement = (id) => {
        axios
            .delete(config.api.deleteAnnouncement + `/${id}`)
            .then(() => fetchAnnouncements())
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    return (
        <div className="px-6 py-4 space-y-6">
            <Card title={'Announcements'}>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label
                                className="text-gray-600 text-sm"
                                htmlFor="for"
                            >
                                Announcement For
                            </label>
                            <select
                                name="entity"
                                id="entity"
                                className="form-control"
                                value={formData.entity || ''}
                                onChange={handleChange}
                            >
                                <option value="TRAINER">Trainers</option>
                                <option value="STUDENT">Students</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="text-gray-600 text-sm"
                                htmlFor="start_time"
                            >
                                Valid from
                            </label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                id="start_time"
                                className="form-control"
                                value={formData.start_time || 0}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                className="text-gray-600 text-sm"
                                htmlFor="end_time"
                            >
                                Valid till
                            </label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                id="end_time"
                                className="form-control"
                                value={formData.end_time || 0}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            className="text-gray-600 text-sm"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows="5"
                            className="form-control"
                            value={formData.message || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-wrap justify-end">
                        <Button
                            className="float-right"
                            onClick={makeAnnouncement}
                        >
                            Make Announcement
                        </Button>
                    </div>
                </div>
            </Card>
            <Card title={'All Announcements'} bodyClass="p-0">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="thead">For</th>
                            <th className="thead">Message</th>
                            <th className="thead">Valid from</th>
                            <th className="thead">Valid through</th>
                            <th className="thead">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement, key) => (
                            <tr key={key}>
                                <td className="p-4">
                                    {capitalize(
                                        announcement.entity.toLowerCase()
                                    )}
                                </td>
                                <td className="p-4">
                                    {announcement.message.substring(0, 50)}
                                    {announcement.message.length > 50 && '...'}
                                </td>
                                <td className="p-4">
                                    {moment(announcement.start_time)
                                        .tz('Asia/Kolkata')
                                        .format('LLL')}
                                </td>
                                <td className="p-4">
                                    {moment(announcement.end_time)
                                        .tz('Asia/Kolkata')
                                        .format('LLL')}
                                </td>
                                <td className="p-4">
                                    <TrashIcon
                                        className="text-red-500 w-5 h-5 cursor-pointer"
                                        fill="currentColor"
                                        onClick={() =>
                                            deleteAnnouncement(announcement.id)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}

export default Announcements
