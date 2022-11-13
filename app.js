const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

// connecting to the database 
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

// defining database schema
const articleSchema = {
    title : String,
    content : String
};

// defining database model
const Article = mongoose.model("Article",articleSchema);

// Home route
app.get("/",function(req,res){
    res.send("This is a loading page!");
});

///////////////////////////////// Requests targeting all articles ///////////////////////////////////
app.route("/articles")
.get(function(req,res){
    // console.log("get/articles");
    Article.find(function(err,foundArticle){
     if(!err){
       res.send(foundArticle);
    }
    else{
       res.send(err);
    }
    })
 })
 .post(function(req,res){
    //  console.log(req.body.title);
    //  console.log(req.body.content);
    
     const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
     })
    
     newArticle.save(function(err){
        if(!err){
            res.send("Successfully added !");
        }
        else{
            res.send(err);
        }
     })
    })
    .delete(function(req,res){
        //  console.log(req.body.title);
        //  console.log(req.body.content);
        
         const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
         })
        
         newArticle.save(function(err){
            if(!err){
                res.send("Successfully added !");
            }
            else{
                res.send(err);
            }
         });
        });

   ////////////////////////////////// Requests targeting specific articles  /////////////////////////////
    app.route("/articles/:articleTitle")

    .get(function(req,res){
       Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("Nothing found !");
        }
       })
    })

    .put(function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Done successfully!")
                }
            }
        );
    })

    .patch(function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
               if(err){
                res.send(err);
               }
               else{
                res.send("Patch done successfully!");
               }
            }
        );
    })

    .delete(function(req,res){
        Article.deleteOne(
        {title: req.params.articleTitle},
         function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Deleted successfully!");
            }
         }
        )
    })
 

app.listen(3000,function(){
    console.log("Listening at port 3000");
})

