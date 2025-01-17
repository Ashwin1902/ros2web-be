import { Router,Request,Response } from "express";
import path from 'path';
import fs from 'fs';
import { randomUUID } from "crypto";
import * as yaml from "js-yaml";
const dataFilePath = path.join(__dirname, '../data.yaml');
const router=Router()

interface buttonInterface{
    id:string,
    name:string,
}
interface Data {
    points: buttonInterface[];
}
router.post('/addPoint',(req:Request,res:Response)=>{
    try {
        const id=randomUUID();
        const { name } = req.body;
        const type="point";
        const newButton= {name,id,type};
        //console.log(newButton);
        console.log(newButton);
        
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data;
        // const currObject= JSON.parse(data);
        // console.log(data);
        
        data.points.push(newButton);
        fs.writeFileSync(dataFilePath, yaml.dump(data));
        //console.log(data);
        
        //console.log(newButton);
        return res.status(200).json({ message: 'path added successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

router.put('/editPoint',(req:Request,res:Response)=>{
    try {
        
        const { name,id} = req.body;
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data;
        const newButtonIdx=data.points.findIndex((btn:{id:string})=>btn.id==id)
        if(newButtonIdx==-1) return res.status(400).json({ message: 'path does not exist, cannot update'});      
        const type="path";
        const newButton={name,id}
        data.points[newButtonIdx]=newButton
        fs.writeFileSync(dataFilePath,yaml.dump(data));
        console.log("point edited",newButton);
        return res.status(200).json({ message: 'point edited successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

router.get('/removePoint',(req:Request,res:Response)=>{
    
    try {
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
        if(data.points.length==0){
            return res.status(404).json({ message: 'No path available'});
        }
        const removedButton=data.points.pop()
        fs.writeFileSync(dataFilePath,yaml.dump(data));
        // console.log(currObject);
        console.log(removedButton);
        
        
        return res.status(200).json({ message: 'point removed successfully',removedButton});
    } catch (error) {
        return res.status(400).json({"error: ":error});        
    }
   
})

router.get('/removeAllPoints',(req:Request,res:Response)=>{
    
    try {
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
        data.points=[]
        fs.writeFileSync(dataFilePath, yaml.dump(data));
    //console.log(currObject);
        return res.status(200).json({ message: 'All paths removed successfully'});
    } catch (error) {
        return res.status(400).json({"error: ":error});
    }
    
})

// router.get('/getAllPaths',(req:Request,res:Response)=>{
    
//     try {
//         const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
//         // console.log(currObject);
//         return res.status(200).json(data);
//     } catch (error) {
//         return res.status(400).json({"error: ":error});
//     }
    
// })
export default router
