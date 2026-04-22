export default function isAuth(req, res, next){
    if(req.session.isAuthenticated && req.session.user){
        return next();
    }

    req.flash("errors", "You must be logged in to access this page.");
    res.redirect("/");
}