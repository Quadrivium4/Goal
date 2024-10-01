import React, { useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import { useGoals } from '../../context/GoalsContext';
import { insertFakeValues, insertProbablyValues } from '../../db';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from './Calendar';
import Graph from './Graph';
function Stats() {
  const {days} = useDays();
  const {goals} = useGoals();
  const [type, setType] = useState<"calendar" | "graph" | "">("graph");
  const [frequency, setFRequency] = useState<"daily" | "weekly"| "monthly"| "" >("daily");
  return (
    <div id='stats'>
      <h1>Stats</h1>
      <div className='options'>
        <div className='option'>
          <p>Type: </p><Select options={["calendar", "graph"]} onSelect={setType} placeholder='calendar' selected='graph'></Select>
        </div>
         <div className='option'>
          <p>Frequency: </p><Select options={["daily", "weekly", "monthly"]} onSelect={setFRequency} placeholder='daily' selected='daily'></Select>
        </div>
      </div>
      
      {
        type === "calendar" && frequency? <Calendar frequency={frequency} /> : <Graph />
      }

      <button onClick={insertFakeValues}>insert random values</button>
      <button onClick={insertProbablyValues}>insert probably values</button>
    </div>
  );
}

export default Stats;
