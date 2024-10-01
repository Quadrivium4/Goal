import Dexie, {type EntityTable} from "dexie";
type TGoalForm = {
     userId: string,
    progress: number,
    title: string,
    type: string,
    amount: number,
    frequency:  "daily" | "weekly" | "monthly"
}
type TGoal =  TGoalForm & {
    id: number
} 
type TDayGoal = {
    goalId: number,
    type: string,
    amount: number,
    progress: number,
    frequency: "daily" | "weekly" | "monthly"
}
type TDayForm = {
    date: number,
    goals: TDayGoal[]
}
type TDay = TDayForm & {
    id: number
}
const db = new Dexie("Goals") as Dexie & {
    goals: EntityTable<TGoal, "id">,
    days: EntityTable<TDay, "id">
}
const addDay = async(day: TDayForm): Promise<TDay> =>{
    let dayId = await db.days.add(day);
    return {...day, id: dayId};
}
const addGoal = async(goal: TGoalForm): Promise<TGoal> =>{
    let goalId = await db.goals.add(goal);
    return {...goal, id: goalId};
}
const insertFakeValues = async() =>{
    db.days.where("date").below(1735340400000).modify(day =>{
        day.goals = day.goals.map(goal =>{
            let dailyGoalDivider = goal.frequency === "weekly"? 7 : goal.frequency === "monthly"? 30 :1
            return {
                ...goal,
                progress: Math.round(Math.random() * (goal.amount/ dailyGoalDivider ))
            }
        })
    })
}
const insertProbablyValues = async() =>{
    db.days.where("date").below(11735340400000).modify(day =>{
        day.goals = day.goals.map(goal =>{
            let dailyGoalDivider = goal.frequency === "weekly"? 7 : goal.frequency === "monthly"? 30 :1;
            let values = [goal.amount/dailyGoalDivider, goal.amount/dailyGoalDivider, goal.amount/dailyGoalDivider, goal.amount/dailyGoalDivider * 0.9, goal.amount/dailyGoalDivider * 0.9,goal.amount/dailyGoalDivider*0.75, goal.amount/dailyGoalDivider*0.75, goal.amount/dailyGoalDivider*0.5, goal.amount/dailyGoalDivider*0.25, ]
            return {
                ...goal,
                progress: values[Math.floor(Math.random() * values.length)]
            }
        })
    })
}
db.version(1.1).stores({
    goals: "++id, userId, title, type, amount, frequency",
    days: "++id, date, goals"
})
const dbController = {
    addDay,
    addGoal
}
export type {TGoal ,TDay, TDayGoal, TGoalForm}
export {db, dbController, insertFakeValues, insertProbablyValues}