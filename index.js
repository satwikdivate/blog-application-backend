const fs = require('fs');

const  admin=require('firebase-admin')

const credentials=JSON.parse(fs.readFileSync('./credentials.json'))

admin.initializeApp({
    credential:admin.credential.cert(credentials)
})

const  express =require('express');

const  mongoose=require('mongoose');

// import Articles from './Articles';
const tempexport=require('./src/tempexport')
const Article=require('./src/Articles')

const MONGODB_URL='mongodb://127.0.0.1:27017/react-blog-app'
const Dbconnect=require('./Dbconnect');
const Articles = require('./src/Articles');
const cors = require('cors');
const path = require('path');
// make connection 
Dbconnect();
const dotenv = require("dotenv");

dotenv.config();
const app=express();
// important line to accces  data from body
app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(async(req,res,next)=>{
    const {authtoken}=req.headers;
    if(authtoken){
        try{
            req.user=await admin.auth().verifyIdToken(authtoken)

        }catch(e){
            res.sendStatus(400);
        }
    }
    next();
})
// to use out build
app.use(express.static(path.join(__dirname,"../build")))

app.get(/^(?!\/api).+/,(req,res)=>{
    res.sendFile(path.join(__dirname,'../build/index.html'));
})
// article by name
app.get('/api/articles/:name',async(req,res)=>{
    const {name}=req.params;
    
    // connect with mongodnb
    const result= await Articles.findOne({name});
    
    if(result){
        console.log("Result at backend ",result.upvotes);
        return res.status(200).json({
            "message":"Article found",
            "data":result.upvotes
        })
    }

    return res.status(200).json({
        message:"Article not found"
    })
});

// upvote the article
app.put('/api/articles/:name/upvote',async(req,res)=>{
    const name=req.params.name;
    console.log("Name"+name)
        let article=await Articles.findOne({name:name})
        console.log(article)
        if(article){
            article.upvotes+=1;
            article.save();
            return res.status(200).json({"masssage":article})
        }
    return res.status(404).json({
        "message":"not found"
    })

})

// add comment
app.post('/api/articles/:name/comments',async(req,res)=>{

    let {postedBy,text}=req.body;
    let {name}=req.params;

    let article=await Articles.findOne({name:name});
    let txt=postedBy+"    "+text;
    if(article){
        article.comments.push({postedBy,text});
        article.save();
        return res.status(200).json({
            "message":article
        })
    }
    return res.status(404).json({
        "message":"not found"
    })
})

app.get('/api/articlescomment/:name',async(req,res)=>{
    let {name}=req.params;
    let article=await Articles.findOne({name:name})
    console.log(article);
    if(article){
        
        return res.status(200).json({
            "data":article.comments
        })
    }
    return res.status(200).json({
        "data":0
    })
})

const port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("Server is listning on port"+port);
})
Dbconnect();