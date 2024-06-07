import React, { useEffect, useState } from "react";
import './Clock.css'

const Clock = (props) => {
    const giveTime = (time) => {
        const hrs = Math.floor(time / 3600).toString().padStart(2, '0');
        const mins = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        const secs = (time % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    const [time, setTime] = useState(giveTime(props.clock.time));
    const [seconds, setSeconds] = useState(props.clock.time);
    const [isRunning, setIsRunning] = useState(props.clock.isRunning);
    const clockState = seconds === 0 ? 'start-pause reset': (isRunning? 'start-pause running' : 'start-pause notrunning');
    const currState = (seconds === 0)? 'Reset' : (isRunning? 'Pause' : 'Start');
    
    useEffect(() => {
        let interval;
        if(isRunning && seconds > 0){
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    setTime(giveTime(prevSeconds - 1));
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        else if(isRunning){
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    },[isRunning, seconds]);

    useEffect(() => {
        if(isRunning === false){
            props.setTasks((prevTasks) => {
                return prevTasks.map((task) => {
                    if(task.id === props.clock.id){
                        return {...task, time: seconds};
                    }
                    return task;
                });
            });
        }
    }, [isRunning, seconds, props]);

    const changeState = () => {
        if(seconds === 0){
            setSeconds(props.clock.prevTime);
            setTime(giveTime(props.clock.prevTime));
            setIsRunning(false);

            props.setTasks(prevTasks => {
                return prevTasks.map((task) => {
                    if(task.id === props.clock.id){
                        return {...task, time: task.prevTime};
                    }
                    return task;
                })
            });
        }
        else{
            setIsRunning(!isRunning);
        }
    };

    const deleteClock = (e) => {
        e.stopPropagation();
        props.setTasks((prevTasks) => {
            return prevTasks.filter((task) => task.id !== props.clock.id);
        });
    }

    return (
        <div className='clock'>
            <div className="delete" onClick={deleteClock}>X</div>
            <div className={clockState} onClick={changeState}>{currState}</div>
            <div className='details'>
                <h1>{props.clock.title}</h1>
                <div className='time'>{time}</div>
            </div>
        </div>
    );
}

export default Clock;