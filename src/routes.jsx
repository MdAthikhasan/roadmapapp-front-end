import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Sign_up from "./pages/Sign_up";
import Sign_in from "./pages/Sign_in";
import Error from "./pages/Eroor";
import Home from "./pages/Home";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "sign_up",
        element: <Sign_up />,
      },
      {
        path: "sign_in",
        element: <Sign_in />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
