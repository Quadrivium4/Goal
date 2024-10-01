import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { dbController, db, TDay, TDayGoal, TGoal, TGoalForm} from "../db";
import { dayInMilliseconds, todayDate } from "../constants";
import { useGoals } from "./GoalsContext";
import { resolve } from "path";
import { getToday } from "../utils";
type TDaysContext = {
    today: TDay | null,
    days: TDay[],
    setDayProgress: (goalId: number, progress: number) => void
    addGoal: (goal: TGoalForm) => void
}
const daysState = {
    today: null,
    days:[],
    setDayProgress: (goaldId: number, progress: number) =>{},
    addGoal: () => {}
}
const addProgressToDayGoals = (goals: TGoal[], progress: number, goalId?: number) => {
     if(goalId === undefined) {
        return goals.map(goal =>({
            goalId: goal.id,
            type: goal.type,
            amount: goal.amount,
            progress: progress,
            frequency: goal.frequency
        }))
     }
     return goals.map(goal =>({
            goalId: goal.id,
            type: goal.type,
            amount: goal.amount,
            progress: goalId === goal.id? goal.progress + progress : goal.progress,
            frequency: goal.frequency
    }))
}
   

const addEmptyDays = async(goals: TGoal[], difference: number, now: Date) =>{
    let numberOfDaysOff = Math.floor(difference/dayInMilliseconds) -1;
    console.log("add empty days:", numberOfDaysOff)
            //maybe better promises.all ...
        for(let i = 1; i< numberOfDaysOff + 1; i++){
            await db.days.add({
            date: now.getTime() - (dayInMilliseconds* i),
            goals: addProgressToDayGoals(goals, 0)
        })
    }
}
const DaysContext = createContext<TDaysContext>(daysState)
const DaysProvider = ({children}: {children: ReactNode}) =>{
    //const [goals, setGoals] = useState<TGoal[]>([]);
    const [days, setDays] = useState<TDay[]>([]);
    const [today, setToday] = useState<TDay | null>(null)
    const {goals} = useGoals()
    //const [loading, setLoading] = useState(true);
    const setDayProgress = async (goalId: number, progress: number) => {
        let latestDay = days[0];
        let now = getToday()
        if(!latestDay){
            let todayGoals = addProgressToDayGoals(goals,progress, goalId)
            let day= await dbController.addDay({
                date: now.getTime(),
                goals: todayGoals
            })
            setDays([day,...days])
            setToday(day)
        }else if(now.getTime() - new Date(latestDay.date).getTime() >= dayInMilliseconds ){
            let difference = now.getTime() - new Date(latestDay.date).getTime();
            console.log("difference:", difference, dayInMilliseconds)
            await addEmptyDays(goals, difference, now)
            let todayGoals = addProgressToDayGoals(goals,progress, goalId  );

            let day = await dbController.addDay({
                date: now.getTime(),
                goals: todayGoals
            })
            setDays([day, ...days])
            setToday(day)
        }else{
            await db.days.where({id: latestDay.id}).modify(day=>{
                let difference = now.getTime() - new Date(latestDay.date).getTime();
                console.log("difference:", difference, dayInMilliseconds)
                day.goals = day.goals.map(goal => {
                    if(goal.goalId === goalId) return {
                        ...goal,
                        progress: goal.progress + progress
                    }
                    return goal
                })
                let today = {
                    id: latestDay.id,
                    date: latestDay.date,
                    goals: day.goals
                };
                let updatedDays = days;
                updatedDays[0] = today;
                setDays(updatedDays)
                setToday(day)
            })
            
        }
    
    }
    const addGoal = async(goalForm: TGoalForm) =>{
        let goal = await dbController.addGoal(goalForm)
        let latestDay = days[0];
        let now = getToday();
        if(!latestDay){
            let todayGoals = addProgressToDayGoals([...goals, goal],0)
            let day = await dbController.addDay({
                date: now.getTime(),
                goals: todayGoals
            })
            setDays([day])
            setToday(day)
        }else if(now.getTime() - new Date(latestDay.date).getTime() >= dayInMilliseconds ){
            let difference = now.getTime() - new Date(latestDay.date).getTime();
            console.log("difference:", difference, dayInMilliseconds)
            await addEmptyDays(goals, difference, now)
            let todayGoals = addProgressToDayGoals([...goals, goal],0, goal.id);
            let day = await dbController.addDay({
                date: now.getTime(),
                goals: todayGoals
            })
            setDays([day,...days])
            setToday(day)
        }else{
            await db.days.where({id: latestDay.id}).modify(day=>{
                day.goals = [...day.goals, {goalId: goal.id, type: goal.type, amount: goal.amount, frequency: goal.frequency, progress: 0}]
                let today = {
                    id: latestDay.id,
                    date: latestDay.date,
                    goals: day.goals
                };
                let updatedDays = days;
                updatedDays[0] = today;
                setDays(updatedDays)
                setToday(day)
            })
            
        }
    
    }
    useEffect(()=>{
        db.days.orderBy("date").reverse().toArray().then(result =>{
            setDays(result);
            setToday(result[0])
        })
    },[])
    return (
        <DaysContext.Provider value={{days,today, setDayProgress, addGoal}}>
            {children}
        </DaysContext.Provider>
    )
}
const useDays = () =>{
    let daysContext = useContext(DaysContext);
    if(!daysContext) throw new Error("useDays must be used inside DaysProvider");
    return daysContext;
}
export { useDays, DaysProvider};
