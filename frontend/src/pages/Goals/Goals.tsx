import React,{ReactNode, useEffect, useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import Pop from '../../components/Pop/Pop';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { db } from '../../db';
import { getTime } from '../../utils';
import AddGoal from '../../components/AddGoal';
import "./Goals.css"
import AddProgress from '../../components/AddProgress';
import { useGoals } from '../../context/GoalsContext';
import { useDays } from '../../context/DaysContext';
let deferredPrompt: Event;
// if("serviceWorker" in navigator){
//   window.addEventListener("load", () => {
    
//     navigator.serviceWorker.register("/resetGoalWorker.js")
//     .then(reg => console.log("Service Worker: Registered"))
//     .catch(err => console.log("Service Worker Error: " + err))
//   })
//   window.addEventListener("beforeinstallprompt", (e)=>{
//           e.preventDefault();
//           deferredPrompt = e;
//         })
// }

function Goals() {
    const user = useUser();
    const {goals } = useGoals()
    const {days, today, setDayProgress} = useDays();
    const [pop, setPop] = useState<ReactNode>();
    useEffect(()=>{
      console.log(goals)
      //worker.postMessage("hello")
    },[goals])
    //console.log(user)
  return (
    <div className='page' id='goals'>
      {pop && <Pop toggle={() => setPop(undefined)}>{pop}</Pop>}
      <h1>Hello {user.name}</h1>
      <div className='goals'>
        {
          goals.map(goal=>{
            
            //let goalProgressString = getTime(goal.progress)
            let todayGoal = today?.goals.find(todayGoal=> todayGoal.goalId === goal.id);
            //console.log({todayGoal})

            let goalProgress = todayGoal? todayGoal.progress : 0;
            if(goal.frequency === "weekly"){
              goalProgress = 0;
              days.slice(0,7).map(day => {
                day.goals.map(current=>{
                  if(current.goalId === goal.id) goalProgress+=current.progress
                })
              })
            }
            let progressWidth = 100 /goal.amount* goalProgress;
            let goalAmountString = goal.type === "time"? getTime(goalProgress) + "/" +getTime(goal.amount) + " hours": goal.type === "distance"? goalProgress/1000 + "/" + goal.amount/1000 + "km": goal.amount;
            return (
              <div className='goal' key={goal.id}>
                <div className='header'><div className='progress' style={{width: progressWidth + "%"}}></div></div>
                <h3>{goal.title}</h3>
                <p>{goalAmountString}</p>
                <p>{goal.frequency}</p>
                <button className='outline' onClick={() => setPop(<AddProgress  goal={goal} setProgress={setDayProgress} closePop={()=>setPop(undefined)}/>)}>add progress</button>
              </div>
            )
          })
        }
      </div>
      <h1>{days.length > 1? days[0].goals.map(goal =>{
        return (goal.progress)
      }): null}</h1>
      {/* <div className='days'>
        {
          days.map(day =>{
            return (<div key={day.date}>
              <p>Day {new Date(day.date).getTime()}</p>
            </div>)
          })
        }
      </div> */}
      <button onClick={() =>{
        setPop(<AddGoal />)
      }}>+</button>
    </div>
  );
}

export default Goals;
