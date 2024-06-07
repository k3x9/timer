import React from "react";
import {useState} from "react";
import './AddTask.css';

const AddTask = (props) => {
    const [task, setTask] = useState({title: "", time: "00:00:00"});
    const close = props.PopDown;
    const flag = props.showPopUp? "form show" : "form donotshow";
    const closeForm = (e) => {
        e.preventDefault();
        close();
    }
    const addTasks = (e) =>{
        e.preventDefault();
        if(task.title === ""){
            alert("Please enter all the fields");
            return;
        }
        const timePattern = /^([0-9]|[0-9][0-9]):([0-5][0-9]):([0-5][0-9])$/;
        if(!timePattern.test(task.time)){
            alert("Please enter time in hh:mm:ss format");
            return;
        }

        props.addTask(task);
        setTask({title: "", time: "00:00:00"});
        close();
    };

    return(
        <form className={flag} onSubmit={addTasks}>
            <button className="close" onClick={closeForm}>X</button>
            <input type="text" placeholder="Task Name" value={task.title} onChange={(e) => setTask({...task, title: e.target.value})}/>
            <input placeholder="hh:mm:ss" value={task.time} pattern="\d{2}:\d{2}:\d{2}" onChange={(e) => setTask({...task, time: e.target.value})}/>
            <button type="submit" className="add" onClick={addTasks}>Add Task</button>
        </form>
    )
};

export default AddTask; 