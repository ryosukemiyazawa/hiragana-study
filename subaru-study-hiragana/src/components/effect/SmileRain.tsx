export default function SmileRain() {
  return (
    <>
      <style>{`
        .smile-root{
          position:fixed;
          inset:0;
          pointer-events:none;
          overflow:hidden;
          z-index:9999;
        }

        .smile{
          position:absolute;
          top:-60px;
          font-size:48px;
          animation:fall linear forwards;
        }

        @keyframes fall{
          from{
            transform:translateY(0) rotate(0deg);
          }
          to{
            transform:translateY(110vh) rotate(360deg);
            opacity:0;
          }
        }
      `}</style>

      <div className="smile-root">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="smile"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random()}s`,
              animationDelay: `${Math.random() * .5}s`,
            }}
          >
            😊
          </div>
        ))}
      </div>
    </>
  );
}