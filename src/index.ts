import express, {Request,Response} from "express"
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { randomUUID } from "crypto";
const app=express()
const dataFilePath = path.join(__dirname, 'data.json');
app.use(express.json())
app.use(cors())

interface buttonInterface{
    id:string,
    name:string,
    speed:number,
    acceleration:number,
    wait:number,
}

app.post('/addButton',(req:Request,res:Response)=>{
    try {
        const id=randomUUID();
        const { name,speed,acceleration,wait } = req.body;
        const newButton:buttonInterface = {name,speed,acceleration,wait,id};       
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        currObject.buttons.push(newButton)
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');
        //console.log(newButton);
        return res.status(200).json({ message: 'Button added successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

app.put('/editButton',(req:Request,res:Response)=>{
    try {
        
        const { name,speed,acceleration,wait,id } = req.body;
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        const newButtonIdx=currObject.buttons.findIndex((btn:{id:string})=>btn.id==id)
        if(newButtonIdx==-1) return res.status(400).json({ message: 'Button does not exist, cannot update'});      
        const newButton:buttonInterface={name,speed,acceleration,wait,id}
        currObject.buttons[newButtonIdx]=newButton
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');
        console.log("Button edited",newButton);
        return res.status(200).json({ message: 'Button added successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

app.get('/removeButton',(req:Request,res:Response)=>{
    
    try {
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        if(currObject.buttons.length==0){
            return res.status(400).json({ message: 'No buttons available'});
        }
        const removedButton=currObject.buttons.pop()
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');
        // console.log(currObject);
        console.log(removedButton);
        
        
        return res.status(200).json({ message: 'Button removed successfully',removedButton});
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

app.get('/removeAllButtons',(req:Request,res:Response)=>{
    
    try {
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        currObject.buttons=[]
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');
    //console.log(currObject);
        return res.status(200).json({ message: 'All Buttons removed successfully'});
    } catch (error) {
        return res.status(400).json({"error: ":error});
    }
    
})

app.get('/getAllButtons',(req:Request,res:Response)=>{
    
    try {
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        // console.log(currObject);
        return res.status(200).json({currObject});
    } catch (error) {
        return res.status(400).json({"error: ":error});
    }
    
})

app.listen(5000,()=>{
    console.log("server is listening on port 5000")
})
