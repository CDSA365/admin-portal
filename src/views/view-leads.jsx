import { EyeIcon, MailIcon, PhoneIcon, TrashIcon } from '@heroicons/react/solid'
import axios from 'axios'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/card'
import PaginatedItems from '../components/paginated-items'
import Placeholder from '../components/placeholder'
import { config } from '../config/config'
import { capitalize } from '../helpers/helper'

const LeadList = ({ data, deleteLead }) => {
    return (
        <Card
            title={`Leads (${data?.length})`}
            bodyClass="p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300"
        >
            <table className="table border-0 shadow-none">
                <thead>
                    <tr className="border-l-4 border-l-sky-100">
                        <th className="thead">Name</th>
                        <th className="thead">Email</th>
                        <th className="thead">Phone</th>
                        <th className="thead">Program</th>
                        <th className="thead">Lead captured at</th>
                        <th className="thead">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {data.map((lead, key) => {
                        return (
                            <tr
                                key={key}
                                className={`text-sm divide-x ${
                                    lead.viewed === 0 &&
                                    'bg-teal-50 border-l-4 border-l-teal-500 '
                                }`}
                            >
                                <td className="px-4 py-2">
                                    <div className="min-w-max">
                                        {lead.first_name} {lead.last_name}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="min-w-max">
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="flex items-center"
                                        >
                                            <MailIcon
                                                className="w-4 h-4 mr-2 text-sky-500"
                                                fill="currentColor"
                                            />
                                            {lead.email}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="min-w-max">
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="flex items-center"
                                        >
                                            <PhoneIcon
                                                className="w-4 h-4 mr-2 text-sky-500"
                                                fill="currentColor"
                                            />
                                            {lead.phone}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="min-w-max">
                                        {lead.program
                                            ? capitalize(lead.program)
                                            : '-'}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="min-w-max">
                                        {moment(lead.created_at)
                                            .tz('Asia/Kolkata')
                                            .format('LLL')}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex space-x-4 min-w-max">
                                        <Link
                                            to={`/dashboard/leads/view/${lead.id}`}
                                            state={{
                                                ...lead,
                                            }}
                                        >
                                            <div className="flex items-center text-sky-500 hover:text-sky-600">
                                                <EyeIcon className="w-4 h-4 mr-2" />
                                                View
                                            </div>
                                        </Link>
                                        <div
                                            className="flex items-center text-red-500 hover:text-red-600 cursor-pointer"
                                            onClick={() => deleteLead(lead.id)}
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    )
}

const ViewLeads = () => {
    const [leads, setLeads] = useState([])

    const fetchLeads = async () => {
        try {
            const { data } = await axios.get(config.api.getLeads)
            setLeads(data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteLead = (id) => {
        axios
            .delete(config.api.deleteLead + `/${id}`)
            .then(() => fetchLeads())
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    return (
        <div className="px-6 py-4">
            {leads.length > 0 ? (
                <PaginatedItems
                    itemsPerPage={15}
                    items={leads}
                    render={(result) => (
                        <LeadList data={result} deleteLead={deleteLead} />
                    )}
                />
            ) : (
                <Placeholder message={'No leads to list'} />
            )}
        </div>
    )
}

export default ViewLeads
