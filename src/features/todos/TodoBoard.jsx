import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import { useTodoStore } from "@/store/useTodoStore";
import { useNotifications } from "@/hooks/useNotifications";
import { TodoItem } from "./TodoItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function TodoBoard() {
    const [inputValue, setInputValue] = useState("");
    const [activeReminderTodo, setActiveReminderTodo] = useState(null);
    const [reminderTime, setReminderTime] = useState("");

    const { todos, addTodo } = useTodoStore();
    const { requestPermission, scheduleNotification } = useNotifications();
    const { toast } = useToast();

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        addTodo(inputValue);
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    const handleNotify = async (todo) => {
        const permission = await requestPermission();
        if (permission === "granted") {
            setActiveReminderTodo(todo);
            // Default to current time + 1 hour approx, or just empty
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setReminderTime(`${hours}:${minutes}`);
        } else {
            toast({
                variant: "destructive",
                title: "Permission Denied",
                description: "Please enable notifications to use this feature.",
            });
        }
    };

    const scheduleReminder = () => {
        if (!activeReminderTodo || !reminderTime) return;

        const [hours, minutes] = reminderTime.split(':').map(Number);
        const now = new Date();
        const scheduleDate = new Date();
        scheduleDate.setHours(hours, minutes, 0, 0);

        // If time is in the past for today, schedule for tomorrow
        if (scheduleDate <= now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        const delay = scheduleDate.getTime() - now.getTime();

        scheduleNotification(
            "Todo Reminder",
            {
                body: `Don't forget: ${activeReminderTodo.text}`,
                tag: activeReminderTodo.id,
            },
            delay
        );

        toast({
            title: "Reminder Set",
            description: `Reminder set for ${activeReminderTodo.text} at ${reminderTime}`,
        });

        setActiveReminderTodo(null);
        setReminderTime("");
    };

    const activeTodos = todos.filter((t) => !t.completed);
    const completedTodos = todos.filter((t) => t.completed);

    return (
        <div className="mx-auto w-full max-w-2xl space-y-8 p-4 relative">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Task Master
                </h1>
                <p className="text-muted-foreground">Manage your tasks with focus and clarity.</p>
            </div>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Add a new task..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-12 text-lg bg-background/50 border-transparent focus:border-primary ring-offset-0 focus-visible:ring-0 shadow-inner"
                        />
                        <Button size="icon" onClick={handleAdd} className="h-12 w-12 rounded-lg shadow-md transition-transform active:scale-95">
                            <Plus className="h-6 w-6" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Active Tasks ({activeTodos.length})
                        </h2>
                        <div className="space-y-2 min-h-[100px]">
                            <AnimatePresence mode="popLayout">
                                {activeTodos.map((todo) => (
                                    <TodoItem key={todo.id} todo={todo} onNotify={handleNotify} />
                                ))}
                                {activeTodos.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
                                    >
                                        <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
                                        <p>No active tasks. Time to relax!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {completedTodos.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-border/50">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Completed ({completedTodos.length})
                            </h2>
                            <div className="space-y-2 opacity-80">
                                {completedTodos.map((todo) => (
                                    <TodoItem key={todo.id} todo={todo} onNotify={handleNotify} />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AnimatePresence>
                {activeReminderTodo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-sm rounded-xl bg-background p-6 shadow-2xl ring-1 ring-border"
                        >
                            <h3 className="text-lg font-semibold mb-4">Set Reminder</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Choose a time for: <span className="font-medium text-foreground">{activeReminderTodo.text}</span>
                            </p>
                            <div className="flex flex-col gap-4">
                                <Input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    className="text-2xl p-4 h-16 text-center"
                                />
                                <div className="flex gap-2 justify-end mt-2">
                                    <Button variant="ghost" onClick={() => setActiveReminderTodo(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={scheduleReminder}>
                                        Set Reminder
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
