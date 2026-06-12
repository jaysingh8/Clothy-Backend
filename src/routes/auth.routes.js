import {Router} from 'express';
import { validateLogin, validateRegisterUser } from '../validators/auth.validator.js';
import { getMe, googleCallback, login, register , } from '../controllers/auth.controller.js';
import passport from 'passport';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register" ,validateRegisterUser, register)

router.post('/login',validateLogin, login)

router.get("/google",passport.authenticate("google" , { scope: ["profile" ,"email"]}))

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "https://clothy-frontend-mu.vercel.app/login" }, (err, user, info) => {
    if (err || !user) {
      return res.redirect("https://clothy-frontend-mu.vercel.app/login");
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return res.redirect("https://clothy-frontend-mu.vercel.app/login");
      }
      next();
    });
  })(req, res, next);
}, googleCallback)


router.get("/me",authenticateUser,getMe)

export default router;