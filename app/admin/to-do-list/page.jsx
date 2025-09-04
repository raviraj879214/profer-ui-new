"use client";
import { useState } from "react";
import { Plus, Filter, MoreVertical, X } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialData = {
  todo: [
    { id: "1", title: "Finish user onboarding", date: "Tomorrow", comments: 1, assignee: "/user1.png" },
    { id: "2", title: "Solve the Dribbble prioritisation issue", date: "Jan 8, 2027", comments: 1, tag: "Marketing" },
    { id: "3", title: "Change license and remove products", date: "Jan 8, 2027", tag: "Dev" },
  ],
  inprogress: [
    { id: "4", title: "Work In Progress (WIP) Dashboard", date: "Today", comments: 1 },
    { id: "5", title: "Kanban Flow Manager", date: "Feb 12, 2027", comments: 2, tag: "Template" },
    { id: "6", title: "Product Update - Q4 2024", date: "Feb 12, 2027", comments: 8, description: "Dedicated form for a category of users.", image: "/product.png" },
  ],
  completed: [
    { id: "7", title: "Manage internal feedback", date: "Tomorrow", comments: 1 },
    { id: "8", title: "Do some projects on React Native with Flutter", date: "Jan 8, 2027", tag: "Development" },
    { id: "9", title: "Design marketing assets", date: "Jan 8, 2027", comments: 2, tag: "Marketing" },
  ],
};

export default function KanbanPage() {
  const [tasks, setTasks] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    tag: "",
    column: "todo",
  });

  const totalTasks = Object.values(tasks).flat().length;

  // Handle drag & drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const [fromColumn, task] = findTaskById(active.id);
    const [toColumn] = findTaskById(over.id);

    if (fromColumn !== toColumn) {
      setTasks((prev) => {
        const updated = { ...prev };
        updated[fromColumn] = updated[fromColumn].filter((t) => t.id !== task.id);
        updated[toColumn] = [...updated[toColumn], task];
        return updated;
      });
    }
  };

  const findTaskById = (id) => {
    for (const column in tasks) {
      const task = tasks[column].find((t) => t.id === id);
      if (task) return [column, task];
    }
    return [null, null];
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    const task = {
      id,
      title: newTask.title,
      description: newTask.description,
      tag: newTask.tag,
      date: "Today",
      comments: 0,
    };

    setTasks((prev) => ({
      ...prev,
      [newTask.column]: [...prev[newTask.column], task],
    }));

    setNewTask({ title: "", description: "", tag: "", column: "todo" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Kanban</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
            <Filter size={16} /> Filter & Sort
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            <Plus size={16} /> Add New Task
          </button>
        </div>
      </div>

      {/* Tabs Summary */}
      <div className="flex gap-4 mb-6">
        <span className="text-sm font-medium">All Tasks ({totalTasks})</span>
        <span className="text-sm">To do ({tasks.todo.length})</span>
        <span className="text-sm">In Progress ({tasks.inprogress.length})</span>
        <span className="text-sm">Completed ({tasks.completed.length})</span>
      </div>

      {/* Kanban Columns */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {Object.keys(tasks).map((column) => (
            <KanbanColumn key={column} title={capitalize(column)} items={tasks[column]} />
          ))}
        </div>
      </DndContext>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Task</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  className="border rounded px-3 py-2 text-sm w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  className="border rounded px-3 py-2 text-sm w-full"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <input
                  type="text"
                  value={newTask.tag}
                  onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
                  placeholder="e.g. Marketing, Dev"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Column</label>
                <select
                  value={newTask.column}
                  onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm min-h-[400px] transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-gray-700">{title}</h2>
        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
      </div>
      <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {items.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? "0px 6px 12px rgba(0,0,0,0.15)" : "none",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} />
    </div>
  );
}

function KanbanCard({ task }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 text-sm flex flex-col gap-2 hover:shadow-md transition-all cursor-grab">
      <h3 className="font-medium text-gray-800">{task.title}</h3>
      {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
      {task.image && <img src={task.image} alt="task" className="rounded-lg mt-2" />}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <span>{task.date}</span>
        <span>💬 {task.comments || 0}</span>
      </div>
      {task.tag && (
        <span className="inline-block mt-1 px-2 py-1 text-[10px] rounded-md bg-gray-100 text-gray-600">
          {task.tag}
        </span>
      )}
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
