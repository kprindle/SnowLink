const story = require('../models/connection');
const Story = require('../models/connection')

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already')
        return res.redirect('/users/profile');
    }
};

//checks if user is authenticated
exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to log in first')
        return res.redirect('/users/login');
    }
};

//check if user is autor of story
exports.isAuthor = (req, res, next) => {
   let id = req.params.id;
   Story.findById(id)
   .then(story=>{
        if(story){
            if(story.author == req.session.user){
                return next();
            } else {
                let err = Error('Unauthorized to access the resource being not the author');
                err.status = 401;
                return next(err);
            }
        }
   })
   .catch(err=>next(err));
};

//check if user is autor of story
exports.isNotAuthor = (req, res, next) => {
    let id = req.params.id;
    Story.findById(id)
    .then(story=>{
         if(story){
             if(story.author != req.session.user){
                 return next();
             } else {
                 let err = Error('Unauthorized to access the resource being the author');
                 err.status = 401;
                 return next(err);
             }
         }
    })
    .catch(err=>next(err));
 };