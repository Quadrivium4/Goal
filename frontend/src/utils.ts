import axios from "axios";
import { baseUrl, protectedUrl } from "./constants";

export const api = axios.create({
    baseURL: baseUrl
});
export const protectedApi = axios.create({
    baseURL: protectedUrl,
    headers: {
        "Authorization":  "Bearer " + localStorage.getItem("aToken"),
    }
})
export const getTime = (timeInMinutes: number) =>{
    return Math.floor(timeInMinutes/60) + ":" + (timeInMinutes % 60).toString().padStart(2,"0");
}
export const getNormalizedPercentage = (max: number, value: number, dayDiveder = 1)=>{ 
    let percentage = Math.round(100/(max/dayDiveder)* value);;
    if(percentage>100)return 100
    return percentage
}
export const getToday = () =>{
    //let now = new Date()
    let now = new Date("2024-12-28T22:00:00.000Z");
    now.setHours(0,0,0,0);
    return now
}