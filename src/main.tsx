import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AppContextProvider } from "./context/app.context";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContextProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AppContextProvider>
      <ToastContainer position="top-center" autoClose={1500} />
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  </QueryClientProvider>,
);
