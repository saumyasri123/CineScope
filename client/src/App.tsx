import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TMDBProvider } from "@/contexts/TMDBContext";
import Home from "@/pages/Home";
import MovieDetails from "@/pages/MovieDetails";
import TVDetails from "@/pages/TVDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movie/:id" component={MovieDetails} />
      <Route path="/tv/:id" component={TVDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TMDBProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TMDBProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
