import fs from 'fs';
import { buildDir } from "./utils/build";

fs.rmdirSync(buildDir, { recursive: true });
