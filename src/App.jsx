import { ThemeProvider } from "@/components/theme-provider"
import { TodoBoard } from "@/features/todos/TodoBoard"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border z-50"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased text-foreground transition-colors duration-300">
        <ThemeToggle />
        <main className="container flex min-h-screen flex-col items-center justify-center py-12">
          <TodoBoard />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App