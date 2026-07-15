import { Request, Response, NextFunction } from "express";
import { colors } from "../utils/colorUtils.js";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Status code coloring
    let statusColor = colors.green;
    if (statusCode >= 500) {
      statusColor = (t) => colors.bold(colors.red(t));
    } else if (statusCode >= 400) {
      statusColor = (t) => colors.bold(colors.yellow(t));
    } else if (statusCode >= 300) {
      statusColor = (t) => colors.bold(colors.cyan(t));
    } else {
      statusColor = (t) => colors.bold(colors.green(t));
    }

    // HTTP Method coloring
    let methodColor = colors.bold;
    if (method === "GET") {
      methodColor = (t) => colors.bold(colors.green(t));
    } else if (method === "POST") {
      methodColor = (t) => colors.bold(colors.cyan(t));
    } else if (method === "PUT" || method === "PATCH") {
      methodColor = (t) => colors.bold(colors.yellow(t));
    } else if (method === "DELETE") {
      methodColor = (t) => colors.bold(colors.red(t));
    }

    console.log(
      `[API] Balivio ${colors.white("|")} ${methodColor(method)} ${colors.gray(originalUrl)} ${statusColor(statusCode)} ${colors.gray("-")} ${colors.yellow(`${timeInMs} ms`)}`
    );
  });

  next();
};

export default loggerMiddleware;
