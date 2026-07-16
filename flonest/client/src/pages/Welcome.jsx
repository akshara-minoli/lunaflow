import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarHeart, ShieldCheck, Sparkles, TrendingUp, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <CalendarHeart className="w-6 h-6 text-rose-400" />,
      title: "Smart Predictor",
      desc: "Get intelligent predictions for your next period, ovulation dates, and fertile window based on your body's natural patterns."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "Symptom & Mood Journal",
      desc: "Log flow intensity, moods, symptoms, and private notes to understand changes throughout your cycle."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-teal-400" />,
      title: "Insights & Trends",
      desc: "Analyze average cycle durations, period lengths, and symptom frequencies through clean stats dashboards."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-pink-400" />,
      title: "Privacy First",
      desc: "Your data belongs to you. We secure your records using industry-standard hashing and strict access tokens."
    }
  ];

  return (
    <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-rose-500/10 blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[120px] -z-10" />

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl text-center space-y-8"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3 h-3 fill-rose-400" />
          <span>Care & confidence, every day</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-outfit font-extrabold text-4xl md:text-7xl leading-tight text-white tracking-tight"
        >
          Track your menstrual cycle <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-purple-500 bg-clip-text text-transparent text-glow">
            with confidence.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-350 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          FloNest provides simple cycle logs, ovulation predictions, and symptom monitoring—all protected in a secure and customizable space.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow shadow-lg shadow-rose-600/35"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow shadow-lg shadow-rose-600/35"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold transition-all duration-300"
              >
                Login
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div id="features" className="w-full max-w-6xl mt-28 md:mt-40 border-t border-white/5 pt-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white">
            Why choose FloNest?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Intuitively crafted tools to support and guide your cycle monitoring journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-outfit font-bold text-lg text-white">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Welcome;
