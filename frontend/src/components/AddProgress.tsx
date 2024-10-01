import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { db, TGoal } from '../db';
import { useUser } from '../context/AuthContext';

function AddProgress({goal, setProgress, closePop} : {goal: TGoal, setProgress: (id: number, progress: number)=>void, closePop: ()=>void}) {
    const user = useUser();
    const [progressValue, setProgressValue] = useState(0)
    const updateGoalProgress = () =>{
        setProgress(goal.id,  progressValue);
        closePop();
    }
    return (
    <div className='form'>
        <h2>Add Progress</h2>
        {goal.type === "time" ? <Input.TimePicker onSelect={setProgressValue} /> 
        : goal.type === "distance"? <Input.DistancePicker onSelect={setProgressValue}/> 
        : <input placeholder='progress' value={progressValue} type="number" onChange={(e)=> setProgressValue(parseInt(e.target.value))} />}
        <button onClick={updateGoalProgress}>add</button>
    </div>
);
}

export default AddProgress;
