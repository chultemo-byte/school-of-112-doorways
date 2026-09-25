import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import type { Door, DoorIndex, DoorIndexEntry } from "./types.ts";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

export function repoRoot(): string {
  return ROOT;
}

let validator: ValidateFunction | undefined;

function getValidator(): ValidateFunction {
  if (!validator) {
    const schemaPath = path.join(ROOT, "schemas", "door.schema.json");
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as object;
    const ajv = new Ajv({ allErrors: true, strict: false });
    validator = ajv.compile(schema);
  }
  return validator;
}

export function formatSchemaErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return "Door JSON does not match schemas/door.schema.json.";
  }
  return errors
    .map((error) => {
      const where = error.instancePath === "" ? "(door)" : error.instancePath;
      return where + " " + (error.message ?? "is invalid");
    })
    .join("; ");
}

export function validateDoor(data: unknown): Door {
  const validate = getValidator();
  if (!validate(data)) {
    throw new Error(formatSchemaErrors(validate.errors));
  }
  return data as Door;
}

export function doorFileName(number: number): string {
  return String(number).padStart(3, "0") + ".json";
}

export function loadIndex(): DoorIndex {
  const raw = readFileSync(path.join(ROOT, "doors", "index.json"), "utf8");
  const index = JSON.parse(raw) as DoorIndex;
  if (!Array.isArray(index.doors) || index.doors.length !== 112) {
    throw new Error("doors/index.json must list exactly 112 doors.");
  }
  return index;
}

export function indexEntry(number: number): DoorIndexEntry {
  if (!Number.isInteger(number) || number < 1 || number > 112) {
    throw new Error("Door number must be an integer from 1 to 112.");
  }
  const entry = loadIndex().doors.find((door) => door.number === number);
  if (!entry) {
    throw new Error("Door " + number + " is missing from doors/index.json.");
  }
  return entry;
}

export function loadDoor(number: number): Door {
  const entry = indexEntry(number);
  if (entry.status !== "seeded") {
    throw new Error(
      "Door " +
        number +
        " is unassigned. Seeded doors are 1 (Tadasana), 49 (Bhujangasana), and 112 (Padmasana).",
    );
  }
  const file = path.join(ROOT, "doors", entry.file ?? doorFileName(number));
  const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
  const door = validateDoor(raw);
  if (door.number !== number) {
    throw new Error("Door file " + file + " declares number " + door.number + ", not " + number + ".");
  }
  return door;
}

export function seededDoors(): DoorIndexEntry[] {
  return loadIndex()
    .doors.filter((door) => door.status === "seeded")
    .sort((a, b) => a.number - b.number);
}
