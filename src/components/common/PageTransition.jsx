import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    x: '60%',
    opacity: 0,
    filter: 'blur(4px)',
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    x: '-30%',
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
