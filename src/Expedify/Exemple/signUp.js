import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { createUser, resetAuthState } from '../login/userSlice';
import { motion } from 'framer-motion';
import {
  UserIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
const SignUp = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
   const { status } = useSelector((state) => state.user);



   const [successMessage, setSuccessMessage] = useState('');
   console.log('status:', status);

  
  useEffect(() => {
  if (status === 'succeeded') {
    setSuccessMessage("Compte créé avec succès ! Redirection en cours...");
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer)
  }
}, [status, navigate]);


  const [userType, setUserType] = useState('personal');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company_name: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      company_name: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const userData = {
      ...form,
      type: userType,
    };
    dispatch(createUser(userData));
  };
    useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Message de succès amélioré */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center max-w-md">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            <div>
              <p className="font-semibold">Succès</p>
              <p>{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-center relative"
            >
              Créer un compte
            </motion.h2>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-indigo-100 text-center mt-2 relative"
            >
              Commencez le voyage de votre colis avec nous
            </motion.p>
          </div>

          <div className="p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-between space-x-4 mb-8 bg-indigo-50/50 p-1.5 rounded-xl backdrop-blur-sm"
            >
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={() => handleUserTypeChange('personal')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  userType === 'personal'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Particulier
              </motion.button>

              <motion.button
                variants={itemVariants}
                type="button"
                onClick={() => handleUserTypeChange('company')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  userType === 'company'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <BuildingOffice2Icon className="w-5 h-5" />
                Entreprise
              </motion.button>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {userType === 'personal' ? (
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Nom"
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>
              ) : (
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                    <BuildingOffice2Icon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="Nom de l'entreprise"
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  required
                  minLength="6"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                />
              </motion.div>

              <motion.button
  type="submit"
  disabled={status === 'loading'}
  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all ${
    status === 'loading'
      ? 'bg-indigo-300 cursor-not-allowed'
      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20'
  } flex items-center justify-center gap-2`} // Ajout de gap-2 pour espacer spinner + texte
>
  {status === 'loading' && (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  )}
  {status === 'loading' ? 'Chargement...' : 'Créer un compte'}
</motion.button>

              <Link
                to="/login"
                className="block text-center mx-auto text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none"
              >
                Vous avez déjà un compte ?
              </Link>
            </motion.form>
           

          </div>
        </div>
      </motion.div>
    </div>
  

  );
};

export default SignUp;