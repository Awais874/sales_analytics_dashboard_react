const Section = ({ title, children, id, maxWidth = "1400px", titleAlign = "left", action }) => {
  return (
    <section
      className="section"
      id={id}
      style={{ maxWidth }}
    >
      {title && (
        <div className="section__header" style={{ justifyContent: titleAlign === "center" ? "center" : "space-between" }}>
          <h2 className="section__title" style={{ textAlign: titleAlign }}>
            {title}
          </h2>
          {action && <div className="section__action">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
