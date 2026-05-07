import React from "react";
export default function BankLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
      <div style={{width:size,height:size,background:"linear-gradient(135deg,#1E40AF,#1E3A8A)",borderRadius:Math.round(size*0.25)+"px",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" opacity="0.9"/>
          <path d="M12 2L3 7l9 5 9-5-9-5z" fill="white" opacity="0.3"/>
        </svg>
      </div>
      <span style={{fontSize:size*0.45+"px",fontWeight:700,color:"#0F172A",letterSpacing:"-0.3px"}}>Strangefregetrust</span>
    </div>
  );
}
