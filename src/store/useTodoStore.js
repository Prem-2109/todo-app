import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTodoStore = create(
    persist(
        (set) => ({
            todos: [],
            addTodo: (text) =>
                set((state) => ({
                    todos: [
                        ...state.todos,
                        { id: crypto.randomUUID(), text, completed: false, createdAt: new Date().toISOString() },
                    ],
                })),
            toggleTodo: (id) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, completed: !todo.completed } : todo
                    ),
                })),
            deleteTodo: (id) =>
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                })),
            updateTodo: (id, text) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, text } : todo
                    ),
                })),
        }),
        {
            name: 'todo-storage',
        }
    )
)
