"use client";

import { useState, useEffect } from "react";
import axios from "axios";

/*  Todo interface */
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

      // Generate unique ID
      const uniqueTodo = { ...res.data, id: Date.now() };

      setTodos([...todos, uniqueTodo]); // update
      setNewTodo("");
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    // Optimistic update: Remove todo 
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      // Then delete the todo from the server
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    } catch (error) {
      console.error("Delete error:", error);
      // Rollback 
      setTodos(todos); //previous state
    }
  };

  return (
    <div className="text-black h-screen w-full max-w-full mx-auto p-5 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">
      Todo App by Sorokolit Artur (
      <a href="https://github.com/cllown" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">@cllown</a>)</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={addTodo}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Add new
        </button>
      </div>

      {/* Todo List */}
      <div className="overflow-auto max-h-[70vh]">
        <ul className="flex flex-wrap gap-4 justify-start">
          {todos.map((todo) => (
            <li
              key={todo.id} /* unique key */
              className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden max-w-[200px] w-full aspect-w-1 aspect-h-1"
            >
              <button
                onClick={() => deleteTodo(todo.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white font-bold border-2 border-red-600 rounded-md flex items-center justify-center hover:bg-red-600 hover:border-red-700 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <span className="absolute w-6 h-0.5 bg-white transform rotate-45"></span>
                <span className="absolute w-6 h-0.5 bg-white transform -rotate-45"></span>
              </button>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-semibold">{todo.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
