// components/Section.js
import React from "react";

const Section = ({ title, children, maxWidth = "1400px", style = {} }) => {
  return (
    <section
      style={{
        padding: "30px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth,
        marginBottom: "60px",
        ...style,
      }}
    >
      {title && (
        <h2
          style={{
            marginBottom: "25px",
            color: "#111",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;