const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

// middlewire
// app.use(cors())

app.use(cors({
    origin: "*"
}))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqld3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo-app").collection("task");
        const completedTaskCollection = client.db("todo-app").collection("completedTask");

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/singletask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.post('/addtask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.put('/singletask/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedTask,
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // chechk button api for completed task

        app.post('/completedtask', async (req, res) => {
            const task = req.body;
            const result = await completedTaskCollection.insertOne(task);
            res.send(result);
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/completedtask', async (req, res) => {
            const query = {};
            const cursor = completedTaskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello ToDo Task App')
})

app.listen(port, () => {
    console.log('App Running')
})
