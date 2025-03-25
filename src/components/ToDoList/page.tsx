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
    <div className="text-black max-w-lg mx-auto p-5 bg-gray-100 shadow-lg rounded-lg ">
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
      className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
      >
      Add new
      </button>

      </div>
      {/* Todo List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {todos.map((todo) => (
            <li
               key={todo.id} /* unique key */
               className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden"
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
  );
}
