import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import authRouter from "../src/routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js";
import productRouter from "../src/routes/product.routes.js";
import wishlistRouter from "../src/routes/wishlist.routes.js";

import { config } from "./config/config.js";

const app = express();

app.set("trust proxy", 1);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://clothy-frontend-mu.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ SESSION (REQUIRED for Google OAuth)
app.use(
  session({
    secret: "clothy_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ✅ PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

// ================= GOOGLE STRATEGY =================
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://clothy-backend-djl7.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ✅ REQUIRED (FIX)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);

export default app;