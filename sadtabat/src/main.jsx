import Home from './Home.jsx'
import Vip from './components/vip.jsx'
import Gallary from './components/Gallary.jsx'
import Collection from './components/Collection.jsx'
import Manual from './components/Manual.jsx'
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "vip",
    element: <Vip/>,
  },
  {
    path: "gallary",
    element: <Gallary/>,
  },
  {
    path: "collection",
    element: <Collection/>,
  },
  {
    path: "manual",
    element: <Manual/>,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);