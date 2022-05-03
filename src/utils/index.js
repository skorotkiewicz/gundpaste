import { Buffer } from "buffer";

export const B64ToText = (b64) => {
  const buff = Buffer.from(b64, "base64");
  return buff.toString("utf8");
};

export const TextToB64 = (text) => {
  const buff = Buffer.from(text, "utf8");
  return buff.toString("base64");
};
