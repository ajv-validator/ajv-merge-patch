declare module "ajv-merge-patch" {
	import * as Ajv from "ajv";
	const module: (instance: Ajv.Ajv) => void;
	export = module;
}
