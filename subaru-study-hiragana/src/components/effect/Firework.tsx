import React from 'react';

export default function Firework() {
  const particles = Array.from({ length: 36 });

  return (
    <>
      <style>{`
        .fw-root{
          position:fixed;
          inset:0;
          pointer-events:none;
          overflow:hidden;
          z-index:9999;
        }

        .burst{
          position:absolute;
          left:50%;
          top:45%;
          width:0;
          height:0;
          animation: pop .9s ease-out forwards;
        }

        .particle{
          position:absolute;
          left:0;
          top:0;
          width:12px;
          height:12px;
          margin:-6px;
          border-radius:50%;
          background: hsl(var(--h),95%,65%);
          transform:
            rotate(calc(var(--i) * 10deg))
            translateY(calc(var(--d) * -1px));
          animation: particle .9s ease-out forwards;
          box-shadow:0 0 10px rgba(255,255,255,.8);
        }

        .particle::after{
          content:"";
          position:absolute;
          inset:2px;
          border-radius:50%;
          background:white;
          opacity:.6;
        }

        .star{
          position:absolute;
          font-size:26px;
          animation: star 1.3s ease-out forwards;
          filter:drop-shadow(0 0 6px gold);
        }

        .star:nth-child(2){left:22%;top:25%;}
        .star:nth-child(3){left:74%;top:30%;}
        .star:nth-child(4){left:30%;top:70%;}
        .star:nth-child(5){left:72%;top:68%;}

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

        .confetti{
          position:absolute;
          width:10px;
          height:22px;
          left:calc(var(--x) * 1%);
          top:-30px;
          background:hsl(var(--h),90%,60%);
          border-radius:3px;
          animation:fall 1.8s linear forwards;
          transform:rotate(calc(var(--r) * 1deg));
        }

        @keyframes particle{
          0%{
            opacity:1;
            transform:
              rotate(calc(var(--i) * 10deg))
              translateY(0)
              scale(.2);
          }

          100%{
            opacity:0;
            transform:
              rotate(calc(var(--i) * 10deg))
              translateY(calc(var(--d) * -1px))
              scale(1.2);
          }
        }

        @keyframes pop{
          0%{transform:scale(.2);}
          30%{transform:scale(1.15);}
          100%{transform:scale(1);}
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

        @keyframes star{
          0%{
            transform:scale(0) rotate(0deg);
            opacity:0;
          }

          30%{
            opacity:1;
          }

          100%{
            transform:
              translateY(-30px)
              scale(1.5)
              rotate(180deg);
            opacity:0;
          }
        }

        @keyframes fall{
          to{
            transform:
              translateY(110vh)
              rotate(720deg);
            opacity:0;
          }
        }
      `}</style>

      <div className="fw-root">
        <div className="burst">
          {particles.map((_, i) => (
            <div
              key={i}
              className="particle"
              style={
                {
                  '--i': i,
                  '--d': 70 + (i % 4) * 18,
                  '--h': (i * 37) % 360,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="star">⭐</div>
        <div className="star">✨</div>
        <div className="star">🌟</div>
        <div className="star">💖</div>


        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={
              {
                '--x': Math.random() * 100,
                '--h': Math.random() * 360,
                '--r': Math.random() * 360,
                animationDelay: `${Math.random() * 0.4}s`,
                animationDuration: `${1.4 + Math.random()}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}