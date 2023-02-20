import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from 'dotenv'
import {Configuration, OpenAIApi} from 'openai'

const app = express()

env.config()

app.use(cors())
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://gpt-tes.vercel.app/","http://localhost:3000");
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
app.get("/", (req, res) => {
    res.send("Hello World!")
})


//post route for making requests
app.post('/', async (req, res)=>{
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
