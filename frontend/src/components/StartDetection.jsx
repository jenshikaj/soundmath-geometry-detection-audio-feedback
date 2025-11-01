import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import styles from "../style";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { FaKeyboard } from "react-icons/fa"
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const StartDetection = () => {
    const navigate = useNavigate();
    const hasSpokenShortcuts = useRef(false);
    const location = useLocation();

    const [isDetecting, setIsDetecting] = useState(false);
    const [shapeFeedback, setShapeFeedback] = useState("Press 'Start' to begin the detection.");
    const [shapeDescriptions, setShapeDescriptions] = useState({});
    const [detectedShape, setDetectedShape] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shapeCounters, setShapeCounters] = useState({});
    const [shortcutText, setShortcutText] = useState("");

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectionInterval = useRef(null);
    const speechRef = useRef(null);

    useEffect(() => {
        const user = localStorage.getItem("sessionId");
        if (!user) {
            toast.dismiss(); // Clear previous toasts if any
            toast.info("Please log in to access real time Geometric Object Detection.", {
                theme: "colored",
                toastClassName: "text-left",
            });
            localStorage.setItem("redirectAfterLogin", "/start-detection");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const user = localStorage.getItem("sessionId");
        if (!user) return;

        // Prevent speaking more than once per mount
        if (!hasSpokenShortcuts.current) {
            hasSpokenShortcuts.current = true;

            const text = `
        Welcome to the Geometric Object Detection page.
        Here are the available keyboard shortcuts.
        Press Control and B to start detection.
        Press Control and X to stop detection.
        Press Escape to close the shape description.
        Press Control and M to go to the home page.
        Press Control and L to go to your profile.
        `;
            setShortcutText(text);
            speakText(text);
        }

        // Cleanup on unmount or route change
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [location.pathname]);


    useEffect(() => {
        const descriptions = {
            circle: "A circle is a flat, round shape with no corners or edges. Every point along the edge is the same distance from the center. You can feel a circle by tracing around the rim of a cup or the edge of a round plate. It feels smooth and continuous, with no sharp points or angles — just one soft curve all the way around.",

            cone: "A cone is a solid shape that has a flat, round base and a curved surface that narrows to a single point at the top. It feels like a party hat or a funnel used in the kitchen. If you explore it with your hands, you'll notice the base is a circle and the surface gently slopes inward until it reaches the tip.",

            cube: "A cube is a solid shape with six flat square faces, all the same size. It has 12 straight edges and 8 corners. If you’ve ever held a large dice or a wooden block, you’ve felt a cube. All its sides feel equal, and the corners are sharp and right-angled. Every face feels like a square.",

            cylinder: "A cylinder is a solid shape with two flat circular ends and one curved side. It feels like a can of food or a thick battery. When you run your hand along it, the top and bottom are flat and round, and the side is a smooth curve that goes all the way around. It can roll easily on a flat surface.",

            heart: "A heart shape is flat and symmetrical. The top has two rounded bumps and the bottom ends in a point. It may feel like a valentine card or a raised decoration on a tactile greeting card. If you trace it, you'll feel a rounded shape that dips in the middle at the top and comes together at a sharp tip below.",

            pyramid: "A pyramid has a flat base — usually a square — and four triangular faces that meet at a single point on top. You might feel a pyramid shape in a stacking toy or a tactile model used in school. The sides rise steeply from the base to the peak. It feels wider at the bottom and narrow at the top, with clearly angled faces.",

            rectangle: "A rectangle is a flat shape with four sides. It has two long sides and two short sides, and all corners are right angles. If you’ve held a book, a phone, or a braille display, you’ve felt a rectangle. When traced, opposite sides feel the same length, and the shape feels longer in one direction.",

            sphere: "A sphere is a solid ball-like shape. It has no flat parts, edges, or corners. Every part of its surface is equally curved and smooth. It feels the same no matter how you turn it. You may know it from a stress ball, a toy ball, or a round fruit like an orange. It rolls in every direction.",

            square: "A square is a flat shape with four equal sides and four right-angle corners. It feels just like a smaller version of a tabletop tile or a coaster. When you trace it with your fingers, each side feels exactly the same length, and the corners are evenly spaced and sharp.",

            triangle: "A triangle is a flat shape with three straight sides and three corners. The sides can be equal or different lengths. You might feel a triangle on tactile puzzle pieces or signs used in mobility training. When you trace it, you’ll find three connected edges forming a closed shape with pointed angles at each corner."
        };

        setShapeDescriptions(descriptions);
    }, []);

    useEffect(() => {
        if (isDetecting) {
            startWebcam();
        } else {
            stopWebcam();
            stopDetectionLoop();
        }
    }, [isDetecting]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'b') {
                handleDetection();
            }

            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'm') {
                window.speechSynthesis.cancel();
                navigate('/');
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                window.speechSynthesis.cancel();
                navigate('/profile');
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'x') {
                setIsDetecting(false);
                setShapeFeedback("Detection stopped.");
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                speakText(shortcutText);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, isDetecting]);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
                startDetectionLoop();
            };
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setShapeFeedback("Error accessing webcam.");
        }
    };

    const stopWebcam = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const startDetectionLoop = () => {
        detectionInterval.current = setInterval(() => {
            detectShape();
        }, 1000);
    };

    const stopDetectionLoop = () => {
        clearInterval(detectionInterval.current);
    };

    const detectShape = async () => {
        if (isModalOpen) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");

        try {
            const response = await axios({
                method: "POST",
                url: "https://serverless.roboflow.com/shapes-classification/17",
                params: {
                    api_key: "APdXsCz34zsKdsebkhMl"
                },
                data: imageData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            const predictions = response.data.predictions || [];

            if (predictions.length > 0) {
                const firstShape = predictions[0].class.toLowerCase();
                setShapeFeedback(`Detected: ${predictions.map(p => p.class).join(", ")}`);

                setShapeCounters(prev => {
                    const updated = { ...prev, [firstShape]: (prev[firstShape] || 0) + 1 };

                    if (updated[firstShape] >= 5) {
                        if (shapeDescriptions[firstShape]) {
                            setDetectedShape({ name: firstShape, description: shapeDescriptions[firstShape] });
                            speakText(shapeDescriptions[firstShape]);
                            setIsModalOpen(true);
                            setIsDetecting(false);
                            updated[firstShape] = 0;
                        }
                    }

                    return updated;
                });
            } else {
                setShapeFeedback("No shapes detected.");
            }
        } catch (error) {
            console.error("Detection error:", error);
            setShapeFeedback("Error during detection.");
        }
    };

    const speakText = (text) => {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel(); // Cancel ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.pitch = 1.4;
        utterance.rate = 1;

        const setVoiceAndSpeak = () => {
            const voices = synth.getVoices();
            const femaleVoices = voices.filter(
                (v) =>
                    v.lang === "en-US" &&
                    /female|woman|susan|zoe|emma|jenny|samantha/i.test(v.name)
            );

            if (femaleVoices.length > 0) {
                utterance.voice = femaleVoices[0];
            }

            speechRef.current = utterance;
            synth.speak(utterance);
        };

        // If voices already available, speak immediately
        if (synth.getVoices().length > 0) {
            setVoiceAndSpeak();
        } else {
            // Wait for voices to be loaded
            synth.onvoiceschanged = () => {
                setVoiceAndSpeak();
            };
        }
    };

    const handleDetection = () => {
        if (isDetecting) {
            setIsDetecting(false);
            setShapeFeedback("Press 'Start' to begin the detection.");
        } else {
            setIsDetecting(true);
            setShapeFeedback("Detecting Shapes...");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDetectedShape(null);
        window.speechSynthesis.cancel();
        setIsDetecting(true);
    };

    return (
        <div className="bg-primary w-full overflow-hidden relative">
            {/* NAVBAR */}
            <div className="navbar">
                <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                    <div className={`${styles.boxWidth}`}></div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className={`bg-primary ${styles.flexCenter} min-h-screen`}>
                <div className={`${styles.boxWidth} flex flex-col items-center text-white`}>
                    <h1 className={`${styles.heading2} text-center mb-6`}>
                        Geometric Objects Detection
                    </h1>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-[640px] h-[480px] bg-black rounded-lg shadow-lg my-6"
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <p className={styles.paragraph}>{shapeFeedback}</p>

                    <Button styles="mt-4" onClick={handleDetection}>
                        {isDetecting ? "Stop Detection" : "Start Detection"}
                    </Button>
                </div>
            </div>

            {/* SHORTCUTS PANEL */}
            <div className="fixed top-1/3 right-4 bg-gray-900 bg-opacity-80 text-white p-4 rounded-lg shadow-lg max-w-xs z-50">
                <div className="flex items-center gap-2 mb-2">
                    <FaKeyboard />
                    <span className="font-semibold text-lg">Shortcuts</span>
                </div>
                <ul className="text-sm space-y-1">
                    <li><strong>Ctrl+B</strong> – Start Detection</li>
                    <li><strong>Ctrl+X</strong> – Stop Detection</li>
                    <li><strong>Esc</strong> – Close Shape Description</li>
                    <li><strong>Ctrl+M</strong> – Go to Home</li>
                    <li><strong>Ctrl+L</strong> – Go to Profile</li>
                </ul>
            </div>

            {/* MODAL */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Shape Description"
                style={{
                    content: {
                        background: "#1f1f1f",
                        color: "#fff",
                        padding: "2rem",
                        maxWidth: "500px",
                        maxHeight: "350px",
                        overflowY: "auto",
                        margin: "auto",
                        borderRadius: "1rem",
                        textAlign: "center",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                }}
            >
                <h2 className="text-xl font-bold mb-4 capitalize">{detectedShape?.name}</h2>
                <p className="mb-6">{detectedShape?.description}</p>
                <button
                    onClick={closeModal}
                    className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300 transition"
                >
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default StartDetection;
