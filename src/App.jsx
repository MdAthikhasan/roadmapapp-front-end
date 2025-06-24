import { Outlet } from "react-router-dom";
import RoadmapFooter from "./components/footer/Footer";
import Header from "./components/header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const navigation = useNavigation();
  return (
    <div>
      <Header />

      <Outlet />

      <RoadmapFooter />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
