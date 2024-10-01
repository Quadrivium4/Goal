
import React,{useEffect, useState, useRef} from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import { useGoals } from '../../context/GoalsContext';
import { insertFakeValues, TDayGoal } from '../../db';
import Canvas from '../../components/Canvas';
import { getNormalizedPercentage } from '../../utils';
type TPoint = {
    x: number,
    y: number
}
type TGraphPoint = TDayGoal & {date: number}
const gap = 25;
const padding = 10
function Svg ({graph, points}:{graph: TGraphPoint[], points: TPoint[]}) {
    const [pointsString, setPointsString] = useState("");
    const [monthNamePoints, setMonthNamePoints] = useState<(TPoint & {date: number})[]>([]);
    const [monthDayScroll, setMonthDayScroll] = useState(0);
     const ref = useRef<HTMLDivElement>(null)
    
    useEffect(() =>{
        if(ref.current) {
            let div = ref.current;
            let toScroll = div.scrollWidth - div.clientWidth;
            div.scrollLeft = div.scrollWidth - div.clientWidth;
            console.log(div.scrollLeft, toScroll)
        
        }
        
    },[graph, points])
    useEffect(() =>{
        let str = "";
        let monthPointsArray:(TPoint & {date: number})[]= [];
        for(let k = 0; k < points.length; k++){
            let point = points[k];
            str += `${point.x},${point.y} `;
            let day = new Date(graph[k].date);
            let previousDay = new Date(graph[k-1]?.date);
            if(day.getMonth() != previousDay.getMonth() ){
                monthPointsArray.push({...point, date: day.getTime()});
            }
        }
        setMonthNamePoints(monthPointsArray);
        for(let k = points.length -1; k >= 0 ; k--){
            let point = points[k];
            str+= `${point.x},150 `
        }
        setPointsString(str)
    },[points])
    return (
        <>
         <div className='months'>
                {
                    monthNamePoints.map((month, i) =>{
                        let monthName = new Date(month.date).toLocaleString('en-us', { month: 'long' });
                        let previousMonth = monthNamePoints[i-1];
                        let nextMonthPosition = monthNamePoints[i+1]?  monthNamePoints[i+1].x : graph.length *gap+ padding;
                        let previousMonthPosition =  monthNamePoints[i-1]?  monthNamePoints[i-1].x : graph.length *gap+ padding;
                        let visible = monthDayScroll > month.x && monthDayScroll > previousMonthPosition ;

                        console.log()
                        return (
                            <>
                            {<p className='month' style={{opacity: (nextMonthPosition - monthDayScroll -10)/130, display: visible? "block" : "none"}} >{monthName}</p>}
                            </>
                        )
                    })
                }
            </div>
        <div className='graph' ref={ref} onScroll={(e)=>{
            let scroll = e.currentTarget.scrollLeft;
            let viewWidth = e.currentTarget.clientWidth;
            console.log({scroll},scroll - viewWidth)
            if(Math.abs(scroll - monthDayScroll) >0)setMonthDayScroll(scroll)
        }}>
           
        <svg width={graph.length *gap +padding} height={150}>
            <polygon points={pointsString} fill='rgba(92, 200, 82, 0.25)'></polygon>
            {graph.map((day, j) =>{
                let dayDiveder = day.frequency === "weekly"? 7 : day.frequency === "monthly"? 30 : 1;
        let progressPercentage = Math.round(100/(day.amount/dayDiveder)* day.progress);
        let progressWidth = progressPercentage > 100? 100 : progressPercentage;
        let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ Math.round(82/100 * progressWidth)})`;
        let nextColor;
        let point =  points[j]
        //console.log(point)
        let nextDay =  graph[j + 1];
        let nextPoint = points[j+1]
        if(nextDay){
            let nextDayDiveder = day.frequency === "weekly"? 7 : day.frequency === "monthly"? 30 : 1;
            let nextProgressPercentage = Math.round(100/(nextDay.amount/nextDayDiveder)* nextDay.progress);
            let colorPercentage = nextProgressPercentage > 100? 100 : nextProgressPercentage;
            nextColor = `rgb(${185-colorPercentage}, ${Math.round(200/100 * colorPercentage)}, ${ Math.round(82/100 * colorPercentage)})`;
        }
        let date = new Date(day.date);
        let dayNumber = date.getDate().toString()//.padStart(2,"0");
        let monthNumber = date.getMonth().toString().padStart(2,"0");
        let previousDay = graph[j-1];
        let monthName = !previousDay || date.getMonth() != new Date(graph[j-1].date).getMonth()? date.toLocaleString('en-us', { month: 'long' }) : null;
        let graphLength = graph.length *gap+ padding;
        let viewWidth = ref.current?.clientWidth ||0 ;
        let scroll = ref.current?.scrollLeft || 0;
        let gradientId = "gradient" +point.x +"" + point.y + "" + j + "" + Math.random();
        // let monthNamePositionX = monthDayScroll +viewWidth > point.x? monthDayScroll+viewWidth : point.x;
        // console.log({monthNamePositionX}, point.x)
        return (
            <>
            {/* {monthName && <text className='month-name' x={monthDayScroll > point.x? monthDayScroll : point.x} y={20}>{monthName}</text>} */}
            <circle r={5} cx={point.x} cy={point.y}z={10} fill={backgroundColor} key={j} ></circle>
            <text x={point.x - (4.5 * dayNumber.length)} y={40} style={{color: "red"}}>{dayNumber }</text>
            {nextPoint? 
                <>
                <linearGradient id={gradientId} >
                    <stop offset="0%" stopColor={backgroundColor}></stop>
                    <stop offset="100%" stopColor={nextColor}></stop>
                </linearGradient>
                <line x1={point.x} y1={point.y} x2={nextPoint.x}y2={nextPoint.y} className='line-connect' stroke={backgroundColor == nextColor? nextColor : `url(#${gradientId})` }></line>
                {/* <polygon points={`${point.x},${point.y} ${nextPoint.x},${nextPoint.y} ${nextPoint.x},0 ${point.x},0`} fill='rgba(92, 200, 82, 0.2)' z={-1}></polygon> */}
                </>
            : null}
            <line x1={point.x} x2={point.x} y1={50} y2={150}  className='line-vertical'></line>
            </>
        )
    })}
        {
            monthNamePoints.map((month, i) =>{
                let monthName = new Date(month.date).toLocaleString('en-us', { month: 'long' });
                let previousMonth = monthNamePoints[i-1];
                let previousMonthPosition = monthNamePoints[i+1]?  monthNamePoints[i+1].x : graph.length *gap+ padding;
                let visible = !(monthDayScroll > month.x && monthDayScroll < previousMonthPosition -200)
                return (
                    <>
                    {visible && <text className='month'  x={month.x } y={20}>{monthName}</text>}
                    </>
                )
            })
        }
        </svg>
        </div>
        </>
    )
}
function Graph() {
    const {days} = useDays();
    const {goals} = useGoals();
    const [graphs, setGraphs] = useState<TGraphPoint[][]>([]);
    const [points, setPoints] = useState<TPoint[][]>([])
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() =>{
        if(ref.current) {
            let div = ref.current;
            
            div.scrollLeft = div.scrollWidth;
            console.log(div.scrollLeft, div.scrollWidth)
        
        }
        
    },[graphs])
    useEffect(() =>{
        let graphsArray:TGraphPoint[][]  = [];
        let pointsArray:TPoint[][] = [];
        days.map((day) =>{
            day.goals.map((goal,i) =>{
                if(!graphsArray[i]) graphsArray[i] = [{...goal, date: day.date}]
                else graphsArray[i].unshift({...goal, date: day.date})
            })
        })
        console.log({graphsArray})
        for(let i = 0; i< graphsArray.length; i++){
            pointsArray.push([]);
            for(let j = 0; j< graphsArray[i].length ; j++){
                let day = graphsArray[i][j];
                let dayDiveder = day.frequency === "weekly"? 7 : day.frequency === "monthly"? 30 : 1;
                let progressPercentage = Math.round(100/(day.amount/dayDiveder)* day.progress);
                let progressWidth = progressPercentage > 100? 100 : progressPercentage;
                //let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ 82/100 * progressWidth})`;
                let point = {x: j*gap + 2*padding, y: 150-progressWidth + padding};
                pointsArray[i][j] = point
            }
        }
        console.log({pointsArray})
        setPoints(pointsArray)
        setGraphs(graphsArray)
    },[days, goals])
    const drawOnCanvas = (ctx: CanvasRenderingContext2D,canvas: HTMLCanvasElement, graph: TDayGoal[] ) =>{
        const pointWidth = 100;
        const pointHeight = 100;
        ctx.imageSmoothingEnabled= true;
        ctx.translate(0.5,0.5)
        canvas.width = 1920;
        canvas.height = 1080;
        const gap = canvas.width/ 20
        graph.map((day, i) =>{
            let dayDiveder = day.frequency === "weekly"? 7 : day.frequency === "monthly"? 30 : 1;
            let progressPercentage = Math.round(100/(day.amount/dayDiveder)* day.progress);
            let progressWidth = progressPercentage > 100? 100 : progressPercentage;
            let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ 82/100 * progressWidth})`;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(gap * i, canvas.height - (progressWidth * 10) - pointHeight, pointWidth,pointHeight);
            let nextPoint = graph[i+1];
            if(nextPoint){
                ctx.strokeStyle = "white";
                ctx.lineWidth = 10;
                ctx.lineCap = "round"
                ctx.lineTo((i+1) *gap + pointWidth/2, canvas.height - (getNormalizedPercentage(nextPoint.amount, nextPoint.progress) * 10) - pointHeight/2)
                ctx.stroke()
                
            }
            
        })
    }
    return (
        <div className='graphs'>
            {graphs.map((graph, i)=>{
                let currentGoal = goals.find(goal => goal.id === graph[0].goalId);
                let title = currentGoal?.title;
     
                
                return (
                    <div key={graph[0].goalId} className='graph-container'>
                        <h2>{title}</h2>
                        
                            <Svg  points={points[i]} graph={graph}/>
                        {/* <Canvas draw={drawOnCanvas} graph={graph} /> */}
                        {/* {graph.map((day, i) =>{
                            let progressPercentage = Math.round(100/(day.amount)* day.progress);
                            let progressWidth = progressPercentage > 100? 100 : progressPercentage;
                            let backgroundColor = `rgb(${185-progressWidth}, ${Math.round(200/100 * progressWidth)}, ${ 82/100 * progressWidth})`
                            return (
                                <div className='graph-point' style={{left: i* 20, bottom: progressWidth, backgroundColor: backgroundColor}} key={i}></div>
                            )
                        })} */}
                        </div>
                )
            })}
        </div>
    );
}

export default Graph;
