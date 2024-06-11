import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Components/Layout";
import { Tasks } from "./pages/Tasks";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Components/Loader/index";
import { setLoader } from "./redux/loaderSlice";

function App() {
  const dispatch = useDispatch();
  const  loading  = useSelector(state => state.loader.loading);
  console.log(loading)

  return (
    <div>
      {loading && <Loader/> }
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Tasks/>}/>
            {/* <Route path="/tasks" element={<Tasks/>}/> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
    
  )
}

export default App;
