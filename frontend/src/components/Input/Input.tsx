import React,{useEffect, useState} from 'react';

const TimePicker = ({onSelect}: {onSelect: (timeInMinutes: number) =>void}) =>{
    const [time, setTime] = useState(0);
    const [input, setInput] = useState("")
    const [error, setError] = useState(false)
    useEffect(()=>{
        onSelect(time)
    },[time, onSelect])
    const handleValidation = (timeString: string) =>{
        let time = timeString.split(":")
        if(time.length < 2) {
            if(time[0] === "") return;
            let hours = parseInt(time[0]);
            setTime(hours * 60);
            setInput(hours.toString() + ":00")
        }else if(time.length < 3){
            let hours = parseInt(time[0]);
            let minutes = parseInt(time[1]);
            let timeInMinutes = hours * 60 + minutes;
            setTime(timeInMinutes);
            setInput(Math.floor(timeInMinutes/60).toString()+ ":" + (timeInMinutes % 60).toString().padStart(2,"0"))
        }else {
            setError(true)
        }
    }
    return (
        <input 
            className={error? "error": ""}
            placeholder={"hh:mm"} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter")  handleValidation(input)
            }}
            onBlur={()=>handleValidation(input)}></input>
    )
}
const DistancePicker = ({onSelect}: {onSelect: (distanceInMeters: number) =>void}) =>{
    const [distance, setDistance] = useState(0);
    const [input, setInput] = useState("")
    const [error, setError] = useState(false)
    useEffect(()=>{
        onSelect(distance)
    },[distance, onSelect])
    const handleValidation = (distanceString: string) =>{
        let distance = distanceString.split(".")
        console.log({distance})
        if(distance.length < 2) {
            if(distance[0] === "") return;
            let kilometers = parseInt(distance[0]);
            setDistance(kilometers * 1000);
            setInput(kilometers.toString())
        }else if(distance.length < 3){
            let kilometers = parseInt(distance[0]);
            let meters = parseInt(distance[1].padEnd(3, "0"))
            let distanceInMeters = kilometers * 1000 + meters;
            setDistance(distanceInMeters);
            setInput(Math.floor(distanceInMeters/1000) + "." + distanceInMeters % 1000)
        }else {
            setError(true)
        }
    }
    return (
        <input 
            className={error? "error": ""}
            placeholder={"km (e.g 6.5)"} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e)=>{
                if(e.key === "Enter")  handleValidation(input)
            }}
            onBlur={()=>handleValidation(input)}></input>
    )
}
const Input = {
    TimePicker,
    DistancePicker
}
export default Input