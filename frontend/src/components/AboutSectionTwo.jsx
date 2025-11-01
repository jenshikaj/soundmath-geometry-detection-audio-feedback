import { homeimage } from "../assets";
import styles, { layout } from "../style";

// AboutSectionTwo component to provide additional information about the app
const AboutSectionTwo = () => (
  <section className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={homeimage} alt="billing" className="w-[100%] h-[100%] relative z-[5]" />

      {/* Gradient overlays for visual effect */}
      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    {/* Text Section */}
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Explore Geometry <br className="sm:block hidden" /> Through Touch and Sound
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        SoundMath uses AI to detect shapes and describe them through audio and haptic feedback, helping visually impaired students understand geometry in a hands-on, intuitive way.
      </p>
    </div>
  </section>
);

export default AboutSectionTwo;
