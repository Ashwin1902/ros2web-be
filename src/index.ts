import express, {Request,Response} from "express"
import btnRouter from './router/buttonRouter';
import gripperRouter from "./router/gripperRoter";
import cors from 'cors';

const app=express()

app.use(express.json())
app.use(cors())

app.use('/btn',btnRouter)
app.use('/gripper',gripperRouter)


app.listen(5000,()=>{
    console.log("server is listening on port 5000")
})
