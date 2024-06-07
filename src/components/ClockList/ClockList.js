import React from "react";
import './ClockList.css';
import Clock from '../Clock/Clock';

const ClockList = (props) => {
    return (
        <div className='clock-list'>
            {
                props.task_timers.map((task_timer) => (
                    <Clock clock={task_timer} key={task_timer.id} setTasks={props.setTasks}/>
                ))
            }
        </div>
    );
}

export default ClockList;