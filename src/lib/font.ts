import { Titillium_Web, Josefin_Sans } from "next/font/google";


export const titilium = Titillium_Web({
  subsets: ["latin-ext"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "900"]
});

export const josefin = Josefin_Sans({
  subsets: ["latin-ext"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700"]
});
