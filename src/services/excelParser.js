import * as XLSX from "xlsx";

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeBoolean(value) {
  const v = normalizeString(value).toLowerCase();

  if (["yes", "y", "true", "1"].includes(v)) return true;
  if (["no", "n", "false", "0"].includes(v)) return false;

  return false;
}

function excelDateToJSDate(value) {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;
    return new Date(
      parsed.y,
      parsed.m - 1,
      parsed.d,
      parsed.H || 0,
      parsed.M || 0,
      parsed.S || 0
    );
  }

  const asDate = new Date(value);
  return Number.isNaN(asDate.getTime()) ? null : asDate;
}

export async function parseExcelFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const allRows = [];

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: true,
    });

    rows.forEach((row, index) => {
      allRows.push({
        sourceFileName: file.name,
        sourceSheetName: sheetName,
        sourceRowNumber: index + 2,

        firstName: normalizeString(row["First Name"]),
        lastName: normalizeString(row["Last Name"]),
        email: normalizeEmail(row["Email"]),
        companyName: normalizeString(row["Company name"]),
        operatesIn: normalizeString(row["Operates in"]),
        attendeeGroup: normalizeString(row["Attendee group"]),
        eventName: normalizeString(row["event name"]),
        eventDate: excelDateToJSDate(row["event date"]),
        joinedAt: excelDateToJSDate(row["joined at"]),
        numberOfMeetings: normalizeNumber(row["number of meetings"]),
        meetingsWith: normalizeString(row["meetings with"]),
        exploringBuying: normalizeBoolean(row["Exploring getting or buying"]),
        offeringSelling: normalizeBoolean(row["Offering or selling"]),
      });
    });
  });

  return allRows;
}

export async function parseMultipleExcelFiles(files) {
  const parsed = await Promise.all(Array.from(files).map(parseExcelFile));
  return parsed.flat();
}