import { Footer } from 'flowbite-react'
import moment from 'moment'
import React from 'react'

const DashboardFooter = () => {
    return (
        <Footer className="flex flex-col rounded-none shadow-none">
            <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="font-semibold text-gray-400">
                        Carpe Diem Skills Acedemy
                    </p>
                </div>
                <Footer.LinkGroup className="mt-3 flex-wrap items-center text-sm sm:mt-0">
                    <Footer.Link href="#">About</Footer.Link>
                    <Footer.Link href="#">Privacy Policy</Footer.Link>
                    <Footer.Link href="#">Licensing</Footer.Link>
                    <Footer.Link href="#">Contact</Footer.Link>
                </Footer.LinkGroup>
            </div>
            <hr className="my-3 w-full border-gray-200 p-1 dark:border-gray-700 sm:mx-auto lg:my-4" />
            <Footer.Copyright
                href="#"
                by="CDSA"
                year={moment().format('YYYY')}
            />
        </Footer>
    )
}

export default DashboardFooter
