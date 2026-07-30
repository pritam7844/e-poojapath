# Walkthrough: Home Page Visual Redesign & Restructuring

We have completely converted the ePoojapaath home page design and layout to match the provided mobile screenshots, updating styles and re-arranging the sections into the requested sequence. All dynamic data bindings to the database (pujas, temples, offerings, reviews, stats) have been preserved without any data loss.

Additionally, we optimized structural gaps, height parameters, and global widgets layout:
- Shrank the desktop Hero height and heading text size.
- Reduced the global `.section-padding` from `py-20` to `py-10 md:py-12`.
- Reduced the `<MandalaDivider />` padding from `py-8` to `py-3` to minimize inter-section gaps.
- Integrated the floating buttons (WhatsApp, AI Chat, and "Book a Puja Now") globally into the public layout, so they display on all public pages.
- Arranged the mobile floating layouts to stack vertically and sit side-by-side:
  - **AI Chat** orange circle button is at the bottom-right corner (`bottom-4 right-4`).
  - **WhatsApp** green circle button sits directly above it (`bottom-20 right-4`).
  - **Book Now** rectangular button sits to the left of the WhatsApp button (`bottom-20 right-[68px]`).
- Implemented **sticky scroll-trigger behavior for the booking page button**: on the Puja detail page, the generic booking button is hidden, and when the user scrolls past the main package "Book Now" form button, a customized sticky "Book Now at ₹Price 🪔" button slides in on the bottom-right of the viewport at `bottom-20 right-[68px]`, aligning perfectly next to the floating WhatsApp icon.
