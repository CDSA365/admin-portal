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
    SearchIcon,
    TrashIcon,
} from '@heroicons/react/solid'
import AddCategoryDropdown from '../components/add-category-dropdown'
import Modal from '../components/modal'
import { Link } from 'react-router-dom'
import LoadingPlaceholder from '../components/loading-placeholder'
import { Button, Table, TextInput } from 'flowbite-react'
import PaginatedItems from '../components/paginated-items'

const ListClasses = () => {
    const [classes, setClasses] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
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
                    <Button
                        size="xs"
                        color="light"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FilterIcon className="w-4 h-4" fill="currentColor" />
                    </Button>
                    {showActionButton && (
                        <>
                            <Button
                                onClick={triggerModal}
                                size="xs"
                                color="light"
                            >
                                <FolderAddIcon className="w-4 h-4 mr-2" />
                                Add category
                            </Button>
                            <Button
                                onClick={bulkDeleteClasses}
                                size="xs"
                                color="light"
                            >
                                <TrashIcon
                                    className="w-4 h-4 mr-2 text-red-500"
                                    fill="currentColor"
                                />
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full my-3">
                <TextInput
                    placeholder="Search classes"
                    icon={SearchIcon}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full">
                <PaginatedItems
                    items={cls}
                    itemsPerPage={20}
                    render={(data) => (
                        <div className="table-card overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
                            {/* <table className="items-center min-w-full bg-transparent border-collapse border-1 shadow-sm"> */}
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell className="thead w-4">
                                        <input
                                            className="checkbox"
                                            type="checkbox"
                                            name="sellect-all"
                                            onChange={handleAllChecked}
                                        />
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Title
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Category
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Trainer
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Date
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Time
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Status
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Progress
                                    </Table.HeadCell>
                                    <Table.HeadCell className="thead">
                                        Action
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {showFilter && (
                                        <Table.Row className="border-b bg-gray-100">
                                            <Table.Cell></Table.Cell>

                                            <Table.Cell>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={titleToFilter}
                                                    className="form-control-sm"
                                                    placeholder="Enter title to filter"
                                                    onChange={(e) =>
                                                        setTitleToFilter(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell>
                                                <input
                                                    type="text"
                                                    name="trainer_name"
                                                    value={nameToFilter}
                                                    className="form-control-sm"
                                                    placeholder="Enter name to filter"
                                                    onChange={(e) =>
                                                        setNameToFilter(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                            <Table.Cell>
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
                                                    <option value={''}>
                                                        Select
                                                    </option>
                                                    <option value={0}>
                                                        Draft
                                                    </option>
                                                    <option value={1}>
                                                        Published
                                                    </option>
                                                </select>
                                            </Table.Cell>
                                            <Table.Cell>
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
                                                    <option value={''}>
                                                        Select
                                                    </option>
                                                    <option value={'SCHEDULED'}>
                                                        Scheduled
                                                    </option>
                                                    <option
                                                        value={'IN PROGRESS'}
                                                    >
                                                        In progress
                                                    </option>
                                                    <option value={'COMPLETED'}>
                                                        Completed
                                                    </option>
                                                </select>
                                            </Table.Cell>
                                            <Table.Cell className="text-center text-sm text-red-400">
                                                <span
                                                    onClick={clearFilter}
                                                    className="cursor-pointer"
                                                >
                                                    Clear filter
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                    {classes.length > 0
                                        ? data
                                              .filter((c) =>
                                                  c.title
                                                      .toLowerCase()
                                                      .includes(
                                                          searchTerm.toLowerCase()
                                                      )
                                              )
                                              .map((c, key) => (
                                                  <Table.Row
                                                      key={key}
                                                      className="transition-transform"
                                                  >
                                                      <Table.Cell
                                                          nowrap
                                                          className="w-4"
                                                      >
                                                          <div className="min-w-max">
                                                              <input
                                                                  className="checkbox"
                                                                  type="checkbox"
                                                                  name="sellect-class"
                                                                  value={c.id}
                                                                  checked={
                                                                      c.isChecked
                                                                  }
                                                                  onChange={
                                                                      handleCheckboxChange
                                                                  }
                                                              />
                                                          </div>
                                                      </Table.Cell>
                                                      <Link
                                                          to={`/dashboard/classes/view/${c.slug}`}
                                                          state={{ class: c }}
                                                      >
                                                          <Table.Cell
                                                              nowrap
                                                              className="w-1/2 space-y-2 text-truncate"
                                                          >
                                                              <div className="min-w-max">
                                                                  <p className="text-slate-700 font-semibold">
                                                                      {c.title}
                                                                  </p>
                                                              </div>
                                                          </Table.Cell>
                                                      </Link>
                                                      <Table.Cell className="text-sm">
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
                                                      </Table.Cell>
                                                      <Table.Cell
                                                          nowrap
                                                          className="text-sm"
                                                      >
                                                          <div className="min-w-max">
                                                              <Link
                                                                  to={`/dashboard/trainers/view/${c.trainer_id}`}
                                                                  className="hover:text-sky-500"
                                                              >
                                                                  {
                                                                      c.trainer_name
                                                                  }
                                                              </Link>
                                                          </div>
                                                      </Table.Cell>
                                                      <Table.Cell
                                                          nowrap
                                                          className="text-sm"
                                                      >
                                                          <div className="min-w-max">
                                                              {moment(
                                                                  c.start_time
                                                              )
                                                                  .tz(
                                                                      'Asia/Kolkata'
                                                                  )
                                                                  .format('LL')}
                                                          </div>
                                                      </Table.Cell>
                                                      <Table.Cell
                                                          nowrap
                                                          className="text-sm"
                                                      >
                                                          <div className="min-w-max">
                                                              {moment(
                                                                  c.start_time
                                                              )
                                                                  .tz(
                                                                      'Asia/Kolkata'
                                                                  )
                                                                  .format(
                                                                      'LT'
                                                                  ) +
                                                                  ' - ' +
                                                                  moment(
                                                                      c.end_time
                                                                  )
                                                                      .tz(
                                                                          'Asia/Kolkata'
                                                                      )
                                                                      .format(
                                                                          'LT'
                                                                      )}
                                                          </div>
                                                      </Table.Cell>
                                                      <Table.Cell nowrap>
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
                                                      </Table.Cell>
                                                      <Table.Cell className="capitalize text-xs">
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
                                                      </Table.Cell>
                                                      <Table.Cell nowrap>
                                                          <div className="flex justify-end space-x-4 min-w-max">
                                                              <Link
                                                                  to={`/dashboard/classes/edit/${c.id}`}
                                                                  state={{
                                                                      class: c,
                                                                  }}
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
                                                                      deleteClass(
                                                                          c.id
                                                                      )
                                                                  }
                                                              />
                                                          </div>
                                                      </Table.Cell>
                                                  </Table.Row>
                                              ))
                                        : [...Array(9)].map((key) => {
                                              return (
                                                  <Table.Row key={key}>
                                                      {[...Array(8)].map(
                                                          (key) => (
                                                              <Table.Cell
                                                                  key={key}
                                                              >
                                                                  <LoadingPlaceholder />
                                                              </Table.Cell>
                                                          )
                                                      )}
                                                  </Table.Row>
                                              )
                                          })}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                />
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

export default ListClasses
