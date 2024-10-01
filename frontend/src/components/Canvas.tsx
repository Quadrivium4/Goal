import React, { useEffect, useRef, useState } from 'react';
import { useMessage } from '../context/MessageContext';
import { TDayGoal } from '../db';


function Canvas({draw, graph}: {draw: (ctx: CanvasRenderingContext2D,canvas: HTMLCanvasElement, graph: TDayGoal[])=>void, graph: TDayGoal[]}) {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() =>{
        if(ref.current){
            let ctx = ref.current.getContext('2d');
            if(ctx) draw(ctx,ref.current, graph)
        }
    },[])
    return (
        <canvas ref={ref}></canvas>
    );
}

export default Canvas;
