"use client";

import { motion } from "framer-motion";

export function WhatsAppWidget() {
  const whatsappNumber = "919165057755"; // support contact number
  const message = "Hello ePoojapaath Support! I have a query regarding puja bookings / services.";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      id="whatsapp-floating-widget"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed md:bottom-[96px] bottom-20 md:right-6 right-4 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center text-white hover:bg-[#20ba5a] transition-all group cursor-pointer animate-glow-pulse"
      aria-label="Chat on WhatsApp"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 md:w-8 md:h-8 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.58 1.978 14.108.954 11.998.954 6.56.954 2.136 5.325 2.132 10.756c-.001 1.637.45 3.238 1.309 4.63l-.995 3.635 3.731-.977zm11.368-6.19c-.3-.149-1.772-.874-2.046-.974-.275-.1-.475-.149-.675.15-.2.299-.775.974-.95 1.173-.175.2-.35.225-.65.075-.3-.15-1.265-.466-2.41-1.488-.89-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.492-.51-.675-.518-.174-.007-.374-.009-.574-.009-.2 0-.525.075-.8.375-.276.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.116 4.52.716.31 1.274.495 1.71.634.72.228 1.375.196 1.893.118.577-.087 1.772-.724 2.022-1.424.25-.7.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z" />
      </svg>

      {/* Tooltip on Hover - Shows on the left */}
      <span className="absolute right-20 bg-dark text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md border border-deep-gold/20 font-medium">
        Chat with Us
      </span>

      {/* Pulsing indicator ring */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 pointer-events-none" />
    </motion.a>
  );
}
