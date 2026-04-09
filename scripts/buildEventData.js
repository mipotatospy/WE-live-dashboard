import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, "../source-data");
const outputDir = path.join(__dirname, "../src/data");
const outputFile = path.join(outputDir, "eventRows.json");

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return 0;

  const text = String(value).trim().replace(",", ".");
  const parsed = Number(text);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeBoolean(value) {
  const v = normalizeString(value).toLowerCase();

  if (["yes", "y", "true", "1"].includes(v)) return true;
  if (["no", "n", "false", "0"].includes(v)) return false;

  return false;
}

function parseDateValue(value) {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;

    const date = new Date(
      parsed.y,
      parsed.m - 1,
      parsed.d,
      parsed.H || 0,
      parsed.M || 0,
      parsed.S || 0
    );

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const text = String(value).trim();

  if (!text) return null;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  const ddmmyyyy = text.match(
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (ddmmyyyy) {
    const [, dd, mm, yyyy, hh = "0", min = "0", ss = "0"] = ddmmyyyy;
    const date = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      Number(ss)
    );

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  return null;
}

function getCell(row, possibleHeaders) {
  for (const header of possibleHeaders) {
    if (Object.prototype.hasOwnProperty.call(row, header)) {
      return row[header];
    }
  }
  return "";
}

function mapRow(row, sourceFileName, sourceSheetName, sourceRowNumber) {
  return {
    sourceFileName,
    sourceSheetName,
    sourceRowNumber,

    firstName: normalizeString(
      getCell(row, ["First Name", "First name", "first name"])
    ),
    lastName: normalizeString(
      getCell(row, ["Last Name", "Last name", "last name"])
    ),
    email: normalizeEmail(
      getCell(row, ["Email", "email", "E-mail", "Mail"])
    ),
    companyName: normalizeString(
      getCell(row, ["Company name", "Company Name", "company name", "Company"])
    ),
    operatesIn: normalizeString(
      getCell(row, ["Operates in", "operates in", "Industry", "industry"])
    ),
    attendeeGroup: normalizeString(
      getCell(row, ["Attendee group", "Attendee Group", "attendee group", "Group"])
    ),
    eventName: normalizeString(
      getCell(row, ["event name", "Event name", "Event Name"])
    ),
    eventDate: parseDateValue(
      getCell(row, ["event date", "Event date", "Event Date"])
    ),
    joinedAt: parseDateValue(
      getCell(row, ["joined at", "Joined at", "Joined At", "Registration date"])
    ),
    numberOfMeetings: normalizeNumber(
      getCell(row, ["number of meetings", "Number of meetings", "Meetings"])
    ),
    meetingsWith: normalizeString(
      getCell(row, ["meetings with", "Meetings with", "Meetings With"])
    ),
    exploringBuying: normalizeBoolean(
      getCell(row, [
        "Exploring getting or buying",
        "exploring getting or buying",
        "Buying",
        "Buyer",
      ])
    ),
    offeringSelling: normalizeBoolean(
      getCell(row, [
        "Offering or selling",
        "offering or selling",
        "Selling",
        "Seller",
      ])
    ),
  };
}

function isMeaningfulRow(mappedRow) {
  return Boolean(
    mappedRow.email ||
      mappedRow.firstName ||
      mappedRow.lastName ||
      mappedRow.companyName ||
      mappedRow.eventName
  );
}

function parseWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    raw: true,
  });

  const sourceFileName = path.basename(filePath);
  const allRows = [];

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: true,
    });

    rows.forEach((row, index) => {
      const mappedRow = mapRow(row, sourceFileName, sheetName, index + 2);

      if (isMeaningfulRow(mappedRow)) {
        allRows.push(mappedRow);
      }
    });
  });

  return allRows;
}

function getSourceFiles(directory) {
  return fs.readdirSync(directory).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".xlsx", ".xls", ".csv"].includes(ext);
  });
}

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const files = getSourceFiles(sourceDir);

  if (!files.length) {
    console.error(`No .xlsx, .xls, or .csv files found in: ${sourceDir}`);
    process.exit(1);
  }

  const combinedRows = files.flatMap((fileName) => {
    const fullPath = path.join(sourceDir, fileName);
    console.log(`Reading ${fileName}...`);
    return parseWorkbook(fullPath);
  });

  ensureDirectoryExists(outputDir);
  fs.writeFileSync(outputFile, JSON.stringify(combinedRows, null, 2), "utf8");

  console.log(
    `Done. Wrote ${combinedRows.length} rows from ${files.length} file(s) to ${outputFile}`
  );
}

main();