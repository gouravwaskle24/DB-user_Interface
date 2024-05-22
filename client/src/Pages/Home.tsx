import React from "react";
import Navigation from "../components/Navigation";
import { Button } from "components/ui/button";
import { ArrowRight, ArrowRightSquare } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  return (
    <main className="h-full ">
      <Navigation />
      <section className="h-full w-full pt-[200px] relative flex items-center justify-center flex-col gap-10">
        <div
          aria-label="true"
          className="absolute bottom-0 left-0  right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10"
        />
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className=" max-w-7xl text-7xl font-bold text-center sm:text-[100px] ">
            Manage any content. Anywhere
          </h1>
        </div>
        <Link to={"/dashboard"}>
          <Button className="gap-3">
            <span>Get Started</span>
            <ArrowRight size={20} />
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Home;
