export async function getAdAccountInsights(timeRange: string = "this_month") {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID;

  if (!accessToken || !adAccountId) {
    return {
      success: true,
      simulated: true,
      data: {
        spend: 0,
        impressions: 0,
        clicks: 0,
        reach: 0,
        leads: 0,
        cpl: 0,
        ctr: 0,
      },
    };
  }

  try {
    const cleanAdAccountId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
    const url = `https://graph.facebook.com/v19.0/${cleanAdAccountId}/insights?fields=spend,impressions,clicks,actions,reach&date_preset=${timeRange}&access_token=${accessToken}`;

    const res = await fetch(url, { cache: "no-store" });
    const result = await res.json();

    if (result.error) {
      console.warn(`[Meta Graph API Warning]: ${result.error.message}`);
      // Return safe default struct if Meta permissions are limited
      return {
        success: true,
        simulated: true,
        data: {
          spend: 0,
          impressions: 0,
          clicks: 0,
          reach: 0,
          leads: 0,
          cpl: 0,
          ctr: 0,
        },
      };
    }

    const insight = result.data?.[0] || {};
    const spend = parseFloat(insight.spend || "0");
    const impressions = parseInt(insight.impressions || "0", 10);
    const clicks = parseInt(insight.clicks || "0", 10);
    const reach = parseInt(insight.reach || "0", 10);

    let leads = 0;
    if (insight.actions) {
      const leadAction = insight.actions.find(
        (a: any) =>
          a.action_type === "lead" ||
          a.action_type === "onsite_conversion.lead_grouped" ||
          a.action_type === "offsite_conversion.fb_pixel_lead"
      );
      if (leadAction) {
        leads = parseInt(leadAction.value || "0", 10);
      }
    }

    const cpl = leads > 0 ? parseFloat((spend / leads).toFixed(2)) : 0;
    const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;

    return {
      success: true,
      simulated: false,
      data: {
        spend,
        impressions,
        clicks,
        reach,
        leads,
        cpl,
        ctr,
      },
    };
  } catch (error) {
    console.error("[Meta Insights API Error]", error);
    return {
      success: true,
      simulated: true,
      data: {
        spend: 0,
        impressions: 0,
        clicks: 0,
        reach: 0,
        leads: 0,
        cpl: 0,
        ctr: 0,
      },
    };
  }
}
