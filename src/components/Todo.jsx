import React, { useEffect, useRef, useState } from 'react';
import Todo_icon from '../assets/images/todo_icon.png';
import Todoitem from '../components/Todoitem';
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';

const Todo = () => {
    const [todoList, setTodoList] = useState(localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []);
    const inputref = useRef();
    const timeRef = useRef();

    // Function to add a new task
    const add = () => {
        const inputText = inputref.current.value;
        const dueTime = timeRef.current.value; // Get the due time from the input

        // Alert if either input is empty
        if (inputText === "") {
            alert("Task description cannot be empty.");
            return; // Stop the function if validation fails
        }

        if (dueTime === "") {
            alert("Please set a reminder time for the task.");
            return; // Stop the function if validation fails
        }

        const newTodo = {
            id: Date.now(),
            text: inputText,
            dueTime: new Date(dueTime).getTime(), // Store due time as a timestamp
            isComplete: false,
        };

        setTodoList((prev) => [...prev, newTodo]);

        // Schedule a reminder notification
        const timeUntilReminder = newTodo.dueTime - Date.now();

        if (timeUntilReminder > 0) {
            setTimeout(() => {
                addNotification({
                    title: 'Task Reminder',
                    message: `Reminder: "${inputText}" is due now!`,
                    native: true, // Native browser notification
                });
            }, timeUntilReminder);
        }

        // Clear inputs after adding the task
        inputref.current.value = "";
        timeRef.current.value = "";
    };

    const deletetodo = (id) => {
        const todoToDelete = todoList.find(todo => todo.id === id);

        setTodoList((prvTodos) => {
            return prvTodos.filter((todo) => todo.id !== id);
        });

        addNotification({
            title: 'Task Deleted',
            message: `Task "${todoToDelete.text}" has been deleted!`,
            native: true,
        });
    };

    const toggle = (id) => {
        setTodoList((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, isComplete: !todo.isComplete };
                }
                return todo;
            });
        });
    };

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todoList));
    }, [todoList]);

    return (
        <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-5 md:p-7 min-h-[550px] rounded-xl shadow-lg'>
            <Notifications />
            <div className='flex items-center mt-5 md:mt-7 gap-2'>
                <img src={Todo_icon} alt='Todo icon' className='w-6 md:w-8' />
                <h1 className='text-2xl md:text-3xl font-semibold'>To-Do List</h1>
            </div>

            {/* Input section for task and due time */}
            <div className='my-5 md:my-7'>
                <div className='flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3'>
                    <input 
                        ref={inputref} 
                        className='w-full md:w-2/3 bg-gray-200 border-0 outline-none rounded-full h-12 md:h-14 px-4 md:px-6 text-slate-600' 
                        type='text' 
                        placeholder='Add your task' 
                    />
                    <input 
                        ref={timeRef} 
                        className='w-full md:w-1/3 bg-gray-200 border-0 outline-none rounded-full h-12 md:h-14 px-4 md:px-6 text-slate-600' 
                        type='datetime-local' 
                        placeholder='Set a reminder time' 
                    />
                </div>
                <button 
                    onClick={add} 
                    className='mt-3 md:mt-0 w-full md:w-1/3 md:ml-3 h-12 md:h-14 bg-purple-400 rounded-full text-white text-base md:text-lg font-medium'
                >
                    Add +
                </button>
            </div>

            {/* Todo list display */}
            <div className='overflow-y-auto'>
                {todoList.map((item, index) => (
                    <Todoitem key={index} text={item.text} id={item.id} isComplete={item.isComplete} deletetodo={deletetodo} toggle={toggle} />
                ))}
            </div>
        </div>
    );
};

export default Todo;
