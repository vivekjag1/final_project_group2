import express from 'express'; 
import moods from '../mongoose/mood/model'; 
import { MoodType } from '../mongoose/mood/schema';
const router = express.Router(); 
router.post('/api/updateMood', async(req, res) => { 
    const userName = req.body.userName; 
    const oldMood = await moods.find({userName});


    if (oldMood[0]) {
        console.log(oldMood);
        let newMoodList = oldMood[0].moods;
        newMoodList[req.body.day] = req.body.mood;
        let newMood = await moods.findOneAndUpdate({userName: userName}, {mood: newMoodList}, {new:true});
        res.json(newMood);
    } else {
        let moodList = ["", "", "", "", "", "", ""];
        moodList[req.body.day] = req.body.mood;
        let newMood = new moods({
            userName: userName,
            moods: moodList,
        });
        await newMood.save();
        res.json(newMood);
    }

}); 
export default router; 
