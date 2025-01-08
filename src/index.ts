import express, {Request,Response} from "express"
import fs from 'fs';
import path from 'path';
import cors from 'cors';
const app=express()
const dataFilePath = path.join(__dirname, 'data.json');
app.use(express.json())
app.use(cors())
app.post('/addButton',(req:Request,res:Response)=>{
    try {
        const { buttonType, value } = req.body;
    
        if (!buttonType || !value) {
            return res.status(400).json({ message: 'buttonType and value are required.' });
        }
        const newButton = { buttonType, value };
        const data = fs.readFileSync(dataFilePath,'utf-8');
        const currObject= JSON.parse(data);
        currObject.buttons.push(newButton)
        // console.log(myObject);
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');
        // console.log(data);
        
        // const myObject= JSON.parse(data);
        
        console.log(newButton);
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

