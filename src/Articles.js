const  mongoose =require('mongoose');

const ArticlesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        required: true
    },
    comments: []
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports=Articles;
