const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const NewUser = require('./models/UserModel')
const jwt = require('jsonwebtoken');
const secret='qwaesrdfghjhugyftdxfcvgbhjnmjkhgvc'
const cookieParser = require('cookie-parser');



mongoose.connect('mongodb+srv://nivedkp001:nivedmon@cluster0.uhvah4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')



app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());





app.get('/', (req, res) => {
    res.send('Hello')
}) 


app.post('/reg', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userDoc = await NewUser.create({
            name,
            email,
            password
        })

        res.json(userDoc)


    }
    catch (err) {
        console.log(err)
    }
})


app.post('/log', async (req, res) => {
    try {
        const { email, password } = req.body;
  
        const user = await NewUser.findOne({ email, password });
        
        if (user) {
            // Generate JWT token
            const token = jwt.sign({ email, password }, secret);
            
            // Return token in response
            return res.cookie( 'token',token ).json('ok');
        } else {
            // If user is not found, return appropriate message
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/profile',(req,res)=>{

    const {token}=req.cookies
    jwt.verify(token,secret,{},(err,info)=>{
        if(err)
        {
            console.log('error while verifying jwt token')
        }
        res.json({'token':info})
    })

})


app.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.json({ message: 'Logged out successfully' });
});


app.listen(4000, () => [
    console.log('Server Started')
])

