import React from "react";
import { Hero as HeroData } from "@/data/site";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="flex flex-col gap-y-6 text-center justify-center items-center min-h-[calc(100vh-7rem)]">
      <div className="max-w-[90vw] flex flex-col gap-y-6">
        <h1 className="text-foreground text-4xl font-bold uppercase">
          {HeroData.title}
        </h1>
        <h3 className="text-foreground text-sm text-wrap font-normal">
          {HeroData.subHeading}
        </h3>
      </div>
      <Button variant={"default"} className="font-bold">Start Now!!!</Button>
    </div>
  );
};

export default Hero;
