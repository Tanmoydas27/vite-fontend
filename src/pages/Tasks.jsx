import { useState, useEffect } from "react";
import axios from "axios";
import { setLoader } from "../redux/loaderSlice";
import { useDispatch,useSelector } from "react-redux";
import Loader from "../Components/Loader";
import Swal from 'sweetalert2';
import { GoogleOAuthProvider , GoogleLogin , googleLogout} from "@react-oauth/google";


const API_URL = import.meta.env.VITE_APP_API_URL;
const GOOGLE_CLIENT = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID ;
console.log("12",API_URL);
console.log("13",GOOGLE_CLIENT);


export const Tasks = () => {

    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('');

    const clearForm = (editing = false) => {
        setTitle('');
        setDescription('');
        setCompleted(false);
        setEditing(editing);
        setId('');
    };

    const handleLoginSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            const res = await axios.post(`${API_URL}/login`, { token: idToken });
            console.log(res.data);
            if (res.data.success) {
                const jwtToken = res.data.token;
                setToken(jwtToken);
                setLoggedIn(true);
                await getTasks(jwtToken);
            }
        } catch (error) {
            console.error("Login failed:", error);
            Swal.fire("Error", "Login failed. Please try again later.", "error");
        }
    };


    const handleLoginFailure = (error) => {
        console.error("Login failed:", error);
        Swal.fire("Error", "Login failed. Please try again later.", "error");
    };

    const handleLogout = async () => {
        try {
            await googleLogout();
            setLoggedIn(false);
            setToken('');
            setTasks([]);
            Swal.fire("Success", "Logged out successfully", "success");
        } catch (error) {
            console.error("Logout failed:", error);
            Swal.fire("Error", "Logout failed. Please try again later.", "error");
        }
    };


    const getTasks = async (jwtToken) => {
        try {
            dispatch(setLoader(true))
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            dispatch(setLoader(false));
            setTasks(response.data);
            setEditing(false);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
    });


    const createTask = async () => {
        try {
            dispatch(setLoader(true));
            const response = await axios.post(`${API_URL}/tasks`, {
                title,
                description,
                completed
            },{
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(setLoader(false));
            console.log(response.data);
            if (response.data.success) {
                clearForm();
                await getTasks(token);
                Toast.fire({
                    icon: "success",
                    title: "Task created successfully"
                });
            }
        } catch (error) {
            console.error("Failed to create task:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to create task. Please try again later."
            });
        }
    };

    const deleteTask = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/tasks/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTasks(tasks.filter(task => task._id !== id));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your task has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Failed to delete task:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete task. Please try again later.",
                        icon: "error"
                    });
                }
            }
        });
    };
    const editTask = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { task } = response.data;
            setTitle(task.title);
            setDescription(task.description);
            setCompleted(task.completed);
            setId(id);
            setEditing(true);
        } catch (error) {
            console.error("Failed to fetch task:", error);
        }
    };

    const updateTask = async () => {
        try {
            dispatch(setLoader(true));
            const response = await axios.put(`${API_URL}/tasks/${id}`, {
                title,
                description,
                completed
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(setLoader(false));
            if(response.data.success){
                clearForm(false);
                await getTasks(token);
                Toast.fire({
                    icon: "success",
                    title: "Task updated successfully"
                });
            }   
        } catch (error) {
            console.error("Failed to update task:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to update task. Please try again later."
            });
        }
    };

    const toggleComplete = async (taskId) => {
        try {
            const task = tasks.find(task => task._id === taskId);
            if (task) {

                const updatedTask = {
                    ...task,
                    completed: !task.completed
                };
                const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(response.data.success){
                    setTasks(tasks.map(t => (t._id === taskId ? updatedTask : t)));
                }
            }
        } catch (error) {
            console.error("Failed to toggle task completion:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editing) {
            await createTask();
        } else {
            await updateTask();
        }
        await getTasks();
    };

    useEffect(() => {
        if(token){
            getTasks();
        }
    }, [token]);

    return (
        <>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
                {!loggedIn ? (
                    <div className="d-flex justify-content-center align-items-center " >
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                        />
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-md-4">
                            <form onSubmit={handleSubmit} className="card card-body">
                                <div className="my-2">
                                    <h3 className="mb-4">{editing ? 'EDIT TASK' : 'ADD TASK'}</h3>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="form-control"
                                        placeholder="Title"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className="my-2">
                                    <textarea 
                                        rows={10} 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="form-control"
                                        placeholder="Description"
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className={`btn ${editing ? 'btn-primary' : 'btn-info'} mt-4`}
                                >
                                    {editing ? 'UPDATE' : 'CREATE'}
                                </button>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <div className="card card-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Completed</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task._id} className={task.completed ? 'completed-task' : ''}>
                                                <td style={{ color: task.completed ? 'red' : 'inherit', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</td>
                                                <td style={{ color: task.completed ? 'red' : 'inherit', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.description}</td>
                                                <td>
                                                    <input 
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() => toggleComplete(task._id)}
                                                    />
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-secondary btn-sm btn-block"
                                                        onClick={() => editTask(task._id)}
                                                    >Edit</button>
                                                    <button 
                                                        onClick={() => deleteTask(task._id)}
                                                        className="btn btn-danger btn-sm btn-block"
                                                    >Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-2 text-center mt-4">
                            <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                 )}
            </GoogleOAuthProvider> 
        </>
    );
};
