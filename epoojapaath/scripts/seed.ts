import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import User from "../models/User";
import Temple from "../models/Temple";
import Puja from "../models/Puja";
import Chadawa from "../models/Chadawa";
import Booking from "../models/Booking";
import Blog from "../models/Blog";
import Ad from "../models/Ad";
import Review from "../models/Review";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔗 Connected to MongoDB");

  // Clear all
  await Promise.all([User, Temple, Puja, Chadawa, Booking, Blog, Ad, Review].map((M) => M.deleteMany({})));
  console.log("🗑️  Cleared existing data");

  const hashedPw = await bcrypt.hash("password123", 12);

  // Users
  const [admin, owner1, owner2, owner3, user1, user2] = await User.insertMany([
    { name: "Admin Sharma", email: "admin@epoojapaath.com", password: hashedPw, role: "admin", phone: "+91 98765 43210", city: "Varanasi" },
    { name: "Pt. Ram Kripal", email: "temple1@example.com", password: hashedPw, role: "temple_owner", phone: "+91 87654 32109", city: "Varanasi" },
    { name: "Smt. Kamla Devi", email: "temple2@example.com", password: hashedPw, role: "temple_owner", phone: "+91 76543 21098", city: "Mathura" },
    { name: "Acharya Suresh", email: "temple3@example.com", password: hashedPw, role: "temple_owner", phone: "+91 65432 10987", city: "Ujjain" },
    { name: "Priya Agarwal", email: "user1@example.com", password: hashedPw, role: "user", phone: "+91 98001 00001", city: "Delhi" },
    { name: "Rajesh Mehta", email: "user2@example.com", password: hashedPw, role: "user", phone: "+91 98001 00002", city: "Mumbai" },
  ]);
  console.log("👤 Created 6 users");

  // Temples
  const [t1, t2, t3] = await Temple.insertMany([
    {
      name: "Tripura Sundari Temple",
      slug: "tripura-sundari",
      shortDescription: "One of the Sacred 51 Shakti Peethas of India — Maa Tripurasundari Temple, Udaipur, Tripura, established in 1501 AD by Maharaja Dhanya Manikya.",
      description: `Experience Divine Blessings at Maa Tripurasundari Temple
Tripura Sundari Temple, popularly known as Maa Bari, is one of the holiest Hindu pilgrimage sites and among the revered 51 Shakti Peethas in India. Located in the historic town of Udaipur in Tripura, this ancient temple is dedicated to Goddess Tripura Sundari, an incarnation of Goddess Shakti and Maa Kali. Devotees from across India visit this sacred temple seeking blessings for prosperity, protection, success, peace, marriage, health, and spiritual growth.

History of Tripura Sundari Temple
The sacred Tripura Sundari Temple was established in the year 1501 by Maharaja Dhanya Manikya, the ruler of the Manikya dynasty of Tripura. According to Hindu mythology and Tantric traditions, this temple is one of the 51 Shakti Peethas where the right foot of Goddess Sati is believed to have fallen after Lord Shiva carried her divine body across the universe.
The temple holds immense importance in Shaktism and Tantric worship traditions. Built in traditional Bengali-style architecture with a unique square sanctum and cone-shaped dome, the temple has remained a major spiritual destination for centuries.
The deity worshipped here is Maa Tripura Sundari, also known as Soroshi Kali, represented in the form of a black stone idol symbolizing supreme feminine divine power.

Spiritual Significance of Tripura Sundari Temple
The Tripura Sundari Temple is considered one of the most powerful Shakti Peethas in India. Devotees believe that prayers and pujas offered here bring divine blessings, spiritual protection, fulfillment of wishes, and removal of negative energies.

Why the Temple is Spiritually Powerful
• One of the sacred 51 Shakti Peethas
• Dedicated to Maa Tripura Sundari, the goddess of supreme power
• Major center of Tantric and Shakti worship
• Known for wish fulfillment and spiritual healing
• Strong spiritual vibrations and ancient divine energy
• Thousands of devotees visit during Diwali and Navratri

Temple Timings
• Summer (March to Oct): 5:00 AM to 9:00 PM
• Winter (Nov to Feb): 5:30 AM to 8:30 PM

Daily Puja & Ritual Schedule
• Mangal Aarti: 4:00 AM (Summer) / 4:30 AM (Winter)
• Abhishek & Shringar: 5:00 AM to 6:00 AM (Summer) / 5:30 AM to 7:00 AM (Winter)
• General Darshan Begins: 6:00 AM (Summer) / 7:00 AM (Winter)
• Bhog Offering: 12:00 PM to 1:00 PM
• Temple Closure (Vishram): 1:00 PM to 2:30 PM
• Evening (Sandhya) Aarti: 7:15 PM (Summer) / 6:30 PM (Winter)

Offerings to Maa Tripura Sundari
At the Tripura Sundari Shaktipeeth Temple, the deity is offered 🌺 Red Hibiscus Flower, 🪔 Deep & Dhuno, Peda Prasad, Coconut, Chunari & Saree, Kumkum & Sindoor are also offered during worship.`,
      deity: "Maa Kali",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Udaipur, Tripura", city: "Udaipur", state: "Tripura", pincode: "799120", lat: 23.5048, lng: 91.4986 },
      coverImage: "/tripura-sundari.jpeg",
      images: ["/tripura-sundari.jpeg"],
      timings: "Summer (March to Oct): 5:00 AM to 9:00 PM | Winter (Nov to Feb): 5:30 AM to 8:30 PM",
      established: "1501 AD",
      contactPhone: "+91 3821 223 555",
      contactEmail: "info@tripurasundari.org",
      tags: ["shakti-peetha", "devi", "tripura", "ancient", "51-shaktipeeth", "kali", "tantric"],
      totalBookings: 2400,
      rating: 5.0,
      reviewCount: 35,
    },
    {
      name: "Kasbeswari Kali Temple",
      slug: "kasbeswari-kali",
      shortDescription: "Sacred Shaktipeeth in Tripura with a rare 15th-century sandstone idol of Maa Durga, worshipped as Maa Kali — an ancient Indo-Bangla bond of faith and devotion.",
      description: `Experience the Divine Blessings of Maa Kasbeswari
Kasbeswari Kali Temple is one of the revered spiritual destinations in Tripura dedicated to Goddess Kali, worshipped locally as Maa Kasbeswari. Known for its peaceful spiritual atmosphere and deep devotional significance, the temple attracts thousands of devotees seeking protection, prosperity, courage, and divine blessings.

History of the Temple
The sacred Kasbeswari Shaktipeeth Temple in Tripura is home to a rare 15th-century sandstone idol of Maa Durga, worshipped with deep devotion as Maa Kali. Built in the 17th century, this ancient temple carries centuries of divine energy, where Maa blesses devotees with protection, strength, and victory over evil. Rooted in the shared spiritual heritage of India and Bangladesh, it stands as a timeless Indo-Bangla bond of faith and devotion. With a sacred Shivalinga at Maa’s feet, this powerful Shaktipeeth radiates unmatched spiritual vibrations and wish-fulfilling blessings.

Spiritual Significance of Maa Kasbeswari
Maa Kasbeswari is worshipped as the divine mother who removes fear, negativity, and obstacles from devotees’ lives. Devotees believe that sincere prayers and offerings at the temple bring spiritual strength, prosperity, and fulfillment of wishes.

Why the Temple is Spiritually Powerful
• Strong Presence of Divine Shakti
• Ancient Kali Worship Traditions
• Sacred center of Kali and Shakti worship
• Powerful spiritual vibrations and divine atmosphere
• Known for protection and wish fulfillment
• Important temple during Kali Puja and Navratri
• Spiritual peace and positive energy
• Ancient devotional traditions of Tripura

Temple Timings
• Summer (March to Oct): 5:00 AM to 9:00 PM
• Winter (Nov to Feb): 5:30 AM to 8:30 PM

Daily Puja & Ritual Schedule
• Mangal Aarti: 4:00 AM (Summer) / 4:30 AM (Winter)
• Abhishek & Shringar: 5:00 AM to 6:00 AM (Summer) / 5:30 AM to 7:00 AM (Winter)
• General Darshan Begins: 6:00 AM (Summer) / 7:00 AM (Winter)
• Bhog Offering: 12:00 PM to 1:00 PM
• Temple Closure (Vishram): 2:00 PM to 5:00 PM
• Evening (Sandhya) Aarti: 7:15 PM (Summer) / 6:30 PM (Winter)

Offerings to Maa Kasbeswari
At the Kasbeswari Kali Temple, the deity is offered 🌺 Red Hibiscus Flower, 🪔 Deep & Dhuno, Peda Prasad, Coconut, Chunari & Saree, Kumkum & Sindoor are also offered during worship.`,
      deity: "Maa Kali",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Kasba, Tripura", city: "Kasba", state: "Tripura", pincode: "799102", lat: 23.6300, lng: 91.3500 },
      coverImage: "/kasbeswari.jpeg",
      images: ["/kasbeswari.jpeg"],
      timings: "Summer (March to Oct): 5:00 AM to 9:00 PM | Winter (Nov to Feb): 5:30 AM to 8:30 PM",
      established: "17th century",
      contactPhone: "+91 3821 224 666",
      contactEmail: "info@kasbeswarikali.org",
      tags: ["kali", "shakti-peetha", "devi", "tripura", "historical", "indo-bangla"],
      totalBookings: 1800,
      rating: 4.9,
      reviewCount: 12,
    },
    {
      name: "Tripuresh Bhairav Temple",
      slug: "tripuresh-bhairav",
      shortDescription: "Sacred Bhairav Temple in Tripura — Baba Tripuresh Bhairav, divine guardian and protector of Maa Tripura Sundari Shakti Peetha, established in the 15th century.",
      description: `Experience the Divine Power of Baba Tripuresh Bhairav
Tripuresh Bhairav Temple, popularly known as Shibbari Temple, is one of the most revered Shiva temples in Tripura and holds immense spiritual importance among devotees of Lord Shiva and Shakti traditions. Located near the sacred Tripura Sundari Temple, this holy temple is dedicated to Baba Tripuresh Bhairav, the divine Bhairav form associated with Maa Tripura Sundari.
Devotees visit this sacred temple seeking blessings for protection, spiritual strength, peace, success, and removal of negative energies.

History of Tripuresh Bhairav Temple
Established in 15th Century, this sacred Tripuresh Bhairav Temple is deeply connected with the spiritual heritage of Tripura Sundari Temple and Shakti worship traditions. In Hindu mythology and Tantric belief, every Shakti Peetha is protected by a Bhairav, a fierce and divine manifestation of Lord Shiva.
Baba Tripuresh Bhairav is regarded as the guardian deity and divine protector of Maa Tripura Sundari Temple. Devotees traditionally visit Bhairav Temple before or after offering prayers to Maa Tripura Sundari, completing the sacred spiritual journey.
The temple has remained an important centre of Shiva worship, meditation, and Tantric spiritual practices for generations.

Spiritual Significance of Tripuresh Bhairav Temple
Tripuresh Bhairav Temple is considered a powerful spiritual center where devotees seek divine protection, courage, inner strength, and liberation from fear and negativity.

Why Devotees Visit Baba Tripuresh Bhairav
• Sacred Bhairav associated with Tripura Sundari Shakti Peetha
• Divine protector and guardian deity
• Powerful center for Shiva worship and meditation
• Believed to remove fear, negativity, and obstacles
• Strong spiritual and Tantric significance
• Known for blessings of protection and spiritual energy

Temple Timings
• Summer (Mar 1 – Oct 15): 5:00 AM to 9:00 PM
• Winter (Oct 16 – Feb 28): 5:30 AM to 8:30 PM

Key Daily Rituals & Timings:
• Mangala Aarti: Dawn (4:00 AM in summer; 4:30 AM in winter)
• Main Puja: 9:30 AM to 11:00 AM
• Temple Rest/Bhog: The Goddess rests after Annabhog between 2:00 PM and 2:30 PM.
• Sandhya Aarti: Dusk (6:00 PM in winter; 7:00 PM in summer)

Offerings at Tripuresh Bhairav
At the Tripuresh Bhairav Temple, the deity is offered Bilva Leaves, Flowers & Garland, Milk Abhishek, Dhup & Deep, Coconut, Peda are also offered during worship.`,
      deity: "Lord Bhairav",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Udaipur, Tripura", city: "Udaipur", state: "Tripura", pincode: "799120", lat: 23.5060, lng: 91.4990 },
      coverImage: "/tripuresh-bhairav.jpeg",
      images: ["/tripuresh-bhairav.jpeg"],
      timings: "Summer (Mar 1 – Oct 15): 5:00 AM to 9:00 PM | Winter (Oct 16 – Feb 28): 5:30 AM to 8:30 PM",
      established: "15th century",
      contactPhone: "+91 3821 223 777",
      contactEmail: "info@tripureshbhairav.org",
      tags: ["shiva", "bhairav", "tripura", "guardian", "tantric", "shakti-peetha"],
      totalBookings: 3100,
      rating: 4.8,
      reviewCount: 9,
    },
  ]);
  console.log("🛕 Created 3 featured temples");

  // Schedule helpers — relative to seed run time
  const inHours = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);

  const COMMON_FAQS = [
    { question: "Why choose us for online Puja booking?", answer: "We are a trusted Sanatan spiritual platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals." },
    { question: "Will I receive a recording of the Puja?", answer: "Yes! After the puja, a recorded video is provided. Post-puja, bhaktibox and aarti-prasad are delivered to the devotee's doorstep." },
    { question: "What should I do if I don't know my Gotra?", answer: "If you know your Gotra, please provide it during booking. If you don't know your Gotra, you can leave the field blank. Our priest will guide you according to the customary Sankalp practice." },
    { question: "Can I book the puja if I cannot personally visit the temple?", answer: "Yes. ePoojapaath enables devotees to submit their Sankalp remotely while the puja is performed at the temple by the participating priest." },
  ];

  // Pujas
  await Puja.insertMany([
    {
      name: "Tripura Sundari Nitya Puja",
      nameHi: "त्रिपुरसुंदरी नित्य पूजा",
      price: 301,
      duration: "1 to 1.5 hours",
      temple: t1._id,
      description: "Nitya Puja refers to the daily worship offered to the Goddess with devotion, Vedic mantras, flowers, bhog, diya, incense, and sacred rituals performed by temple priests. This spiritual practice is believed to maintain positive energy, remove negativity, and attract divine protection and prosperity.\n\nAt Tripura Sundari Temple, the Nitya Puja is performed according to ancient Tantric and Vedic traditions followed for centuries.\n\n\"ॐ ऐं ह्रीं श्रीं त्रिपुरसुन्दर्यै नमः॥\"\nReceive Divine Blessings of Maa Tripura Sundari from Anywhere in the World.",
      descriptionHi: "नित्य पूजा देवी को प्रतिदिन भक्तिभाव, वैदिक मंत्रों, पुष्प, भोग, दीप, धूप और मंदिर के पुजारियों द्वारा संपन्न पवित्र अनुष्ठानों के साथ अर्पित की जाती है।",
      image: "/tripura-sundari.jpeg",
      benefits: [
        "Blessings of Maa Tripura Sundari",
        "Removal of negative energies and obstacles",
        "Peace, positivity, and spiritual protection",
        "Success in career and business",
        "Financial prosperity and abundance",
        "Harmony in family and relationships",
        "Good health and mental peace",
        "Fulfillment of wishes and desires",
        "Protection from evil influences and doshas",
        "Spiritual awakening and divine grace",
      ],
      benefitsHi: [
        "मां त्रिपुरसुंदरी का आशीर्वाद",
        "नकारात्मक ऊर्जाओं और बाधाओं का निवारण",
        "शांति, सकारात्मकता और आध्यात्मिक सुरक्षा",
        "करियर और व्यवसाय में सफलता",
        "आर्थिक समृद्धि और प्रचुरता",
        "पारिवारिक सद्भाव और संबंधों में मधुरता",
        "अच्छा स्वास्थ्य और मानसिक शांति",
        "इच्छाओं और मनोकामनाओं की पूर्ति",
        "बुरे प्रभावों और दोषों से सुरक्षा",
        "आध्यात्मिक जागृति और दिव्य कृपा",
      ],
      includes: [
        "Pushpanjali Offering",
        "Peda Prasad Offering",
        "Mantra Chanting & Archana",
        "Name & Gotra Sankalp",
        "Video Recording",
        "Prasad Delivery (Optional)",
      ],
      packages: [
        { label: "Single", persons: "For 1 person", price: 301, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 551, maxPersons: 2 },
        { label: "Family", persons: "Upto 4 people", price: 1051, maxPersons: 4 },
        { label: "Family+", persons: "Upto 6 people", price: 1551, maxPersons: 6 },
      ],
      scheduledAt: inHours(2),
      rating: 5.0,
      reviewCount: 35,
      totalBooked: 240,
      faqs: [
        ...COMMON_FAQS,
        { question: "Is there a special discount coupon available?", answer: "Yes! Use our special discount coupon for ₹50 off on orders above 108. This is our way of celebrating devotion." },
        { question: "What offerings are included in the Nitya Puja?", answer: "The Nitya Puja includes Pushpanjali with Red Hibiscus flowers, Peda Prasad offering, Mantra Chanting & Archana, Name & Gotra Sankalp, Video Recording, and optional Prasad Delivery." },
      ],
    },
    {
      name: "Kasbeswari Kali Nitya Puja",
      nameHi: "कस्बेश्वरी काली नित्य पूजा",
      price: 301,
      duration: "1 to 1.5 hours",
      temple: t2._id,
      description: "Nitya Puja refers to the regular daily worship offered to the deity with sacred rituals, mantra chanting, flowers, lamps, bhog, and prayers. At Kasbeswari Temple, the puja is performed every day by experienced priests with devotion and spiritual discipline. The ritual is believed to maintain divine energy within the temple and spread positivity, peace, and spiritual protection among devotees.\n\nॐ क्रीं कालिकायै नमः॥\nFaith Connected Digitally, Blessings Delivered Spiritually.",
      descriptionHi: "नित्य पूजा देवी को प्रतिदिन दी जाने वाली पवित्र पूजा है जिसमें मंत्र जाप, पुष्पांजलि, दीप, भोग और प्रार्थनाएं शामिल हैं। कस्बेश्वरी मंदिर में यह पूजा प्रतिदिन अनुभवी पुजारियों द्वारा भक्तिभाव और आध्यात्मिक अनुशासन के साथ संपन्न की जाती है।",
      image: "/kasbeswari.jpeg",
      benefits: [
        "Divine blessings of Maa Kali & Maa Durga",
        "Protection from negative energies",
        "Peace, positivity, and mental strength",
        "Success in career and business",
        "Family harmony and prosperity",
        "Courage and spiritual confidence",
        "Removal of obstacles and fear",
        "Fulfillment of wishes and desires",
        "Spiritual growth and inner peace",
      ],
      benefitsHi: [
        "मां काली और मां दुर्गा का दिव्य आशीर्वाद",
        "नकारात्मक ऊर्जाओं से सुरक्षा",
        "शांति, सकारात्मकता और मानसिक शक्ति",
        "करियर और व्यवसाय में सफलता",
        "पारिवारिक सद्भाव और समृद्धि",
        "साहस और आध्यात्मिक आत्मविश्वास",
        "बाधाओं और भय का निवारण",
        "इच्छाओं और मनोकामनाओं की पूर्ति",
        "आध्यात्मिक विकास और आंतरिक शांति",
      ],
      includes: [
        "Pushpanjali Offering",
        "Peda Prasad Offering",
        "Mantra Chanting & Archana",
        "Name & Gotra Sankalp",
        "Video Recording",
        "Prasad Delivery (Optional)",
      ],
      packages: [
        { label: "Single", persons: "For 1 person", price: 301, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 551, maxPersons: 2 },
        { label: "Family", persons: "Upto 4 people", price: 1051, maxPersons: 4 },
        { label: "Family+", persons: "Upto 6 people", price: 1551, maxPersons: 6 },
      ],
      scheduledAt: inHours(1),
      rating: 4.9,
      reviewCount: 12,
      totalBooked: 95,
      faqs: [
        ...COMMON_FAQS,
        { question: "Is there a special discount coupon available?", answer: "Yes! Use our special discount coupon for ₹50 off on orders above 108. This is our way of celebrating devotion." },
        { question: "What offerings are included in the Nitya Puja?", answer: "The Nitya Puja includes Pushpanjali with Red Hibiscus flowers, Peda Prasad offering, Mantra Chanting & Archana, Name & Gotra Sankalp, Video Recording, and optional Prasad Delivery." },
      ],
    },
    {
      name: "Tripuresh Bhairav Nitya Abhishek Puja",
      nameHi: "त्रिपुरेश भैरव नित्य अभिषेक पूजा",
      price: 301,
      duration: "1 to 1.5 hours",
      temple: t3._id,
      description: "Nitya Abhishek means the daily ceremonial bathing and worship of Lord Shiva performed according to ancient Vedic and Tantric traditions. This sacred ritual is believed to purify the mind, remove negative energies, and invite peace, prosperity, and spiritual protection into life.\n\nAt Tripuresh Bhairav Temple, the puja is performed by experienced temple priests with devotion, sacred mantras, and traditional offerings.\n\n\"ॐ कालभैरवाय नमः॥\"\nOffer Devotion, Receive Divine Protection & Blessings.",
      descriptionHi: "नित्य अभिषेक का अर्थ है प्राचीन वैदिक और तांत्रिक परंपराओं के अनुसार भगवान शिव का दैनिक स्नान और पूजा। यह पवित्र अनुष्ठान मन को शुद्ध करता है, नकारात्मक ऊर्जाओं को दूर करता है और जीवन में शांति, समृद्धि और आध्यात्मिक सुरक्षा लाता है।",
      image: "/tripuresh-bhairav.jpeg",
      benefits: [
        "Blessings of Lord Shiva & Baba Bhairav",
        "Protection from negative energies",
        "Removal of obstacles and fears",
        "Peace, positivity, and mental strength",
        "Career and business growth",
        "Financial stability and prosperity",
        "Good health and spiritual healing",
        "Family harmony and well-being",
        "Spiritual growth and inner peace",
      ],
      benefitsHi: [
        "भगवान शिव और बाबा भैरव का आशीर्वाद",
        "नकारात्मक ऊर्जाओं से सुरक्षा",
        "बाधाओं और भय का निवारण",
        "शांति, सकारात्मकता और मानसिक शक्ति",
        "करियर और व्यवसाय में वृद्धि",
        "आर्थिक स्थिरता और समृद्धि",
        "अच्छा स्वास्थ्य और आध्यात्मिक उपचार",
        "पारिवारिक सद्भाव और कल्याण",
        "आध्यात्मिक विकास और आंतरिक शांति",
      ],
      includes: [
        "Jal Abhishek",
        "Panchamrit Abhishek",
        "Bilva Patra Offering",
        "Bhairav Mantra Chanting",
        "Deep & Dhup Seva",
        "Prasad Offering",
        "Name & Gotra Sankalp",
        "Video Recording",
        "Prasad Delivery (Optional)",
      ],
      packages: [
        { label: "Single", persons: "For 1 person", price: 301, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 551, maxPersons: 2 },
        { label: "Family", persons: "Upto 4 people", price: 1051, maxPersons: 4 },
        { label: "Family+", persons: "Upto 6 people", price: 1551, maxPersons: 6 },
      ],
      scheduledAt: inHours(3),
      rating: 4.8,
      reviewCount: 9,
      totalBooked: 70,
      faqs: [
        ...COMMON_FAQS,
        { question: "Is there a special discount coupon available?", answer: "Yes! Use our special discount coupon for ₹50 off on orders above 108. This is our way of celebrating devotion." },
        { question: "What offerings are included in the Nitya Abhishek Puja?", answer: "The Nitya Abhishek includes Jal Abhishek, Panchamrit Abhishek, Bilva Patra offering, Bhairav Mantra Chanting, Deep & Dhup Seva, Prasad Offering, Name & Gotra Sankalp, Video Recording, and optional Prasad Delivery." },
      ],
    },
  ]);
  console.log("📿 Created 4 pujas with packages, timers & FAQs");

  // Chadawa
  await Chadawa.insertMany([
    // ── Tripura Sundari Temple – Add-on Chadawa (isSpecial: false)
    {
      name: "Flower Basket Small",
      nameHi: "फूल टोकरी छोटी",
      price: 51,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Mixed flowers, are offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "देवी को मिश्रित फूल अर्पित किए जाते हैं जो सौंदर्य, भक्ति, पवित्रता और दिव्य स्त्री ऊर्जा का प्रतीक हैं।",
      image: "/tripura-sundari.jpeg",
      items: ["Mixed Seasonal Flowers"],
      isActive: true,
    },
    {
      name: "Red Hibiscus Flower Mala",
      nameHi: "लाल गुड़हल फूल माला",
      price: 251,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Red Hibiscus garlands are offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "लाल गुड़हल माला देवी को अर्पित की जाती है जो सौंदर्य, भक्ति, पवित्रता और दिव्य स्त्री ऊर्जा का प्रतीक है।",
      image: "/red-hibiscus-mala.jpg",
      items: ["Red Hibiscus Mala"],
      isActive: true,
    },
    {
      name: "Deep Daan",
      nameHi: "दीप दान",
      price: 51,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Lighting ghee lamps before the Goddess is believed to remove darkness, negativity, and obstacles while attracting positivity and prosperity.",
      descriptionHi: "देवी के सामने घी के दीप जलाना अंधकार, नकारात्मकता और बाधाओं को दूर करता है तथा सकारात्मकता और समृद्धि को आकर्षित करता है।",
      image: "/tripura-sundari.jpeg",
      items: ["Ghee Lamp"],
      isActive: true,
    },
    {
      name: "Peda Prasad",
      nameHi: "पेड़ा प्रसाद",
      price: 101,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Traditional sweets such as peda offered seeking abundance and blessings.",
      descriptionHi: "पेड़ा जैसी पारंपरिक मिठाई प्रचुरता और आशीर्वाद की प्राप्ति के लिए अर्पित की जाती है।",
      image: "/peda-prasad.jpg",
      items: ["Peda"],
      isActive: true,
    },
    {
      name: "Coconut",
      nameHi: "नारियल",
      price: 71,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Coconut symbolizes surrender of ego and purity of mind and is considered highly auspicious in Devi worship.",
      descriptionHi: "नारियल अहंकार के समर्पण और मन की पवित्रता का प्रतीक है और देवी पूजा में अत्यंत शुभ माना जाता है।",
      image: "/coconut.jpg",
      items: ["Coconut"],
      isActive: true,
    },
    {
      name: "Chunari",
      nameHi: "चुनरी",
      price: 51,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Red chunari are offered to Maa Lalita Tripura Sundari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "मां ललिता त्रिपुरसुंदरी को लाल चुनरी समृद्धि, विवाह, पारिवारिक सुख और स्त्री अनुग्रह के आशीर्वाद के लिए अर्पित की जाती है।",
      image: "/chunari.jpg",
      items: ["Red Chunari"],
      isActive: true,
    },
    {
      name: "Saree",
      nameHi: "साड़ी",
      price: 501,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Red saree offered to Maa Lalita Tripura Sundari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "मां ललिता त्रिपुरसुंदरी को लाल साड़ी समृद्धि, विवाह, पारिवारिक सुख और स्त्री अनुग्रह के आशीर्वाद के लिए अर्पित की जाती है।",
      image: "/red-saree.jpg",
      items: ["Red Saree"],
      isActive: true,
    },
    {
      name: "Sindoor",
      nameHi: "सिंदूर",
      price: 51,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Sindoor symbolize Shakti, feminine divine energy, and auspiciousness.",
      descriptionHi: "सिंदूर शक्ति, स्त्री दिव्य ऊर्जा और शुभता का प्रतीक है।",
      image: "/sindoor.jpg",
      items: ["Sindoor"],
      isActive: true,
    },
    {
      name: "Dakshina to Pandit Ji",
      nameHi: "पंडित जी को दक्षिणा",
      price: 51,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Offer sacred dakshina to the temple pandit as a mark of respect and gratitude for performing the puja rituals. Min ₹51 to ₹9999.",
      descriptionHi: "पूजा अनुष्ठान संपन्न कराने वाले मंदिर पंडित को सम्मान और कृतज्ञता के रूप में पवित्र दक्षिणा अर्पित करें।",
      image: "/tripura-sundari.jpeg",
      items: ["Dakshina"],
      isActive: true,
    },
    {
      name: "Divine Aashirbad Box",
      nameHi: "दिव्य आशीर्वाद बॉक्स",
      price: 201,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: false,
      description: "Box includes Peda, Flower, Sindoor, Mauli, Sacred water from Temple — a divine blessing package delivered to your doorstep.",
      descriptionHi: "बॉक्स में पेड़ा, फूल, सिंदूर, मौली, मंदिर का पवित्र जल शामिल है — एक दिव्य आशीर्वाद पैकेज जो आपके दरवाजे पर पहुंचाया जाएगा।",
      image: "/tripura-sundari.jpeg",
      items: ["Peda", "Flower", "Sindoor", "Mauli", "Sacred Temple Water"],
      isActive: true,
    },

    // ── Tripura Sundari Temple – Special Chadawa (isSpecial: true) — 7 individual items
    {
      name: "Red Flowers & Lotus Basket",
      nameHi: "लाल फूल और कमल टोकरी",
      price: 201,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Offering a Flower Basket to the Deity is a sacred act of devotion symbolizing love and surrender. Fresh, fragrant flowers are offered at the feet of the Divine, pleasing the Gods and Goddesses. This holy offering invokes blessings of peace, joy, harmony, and fulfillment of wishes.",
      descriptionHi: "देवी को फूल टोकरी अर्पित करना प्रेम और समर्पण का एक पवित्र कार्य है। ताजे सुगंधित फूल दिव्य चरणों में अर्पित किए जाते हैं जो शांति, आनंद, सद्भाव और मनोकामना पूर्ति का आशीर्वाद देते हैं।",
      image: "/tripura-sundari.jpeg",
      items: ["Red Flowers", "Lotus Flowers"],
      isActive: true,
    },
    {
      name: "Red Hibiscus Flower Mala – Special",
      nameHi: "लाल गुड़हल फूल माला – विशेष",
      price: 201,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Red Hibiscus garlands are offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "लाल गुड़हल माला देवी को अर्पित की जाती है जो सौंदर्य, भक्ति, पवित्रता और दिव्य स्त्री ऊर्जा का प्रतीक है।",
      image: "/red-hibiscus-mala.jpg",
      items: ["Red Hibiscus Mala"],
      isActive: true,
    },
    {
      name: "Peda Prasad & Coconut Offering",
      nameHi: "पेड़ा प्रसाद और नारियल अर्पण",
      price: 151,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Traditional sweets such as peda offered seeking abundance and blessings. Coconut symbolizes surrender of ego and purity of mind and is considered highly auspicious in Devi worship.",
      descriptionHi: "प्रचुरता और आशीर्वाद की प्राप्ति के लिए पेड़ा जैसी पारंपरिक मिठाई अर्पित की जाती है। नारियल अहंकार के समर्पण और मन की पवित्रता का प्रतीक है।",
      image: "/peda-prasad.jpg",
      items: ["Peda Prasad", "Coconut"],
      isActive: true,
    },
    {
      name: "Saree – Special Offering",
      nameHi: "साड़ी – विशेष अर्पण",
      price: 501,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Red saree offered to Maa Lalita Tripura Sundari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "मां ललिता त्रिपुरसुंदरी को लाल साड़ी समृद्धि, विवाह, पारिवारिक सुख और स्त्री अनुग्रह के आशीर्वाद के लिए अर्पित की जाती है।",
      image: "/red-saree.jpg",
      items: ["Red Saree"],
      isActive: true,
    },
    {
      name: "Offer Nine Suhaag Shringar Items",
      nameHi: "नौ सुहाग श्रृंगार सामग्री अर्पण",
      price: 901,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Offering 9 Suhaag Shringar items like alta, bangles, chunari, bindi, sindoor, mehendi, saree, kajal, and maang tika to the Goddess fulfills all the devotees' desires. Shringar Seva symbolizes devotion, beauty, abundance, and divine feminine power.",
      descriptionHi: "देवी को आलता, चूड़ियां, चुनरी, बिंदी, सिंदूर, मेहंदी, साड़ी, काजल और माँग टीका जैसे 9 सुहाग श्रृंगार सामग्री अर्पित करने से भक्तों की सभी मनोकामनाएं पूरी होती हैं।",
      image: "/tripura-sundari.jpeg",
      items: ["Alta", "Bangles", "Chunari", "Bindi", "Sindoor", "Mehendi", "Saree", "Kajal", "Maang Tika"],
      isActive: true,
    },
    {
      name: "Tripura Sundari Maa Mangalmay Poojan Bhet",
      nameHi: "त्रिपुर सुंदरी मां मंगलमय पूजन भेंट",
      price: 501,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "Offer the Maa Kali Mangalmay Poojan Bhet — a sacred thali with red hibiscus, chunri, fruits, sweets, kumkum, haldi, sindoor, paan, and diya, seeking protection, strength, and fearless divine blessings.",
      descriptionHi: "मां काली मंगलमय पूजन भेंट अर्पित करें — लाल गुड़हल, चुनरी, फल, मिठाई, कुमकुम, हल्दी, सिंदूर, पान और दीये के साथ एक पवित्र थाली, सुरक्षा, शक्ति और निर्भय दिव्य आशीर्वाद की प्राप्ति के लिए।",
      image: "/poojan-bhet.jpg",
      items: ["Red Hibiscus", "Chunri", "Fruits", "Sweets", "Kumkum", "Haldi", "Sindoor", "Paan", "Diya"],
      isActive: true,
    },
    {
      name: "Sacred Khichudi Prasad Seva",
      nameHi: "पवित्र खिचड़ी प्रसाद सेवा",
      price: 3001,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      isSpecial: true,
      description: "In Hindu tradition, Annadanam (food donation) is considered one of the highest forms of charity and spiritual service. Offering or sponsoring Khichudi Prasad at Maa Tripura Sundari Temple is believed to bring immense blessings and positive karma. The sacred prasad is distributed among devotees, pilgrims, saints, and visitors after being offered to the Goddess with Vedic rituals and prayers.",
      descriptionHi: "हिंदू परंपरा में अन्नदान को दान और आध्यात्मिक सेवा के सर्वोच्च रूपों में से एक माना जाता है। मां त्रिपुरसुंदरी मंदिर में खिचड़ी प्रसाद अर्पित करने से अपार आशीर्वाद और सकारात्मक कर्म की प्राप्ति होती है।",
      image: "/tripura-sundari.jpeg",
      items: ["Khichudi Prasad Distribution"],
      isActive: true,
    },

    // ── Kasbeswari Kali Temple – Add-on Chadawa (shown during puja booking & chadawa page)
    {
      name: "Flower Basket Small",
      nameHi: "फूल टोकरी छोटी",
      price: 51,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Mixed flowers offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "देवी को अर्पित मिश्रित फूल — सौंदर्य, भक्ति, शुद्धता और दिव्य स्त्री ऊर्जा का प्रतीक।",
      image: "/flower-garland.jpg",
      items: ["Fresh Mixed Flowers"],
      offeringItems: [
        { name: "Fresh Mixed Flowers", nameHi: "ताजे मिश्रित फूल", price: 51, image: "/red-hibiscus-mala.jpg", description: "Seasonal mixed flowers" },
      ],
    },
    {
      name: "Red Hibiscus Flower Mala",
      nameHi: "लाल गुड़हल फूल माला",
      price: 251,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Red Hibiscus garlands are offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "लाल गुड़हल माला देवी को अर्पित की जाती है जो सौंदर्य, भक्ति, शुद्धता और दिव्य स्त्री ऊर्जा का प्रतीक है।",
      image: "/red-hibiscus-mala.jpg",
      items: ["Red Hibiscus Mala"],
      offeringItems: [
        { name: "Red Hibiscus Mala", nameHi: "लाल गुड़हल माला", price: 251, image: "/red-hibiscus-mala.jpg", description: "Goddess garland" },
      ],
    },
    {
      name: "Deep Daan",
      nameHi: "दीप दान",
      price: 51,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Lighting ghee lamps before the Goddess is believed to remove darkness, negativity, and obstacles while attracting positivity and prosperity.",
      descriptionHi: "देवी के समक्ष घी के दीपक जलाना अंधकार, नकारात्मकता और बाधाओं को दूर करता है और सकारात्मकता व समृद्धि को आकर्षित करता है।",
      image: "/kasbeswari.jpeg",
      items: ["Ghee Lamp"],
      offeringItems: [
        { name: "Ghee Lamp (Deep)", nameHi: "घी का दीपक", price: 51, image: "/tripura-sundari.jpeg", description: "Clay ghee lamp" },
      ],
    },
    {
      name: "Peda Prasad",
      nameHi: "पेड़ा प्रसाद",
      price: 101,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Traditional sweets such as peda offered seeking abundance and blessings.",
      descriptionHi: "पेड़ा जैसी पारंपरिक मिठाइयाँ समृद्धि और आशीर्वाद के लिए अर्पित की जाती हैं।",
      image: "/peda-prasad.jpg",
      items: ["Peda Prasad"],
      offeringItems: [
        { name: "Peda Prasad", nameHi: "पेड़ा प्रसाद", price: 101, image: "/peda-prasad.jpg", description: "Milk sweets" },
      ],
    },
    {
      name: "Coconut",
      nameHi: "नारियल",
      price: 71,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Coconut symbolizes surrender of ego and purity of mind and is considered highly auspicious in Devi worship.",
      descriptionHi: "नारियल अहंकार के समर्पण और मन की पवित्रता का प्रतीक है और देवी पूजा में अत्यंत शुभ माना जाता है।",
      image: "/coconut.jpg",
      items: ["Fresh Coconut"],
      offeringItems: [
        { name: "Fresh Coconut", nameHi: "ताजा नारियल", price: 71, image: "/coconut.jpg", description: "Auspicious coconut" },
      ],
    },
    {
      name: "Chunari",
      nameHi: "चुनरी",
      price: 51,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Red chunari are offered to Maa Kasbeswari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "लाल चुनरी मां कस्बेश्वरी को समृद्धि, विवाह, पारिवारिक सुख और स्त्री कृपा के आशीर्वाद के लिए अर्पित की जाती है।",
      image: "/chunari.jpg",
      items: ["Red Chunari"],
      offeringItems: [
        { name: "Red Chunari", nameHi: "लाल चुनरी", price: 51, image: "/chunari.jpg", description: "Devi chunari" },
      ],
    },
    {
      name: "Saree",
      nameHi: "साड़ी",
      price: 501,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Red saree offered to Maa Kasbeswari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "लाल साड़ी मां कस्बेश्वरी को समृद्धि, विवाह, पारिवारिक सुख और स्त्री कृपा के लिए अर्पित की जाती है।",
      image: "/red-saree.jpg",
      items: ["Red Saree"],
      offeringItems: [
        { name: "Red Saree", nameHi: "लाल साड़ी", price: 501, image: "/red-saree.jpg", description: "Red saree for deity" },
      ],
    },
    {
      name: "Sindoor",
      nameHi: "सिंदूर",
      price: 51,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Sindoor symbolizes Shakti, feminine divine energy, and auspiciousness.",
      descriptionHi: "सिंदूर शक्ति, स्त्री दिव्य ऊर्जा और शुभता का प्रतीक है।",
      image: "/sindoor.jpg",
      items: ["Sindoor"],
      offeringItems: [
        { name: "Sindoor", nameHi: "सिंदूर", price: 51, image: "/sindoor-bowl.jpg", description: "Sacred vermillion" },
      ],
    },
    {
      name: "Dakshina to Pandit Ji",
      nameHi: "पंडित जी को दक्षिणा",
      price: 51,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Offer sacred Dakshina to Pandit Ji as a mark of respect and gratitude. Min ₹51 to ₹9999.",
      descriptionHi: "सम्मान और कृतज्ञता के प्रतीक के रूप में पंडित जी को पवित्र दक्षिणा अर्पित करें।",
      image: "/kasbeswari.jpeg",
      items: ["Dakshina"],
      offeringItems: [
        { name: "Pandit Ji Dakshina", nameHi: "पंडित जी दक्षिणा", price: 51, image: "/tripura-sundari.jpg", description: "Dakshina offering" },
      ],
    },
    {
      name: "Divine Aashirbad Box",
      nameHi: "दिव्य आशीर्वाद बॉक्स",
      price: 201,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: false,
      description: "Box includes Peda, Flower, Sindoor, Mauli, Sacred water from Temple — a complete divine blessing package.",
      descriptionHi: "बॉक्स में पेड़ा, फूल, सिंदूर, मौली, मंदिर का पवित्र जल शामिल है — एक संपूर्ण दिव्य आशीर्वाद पैकेज।",
      image: "/poojan-bhet.jpg",
      items: ["Peda", "Flower", "Sindoor", "Mauli", "Sacred Temple Water"],
      offeringItems: [
        { name: "Peda", nameHi: "पेड़ा", price: 51, image: "/peda-prasad.jpg", description: "Milk sweet" },
        { name: "Flower", nameHi: "फूल", price: 21, image: "/red-hibiscus-mala.jpg", description: "Sacred flower" },
        { name: "Sindoor", nameHi: "सिंदूर", price: 21, image: "/sindoor-bowl.jpg", description: "Vermillion" },
        { name: "Mauli", nameHi: "मौली", price: 11, image: "/kasbeswari.jpeg", description: "Sacred thread" },
        { name: "Sacred Temple Water", nameHi: "मंदिर का पवित्र जल", price: 51, image: "/kasbeswari.jpeg", description: "Holy water" },
      ],
    },

    // ── Kasbeswari Kali Temple – Special Chadawa (standalone booking)
    {
      name: "Red Flowers & Lotus Basket",
      nameHi: "लाल फूल और कमल टोकरी",
      price: 201,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Offering a Flower Basket to the Deity is a sacred act of devotion symbolizing love and surrender. Fresh, fragrant flowers are offered at the feet of the Divine, pleasing the Gods and Goddesses. This holy offering invokes blessings of peace, joy, harmony, and fulfillment of wishes.",
      descriptionHi: "देवी को फूल टोकरी अर्पित करना प्रेम और समर्पण का पवित्र कार्य है। ताजे, सुगंधित फूल दिव्य के चरणों में अर्पित किए जाते हैं, जो शांति, आनंद, सद्भाव और मनोकामनाओं की पूर्ति का आशीर्वाद देते हैं।",
      image: "/flower-garland.jpg",
      items: ["Red Flowers", "Lotus Flowers"],
      offeringItems: [
        { name: "Red Flowers", nameHi: "लाल फूल", price: 101, image: "/red-hibiscus-mala.jpg", description: "Fresh red flowers" },
        { name: "Lotus Basket", nameHi: "कमल टोकरी", price: 101, image: "/red-hibiscus-mala.jpg", description: "Lotus flower basket" },
      ],
    },
    {
      name: "Red Hibiscus Flower Mala – Special",
      nameHi: "लाल गुड़हल फूल माला – विशेष",
      price: 201,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Red Hibiscus garlands are offered to the Goddess symbolizing beauty, devotion, purity, and divine feminine energy.",
      descriptionHi: "लाल गुड़हल माला देवी को सौंदर्य, भक्ति, शुद्धता और दिव्य स्त्री ऊर्जा का प्रतीक के रूप में अर्पित की जाती है।",
      image: "/red-hibiscus-mala.jpg",
      items: ["Red Hibiscus Mala"],
      offeringItems: [
        { name: "Red Hibiscus Mala (Special)", nameHi: "लाल गुड़हल माला (विशेष)", price: 201, image: "/red-hibiscus-mala.jpg", description: "Special Goddess garland" },
      ],
    },
    {
      name: "Peda Prasad & Coconut Offering",
      nameHi: "पेड़ा प्रसाद और नारियल अर्पण",
      price: 151,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Traditional sweets such as peda offered seeking abundance and blessings. Coconut symbolizes surrender of ego and purity of mind and is considered highly auspicious in Devi worship.",
      descriptionHi: "समृद्धि और आशीर्वाद के लिए पेड़ा और नारियल का संयुक्त अर्पण — देवी पूजा में अत्यंत शुभ।",
      image: "/kasbeswari.jpeg",
      items: ["Peda Prasad", "Coconut"],
      offeringItems: [
        { name: "Peda Prasad", nameHi: "पेड़ा प्रसाद", price: 101, image: "/peda-prasad.jpg", description: "Milk sweets" },
        { name: "Coconut", nameHi: "नारियल", price: 51, image: "/coconut.jpg", description: "Fresh coconut" },
      ],
    },
    {
      name: "Saree Offering – Special",
      nameHi: "साड़ी अर्पण – विशेष",
      price: 501,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Red saree offered to Maa Kasbeswari for blessings related to prosperity, marriage, family happiness, and feminine grace.",
      descriptionHi: "लाल साड़ी मां कस्बेश्वरी को समृद्धि, विवाह, पारिवारिक सुख और स्त्री कृपा के लिए विशेष रूप से अर्पित।",
      image: "/kasbeswari.jpeg",
      items: ["Red Saree"],
      offeringItems: [
        { name: "Red Saree (Special)", nameHi: "लाल साड़ी (विशेष)", price: 501, image: "/red-saree.jpg", description: "Saree for deity" },
      ],
    },
    {
      name: "Offer Nine Suhaag Shringar Items",
      nameHi: "नौ सुहाग श्रृंगार सामग्री अर्पण",
      price: 901,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Offering 9 Suhaag Shringar items like alta, bangles, chunari, bindi, sindoor, mehendi, saree, kajal, and maang tika to the Goddess fulfills all the devotees' desires. Shringar Seva symbolizes devotion, beauty, abundance, and divine feminine power.",
      descriptionHi: "देवी को 9 सुहाग श्रृंगार सामग्री अर्पित करने से सभी मनोकामनाएं पूर्ण होती हैं। श्रृंगार सेवा भक्ति, सौंदर्य, समृद्धि और दिव्य स्त्री शक्ति का प्रतीक है।",
      image: "/kasbeswari.jpeg",
      items: ["Alta", "Bangles", "Chunari", "Bindi", "Sindoor", "Mehendi", "Saree", "Kajal", "Maang Tika"],
      offeringItems: [
        { name: "Alta", nameHi: "आलता", price: 51, image: "/sindoor-bowl.jpg", description: "Red alta" },
        { name: "Bangles", nameHi: "चूड़ियाँ", price: 101, image: "/chunari.jpg", description: "Sacred bangles" },
        { name: "Chunari", nameHi: "चुनरी", price: 51, image: "/chunari.jpg", description: "Red chunari" },
        { name: "Bindi", nameHi: "बिंदी", price: 21, image: "/sindoor-bowl.jpg", description: "Forehead bindi" },
        { name: "Sindoor", nameHi: "सिंदूर", price: 51, image: "/sindoor-bowl.jpg", description: "Vermillion" },
        { name: "Mehendi", nameHi: "मेहंदी", price: 51, image: "/kasbeswari.jpg", description: "Sacred mehendi" },
        { name: "Saree", nameHi: "साड़ी", price: 251, image: "/red-saree.jpg", description: "Saree offering" },
        { name: "Kajal", nameHi: "काजल", price: 21, image: "/kasbeswari.jpg", description: "Sacred kajal" },
        { name: "Maang Tika", nameHi: "मांग टीका", price: 101, image: "/kasbeswari.jpg", description: "Maang tika" },
      ],
    },
    {
      name: "Kasbeswari Maa Kali Mangalmay Poojan Bhet",
      nameHi: "कस्बेश्वरी मां काली मंगलमय पूजन भेंट",
      price: 501,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "Offer the Maa Kali Mangalmay Poojan Bhet — a sacred thali with red hibiscus, chunri, fruits, sweets, kumkum, haldi, sindoor, paan, and diya, seeking protection, strength, and fearless divine blessings.",
      descriptionHi: "मां काली मंगलमय पूजन भेंट अर्पित करें — एक पवित्र थाली में लाल गुड़हल, चुनरी, फल, मिठाई, कुमकुम, हल्दी, सिंदूर, पान और दिया — सुरक्षा, शक्ति और निर्भय दिव्य आशीर्वाद के लिए।",
      image: "/kasbeswari.jpg",
      items: ["Red Hibiscus", "Chunri", "Fruits", "Sweets", "Kumkum", "Haldi", "Sindoor", "Paan", "Diya"],
      offeringItems: [
        { name: "Red Hibiscus", nameHi: "लाल गुड़हल", price: 51, image: "/red-hibiscus-mala.jpg", description: "Hibiscus flower" },
        { name: "Chunri", nameHi: "चुनरी", price: 51, image: "/chunari.jpg", description: "Red chunri" },
        { name: "Fruits & Sweets", nameHi: "फल और मिठाई", price: 101, image: "/peda-prasad.jpg", description: "Bhog offering" },
        { name: "Kumkum & Haldi", nameHi: "कुमकुम और हल्दी", price: 51, image: "/sindoor-bowl.jpg", description: "Auspicious items" },
        { name: "Sindoor", nameHi: "सिंदूर", price: 51, image: "/sindoor-bowl.jpg", description: "Sacred vermillion" },
        { name: "Paan & Diya", nameHi: "पान और दिया", price: 51, image: "/kasbeswari.jpg", description: "Sacred paan and lamp" },
      ],
    },
    {
      name: "Sacred Khichudi Prasad Seva",
      nameHi: "पवित्र खिचड़ी प्रसाद सेवा",
      price: 2501,
      deity: "Maa Kali",
      temple: t2._id,
      isSpecial: true,
      description: "In Hindu tradition, Annadanam (food donation) is considered one of the highest forms of charity and spiritual service. Offering or sponsoring Khichudi Prasad at Maa Kasbeswari Temple is believed to bring immense blessings and positive karma. The sacred prasad is distributed among devotees, pilgrims, saints, and visitors after being offered to the Goddess with Vedic rituals and prayers.",
      descriptionHi: "हिंदू परंपरा में अन्नदान को दान और आध्यात्मिक सेवा का सर्वोच्च रूप माना जाता है। मां कस्बेश्वरी मंदिर में खिचड़ी प्रसाद सेवा करना अपार आशीर्वाद और सकारात्मक कर्म लाता है।",
      image: "/kasbeswari.jpg",
      items: ["Khichudi Prasad"],
      offeringItems: [
        { name: "Khichudi Prasad Seva", nameHi: "खिचड़ी प्रसाद सेवा", price: 2501, image: "/coconut-thali.jpg", description: "Annadanam prasad" },
      ],
    },

    // ── Tripuresh Bhairav Temple – Add-on Chadawa (isSpecial: false)
    {
      name: "Rudrabhishek Puja",
      nameHi: "रुद्राभिषेक पूजा",
      price: 151,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "A powerful Shiva ritual performed with Vedic mantra chanting for health, protection, success, and spiritual growth.",
      descriptionHi: "वैदिक मंत्र जाप के साथ स्वास्थ्य, सुरक्षा, सफलता और आध्यात्मिक विकास के लिए एक शक्तिशाली शिव अनुष्ठान।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Rudrabhishek"],
      isActive: true,
    },
    {
      name: "Flower Basket",
      nameHi: "फूल टोकरी",
      price: 51,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Fresh flowers are offered to seek blessings, happiness, and fulfillment of wishes.",
      descriptionHi: "आशीर्वाद, सुख और मनोकामनाओं की पूर्ति के लिए ताजे फूल अर्पित किए जाते हैं।",
      image: "/flower-garland.jpg",
      items: ["Fresh Flowers"],
      isActive: true,
    },
    {
      name: "Red Hibiscus Flower Mala",
      nameHi: "लाल गुड़हल फूल माला",
      price: 201,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Fresh garlands are offered to seek blessings, happiness, and fulfillment of wishes.",
      descriptionHi: "आशीर्वाद, सुख और मनोकामनाओं की पूर्ति के लिए ताजी माला अर्पित की जाती है।",
      image: "/red-hibiscus-mala.jpg",
      items: ["Red Hibiscus Mala"],
      isActive: true,
    },
    {
      name: "Peda Prasad",
      nameHi: "पेड़ा प्रसाद",
      price: 101,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Traditional sweets (Peda) are offered to Baba Bhairav and distributed as blessed prasad.",
      descriptionHi: "पारंपरिक मिठाई (पेड़ा) बाबा भैरव को अर्पित की जाती है और प्रसाद के रूप में वितरित की जाती है।",
      image: "/peda-prasad.jpg",
      items: ["Peda"],
      isActive: true,
    },
    {
      name: "Coconut",
      nameHi: "नारियल",
      price: 51,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Coconut is offered as a sacred symbol of surrender, devotion, and purity.",
      descriptionHi: "नारियल समर्पण, भक्ति और पवित्रता के पवित्र प्रतीक के रूप में अर्पित किया जाता है।",
      image: "/coconut.jpg",
      items: ["Coconut"],
      isActive: true,
    },
    {
      name: "Dakshina to Pandit Ji",
      nameHi: "पंडित जी को दक्षिणा",
      price: 51,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Offer sacred Dakshina to Pandit Ji as a mark of respect and gratitude for performing the puja rituals. Min ₹51 to ₹9999.",
      descriptionHi: "पूजा अनुष्ठान करने वाले पंडित जी को सम्मान और कृतज्ञता के प्रतीक के रूप में पवित्र दक्षिणा अर्पित करें।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Dakshina"],
      isActive: true,
    },
    {
      name: "Divine Aashirbad Box",
      nameHi: "दिव्य आशीर्वाद बॉक्स",
      price: 151,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: false,
      description: "Box includes Peda, Flower, Ashtagandha Chandan, Mauli, Sacred water from Temple — a divine blessing package delivered to your doorstep.",
      descriptionHi: "बॉक्स में पेड़ा, फूल, अष्टगंध चंदन, मौली, मंदिर का पवित्र जल शामिल है — एक दिव्य आशीर्वाद पैकेज।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Peda", "Flower", "Ashtagandha Chandan", "Mauli", "Sacred Temple Water"],
      isActive: true,
    },

    // ── Tripuresh Bhairav Temple – Special Chadawa (isSpecial: true) — 7 individual items
    {
      name: "Tripuresh Bhairav Panch Mahabhent",
      nameHi: "त्रिपुरेश भैरव पंच महाभेंट",
      price: 251,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "Ganga Jal, Bilva Leaves, Marigold Garland, Datura and Coconut — Liberation from all troubles and resolution of hardships.",
      descriptionHi: "गंगा जल, बेलपत्र, गेंदे की माला, धतूरा और नारियल — सभी कष्टों से मुक्ति और कठिनाइयों का समाधान।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Ganga Jal", "Bilva Leaves", "Marigold Garland", "Datura", "Coconut"],
      isActive: true,
    },
    {
      name: "Datura",
      nameHi: "धतूरा",
      price: 75,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "Dhatura is a symbol of ignorance and attachment. By offering Dhatura to Lord Shiva, we pray to renounce these evils and attain knowledge.",
      descriptionHi: "धतूरा अज्ञान और आसक्ति का प्रतीक है। भगवान शिव को धतूरा अर्पित करके हम इन बुराइयों का त्याग करने और ज्ञान प्राप्त करने की प्रार्थना करते हैं।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Datura"],
      isActive: true,
    },
    {
      name: "Ganga Jal, Bilva Leaves and Datura",
      nameHi: "गंगा जल, बेलपत्र और धतूरा",
      price: 121,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "Blessings of purity, Shiva's grace, and the integration of strength.",
      descriptionHi: "पवित्रता का आशीर्वाद, शिव की कृपा और शक्ति का एकीकरण।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Ganga Jal", "Bilva Leaves", "Datura"],
      isActive: true,
    },
    {
      name: "Marigold Flower Garland, Jal and Bilva Leaves",
      nameHi: "गेंदे की माला, जल और बेलपत्र",
      price: 101,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "Blessings of cleanliness, health, and the grace of Lord Shiva. By offering flowers to Lord Shiva, the devotee receives his grace and blessings.",
      descriptionHi: "स्वच्छता, स्वास्थ्य और भगवान शिव की कृपा का आशीर्वाद। भगवान शिव को फूल अर्पित करने से भक्त को उनकी कृपा और आशीर्वाद प्राप्त होता है।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Marigold Garland", "Jal", "Bilva Leaves"],
      isActive: true,
    },
    {
      name: "Panchamrit Abhishek",
      nameHi: "पंचामृत अभिषेक",
      price: 171,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "A sacred mixture of milk, curd, honey, ghee, and sugar is offered during Abhishek rituals for prosperity, harmony, and divine grace.",
      descriptionHi: "समृद्धि, सद्भाव और दिव्य कृपा के लिए अभिषेक अनुष्ठान में दूध, दही, शहद, घी और चीनी का पवित्र मिश्रण अर्पित किया जाता है।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Milk", "Curd", "Honey", "Ghee", "Sugar"],
      isActive: true,
    },
    {
      name: "Bhog & Prasad Offering",
      nameHi: "भोग और प्रसाद अर्पण",
      price: 201,
      deity: "Lord Bhairav",
      temple: t3._id,
      isSpecial: true,
      description: "Traditional sweets, fruits, peda, and sacred bhog are offered to Baba Bhairav and distributed as blessed prasad.",
      descriptionHi: "पारंपरिक मिठाई, फल, पेड़ा और पवित्र भोग बाबा भैरव को अर्पित किया जाता है और प्रसाद के रूप में वितरित किया जाता है।",
      image: "/tripuresh-bhairav.jpeg",
      items: ["Sweets", "Fruits", "Peda", "Sacred Bhog"],
      isActive: true,
    },

  ]);
  console.log("🌸 Created full chadawa offerings (regular + special)");

  // Bookings
  const pujas = await Puja.find().limit(2);
  await Booking.insertMany([
    { user: user1._id, temple: t1._id, service: pujas[0]._id, serviceType: "puja", serviceName: pujas[0].name, serviceNameHi: pujas[0].nameHi, amount: pujas[0].price, devoteeName: "Priya Agarwal", gotra: "Bharadwaj", date: new Date("2026-05-15"), status: "confirmed", paymentStatus: "paid", orderId: "order_001", paymentId: "pay_001" },
    { user: user2._id, temple: t1._id, service: pujas[1]._id, serviceType: "puja", serviceName: pujas[1].name, serviceNameHi: pujas[1].nameHi, amount: pujas[1].price, devoteeName: "Rajesh Mehta", gotra: "Kashyap", date: new Date("2026-05-20"), status: "pending", paymentStatus: "paid", orderId: "order_002", paymentId: "pay_002" },
    { user: user1._id, temple: t2._id, service: pujas[0]._id, serviceType: "puja", serviceName: pujas[0].name, serviceNameHi: pujas[0].nameHi, amount: pujas[0].price, devoteeName: "Priya Agarwal", gotra: "Bharadwaj", date: new Date("2026-06-01"), status: "completed", paymentStatus: "paid", orderId: "order_003", paymentId: "pay_003" },
  ]);
  console.log("📋 Created 3 bookings");

  // Blogs
  await Blog.insertMany([
    {
      title: "The Divine Power of Goddess Tripura Sundari",
      titleHi: "देवी त्रिपुरसुंदरी की दिव्य शक्ति",
      slug: "divine-power-of-tripura-sundari",
      excerpt: "Explore the history and spiritual significance of the Tripura Sundari Shakti Peetha in Udaipur, Tripura.",
      excerptHi: "उदयपुर, त्रिपुरा में त्रिपुर सुंदरी शक्ति पीठ के इतिहास और आध्यात्मिक महत्व का अन्वेषण करें।",
      content: "<p>Tripura Sundari Temple is one of the most revered Shakti shrines in India...</p>",
      contentHi: "<p>त्रिपुर सुंदरी मंदिर भारत में सबसे पूजनीय शक्ति पीठों में से एक है...</p>",
      coverImage: "/tripura-sundari.jpeg",
      author: admin._id,
      category: "devotional",
      status: "published",
      isAdminFeatured: true,
      publishedAt: new Date(),
      tags: ["tripura-sundari", "shakti-peetha", "devi"],
      views: 320,
    },
    {
      title: "Kamlasagar Kasbeswari Kali Temple: A Historical Journey",
      titleHi: "कमलासागर कस्बेश्वरी काली मंदिर: एक ऐतिहासिक यात्रा",
      slug: "kasbeswari-kali-temple-history",
      excerpt: "A look into the 17th-century Kasbeswari Kali temple overlooking the border lake of Kamlasagar.",
      excerptHi: "कमलासागर के सीमावर्ती झील के किनारे स्थित 17वीं सदी के कस्बेश्वरी काली मंदिर पर एक नज़र।",
      content: "<p>Located on a scenic hillock, the Kasbeswari temple has stood for centuries...</p>",
      contentHi: "<p>एक सुरम्य पहाड़ी पर स्थित, कस्बेश्वरी मंदिर सदियों से खड़ा है...</p>",
      coverImage: "/kasbeswari.jpeg",
      author: admin._id,
      temple: t2._id,
      category: "temple-story",
      status: "published",
      isAdminFeatured: true,
      publishedAt: new Date(),
      tags: ["kasbeswari", "tripura", "temple-story"],
      views: 450,
    },
  ]);
  console.log("📝 Created 2 blogs");

  // Ads
  await Ad.insertMany([
    {
      title: "Book Navratri Special Puja",
      imageUrl: "/ad_poojapath_banner.png",
      linkUrl: "/puja?filter=navratri",
      placement: "hero",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      createdBy: admin._id,
    },
    {
      title: "Chadawa Special Offer",
      imageUrl: "/tripura-sundari.jpeg",
      linkUrl: "/chadawa",
      placement: "sidebar",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      createdBy: admin._id,
    },
  ]);
  console.log("📢 Created 2 ads");

  // Reviews
  await Review.insertMany([
    {
      user: user1._id,
      temple: t1._id,
      rating: 5,
      comment: "I booked a Rudrabhishek at Tripura Sundari Temple through ePoojapaath. The pandit performed it beautifully and I received a video within hours. Feeling truly blessed!",
    },
    {
      user: user2._id,
      temple: t2._id,
      rating: 5,
      comment: "Offered Chadawa to Maa Kasbeswari Kali Temple on my mother's birthday. The process was seamless, and the prasad arrived in 3 days. Thank you ePoojapaath!",
    },
    {
      user: user1._id,
      temple: t3._id,
      rating: 5,
      comment: "Highly recommended! Authentic and peaceful experience. The Puja was conducted properly with my name and Gotra.",
    },
  ]);
  console.log("⭐ Created 3 reviews");

  console.log("\n✅ Seed complete!");
  console.log("📧 Admin:   admin@epoojapaath.com / password123");
  console.log("📧 Owner 1: temple1@example.com / password123");
  console.log("📧 User 1:  user1@example.com / password123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
