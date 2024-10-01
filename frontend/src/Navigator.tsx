import AppNavigator from './AppNavigator';
import { useAuth } from './context/AuthContext';
import AuthNavigator from './AuthNavigator';
import { useEffect } from 'react';
import { DaysProvider } from './context/DaysContext';
import { GoalsProvider } from './context/GoalsContext';


const Navigator = () =>{
    const {logged, user} = useAuth();
    useEffect(()=>{
        //console.log("navigator",{logged})
    }, [logged])
    
    return (
        <>
        {logged && user? 
        <GoalsProvider>
            <DaysProvider>
                <AppNavigator />
            </DaysProvider>
        </GoalsProvider>
        : <AuthNavigator/>}</>

    )
}
export default Navigator