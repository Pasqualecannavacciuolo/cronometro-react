import './Timer.css'
import React, {useState, useEffect, createRef, useRef} from 'react'
import axios from 'axios' 


export const Timer = () => {
    // State for GET
    const [times, setTime] = useState([]);
    const [id, setId] = useState('');
    const [changed, setChanged] = useState(false);

    

    /* GET */
    React.useEffect( () => {
        fetch('http://localhost:8080/api/v1')
        .then(response => {
            if(response.ok) {
            return response.json();
            }
            throw response;
        })
        .then(data => {
            setTime(data)
        })
        .catch(error => {
            console.error("Errore durante il FETCH")
        })  
    }, []);
    

    const handleChangeId = event => {
        setId(event.target.value);
    }


    const HandleSubmit = event => {
        event.preventDefault();
        let currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        
        const timer = {
            id: id,
            start: time.toString(),
            end: '0'
        };

        axios.post(`http://localhost:8080/api/v1/`, { id: timer.id, start: timer.start, end: timer.end })
        .then(() => {
            times.push(timer);
            setTime(times);
            setChanged(true); 
        });
        setChanged(false);
    }// Fine handleSubmit for POST


    const HandleStop = event => {
        event.preventDefault();

        axios.put(`http://localhost:8080/api/v1/`+id)
        .then((res) => {
            for(let i=0; i<times.length; i++) {
                if(times[i].id==id) {
                    times[i].end = res.data['end'];
                }
            }
            times.push(res.data)
            setTime(times)
            setChanged(true)
        })
        setChanged(false)
    }// Fine handleStop for STOP

    //console.log(times)


    return(
        <div>
            <form className='post-form' >
                <div className='form-child'>
                    <h2 className='form-title'>Fai partire/fermare un Timer</h2>
                </div>
                <div className='form-child'>
                    <label className='form-label'>ID</label>
                    <input
                        placeholder='Insert ID...'
                        className='form-input'
                        name="id"
                        type="text"
                        onChange={handleChangeId}
                    />
                </div>
                <div className='form-child'>
                    <input className='order-post-button' type="submit" value="Start" onClick={HandleSubmit}/>
                    <input className='order-post-button' type="submit" value="Stop" onClick={HandleStop}/>
                </div>
            </form>

            {times.length > 0 && times.map(time =>
                <div key={time.id} className="father-orders">
                    <div  className='orders-child'>ID: {time.id}</div>
                    <div  className='orders-child'>START: {time.start}</div>
                    <div  className='orders-child'>END: {time.end}</div>
                </div>
            )}
        </div>
    );
}