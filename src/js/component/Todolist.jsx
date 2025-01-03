import React, { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export const Todolist = () => {
    const [inputText, setInputText] = useState("");
    const [todos, setTodos] = useState([]);
    const [editWhatTodos, setEditWhatTodos] = useState({});
    const [iseditTodos, setisEditTodos] = useState(false);


    const urlBase = "https://playground.4geeks.com/todo/";

    const WhatToDo = (event) => {
        event.preventDefault();
        setInputText(event.target.value);
    };

    const empty = (text) => {
        return text.trim() === "";
    };

    const addTodo = async () => {
        if (empty(inputText)) {
            alert("Por favor, introduce un texto válido.");
            return;
        }
        try {
            await fetch(`${urlBase}todos/lisamarie`, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: inputText,
                    is_done: false
                })
            });
            await get(); // Actualiza la lista completa después de añadir
            setInputText("");
        } catch (error) {
            console.log("Error al añadir la tarea:", error.message);
        }
    };

    const modifyTaks = (event) => {
        event.preventDefault();
        setEditWhatTodos({ ...editWhatTodos, label: event.target.value });
    }

    const modifyTodo = async (id) => {
        if (empty(editWhatTodos.label)) {
            alert("Por favor, introduce un texto válido.");
            return;
        }
        try {
            await fetch(`${urlBase}todos/${id}`, {
                method: "PUT",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editWhatTodos)

            });
            setTodos(todos.map((todo) => todo.id === id));
            setisEditTodos(false)

        } catch (error) {
            console.log("Error al modificar la tarea:", error.message);
        }
    };

    const callEditTodo = (todo) => {
        setEditWhatTodos(todo)
        setisEditTodos(true)
    }

    const deleteTodo = async (id) => {
        try {
            await fetch(`${urlBase}todos/${id}`, {
                method: "DELETE",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.log("Error al eliminar la tarea:", error.message);
        }
    };

    const get = async () => {
        try {
            const response = await fetch(`${urlBase}users/lisamarie`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            const data = await response.json();
            setTodos(data.todos || []);
        } catch (error) {
            console.log("Error al cargar las tareas:", error.message);
        }
    };

    useEffect(() => {
        get();
    }, []);

    return (

        <div>
            {iseditTodos ?
                <form>
                    <div className="FormEdit container text-center col-4">
                        <label for="exampleDataList" className="form-label">Task to edit</label>
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={editWhatTodos.label}
                            onKeyDown={(e) => (e.key === "Enter" && empty() ? modifyTodo(editWhatTodos.id) : null)}
                            onChange={modifyTaks}
                        />
                    </div>
                </form>
                :
                <div className="container text-center col-4">
                    <div className="ToDoList">
                        <ul className="list-group text-start">
                            <li className="list-group-item">
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={inputText}
                                    onKeyDown={(e) => (e.key === "Enter" ? addTodo() : null)}
                                    onChange={WhatToDo}
                                />
                            </li>
                            {todos.map((todo, index) => (
                                <li className="list-group-item d-flex justify-content-between" key={todo.id || index}>
                                    {todo.label}
                                    <div>
                                        <button onClick={() => callEditTodo(todo)} type="button" className="btn text-success"><EditIcon /></button>
                                        <button onClick={() => deleteTodo(todo.id)} type="button" className="btn text-danger"><DeleteIcon /></button>
                                    </div>
                                </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-end text-secondary">{todos.length} items left</li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
};
