import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";
import { cookies } from "next/headers";
// import { refresh } from "@/config/refresh-token";
import { redirect } from "next/navigation";

const layout = async ({ children, params: { lang } }: { children: React.ReactNode; params: { lang: any } }) => {
  const trans = await getDictionary(lang);

  const cookieStore = cookies();
  const cookieName = process.env.NEXT_PUBLIC_COOKIES_NAME as string;
  let authToken = cookieStore.get(cookieName)?.value || "";

  const isJwtExpired = (token: string): boolean => {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
      if (!payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (err) {
      return true;
    }
  };

  if (!authToken || isJwtExpired(authToken)) {
    try {
      const newToken = await refreshToken(authToken); // assume refreshToken returns the new token
      if (newToken) {
        cookieStore.set(cookieName, newToken); // Note: `cookies().set` works only in middleware or needs a response object
        authToken = newToken;
      } else {
        redirect(`/${lang}/login`);
      }
    } catch (err) {
      console.error("Token refresh failed", err);
      redirect(`/${lang}/login`);
    }
  }
  return <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>;
};

export default layout;
