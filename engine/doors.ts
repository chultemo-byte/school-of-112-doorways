import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import type { Door, DoorIndex, DoorIndexEntry, PrototypeDoor, ResearchDoor } from "./types.ts";
import { isResearchDoor } from "./types.ts";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

export function repoRoot(): string {
  return ROOT;
}

let prototypeValidator: ValidateFunction | undefined;
let researchValidator: ValidateFunction | undefined;

function loadSchema(relativePath: string): object {
  const schemaPath = path.join(ROOT, relativePath);
  return JSON.parse(readFileSync(schemaPath, "utf8")) as object;
}

function getPrototypeValidator(): ValidateFunction {
  if (!prototypeValidator) {
    const ajv = new Ajv({ allErrors: true, strict: false });
    prototypeValidator = ajv.compile(loadSchema(path.join("schemas", "door.schema.json")));
  }
  return prototypeValidator;
}

function getResearchValidator(): ValidateFunction {
  if (!researchValidator) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    researchValidator = ajv.compile(loadSchema(path.join("schemas", "research-door.schema.json")));
  }
  return researchValidator;
}

export function formatSchemaErrors(errors: ErrorObject[] | null | undefined, schemaPath: string): string {
  if (!errors || errors.length === 0) {
    return "Door JSON does not match " + schemaPath + ".";
  }
  return errors
    .map((error) => {
      const where = error.instancePath === "" ? "(door)" : error.instancePath;
      return where + " " + (error.message ?? "is invalid");
    })
    .join("; ");
}

function isResearchPayload(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as { id: unknown }).id === "string"
  );
}

export function validateDoor(data: unknown): Door {
  if (isResearchPayload(data)) {
    const validate = getResearchValidator();
    if (!validate(data)) {
      throw new Error(formatSchemaErrors(validate.errors, "schemas/research-door.schema.json"));
    }
    return data as ResearchDoor;
  }
  const validate = getPrototypeValidator();
  if (!validate(data)) {
    throw new Error(formatSchemaErrors(validate.errors, "schemas/door.schema.json"));
  }
  return data as PrototypeDoor;
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
  if (entry.status !== "seeded" && entry.status !== "researched") {
    throw new Error("Door " + number + " is unassigned.");
  }
  const relative = entry.file ?? path.join("doors", doorFileName(number));
  const file = path.join(ROOT, relative);
  const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
  const door = validateDoor(raw);
  const declared = isResearchDoor(door) ? Number(door.id.slice(2)) : door.number;
  if (declared !== number) {
    throw new Error("Door file " + file + " declares " + declared + ", not " + number + ".");
  }
  return door;
}

export function seededDoors(): DoorIndexEntry[] {
  return loadIndex()
    .doors.filter((door) => door.status === "seeded")
    .sort((a, b) => a.number - b.number);
}

/** Prototype seeds and researched doors, in door-number order. */
export function teachableDoors(): DoorIndexEntry[] {
  return loadIndex()
    .doors.filter((door) => door.status === "seeded" || door.status === "researched")
    .sort((a, b) => a.number - b.number);
}
