import React, { useEffect } from 'react';
import ClockList from '../../components/ClockList/ClockList';
import './Home.css';
import { useState } from 'react';
import AddTask from '../AddTask/AddTask';

const Home = () => {
    const flag = localStorage.getItem('task_timers');
    const [cnt, setCnt] = useState(0);
    const [task_timers, setTaskTimers] = useState(flag ? JSON.parse(flag) : []);
    const [showPopUp, setShowPopUp] = useState(false);

    const PopDown = () => {
        setShowPopUp(false);
    };

    const addTask = (task) => {
        const id = cnt;
        setCnt(cnt + 1);
        const hh = parseInt(task.time.slice(0, 2));
        const mm = parseInt(task.time.slice(3, 5));
        const ss = parseInt(task.time.slice(6, 8));
        const time = hh * 3600 + mm * 60 + ss;
        const newTask = {id: id, title: task.title, time: time, prevTime: time};

        setTaskTimers([...task_timers, newTask]);
    }
    
    const add = () => {
        setShowPopUp(true);
    }

    useEffect(() => {
        localStorage.setItem('task_timers', JSON.stringify(task_timers));
    }, [task_timers]);

    return(
        <div>
            <ClockList task_timers={task_timers} setTasks={setTaskTimers}/>
            <div className='add-task' onClick={add}>+</div>
            <AddTask addTask={addTask} PopDown={PopDown} showPopUp={showPopUp}/>
        </div>
    )
};

export default Home;