import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

// CardDeal component to present a section with a heading, description, and a button to get started
const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Learn Geometry <br className="sm:block hidden" /> Step by Step with AI Guidance
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Understand shapes and spatial concepts through AI-driven detection and audio descriptions. SoundMath guides students interactively, making geometry accessible and engaging for all.
      </p>
      <Button styles="mt-10">
        Get Started
      </Button>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
