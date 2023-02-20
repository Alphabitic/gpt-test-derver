import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import postRoutes from './routes/posts.js';
import userRouter from './routes/user.js';
import dotenv from 'dotenv';

const app = express()

env.config()

app.use(cors())
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://gpt-tes.vercel.app/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Configure open api
const configuration = new Configuration({
    organization: "org-kDJbLtt6EZiRr2eNhugUibag",
    apiKey: process.env.API_KEY // VISIT .env AND MAKE CHANGES
})
const openai = new OpenAIApi(configuration)


// listeninng
app.listen("3080", ()=>console.log("listening on port 3080"))


// dummy route to test
app.get("/chatbot", (req, res) => {
    res.send("Hello World!")
})


//post route for making requests
app.post('/chatbot', async (req, res)=>{
    const {message} = req.body

    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${message}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        res.json({message: response.data.choices[0].text})

    }catch(e){
        console.log(e)
        res.send(e).status(400)
    }
})
app.use('/posts', postRoutes);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('APP is RUN');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const connectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);