import { useState } from "react"
import { format } from "date-fns"
import { base_url } from "../../../layout/Title"
import Swal from "sweetalert2"
import { useQuery } from "@tanstack/react-query"


function TaskManagement() {

      const { data: tasks = [], refetch, isLoading } = useQuery({
            queryKey: ["tasks"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/task/get-task`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });

      console.log(tasks);

      const [newTask, setNewTask] = useState("")
      const [newDescription, setNewDescription] = useState("")
      const [newStatus, setNewStatus] = useState("planning")
      const [newAssignee, setNewAssignee] = useState("John")
      const [newPriority, setNewPriority] = useState("Medium")
      const [newDueDate, setNewDueDate] = useState("")
      const [newTags, setNewTags] = useState("")
      const [showAddTaskModal, setShowAddTaskModal] = useState(false)
      const [searchTerm, setSearchTerm] = useState("")
      const [selectedTask, setSelectedTask] = useState(null)
      const [showTaskModal, setShowTaskModal] = useState(false)

      const team = ["John", "Sarah", "Mike", "Emma"]
      const priorities = ["Low", "Medium", "High"]
      const columns = [
            { id: "planning", name: "Planning" },
            { id: "in_progress", name: "In Progress" },
            { id: "complete", name: "Complete" },
      ]

      const addTask = () => {
            if (newTask.trim() !== "") {
                  const newTaskObj = {
                        text: newTask,
                        description: newDescription,
                        status: newStatus,
                        assignedTo: newAssignee,
                        priority: newPriority,
                        dueDate: newDueDate,
                        timestamp: new Date().toISOString(),
                        tags: newTags
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag !== ""),
                  }

                  fetch(`${base_url}/task/add-task`, {
                        method: "POST",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(newTaskObj),
                  })
                        .then((res) => res.json())
                        .then((data) => {
                              if (data.success) {
                                    Swal.fire(data.message, " ", "success")
                                    refetch()
                              }
                        })
                  resetForm()
                  setShowAddTaskModal(false)
            }
      }

      const resetForm = () => {
            setNewTask("")
            setNewDescription("")
            setNewStatus("planning")
            setNewAssignee("John")
            setNewPriority("Medium")
            setNewDueDate("")
            setNewTags("")
      }

      const updateTask = (taskId, updates) => {
            // setTasks(tasks.map((task) => (task._id === taskId ? { ...task, ...updates } : task)))
      }

      const deleteTask = (id) => {
            // setTasks(tasks.filter((task) => task._id !== id))
      }

      const onDragEnd = (result) => {
            if (!result.destination) return

            const { source, destination } = result
            const taskId = Number.parseInt(result.draggableId)
            const newStatus = destination.droppableId

            if (source.droppableId !== destination.droppableId) {
                  updateTask(taskId, { status: newStatus })
            }
      }

      const getPriorityColor = (priority) => {
            const colors = {
                  High: "text-red-500",
                  Medium: "text-yellow-500",
                  Low: "text-green-500",
            }
            return colors[priority] || "text-gray-500"
      }

      const getAssigneeInitials = (name) => {
            return name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
      }

      const openTaskModal = (task) => {
            setSelectedTask(task)
            setShowTaskModal(true)
      }

      const filteredTasks = tasks.filter(
            (task) =>
                  task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )



      return (
            <div className=" min-h-screen w-full">
                  <div className=" px-4 py-8">
                        <div className="flex justify-between items-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-100">Task Management</h1>
                              <button
                                    onClick={() => setShowAddTaskModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                              >
                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 mr-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                    >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Task
                              </button>
                        </div>

                        <div className="mb-6">
                              <input
                                    type="text"
                                    placeholder="Search tasks, descriptions, assignees, tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                        </div>



                        {/* Add Task Modal */}
                        {showAddTaskModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                          <div className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                      <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
                                                      <button
                                                            onClick={() => setShowAddTaskModal(false)}
                                                            className="text-gray-400 hover:text-gray-500"
                                                      >
                                                            <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-6 w-6"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  stroke="currentColor"
                                                            >
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                      </button>
                                                </div>
                                                <div className="grid gap-4">
                                                      <div className="grid gap-2">
                                                            <label htmlFor="task-name" className="text-sm font-medium text-gray-700">
                                                                  Task Name
                                                            </label>
                                                            <input
                                                                  id="task-name"
                                                                  value={newTask}
                                                                  onChange={(e) => setNewTask(e.target.value)}
                                                                  placeholder="Enter task name"
                                                                  className="px-3 py-2 border border-gray-700 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                      </div>
                                                      <div className="grid gap-2">
                                                            <label htmlFor="task-description" className="text-sm font-medium text-gray-700">
                                                                  Description
                                                            </label>
                                                            <textarea
                                                                  id="task-description"
                                                                  value={newDescription}
                                                                  onChange={(e) => setNewDescription(e.target.value)}
                                                                  placeholder="Enter task description"
                                                                  rows={3}
                                                                  className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-2">
                                                                  <label htmlFor="task-status" className="text-sm font-medium text-gray-700">
                                                                        Status
                                                                  </label>
                                                                  <select
                                                                        id="task-status"
                                                                        value={newStatus}
                                                                        onChange={(e) => setNewStatus(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                  >
                                                                        {columns.map((column) => (
                                                                              <option key={column._id} value={column._id}>
                                                                                    {column.name}
                                                                              </option>
                                                                        ))}
                                                                  </select>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                  <label htmlFor="task-assignee" className="text-sm font-medium text-gray-700">
                                                                        Assignee
                                                                  </label>
                                                                  <select
                                                                        id="task-assignee"
                                                                        value={newAssignee}
                                                                        onChange={(e) => setNewAssignee(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                  >
                                                                        {team.map((member) => (
                                                                              <option key={member} value={member}>
                                                                                    {member}
                                                                              </option>
                                                                        ))}
                                                                  </select>
                                                            </div>
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-2">
                                                                  <label htmlFor="task-priority" className="text-sm font-medium text-gray-700">
                                                                        Priority
                                                                  </label>
                                                                  <select
                                                                        id="task-priority"
                                                                        value={newPriority}
                                                                        onChange={(e) => setNewPriority(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                  >
                                                                        {priorities.map((priority) => (
                                                                              <option key={priority} value={priority}>
                                                                                    {priority}
                                                                              </option>
                                                                        ))}
                                                                  </select>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                  <label htmlFor="task-due-date" className="text-sm font-medium text-gray-700">
                                                                        Due Date
                                                                  </label>
                                                                  <input
                                                                        id="task-due-date"
                                                                        type="date"
                                                                        value={newDueDate}
                                                                        onChange={(e) => setNewDueDate(e.target.value)}
                                                                        className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                  />
                                                            </div>
                                                      </div>
                                                      <div className="grid gap-2">
                                                            <label htmlFor="task-tags" className="text-sm font-medium text-gray-700">
                                                                  Tags
                                                            </label>
                                                            <input
                                                                  id="task-tags"
                                                                  value={newTags}
                                                                  onChange={(e) => setNewTags(e.target.value)}
                                                                  placeholder="Enter tags (comma-separated)"
                                                                  className="px-3 py-2 border bg-white border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                      </div>
                                                </div>
                                                <div className="mt-6 flex justify-end space-x-3">
                                                      <button
                                                            onClick={() => setShowAddTaskModal(false)}
                                                            className="px-4 py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                                      >
                                                            Cancel
                                                      </button>
                                                      <button
                                                            onClick={addTask}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                      >
                                                            Add Task
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        )}

                        {/* Task Detail Modal */}
                        {showTaskModal && selectedTask && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                          <div className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                      <h3
                                                            className={`text-lg font-semibold ${selectedTask.status === "complete" ? "text-gray-400 line-through" : "text-gray-900"
                                                                  }`}
                                                      >
                                                            {selectedTask.text}
                                                      </h3>
                                                      <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-500">
                                                            <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-6 w-6"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  stroke="currentColor"
                                                            >
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                      </button>
                                                </div>
                                                <div className="grid gap-4">
                                                      <div className="grid gap-2">
                                                            <h4 className="text-sm font-medium text-gray-700">Description</h4>
                                                            <p className="text-sm text-gray-500">{selectedTask.description}</p>
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-2">
                                                                  <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-gray-500"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                  >
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                        />
                                                                  </svg>
                                                                  <span className="text-sm">{selectedTask.assignedTo}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                  <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-4 w-4 ${getPriorityColor(selectedTask.priority)}`}
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                  >
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5L21 11.5V19a2 2 0 01-2 2h-8a2 2 0 01-2-2z"
                                                                        />
                                                                  </svg>
                                                                  <span className="text-sm">{selectedTask.priority}</span>
                                                            </div>
                                                      </div>
                                                      {selectedTask.dueDate && (
                                                            <div className="flex items-center gap-2">
                                                                  <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-gray-500"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                  >
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                        />
                                                                  </svg>
                                                                  <span className="text-sm">{format(new Date(selectedTask.dueDate), "MMMM d, yyyy")}</span>
                                                            </div>
                                                      )}
                                                      {selectedTask.tags.length > 0 && (
                                                            <div className="grid gap-2">
                                                                  <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                                                                  <div className="flex flex-wrap gap-2">
                                                                        {selectedTask.tags.map((tag, i) => (
                                                                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                                    {tag}
                                                                              </span>
                                                                        ))}
                                                                  </div>
                                                            </div>
                                                      )}
                                                      <div className="grid gap-2">
                                                            <h4 className="text-sm font-medium text-gray-700">Status</h4>
                                                            <select
                                                                  value={selectedTask.status}
                                                                  onChange={(e) => {
                                                                        const newStatus = e.target.value
                                                                        updateTask(selectedTask._id, { status: newStatus })
                                                                        setSelectedTask({ ...selectedTask, status: newStatus })
                                                                  }}
                                                                  className="px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                  {columns.map((column) => (
                                                                        <option key={column._id} value={column._id}>
                                                                              {column.name}
                                                                        </option>
                                                                  ))}
                                                            </select>
                                                      </div>
                                                </div>
                                                <div className="mt-6 flex justify-between">
                                                      <button
                                                            onClick={() => {
                                                                  deleteTask(selectedTask._id)
                                                                  setShowTaskModal(false)
                                                            }}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                                                      >
                                                            <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-4 w-4 mr-2"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  stroke="currentColor"
                                                            >
                                                                  <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                  />
                                                            </svg>
                                                            Delete
                                                      </button>
                                                      <div className="flex gap-2">
                                                            <button
                                                                  onClick={() => {
                                                                        const newStatus = selectedTask.status === "complete" ? "in_progress" : "complete"
                                                                        updateTask(selectedTask._id, { status: newStatus })
                                                                        setSelectedTask({ ...selectedTask, status: newStatus })
                                                                  }}
                                                                  className="px-4 py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                                                            >
                                                                  {selectedTask.status === "complete" ? (
                                                                        <>
                                                                              <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-4 w-4 mr-2"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                              >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                              </svg>
                                                                              Mark Incomplete
                                                                        </>
                                                                  ) : (
                                                                        <>
                                                                              <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-4 w-4 mr-2"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                              >
                                                                                    <path
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          strokeWidth={2}
                                                                                          d="M5 13l4 4L19 7"
                                                                                    />
                                                                              </svg>
                                                                              Mark Complete
                                                                        </>
                                                                  )}
                                                            </button>
                                                            <button
                                                                  onClick={() => setShowTaskModal(false)}
                                                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                            >
                                                                  Close
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      )
}

export default TaskManagement
