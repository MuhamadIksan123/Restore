import { createBrowserRouter } from "react-router";
import HomePage from "../../features/home/HomePage";
import ContactPage from "@mui/icons-material/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import App from "../layout/App";
import ProductDetail from "../../features/catalog/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/catalog/:id", element: <ProductDetail /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },
]);
