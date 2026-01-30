"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

type TriggerErrorResponse = {
  error?: string;
};

export default function HomePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (status === "sending") {
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    const payload = {
      event: "RUN_DISTRIBUTION",
      source: "operator_webapp",
      timestamp: Date.now(),
    };

    try {
      const response = await fetch("/api/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response
          .json()
          .catch(() => ({ error: "Ошибка запроса" }))) as TriggerErrorResponse;
        setStatus("error");
        setErrorMessage(data.error ?? "Ошибка запроса");
        return;
      }

      setStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      setStatus("error");
      setErrorMessage(message);
    }
  };

  const statusText = () => {
    switch (status) {
      case "idle":
        return "idle";
      case "sending":
        return "sending…";
      case "success":
        return "Отправлено";
      case "error":
        return errorMessage ? `Ошибка: ${errorMessage}` : "Ошибка";
      default:
        return "idle";
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f7f7",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 12px 30px rgba(15, 15, 15, 0.12)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 24px", fontSize: "28px" }}>
          Запуск распределения
        </h1>
        <button
          type="button"
          onClick={handleClick}
          disabled={status === "sending"}
          style={{
            width: "100%",
            padding: "18px 24px",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "12px",
            border: "none",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            backgroundColor: status === "sending" ? "#9aa0a6" : "#111827",
            color: "#ffffff",
            transition: "background-color 0.2s ease",
          }}
        >
          Запустить распределение
        </button>
        <p style={{ margin: "20px 0 0", fontSize: "16px" }}>
          {statusText()}
        </p>
      </section>
    </main>
  );
}
