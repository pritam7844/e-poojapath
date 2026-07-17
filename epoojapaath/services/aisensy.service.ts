function formatPhoneNumber(phone: string): string {
  // Strip any non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // If it's 10 digits, prepend "91" (defaulting to India)
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

export async function sendOtp(phone: string, name: string, otp: string) {
  const apiKey = process.env.AISENSY_API_KEY;
  const campaignName = process.env.AISENSY_OTP_CAMPAIGN_NAME;
  const destination = formatPhoneNumber(phone);

  if (!apiKey || !campaignName) {
    console.warn(
      `[AiSensy Simulation] Missing AISENSY_API_KEY or AISENSY_OTP_CAMPAIGN_NAME. OTP for ${name} (${destination}) is: ${otp}`
    );
    return { success: true, simulated: true, otp };
  }

  try {
    // Triggering a redeployment to apply new Aisensy environment variables
    const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        campaignName,
        destination,
        userName: name,
        templateParams: [otp], // {{1}} for OTP
      }),
    });

    const data = await res.json();
    console.log("[AiSensy OTP Response]", data);
    return { success: !!(data.success || data.status === "Submitted" || data.valid), response: data };
  } catch (error) {
    console.error("[AiSensy OTP Error]", error);
    return { success: false, error: error instanceof Error ? error.message : "API Call failed" };
  }
}

export async function sendBookingConfirmation(
  phone: string,
  name: string,
  details: { bookingId: string; templeName: string; serviceName: string; date: string; amount: number }
) {
  const apiKey = process.env.AISENSY_API_KEY;
  const campaignName = process.env.AISENSY_BOOKING_CAMPAIGN_NAME;
  const destination = formatPhoneNumber(phone);

  if (!apiKey || !campaignName) {
    console.warn(
      `[AiSensy Simulation] Missing AISENSY_API_KEY or AISENSY_BOOKING_CAMPAIGN_NAME. Booking Confirmation for ${name} (${destination}):`,
      details
    );
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        campaignName,
        destination,
        userName: name,
        templateParams: [
          name,                  // {{1}} Devotee Name
          details.serviceName,   // {{2}} Service / Puja Name
          details.templeName,    // {{3}} Temple Name
          details.date,          // {{4}} Booking Date
          `₹${details.amount}`,  // {{5}} Amount
        ],
      }),
    });

    const data = await res.json();
    console.log("[AiSensy Booking Response]", data);
    return { success: !!(data.success || data.status === "Submitted" || data.valid), response: data };
  } catch (error) {
    console.error("[AiSensy Booking Error]", error);
    return { success: false, error: error instanceof Error ? error.message : "API Call failed" };
  }
}
