'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Lock, User, UserPlus, Check, Mail } from "lucide-react"; // Assuming you use lucide-react for icons
import Form from "next/form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { deleteInvite } from "@/api/firebase/teachers";
import { auth, db } from "@/lib/firebase";

export default function RegisterTeacherForm({ invite, token }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // --- Password Strength Logic ---
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++; // Mix of cases
    if (/\d/.test(password)) strength++; // Digit
    if (/[^a-zA-Z0-9]/.test(password)) strength++; // Special character
    
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };
  // -------------------------------

  const passwordsDontMatch = confirmPassword && password !== confirmPassword;
  const isFormValid = password && !passwordsDontMatch && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword( auth, invite.email, password );
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        name: invite.name,
        email: invite.email,
        contact: invite.contact,
        instituteId: invite.instituteId,
        role: "teacher",
        isActive: true,
        subscriptionExpiry: null,
        createdAt: serverTimestamp(),
      });
      console.log(`User registered with UID: ${uid}`);

      await deleteInvite(token);

      // alert("Registration successful! Redirecting to login.");
      router.push("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full bg-circuit-board bg-gray-08 flex items-center justify-center p-3">

      {/* Register Teacher Form */}
      <Form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-3 p-3 md:p-6 bg-gray-10/80 backdrop-blur-xl rounded-2xl border border-gray-20 w-full max-w-md animate-fadeIn"
      >
        {/* Header */}
        <div className="flex flex-col justify-center items-center gap-2 mb-2">
          <div className="w-16 h-16 bg-purple-60/20 rounded-2xl flex items-center justify-center mb-2">
            <UserPlus className="w-8 h-8 text-purple-60" />
          </div>
          <Typography variant="h1" as="h1" className="text-white-99">
            Teacher Registration
          </Typography>
          <Typography variant="body" className="text-gray-50 text-center">
            You've been invited to join. Set your password to proceed.
          </Typography>
        </div>

        {/* Name Input (Disabled) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Full Name</label>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={invite.name}
            disabled
            startIcon={<User size={18} />}
          />
        </div>

        {/* Email Input (Disabled) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={invite.email}
            disabled
            startIcon={<Mail size={18} />}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock size={18} />}
            endIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < passwordStrength ? getStrengthColor() : 'bg-gray-20'
                    }`}
                  />
                ))}
              </div>
              <Typography variant="body" className={`text-xs ${
                passwordStrength <= 1 ? 'text-red-400' : 
                passwordStrength <= 3 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                Password strength: {getStrengthText()}
              </Typography>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startIcon={<Lock size={18} />}
              endIcon={
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              }
            />
          </div>
          {passwordsDontMatch && (
            <Typography variant="body" className="text-xs text-red-400">
              Passwords do not match
            </Typography>
          )}
        </div>

        {/* Register Button */}
        <Button 
          type="submit" 
          disabled={!isFormValid} 
          className="flex justify-center gap-2 mt-4"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white-99 border-t-transparent rounded-full animate-spin"></div>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
        
      </Form>
    </div>
  );
}