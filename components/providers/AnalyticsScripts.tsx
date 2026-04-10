import Script from "next/script";

export const AnalyticsScripts = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const enableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true" || process.env.VERCEL === "1";

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      ) : null}
      {enableVercelAnalytics ? (
        <Script
          id="vercel-analytics"
          strategy="afterInteractive"
          src="/_vercel/insights/script.js"
        />
      ) : null}
    </>
  );
};
