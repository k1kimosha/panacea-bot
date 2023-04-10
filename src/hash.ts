import { createHash } from "crypto";

export function hash(line:string) {
    return createHash("sha256").update(line).digest("hex");
}