import React from 'react'

const NotAuthorzied = () => {
    return (
        <div className="px-6 py-4">
            <div className="w-full p-6 rounded-md bg-red-100 shadow-sm border-red-200 border-1">
                <p className="text-red-500">
                    You do not have necessary permission to view this page
                </p>
            </div>
        </div>
    )
}

export default NotAuthorzied
