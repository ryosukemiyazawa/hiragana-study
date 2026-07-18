export default function StarFlow() {
  return (
    <>
      <style>{`
        .star-root{
          position:fixed;
          inset:0;
          overflow:hidden;
          pointer-events:none;
          z-index:9999;
        }

        .star{
          position:absolute;
          left:-80px;
          font-size:36px;
          animation:fly linear forwards;
        }

        @keyframes fly{
          from{
            transform:
              translate(0,0)
              rotate(0deg)
              scale(.4);
            opacity:0;
          }

          15%{
            opacity:1;
          }

          to{
            transform:
              translate(120vw,80vh)
              rotate(1080deg)
              scale(1.2);
            opacity:0;
          }
        }
      `}</style>

      <div className="star-root">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 70}%`,
              animationDuration: `${1.5 + Math.random()}s`,
              animationDelay: `${Math.random() * .7}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </>
  );
}