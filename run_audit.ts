import { runDatabaseAudit } from './src/utils/validation.ts';
const report = runDatabaseAudit();
console.log(report.missingCoordsCount);
console.log(report.faultyItems.length);
