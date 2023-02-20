import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from 'dotenv'
import {Configuration, OpenAIApi} from 'openai'

const app = express()
const port = process.env.PORT || 4000;
env.config()

app.use(cors())
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://gpt-tes.vercel.app/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(express.json({ limit: '30mb', extended: true }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));


// Configure open api
const configuration = new Configuration({
    organization: "org-kDJbLtt6EZiRr2eNhugUibag",
    apiKey: process.env.API_KEY // VISIT .env AND MAKE CHANGES
})
const openai = new OpenAIApi(configuration)


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

app.use('/posts', postRoutes);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('APP is RUN');
});

const CONNECTION_URL = 'mongodb+srv://Andria_Herivony:y4y7MNoyqlA9DAVg@andryzolalaina.sxmey4g.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);