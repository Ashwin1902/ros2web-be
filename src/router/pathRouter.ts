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
    speed:number,
    acceleration:number,
    wait:number,
    plan_space: string
}
interface Data {
    paths: buttonInterface[];
}
router.post('/addPath',(req:Request,res:Response)=>{
    try {
        const id=randomUUID();
        const { name,speed,acceleration,wait,plan_space } = req.body;
        const type="path";
        const newButton= {name,speed,acceleration,wait,id,type,plan_space};
        //console.log(newButton);
        console.log(newButton);
        
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data;
        // const currObject= JSON.parse(data);
        data.paths.push(newButton);
        fs.writeFileSync(dataFilePath, yaml.dump(data));
        //console.log(data);
        
        //console.log(newButton);
        return res.status(200).json({ message: 'path added successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

router.put('/editPath',(req:Request,res:Response)=>{
    try {
        
        const { name,speed,acceleration,wait,id,plan_space } = req.body;
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data;
        const newButtonIdx=data.paths.findIndex((btn:{id:string})=>btn.id==id)
        if(newButtonIdx==-1) return res.status(400).json({ message: 'path does not exist, cannot update'});      
        const type="path";
        const newButton={name,speed,acceleration,wait,id,type,plan_space}
        data.paths[newButtonIdx]=newButton
        fs.writeFileSync(dataFilePath,yaml.dump(data));
        console.log("path edited",newButton);
        return res.status(200).json({ message: 'path edited successfully', data: newButton });
    } catch (error) {
        return res.status(400).json({"error: ":error});
        
    }
   
})

router.get('/removePath',(req:Request,res:Response)=>{
    
    try {
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
        if(data.paths.length==0){
            return res.status(404).json({ message: 'No path available'});
        }
        const removedButton=data.paths.pop()
        fs.writeFileSync(dataFilePath,yaml.dump(data));
        // console.log(currObject);
        console.log(removedButton);
        
        
        return res.status(200).json({ message: 'Path removed successfully',removedButton});
    } catch (error) {
        return res.status(400).json({"error: ":error});        
    }
   
})

router.get('/removeAllPaths',(req:Request,res:Response)=>{
    
    try {
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
        data.paths=[]
        fs.writeFileSync(dataFilePath, yaml.dump(data));
    //console.log(currObject);
        return res.status(200).json({ message: 'All paths removed successfully'});
    } catch (error) {
        return res.status(400).json({"error: ":error});
    }
    
})

router.get('/getAllPaths',(req:Request,res:Response)=>{
    
    try {
        const data = yaml.load(fs.readFileSync(dataFilePath,'utf-8')) as Data; 
        // console.log(currObject);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({"error: ":error});
    }
    
})

// router.get('/getButtonById/:id',(req:Request,res:Response)=>{
    
//     try {
//         const data = fs.readFileSync(dataFilePath,'utf-8');
//         const currObject= JSON.parse(data);
//         const id=req.params.id;
//         const obj=currObject.buttons.find((btn:{id:string})=>btn.id==id);
//         if(!obj) return res.status(400).json({"msg":"No such button exists"});
//         return res.status(200).json({obj});
//     } catch (error) {
//         return res.status(400).json({"error: ":error});
//     }
    
// })

export default router