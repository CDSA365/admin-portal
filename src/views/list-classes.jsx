import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Badge from '../components/badge'
import { config } from '../config/config'
import moment from 'moment-timezone'
import {
    EyeOffIcon,
    FilterIcon,
    FolderAddIcon,
    LightningBoltIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/solid'
import AddCategoryDropdown from '../components/add-category-dropdown'
import Modal from '../components/modal'
import { Link } from 'react-router-dom'
import LoadingPlaceholder from '../components/loading-placeholder'

const ListClasses = () => {
    const [classes, setClasses] = useState([])
    const [cls, setCls] = useState(classes)
    const [showActionButton, setShowActionButton] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [titleToFilter, setTitleToFilter] = useState('')
    const [nameToFilter, setNameToFilter] = useState('')
    const [statusToFilter, setStatusToFilter] = useState('')
    const [progressToFilter, setProgressToFilter] = useState('')
    const [selectedClasses, setSelectedClasses] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const defaultCategory = { name: 'Select a category', disabled: true }
    const [categories, setCategories] = useState([defaultCategory])
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

    const updateClassStatus = (id, status) => {
        const url = config.api.updateClass + `/${id}`
        axios.put(url, { status: status }).then(() => fetchClasses())
    }

    const fetchClasses = () => {
        axios
            .get(config.api.fetchAllClasses)
            .then(({ data }) => {
                data.map((d) => (d.isChecked = false))
                setClasses(data)
            })
            .catch((err) => console.log(err))
    }

    const fetchCategories = () => {
        const url = config.api.getCategory + '/class'
        axios
            .get(url)
            .then(({ data }) => setCategories((state) => [...state, ...data]))
            .catch((err) => console.log(err))
    }

    const addToCategory = () => {
        const url = config.api.addUserToCategory + '/class'
        axios
            .post(url, {
                cat_id: selectedCategory.id,
                user_list: selectedClasses.map((o) => o.id),
            })
            .then(({ data }) => fetchClasses())
            .catch((error) => console.log(error))
    }

    const deleteClass = (id) => {
        if (typeof id === 'number' || typeof id === 'string') {
            id = [id]
        }
        console.log(id)
        axios
            .delete(config.api.deleteClass, { data: id })
            .then(() => fetchClasses())
            .catch((err) => console.log(err))
    }

    const handleAllChecked = (e) => {
        const classesCheckbox = cls
        classesCheckbox.forEach((o) => (o.isChecked = e.target.checked))
        setClasses([...classesCheckbox])
    }

    const handleCheckboxChange = (e) => {
        const classesCheckbox = cls
        classesCheckbox.forEach((o) => {
            if (+o.id === +e.target.value) {
                o.isChecked = e.target.checked
            }
        })
        setClasses([...classesCheckbox])
    }

    const triggerModal = () => {
        const selected = cls.filter((o) => o.isChecked)
        setSelectedClasses(selected)
        setOpenModal(true)
    }

    const bulkDeleteClasses = () => {
        const selected = cls.filter((c) => c.isChecked).map((o) => o.id)
        deleteClass(selected)
    }

    const filterClassByTitle = (array, key) => {
        return key.length
            ? array.filter((item) =>
                  item.title.toLowerCase().includes(key.toLowerCase())
              )
            : array
    }

    const filterClassByName = (array, key) => {
        return key.length
            ? array.filter((item) =>
                  item.trainer_name.toLowerCase().includes(key.toLowerCase())
              )
            : array
    }

    const filterClassByStatus = (array, key) => {
        return key ? array.filter((item) => item.status === Number(key)) : array
    }

    const filterClassByProgress = (array, key) => {
        return key
            ? array.filter((item) =>
                  item.progress_state.toLowerCase().includes(key.toLowerCase())
              )
            : array
    }

    const clearFilter = () => {
        setTitleToFilter('')
        setNameToFilter('')
        setStatusToFilter('')
        setProgressToFilter('')
    }

    useEffect(() => {
        fetchClasses()
        fetchCategories()
        return () => setCategories([])
    }, [])

    useEffect(() => {
        setCls(classes)
        console.log(classes)
    }, [classes])

    useEffect(() => {
        const checkedCount = cls.filter((o) => o.isChecked)
        setShowActionButton(checkedCount.length > 0)
        if (openModal) setOpenModal(false)
    }, [cls])

    useEffect(() => {
        let classToFilter = classes
        classToFilter = filterClassByTitle(classToFilter, titleToFilter)
        classToFilter = filterClassByName(classToFilter, nameToFilter)
        classToFilter = filterClassByStatus(classToFilter, statusToFilter)
        classToFilter = filterClassByProgress(classToFilter, progressToFilter)
        setCls(classToFilter)
    }, [titleToFilter, nameToFilter, statusToFilter, progressToFilter])

    useEffect(() => {
        if (!showFilter) {
            titleToFilter.length && setTitleToFilter('')
            nameToFilter.length && setNameToFilter('')
            statusToFilter.length && setStatusToFilter('')
            progressToFilter.length && setProgressToFilter('')
        }
    }, [showFilter])

    return (
        <div className="px-6 py-4">
            <div className="flex w-full justify-between py-4">
                <h4 className="font-semibold text-gray-500">
                    All Classes ({cls.length})
                </h4>
                <div className="action-section flex justify-end space-x-2">
                    <button
                        className="btn-sm btn-gray text-blue-400"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FilterIcon className="w-4 h-4" fill="currentColor" />
                    </button>
                    {showActionButton && (
                        <>
                            <button
                                type="button"
                                className="btn-sm btn-gray"
                                onClick={triggerModal}
                            >
                                <FolderAddIcon className="w-4 h-4 mr-2" />
                                Add category
                            </button>
                            <button
                                type="button"
                                className="btn-sm btn-gray"
                                onClick={bulkDeleteClasses}
                            >
                                <TrashIcon
                                    className="w-4 h-4 mr-2 text-red-500"
                                    fill="currentColor"
                                />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full">
                <div className="table-card overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
                    <table className="items-center min-w-full bg-transparent border-collapse border-1 shadow-sm">
                        <thead>
                            <th className="thead w-4">
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    name="sellect-all"
                                    onChange={handleAllChecked}
                                />
                            </th>
                            <th className="thead">Title</th>
                            <th className="thead">Category</th>
                            <th className="thead">Trainer</th>
                            <th className="thead">Date</th>
                            <th className="thead">Time</th>
                            <th className="thead">Status</th>
                            <th className="thead">Progress</th>
                            <th className="thead">Action</th>
                        </thead>
                        <tbody className="divide-y">
                            {showFilter && (
                                <tr className="border-b bg-gray-100">
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            name="title"
                                            value={titleToFilter}
                                            className="form-control-sm"
                                            placeholder="Enter title to filter"
                                            onChange={(e) =>
                                                setTitleToFilter(e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            name="trainer_name"
                                            value={nameToFilter}
                                            className="form-control-sm"
                                            placeholder="Enter name to filter"
                                            onChange={(e) =>
                                                setNameToFilter(e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2">
                                        <select
                                            name="status"
                                            value={statusToFilter}
                                            className="form-control-sm"
                                            onChange={(e) =>
                                                setStatusToFilter(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value={''}>Select</option>
                                            <option value={0}>Draft</option>
                                            <option value={1}>Published</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            name="progress_state"
                                            value={progressToFilter}
                                            className="form-control-sm"
                                            onChange={(e) =>
                                                setProgressToFilter(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value={''}>Select</option>
                                            <option value={'SCHEDULED'}>
                                                Scheduled
                                            </option>
                                            <option value={'IN PROGRESS'}>
                                                In progress
                                            </option>
                                            <option value={'COMPLETED'}>
                                                Completed
                                            </option>
                                        </select>
                                    </td>
                                    <td className="text-center text-sm text-red-400">
                                        <span
                                            onClick={clearFilter}
                                            className="cursor-pointer"
                                        >
                                            Clear filter
                                        </span>
                                    </td>
                                </tr>
                            )}
                            {classes.length > 0
                                ? cls.map((c, key) => (
                                      <tr
                                          key={key}
                                          className="transition-transform"
                                      >
                                          <td nowrap className="px-4 py-2 w-4">
                                              <div className="min-w-max">
                                                  <input
                                                      className="checkbox"
                                                      type="checkbox"
                                                      name="sellect-class"
                                                      value={c.id}
                                                      checked={c.isChecked}
                                                      onChange={
                                                          handleCheckboxChange
                                                      }
                                                  />
                                              </div>
                                          </td>
                                          <Link
                                              to={`/dashboard/classes/view/${c.slug}`}
                                              state={{ class: c }}
                                          >
                                              <td
                                                  nowrap
                                                  className="px-4 py-2 w-1/2 space-y-2 text-truncate"
                                              >
                                                  <div className="min-w-max">
                                                      <p className="text-slate-700">
                                                          {c.title}
                                                      </p>
                                                  </div>
                                              </td>
                                          </Link>
                                          <td className="px-4 py-2 text-sm">
                                              <div className="min-w-max">
                                                  <p className="text-xs text-slate-400">
                                                      {c.categories.map(
                                                          (cat) => (
                                                              <Badge
                                                                  color="sky"
                                                                  message={
                                                                      cat.name
                                                                  }
                                                              />
                                                          )
                                                      )}
                                                  </p>
                                              </div>
                                          </td>
                                          <td
                                              nowrap
                                              className="px-4 py-2 text-sm"
                                          >
                                              <div className="min-w-max">
                                                  <Link
                                                      to={`/dashboard/trainers/view/${c.trainer_id}`}
                                                      className="hover:text-sky-500"
                                                  >
                                                      {c.trainer_name}
                                                  </Link>
                                              </div>
                                          </td>
                                          <td
                                              nowrap
                                              className="px-4 py-2 text-sm"
                                          >
                                              <div className="min-w-max">
                                                  {moment(c.start_time)
                                                      .tz('Asia/Kolkata')
                                                      .format('LL')}
                                              </div>
                                          </td>
                                          <td
                                              nowrap
                                              className="px-4 py-2 text-sm"
                                          >
                                              <div className="min-w-max">
                                                  {moment(c.start_time)
                                                      .tz('Asia/Kolkata')
                                                      .format('LT') +
                                                      ' - ' +
                                                      moment(c.end_time)
                                                          .tz('Asia/Kolkata')
                                                          .format('LT')}
                                              </div>
                                          </td>
                                          <td nowrap className="px-4 py-2">
                                              <div className="min-w-max">
                                                  {
                                                      <Badge
                                                          color={
                                                              c.status
                                                                  ? 'green'
                                                                  : 'yellow'
                                                          }
                                                          message={
                                                              c.status
                                                                  ? 'Published'
                                                                  : 'Draft'
                                                          }
                                                      />
                                                  }
                                              </div>
                                          </td>
                                          <td className="px-4 py-2 capitalize text-xs">
                                              <div className="min-w-max">
                                                  {c.progress_state ===
                                                      'COMPLETED' && (
                                                      <Badge
                                                          color="red"
                                                          message={c.progress_state.toLowerCase()}
                                                      />
                                                  )}
                                                  {c.progress_state ===
                                                      'SCHEDULED' && (
                                                      <Badge
                                                          color="blue"
                                                          message={c.progress_state.toLowerCase()}
                                                      />
                                                  )}
                                                  {c.progress_state ===
                                                      'IN PROGRESS' && (
                                                      <Badge
                                                          color="green"
                                                          message={c.progress_state.toLowerCase()}
                                                      />
                                                  )}
                                              </div>
                                          </td>
                                          <td nowrap className="px-4 py-2">
                                              <div className="flex justify-end space-x-4 min-w-max">
                                                  <Link
                                                      to={`/dashboard/classes/edit/${c.id}`}
                                                      state={{ class: c }}
                                                  >
                                                      <PencilIcon
                                                          className="h-5 w-5 cursor-pointer"
                                                          fill="currentColor"
                                                      />
                                                  </Link>
                                                  {!c.status ? (
                                                      <LightningBoltIcon
                                                          className="h-5 w-5 text-teal-500 hover:cursor-pointer"
                                                          fill="currentColor"
                                                          onClick={() =>
                                                              updateClassStatus(
                                                                  c.id,
                                                                  1
                                                              )
                                                          }
                                                      />
                                                  ) : (
                                                      <EyeOffIcon
                                                          className="h-5 w-5 text-sky-500 hover:cursor-pointer"
                                                          fill="currentColor"
                                                          onClick={() =>
                                                              updateClassStatus(
                                                                  c.id,
                                                                  0
                                                              )
                                                          }
                                                      />
                                                  )}
                                                  <TrashIcon
                                                      className="h-5 w-5 text-red-500 hover:cursor-pointer"
                                                      fill="currentColor"
                                                      onClick={() =>
                                                          deleteClass(c.id)
                                                      }
                                                  />
                                              </div>
                                          </td>
                                      </tr>
                                  ))
                                : [...Array(8)].map((key) => {
                                      return (
                                          <tr key={key}>
                                              {[...Array(8)].map((key) => (
                                                  <td
                                                      key={key}
                                                      className="px-4 py-2"
                                                  >
                                                      <LoadingPlaceholder />
                                                  </td>
                                              ))}
                                          </tr>
                                      )
                                  })}
                        </tbody>
                    </table>
                </div>
            </div>
            {openModal && (
                <Modal setOpenModel={setOpenModal}>
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

export default ListClasses