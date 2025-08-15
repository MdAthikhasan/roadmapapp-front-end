import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoadmapFooter from "./components/footer/Footer";
import Header from "./components/header/Header";

function App() {
  // const navigation = useNavigation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>

      <RoadmapFooter />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        className="toast-container"
        toastClassName="toast-item"
        bodyClassName="toast-body"
      />
    </div>
  );
}

export default App;
