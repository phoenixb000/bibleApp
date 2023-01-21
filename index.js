const express = require( "express")
const mongoose = require( "mongoose")
const cors = require( 'cors')
const bible = require( './models/bible')
const path = require("path")
const app = express()
app.use(cors());
app.use(express.json())

const PORT = 8000
const DB = "mongodb+srv://bible:bibleapp@cluster0.9wj99pn.mongodb.net/bibleApp?retryWrites=true&w=majority"

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => app.listen(PORT)).catch(err => console.log(err))

app.get('/api/:book', async (req, res) => { 
    const name = req.params.book.toLowerCase().trim()
    let data = []
    try {
        if (name == "bible")
            data = await bible.find()
        if (name == "old testement")
            data = await bible.find({book_no: { $lte: 39 }})
        if (name == "new testement")
            data = await bible.find({book_no: { $gte: 40 }})
        if(data.length == 0)
            data = await bible.find({book_name : { $regex: "^"+name+"$", '$options' : 'i' } })
        if (data.length == 0)
            data = await bible.find({aurthor : { $regex: "^"+name+"$", '$options' : 'i' } })
        if(data.length == 0)
            data = await bible.find({themes : { $regex: "^"+name+"$", '$options' : 'i' } })
        if (data.length == 0)
           data = await bible.find({ministry : { $regex: "^"+name+"$", '$options' : 'i' } })
    } catch (error) {
       console.log("ERROR"); 
    }
    if(!data)
        res.status(200).json({data})
    res.status(200).json({data})
})

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', async (req, res) => { 
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});