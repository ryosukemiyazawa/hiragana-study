import Firework from "./Firework";
import Rainbow from "./Rainbow";
import SmileRain from "./SmileRain";
import StarFlow from "./StarFlow";

const effects = [Firework, Rainbow, SmileRain, StarFlow];

export default function Celebration() {
	const Effect = effects[Math.floor(Math.random() * effects.length)];

	return (
		<>
			<style>{`
        .effect-root{
          position:fixed;
          inset:0;
          pointer-events:none;
          overflow:hidden;
          z-index:9999;
        }

        .message{
          position:absolute;
          left:50%;
          top:28%;
          transform:translateX(-50%);
          font-size:54px;
          font-weight:bold;
          color:#ff4f8b;
          text-shadow:
            0 4px 0 white,
            0 0 16px #fff;
          animation:bounce 1s ease-out;
        }

        @keyframes bounce{
          0%{
            transform:translateX(-50%) scale(.2);
            opacity:0;
          }

          35%{
            transform:translateX(-50%) scale(1.25);
          }

          60%{
            transform:translateX(-50%) scale(.92);
          }

          100%{
            transform:translateX(-50%) scale(1);
            opacity:1;
          }
        }
      `}</style>
			<div className="effect-root">
				<div className="message">🎉 せいかい！ 🎉</div>
				<Effect />;
			</div>
		</>
	);
}
