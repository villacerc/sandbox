import Home from "./pages/home";
import { createBrowserRouter } from "react-router";
import InfiniteCanvas from "./pages/infiniteCanvas";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "canvas", Component: InfiniteCanvas },
    ],
  },
]);
