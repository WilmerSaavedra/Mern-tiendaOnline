import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
  
    isAdmin: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
// Método para verificar si la cuenta está bloqueada
userSchema.methods.isLocked = function () {
  return this.lockUntil > Date.now();
};

// Método para verificar si la contraseña es correcta
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.model("Usuario", userSchema);
