import { execFile, spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import { promisify } from "node:util";

const port = process.env.PORT || "3001";
const execFileAsync = promisify(execFile);

async function main() {
  const existingServer = await detectExistingServer();

  if (existingServer === "uncringe") {
    console.log(`UncringeAI backend already running on port ${port}. Reusing existing server.`);
    return;
  }

  if (existingServer === "occupied") {
    console.log(
      `Port ${port} is already in use. Skipping backend startup. If API requests fail, stop the other process or change PORT in .env.`
    );
    return;
  }

  await startServer();
}

async function detectExistingServer() {
  const portIsOpen =
    (await detectPortUsageViaLsof(port)) || (await canConnectToPort(Number(port)));

  if (!portIsOpen) {
    return "free";
  }

  try {
    const data = await requestHealthCheck(Number(port));
    return data?.ok ? "uncringe" : "occupied";
  } catch (error) {
    return "occupied";
  }
}

async function detectPortUsageViaLsof(targetPort) {
  try {
    const { stdout } = await execFileAsync("lsof", [
      "-nP",
      `-iTCP:${targetPort}`,
      "-sTCP:LISTEN"
    ]);

    return Boolean(stdout.trim());
  } catch (error) {
    return false;
  }
}

function canConnectToPort(targetPort) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port: targetPort });

    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });

    socket.once("error", () => {
      resolve(false);
    });

    socket.setTimeout(600, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function requestHealthCheck(targetPort) {
  return new Promise((resolve, reject) => {
    const request = http.get(
      {
        host: "127.0.0.1",
        port: targetPort,
        path: "/api/health",
        timeout: 1000
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(new Error(`Unexpected status ${response.statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on("error", reject);
    request.on("timeout", () => {
      request.destroy(new Error("Health check timed out."));
    });
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server/index.js"], {
      stdio: "inherit",
      env: process.env
    });

    const forwardSignal = (signal) => {
      if (!child.killed) {
        child.kill(signal);
      }
    };

    process.on("SIGINT", forwardSignal);
    process.on("SIGTERM", forwardSignal);

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      process.off("SIGINT", forwardSignal);
      process.off("SIGTERM", forwardSignal);

      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      process.exit(code ?? 0);
    });

    resolve();
  });
}

main().catch((error) => {
  console.error("Unable to start backend:", error);
  process.exit(1);
});
