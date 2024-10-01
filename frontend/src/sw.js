import {precacheAndRoute} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

console.log("sw working hello");
let cacheName = "cache-v1";
registerRoute(({request})=>request.destination === "script", new NetworkFirst({cacheName}));
// this.addEventListener("install", (event) =>{
//     event.waitUntil(
//         caches.open(cacheName).then((cache) =>{
//             cache.addAll(["static/js/bundle.js", "icon.png", "index.html", "/", "manifest.json", "favicon.ico", "stats", "goals", "home", "settings", "login", "register", "protected/user"])
//         })
//     )
// })
// this.addEventListener("fetch", (event =>{
//     console.log(event.request)
//     let url = URL.parse(event.request.url)
//     console.log(url)
//     // if(url.origin === "http://localhost:3000"){
//     if(!navigator.onLine){
//         event.respondWith(
//             caches.match(event.request).then((response) => {
//                 console.log(response)
//                 if (response) {
//                     return response
//                 }
//                 let requestUrl = event.request.clone();
//                 fetch(requestUrl)
//             })
//         )
//     }
        
// //  }else if(url.href === "http://localhost:5000/login"){
        
// //     }else {
// //         console.log('respond normally')
// //     }
    
// }))