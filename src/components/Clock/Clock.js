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
    const [details, setDetails] = useState('clock show');
    const [doEdit, setDoEdit] = useState('clock hide');
    const [task_, setTask] = useState({...props.clock, time: giveTime(props.clock.time)});

    useEffect(() => {
        let interval;
        if(isRunning && seconds > 0){
            setDetails('clock show');
            setDoEdit('clock hide');
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
            if(seconds === 0)
                window.alert("Time is up!");
        }
    }, [isRunning, seconds]);

    useEffect(() => {
        const reload = (e) => {
            e.preventDefault();
            props.setTasks((prevTasks) => {
                return prevTasks.map((task) => {
                    if(task.id === props.clock.id){
                        return {...task, time: seconds};
                    }
                    return task;
                });
            });
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', reload);

        return () => {window.removeEventListener('beforeunload', reload);}
    }, [seconds]);

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

    const editClock = (e) => {
        e.stopPropagation();
        setDetails('clock hide');
        setDoEdit('clock show');
    };

    const detailClock = (e) => {
        e.preventDefault();
        setDetails('clock show');
        setDoEdit('clock hide');
    };

    const editTask = (e) => {
        e.preventDefault();
        if(task_.title === ""){
            alert("Please enter all the fields");
            return;
        }
        const timePattern = /^([0-9]|[0-9][0-9]):([0-5][0-9]):([0-5][0-9])$/;
        if(!timePattern.test(task_.time)){
            alert("Please enter time in hh:mm:ss format");
            return;
        }

        const temp = parseInt(task_.time.slice(0, 2)) * 3600 + parseInt(task_.time.slice(3, 5)) * 60 + parseInt(task_.time.slice(6, 8));
        setSeconds(temp);
        setTime(giveTime(temp));
        props.setTasks((prevTasks) => {
            return prevTasks.map((task) => {
                if(task.id === task_.id){
                    return {...task_, time: temp, prevTime: temp};
                }
                return task;
            });
        });
        setDetails('clock show');
        setDoEdit('clock hide');
    };

    return (
        <div>
            <div className={details}>
                <div className="edit-delete">
                    <div className="edit" onClick={editClock}>Edit</div>
                    <div className="delete" onClick={deleteClock}>X</div>
                </div>
                <div className={clockState} onClick={changeState}>{currState}</div>
                <div className='details'>
                    <h1>{props.clock.title}</h1>
                    <div className='time'>{time}</div>
                </div>
            </div>
            <div className={doEdit}>
                <div className="edit-delete">
                    <div></div>
                    <div className="delete" onClick={detailClock}>X</div>
                </div>
                <div className={clockState} onClick={changeState}>{currState}</div>
                <div className='details'>
                    <input type="text" placeholder="Task Name" value={task_.title} onChange={(e) => setTask({...task_, title: e.target.value})}/>
                    <input placeholder="hh:mm:ss" value={task_.time} pattern="\d{2}:\d{2}:\d{2}" onChange={(e) => setTask({...task_, time: e.target.value})}/>
                    <button type="submit" className="edit-button" onClick={editTask}>Edit Task</button>
                </div>
            </div>
        </div>
    );
}

export default Clock;