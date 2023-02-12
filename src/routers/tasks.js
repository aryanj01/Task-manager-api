const express = require('express')
const Tasks = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')
const { findOne } = require('../models/user')

router.post('/tasks',auth,  async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
 })

 router.get('/tasks', auth, async (req, res) => {
    try{
        // const completed = req.query.completed
        // if(completed !== undefined){
        //     const match = completed =='true'
        //     const allCompletedTasks = await Tasks.find({owner : req.user._id , completed : match})
        //     return res.status(200).send(allCompletedTasks)
        // }
        // const alltasks = await Tasks.find({owner : req.user._id})
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
 })

 router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Tasks.findOne({_id, owner : req.user._id})
        if(!task)
            return res.status(404).send('task not found')
        res.send(task)
    } catch (e){
        res.status(500).send('user not found')
    }
 })

 router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    try{
        if(!isValidOperation)
            return res.status(500).send('Invalid updates')
        const task = await Tasks.findOne({_id : req.params.id, owner : req.user.id}) 
        if(!task)
            return res.status(404).send('Not found')
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        return res.status(500).res.send()
    }
 })
 router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete({_id : req.params.id, owner : req.user._id})
        if(!task)
            return res.status(404).send('task not found')
        res.send(task)
    } catch (e) {
        return res.status(500).send('server issue')
    }
 })

 module.exports = router