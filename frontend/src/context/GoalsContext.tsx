import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { db, TDay, TGoal } from "../db";
import { dayInMilliseconds } from "../constants";
type TGoalsContext = {
    goals: TGoal[]
}
const goalsState = {
    goals: []

}
const GoalsContext = createContext<TGoalsContext>(goalsState)
const GoalsProvider = ({children}: {children: ReactNode}) =>{
    const [goals, setGoals] = useState<TGoal[]>([]);
    useEffect(()=>{
        db.goals.toArray().then(result =>{
            setGoals(result);
        })
    },[])
    return (
        <GoalsContext.Provider value={{goals}}>
            {children}
        </GoalsContext.Provider>
    )
}
const useGoals = () =>{
    let goalsContext = useContext(GoalsContext);
    if(!goalsContext) throw new Error("useGoals must be used inside GoalsProvider");
    return goalsContext;
}
export { useGoals, GoalsProvider};
