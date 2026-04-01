export const variants = {
  panelEnter: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  tileHover: {
    whileHover: {
      y: -2,
      boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
    },
  },
  statusTransition: {
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      staggerChildren: 0.1,
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
};
