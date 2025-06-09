"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clsx } from "clsx";
import { ColorfulText } from "../ui/animation-ui/colorful-text";
import Logo from "./Logo";

// Add these gradient components
function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "bg-radial from-[#fff1be] from-28% via-[#ee87cb80] via-70% to-[#b060ff]"
      )}
    />
  );
}

function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          "absolute -right-60 -top-44 h-60 w-[36rem] transform-gpu md:right-0",
          "bg-radial from-[#dddbff] from-28% via-[#fdff8b] via-70% to-[#e42e56]",
          "rotate-[-10deg] rounded-full blur-3xl"
        )}
      />
    </div>
  );
}

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  message?: string;
  showNotification?: boolean;
}

export default function ComingSoon({
  title = "Coming Soon",
  subtitle = "Working on progress",
  message = "We're working hard to bring you amazing React learning resources. Stay tuned!",
  showNotification = true,
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set a launch date 30 days from now
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Notification email:", email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  };

  const countdownItemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
  };

  return (
    <div className="flex w-full flex-col items-center justify-center relative overflow-hidden py-10 md:py-20">
      {/* Custom gradient backgrounds */}
      <div className="absolute inset-0 -z-10">
        <Gradient className="absolute inset-0 opacity-80" />
      </div>
      <div className="absolute inset-0 -z-10">
        <GradientBackground />
      </div>

      <motion.div
        className="w-full max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center justify-center"
        >
          <Logo />
        </motion.div>
        <ColorfulText
          text={title}
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text h-20 text-transparent bg-gradient-to-r from-slate-900 to-purple-800"
        />

        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-semibold mb-6 text-slate-800"
        >
          {subtitle}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-slate-700 mb-12 max-w-2xl mx-auto"
        >
          {message}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-4 mb-12"
        >
          {Object.entries(countdown).map(([unit, value]) => (
            <motion.div
              key={unit}
              variants={countdownItemVariants}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg"
            >
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="text-3xl md:text-4xl font-bold text-slate-800"
              >
                {value}
              </motion.div>
              <div className="text-sm text-slate-600 capitalize">{unit}</div>
            </motion.div>
          ))}
        </motion.div>

        {showNotification && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Get Notified When We Launch
              </h3>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 border-white/20 text-slate-800 placeholder:text-slate-500"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                >
                  Notify Me
                </Button>
              </form>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 mt-2"
                >
                  Thank you! We&apos;ll notify you when we launch.
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
