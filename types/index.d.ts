import { Ajv } from "ajv";

declare namespace ajvMergePatch {}

declare function ajvMergePatch(ajv: Ajv): void;

export = ajvMergePatch;
