"use client";
import Image from "next/image";
import VerticalCutReveal from "./textanimation/text";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <div>
       <h1  onClick={() => window.location.reload()} className="viboscope" >viboscope</h1>
     <VerticalCutReveal
  splitBy="words"
  staggerDuration={0.025}
  staggerFrom="first"
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 21,
  }}
  containerClassName="my-container"
>
  {'👋 Welcome to viboscope'}
</VerticalCutReveal>
<VerticalCutReveal
  splitBy="words"
  staggerDuration={0.025}
  staggerFrom="first"
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 21,
    delay: 0.2,
  }}
  containerClassName="my-container1"
>
  {'No filter. Just vibes.'}
</VerticalCutReveal>
<a href="/Home" >
<motion.div

 initial={{ opacity: 0, transform: "translatex(200px)" }}
  animate={{ opacity: 1,  transform: "translatex(30px)" }}
  transition={{
    duration: 0.8,
    ease: [0.6, 0.05, 0.01, 0.99],
    delay: 0.4,

  }}

   className="arrow-container">
  <Image
    src="https://ik.imagekit.io/dvjwbf9tt/Arrow.png?updatedAt=1750207436213"
    alt="Arrow pointing down"
    width={40}
    height={40}
    className="arrow-image" 

  />
</motion.div>
</a>
 
     
    </div>
  );
}
