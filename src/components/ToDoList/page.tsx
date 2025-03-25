"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Todo interface
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos from API
  useEffect(() => {
    axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Load error:", err));
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const todoData = {
      title: newTodo,
      completed: false,
    };

    try {
      const res = await axios.post<Todo>(
        "https://jsonplaceholder.typicode.com/todos",
        todoData
      );

      // Generate unique ID for newly added todo
      const uniqueTodo = { ...res.data, id: Date.now() };

      setTodos([...todos, uniqueTodo]); // Optimistic update
      setNewTodo("");
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    // Optimistic update: Remove todo from state
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      // Then delete the todo from the server
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    } catch (error) {
      console.error("Delete error:", error);
      // Rollback if error occurs
      setTodos(todos); // Restore previous state
    }
  };

  return (
    <div className="text-black max-w-lg mx-auto p-5 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTodo}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-md transition"
        >
          ➕ Add new
        </button>
      </div>
      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id} // Ensuring a unique key
            className="flex justify-between items-center p-2 bg-white border rounded"
          >
            <span>{todo.title}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
