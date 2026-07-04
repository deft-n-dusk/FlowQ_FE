import { useEffect, useState } from "react";

export default function useWebSocket() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2713");

    ws.onopen = () => {
      console.log("🟢 WebSocket Connected");
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket Disconnected");
    };

    ws.onerror = (err) => {
      console.log("❌ WebSocket Error", err);
    };

    ws.onmessage = (event) => {
      console.log("📩 WS Message:", event.data);

      try {
        const message = JSON.parse(event.data);

        // custom ping/pong logging
        if (message.type === "PING") {
          console.log("🏓 PING");
        }

        if (message.type === "PONG") {
          console.log("🏓 PONG");
        }

        if (message.type === "METRICS_UPDATE") {
          setMetrics(message.data);
        }
      } catch (err) {
        console.log("Invalid WS message", err);
      }
    };

    return () => {
      console.log("Closing websocket...");
      ws.close();
    };
  }, []);

  return metrics;
}