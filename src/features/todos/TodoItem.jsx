import { motion } from "framer-motion";
import { Trash2, Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/store/useTodoStore";

export function TodoItem({ todo, onNotify }) {
    const toggleTodo = useTodoStore((state) => state.toggleTodo);
    const deleteTodo = useTodoStore((state) => state.deleteTodo);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "group flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
                todo.completed && "opacity-60 bg-muted/50"
            )}
        >
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 border-2 border-primary/50 data-[state=checked]:border-primary"
                />
                <div className="flex flex-col">
                    <span
                        className={cn(
                            "font-medium transition-all",
                            todo.completed && "text-muted-foreground line-through"
                        )}
                    >
                        {todo.text}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 mobile:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onNotify(todo)}
                    title="Set Reminder"
                >
                    <Bell className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTodo(todo.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}
