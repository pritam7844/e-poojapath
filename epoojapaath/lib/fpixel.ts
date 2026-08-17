declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

export const viewContent = (options: { content_name?: string; content_category?: string; value?: number; currency?: string }) => {
  event("ViewContent", {
    content_name: options.content_name || "Puja Service",
    content_category: options.content_category || "Devotional Offering",
    value: options.value || 0,
    currency: options.currency || "INR",
  });
};

export const initiateCheckout = (options: { content_name?: string; value?: number; currency?: string; num_items?: number }) => {
  event("InitiateCheckout", {
    content_name: options.content_name || "Puja Booking",
    value: options.value || 0,
    currency: options.currency || "INR",
    num_items: options.num_items || 1,
  });
};

export const addPaymentInfo = (options: { content_name?: string; value?: number; currency?: string }) => {
  event("AddPaymentInfo", {
    content_name: options.content_name || "Sankalp Details",
    value: options.value || 0,
    currency: options.currency || "INR",
  });
};

export const lead = (options: { content_name?: string; value?: number; currency?: string }) => {
  event("Lead", {
    content_name: options.content_name || "Devotee Registration",
    value: options.value || 0,
    currency: options.currency || "INR",
  });
};

export const purchase = (options: { content_name?: string; value?: number; currency?: string; order_id?: string }) => {
  event("Purchase", {
    content_name: options.content_name || "Puja Booking Confirmed",
    value: options.value || 0,
    currency: options.currency || "INR",
    order_id: options.order_id || "",
  });
};

