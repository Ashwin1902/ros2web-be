import { Router, Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { randomUUID } from "crypto";

const dataFilePath = path.join(__dirname, '../data.json');
const router = Router();

// interface gripperInterface {
//     id: string;
//     name: string;
//     state: number;
//     number: number;
//     wait: number;
// }

router.post('/addGripper', (req: Request, res: Response) => {
    try {
        const id = randomUUID();
        const {state, number, wait } = req.body;
        const name=`gripper_${number}_${state==0?"close":"open"}`;
        const type="Gripper"
        // if(state==0) name=name+"close";
        // else name=name+"open"; 
        const newGripper = { type,name, state, number, wait, id };
        console.log(name);
        
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        const currObject = JSON.parse(data);
        currObject.buttons.push(newGripper);
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');

        return res.status(200).json({ message: 'Gripper added successfully', data: newGripper });
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({ "error: ": error });
    }
});

router.put('/editGripper', (req: Request, res: Response) => {
    try {
        const { id, state, number, wait } = req.body;
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        const currObject = JSON.parse(data);
        const name=`gripper_${number}_${state==0?"close":"open"}`;

        const gripperIdx = currObject.buttons.findIndex((gripper:{id:string}) => gripper.id === id);
        if (gripperIdx === -1) return res.status(404).json({ message: 'Gripper does not exist, cannot update' });

        const updatedGripper = { id, name, state, number, wait };
        currObject.buttons[gripperIdx] = updatedGripper;
        fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');

        return res.status(200).json({ message: 'Gripper updated successfully', data: updatedGripper });
    } catch (error) {
        return res.status(400).json({ "error: ": error });
    }
});

// router.get('/removeGripper', (req: Request, res: Response) => {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf-8');
//         const currObject = JSON.parse(data);
//         if (currObject.grippers.length === 0) {
//             return res.status(400).json({ message: 'No grippers available' });
//         }

//         const removedGripper = currObject.grippers.pop();
//         fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');

//         return res.status(200).json({ message: 'Gripper removed successfully', removedGripper });
//     } catch (error) {
//         return res.status(400).json({ "error: ": error });
//     }
// });

// router.get('/removeAllGrippers', (req: Request, res: Response) => {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf-8');
//         const currObject = JSON.parse(data);
//         currObject.grippers = [];
//         fs.writeFileSync(dataFilePath, JSON.stringify(currObject, null, 2), 'utf-8');

//         return res.status(200).json({ message: 'All Grippers removed successfully' });
//     } catch (error) {
//         return res.status(400).json({ "error: ": error });
//     }
// });

// router.get('/getAllGrippers', (req: Request, res: Response) => {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf-8');
//         const currObject = JSON.parse(data);
//         return res.status(200).json({ grippers: currObject.grippers });
//     } catch (error) {
//         return res.status(400).json({ "error: ": error });
//     }
// });

// router.get('/getGripperById/:id', (req: Request, res: Response) => {
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf-8');
//         const currObject = JSON.parse(data);
//         const id = req.params.id;
//         const gripper = currObject.grippers.find((gripper:{id:string}) => gripper.id === id);
//         if (!gripper) return res.status(400).json({ "msg": "No such gripper exists" });
//         return res.status(200).json({ gripper });
//     } catch (error) {
//         return res.status(400).json({ "error: ": error });
//     }
// });

export default router;
