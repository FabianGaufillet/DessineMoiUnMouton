import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Veuillez renseigner votre prénom."],
      maxLength: 25,
    },
    last_name: {
      type: String,
      required: [true, "Veuillez renseigner votre nom."],
      maxLength: 25,
    },
    email: {
      type: String,
      required: [true, "Veuillez renseigner votre email."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Veuillez renseigner votre mot de passe."],
      select: false,
      maxLength: 255,
    },
    points: {
      type: Number,
      required: [true, "Veuillez renseigner le nombre de points"],
      default: 0,
    },
    playing_time: {
      type: Number,
      required: [true, "Veuillez renseigner le temps de jeu"],
      default: 0,
    },
    role: {
      type: String,
      required: [true, "Le rôle de l'utilisateur est requis."],
      enum: ["USER", "MODERATOR", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", UserSchema);

export { User };
