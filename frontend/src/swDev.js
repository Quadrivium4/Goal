import { baseUrl } from "./constants";

export function swDev(){
    let swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    console.log({swUrl})
    //alert(navigator.serviceWorker)
    if(navigator)
    navigator.serviceWorker.register(swUrl).then(response=>{
        console.log(response)
    })
}