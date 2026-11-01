export default function StepIndicator() {
  const steps = [
    { num: 1, label: "1. Мастер", status: "done" },
    { num: 2, label: "2. Услуги", status: "done" },
    { num: 3, label: "3. Дата и время", status: "active" },
    { num: 4, label: "4. Контакты", status: "pending" },
    { num: 5, label: "5. Подтверждение", status: "pending" },
  ];

  return (
    <nav className="steps-container" aria-label="Этапы записи">
      <div className="steps-row">
        {steps.map((step) => {
          let classes = "step-tab";
          if (step.status === "done") classes += " done";
          if (step.status === "active") classes += " active";

          return (
            <div key={step.num} className={classes}>
              {step.status === "done" && (
                <svg
                  className="step-check-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2.5 7.5L5.5 10.5L11.5 3.5"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span className="step-text">{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
