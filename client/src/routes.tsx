import Home from "./pages/home";
import { createBrowserRouter } from "react-router";
import InfiniteCanvas from "./pages/infiniteCanvas";
import DragDrop from "./pages/dragdrop";
export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "canvas", Component: InfiniteCanvas },
      { path: "dragdrop", Component: DragDrop },
    ],
  },
]);
