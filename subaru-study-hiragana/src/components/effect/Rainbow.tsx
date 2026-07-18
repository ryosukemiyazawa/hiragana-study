export default function Rainbow() {
  return (
    <>
      <style>{`
        .rainbow-root{
          position:fixed;
          inset:0;
          pointer-events:none;
          z-index:9999;
        }

        .rainbow{
          position:absolute;
          left:50%;
          bottom:-50px;
          width:520px;
          height:260px;
          transform:translateX(-50%);
          animation:rainbowPop 1s ease-out forwards;
        }

        .arc{
          position:absolute;
          inset:0;
          border-radius:260px 260px 0 0;
          border:18px solid transparent;
        }

        .r1{border-color:#ff4b4b transparent transparent transparent;}
        .r2{inset:18px;border-color:#ff9800 transparent transparent transparent;}
        .r3{inset:36px;border-color:#ffd400 transparent transparent transparent;}
        .r4{inset:54px;border-color:#55dd55 transparent transparent transparent;}
        .r5{inset:72px;border-color:#4ec5ff transparent transparent transparent;}
        .r6{inset:90px;border-color:#4d74ff transparent transparent transparent;}
        .r7{inset:108px;border-color:#b050ff transparent transparent transparent;}

        @keyframes rainbowPop{
          0%{
            transform:translateX(-50%) translateY(120px) scale(.2);
            opacity:0;
          }
          70%{
            transform:translateX(-50%) scale(1.08);
            opacity:1;
          }
          100%{
            transform:translateX(-50%) scale(1);
          }
        }
      `}</style>

      <div className="rainbow-root">
        <div className="rainbow">
          <div className="arc r1"/>
          <div className="arc r2"/>
          <div className="arc r3"/>
          <div className="arc r4"/>
          <div className="arc r5"/>
          <div className="arc r6"/>
          <div className="arc r7"/>
        </div>
      </div>
    </>
  );
}