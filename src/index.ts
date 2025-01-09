import express, {Request,Response} from "express"
import btnRouter from './router/buttonRouter';


import cors from 'cors';


const app=express()

app.use(express.json())
app.use(cors())
// const btnRouter=(import router from "./router/buttonRouter")
// interface buttonInterface{
//     id:string,
//     name:string,
//     speed:number,
//     acceleration:number,
//     wait:number,
// }
// interface  
app.use('/btn',btnRouter)
// app.use('/gripper',)
app.listen(5000,()=>{
    console.log("server is listening on port 5000")
})
