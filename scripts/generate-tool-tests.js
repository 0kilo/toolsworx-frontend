const fs = require("fs");
const path = require("path");

const root = process.cwd();

function write(filePath, content) {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function unitConversionTest({ file, jsonPath, value, fromUnit, toUnit, expected, tolerance = 0.01 }) {
  return {
    file,
    content: `import { convertUnit } from "../../lib/tools/logic/unit-conversions/converter";
import { loadJson } from "../_helpers/content";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const content = loadJson("${jsonPath}");
  const { result } = convertUnit({
    value: ${value},
    fromUnit: "${fromUnit}",
    toUnit: "${toUnit}",
    units: content.units,
  });
  assertApprox(result, ${expected}, ${tolerance});
}
`,
  };
}

function temperatureTest() {
  return {
    file: "tests/unit-conversions/temperature.test.ts",
    content: `import { convertTemperature } from "../../lib/tools/logic/unit-conversions/temperature";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const { result } = convertTemperature({ value: 0, fromUnit: "celsius", toUnit: "fahrenheit" });
  assertApprox(result, 32, 0.01);
}
`,
  };
}

function currencyTest() {
  return {
    file: "tests/unit-conversions/currency.test.ts",
    content: `import { convertCurrency } from "../../lib/tools/logic/unit-conversions/currency";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const { result } = convertCurrency({
    value: 100,
    fromCurrency: "USD",
    toCurrency: "EUR",
    rates: { EUR: 0.9 },
  });
  assertApprox(result, 90, 0.01);
}
`,
  };
}

function spacetimeTest() {
  return {
    file: "tests/unit-conversions/spacetime.test.ts",
    content: `import { convertSpaceTime } from "../../lib/categories/unit-conversions/logic";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const result = convertSpaceTime(1, "AU", "km");
  assertApprox(result, 149597870.7, 1);
}
`,
  };
}

function calculatorTest({ file, importPath, funcName, input, expects }) {
  return {
    file,
    content: `import { ${funcName} } from "${importPath}";
import { assertApprox, assertEqual, assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = ${funcName}(${input});
${expects}
}
`,
  };
}

function contentTest({ file, jsonPath }) {
  return {
    file,
    content: `import { loadJson, assertToolContent } from "../_helpers/content";

export async function run() {
  const content = loadJson("${jsonPath}");
  assertToolContent(content);
}
`,
  };
}

function apiFileTest({ file, fixture, targetFormat, expectedType }) {
  return {
    file,
    content: `import { runFileConversionTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runFileConversionTest(fixturePath(${fixture}), "${targetFormat}"${expectedType ? `, "${expectedType}"` : ""});
}
`,
  };
}

function apiMediaTest({ file, fixture, targetFormat, expectedType }) {
  return {
    file,
    content: `import { runMediaConversionTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runMediaConversionTest(fixturePath(${fixture}), "${targetFormat}"${expectedType ? `, "${expectedType}"` : ""});
}
`,
  };
}

function apiImageFilterTest({ file, fixture, filterType, expectedType }) {
  return {
    file,
    content: `import { runImageFilterTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runImageFilterTest(fixturePath(${fixture}), "${filterType}", "jpeg"${expectedType ? `, "${expectedType}"` : ""});
}
`,
  };
}

function apiAudioFilterTest({ file, fixture, filterType, expectedType }) {
  return {
    file,
    content: `import { runAudioFilterTest } from "../_helpers/api";
import { fixturePath } from "../_helpers/fixtures";

export async function run() {
  await runAudioFilterTest(fixturePath(${fixture}), "${filterType}", "mp3"${expectedType ? `, "${expectedType}"` : ""});
}
`,
  };
}

const tests = [
  // Unit conversions
  unitConversionTest({
    file: "tests/unit-conversions/length.test.ts",
    jsonPath: "app/unit-conversions/length/length.json",
    value: 1,
    fromUnit: "meter",
    toUnit: "foot",
    expected: 3.28084,
    tolerance: 0.01,
  }),
  unitConversionTest({
    file: "tests/unit-conversions/mass.test.ts",
    jsonPath: "app/unit-conversions/mass/mass.json",
    value: 1,
    fromUnit: "kilogram",
    toUnit: "pound",
    expected: 2.20462,
    tolerance: 0.01,
  }),
  temperatureTest(),
  unitConversionTest({
    file: "tests/unit-conversions/volume.test.ts",
    jsonPath: "app/unit-conversions/volume/volume.json",
    value: 1,
    fromUnit: "liter",
    toUnit: "gallon",
    expected: 0.26417,
    tolerance: 0.01,
  }),
  currencyTest(),
  unitConversionTest({
    file: "tests/unit-conversions/time.test.ts",
    jsonPath: "app/unit-conversions/time/time.json",
    value: 2,
    fromUnit: "hour",
    toUnit: "minute",
    expected: 120,
    tolerance: 0.001,
  }),
  unitConversionTest({
    file: "tests/unit-conversions/speed.test.ts",
    jsonPath: "app/unit-conversions/speed/speed.json",
    value: 60,
    fromUnit: "mph",
    toUnit: "kph",
    expected: 96.5606,
    tolerance: 0.05,
  }),
  unitConversionTest({
    file: "tests/unit-conversions/area.test.ts",
    jsonPath: "app/unit-conversions/area/area.json",
    value: 1,
    fromUnit: "acre",
    toUnit: "sqm",
    expected: 4046.856,
    tolerance: 1,
  }),
  {
    file: "tests/unit-conversions/energy.test.ts",
    content: `import { convertEnergy } from "../../lib/categories/unit-conversions/logic";
import { assertApprox } from "../_helpers/assert";

export async function run() {
  const result = convertEnergy(1, "kWh", "Wh");
  assertApprox(result, 1000, 0.01);
}
`,
  },
  unitConversionTest({
    file: "tests/unit-conversions/pressure.test.ts",
    jsonPath: "app/unit-conversions/pressure/pressure.json",
    value: 1,
    fromUnit: "bar",
    toUnit: "psi",
    expected: 14.5038,
    tolerance: 0.1,
  }),
  unitConversionTest({
    file: "tests/unit-conversions/data.test.ts",
    jsonPath: "app/unit-conversions/data/data.json",
    value: 1,
    fromUnit: "GB",
    toUnit: "MB",
    expected: 1000,
    tolerance: 0.01,
  }),
  spacetimeTest(),

  // Calculators
  contentTest({
    file: "tests/calculators/graphing-calculator.test.ts",
    jsonPath: "app/calculators/graphing/graphing.json",
  }),
  contentTest({
    file: "tests/calculators/scientific-calculator.test.ts",
    jsonPath: "app/calculators/scientific/scientific.json",
  }),
  calculatorTest({
    file: "tests/calculators/bmi.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-bmi",
    funcName: "calculateBMI",
    input: `{ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" }`,
    expects: `  assertApprox(result.bmi, 22.9, 0.2);\n  assertEqual(result.category, "Normal weight");\n  assertTruthy(result.advice);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/loan-mortgage.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-loan",
    funcName: "calculateLoan",
    input: `{ principal: 200000, interestRate: 5, loanTerm: 30 }`,
    expects: `  assertApprox(result.monthlyPayment, 1073.64, 1);\n  assertApprox(result.totalPaid, 386511.57, 100);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/tip.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-tip",
    funcName: "calculateTip",
    input: `{ billAmount: 100, tipPercentage: 20, numberOfPeople: 4 }`,
    expects: `  assertEqual(result.tipAmount, 20);\n  assertEqual(result.perPersonTotal, 30);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/percentage.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-percentage",
    funcName: "calculatePercentage",
    input: `{ value: 200, percentage: 10, total: 500 }`,
    expects: `  assertEqual(result.percentageOf, 20);\n  assertEqual(result.valueAsPercentage, 40);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/date.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-date",
    funcName: "calculateDate",
    input: `{ startDate: "2024-01-01", endDate: "2024-01-31", addDays: 10 }`,
    expects: `  assertEqual(result.daysBetween, 30);\n  assertTruthy(result.newDate);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/calorie.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-calorie",
    funcName: "calculateCalories",
    input: `{ age: 30, gender: "male", weight: 70, height: 175, activity: "moderate" }`,
    expects: `  assertTruthy(result.dailyCalories);\n  assertTruthy(result.weightLoss);\n  assertTruthy(result.weightGain);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/protein.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-protein",
    funcName: "calculateProtein",
    input: `{ weight: 70, activity: "moderate", goal: "maintain" }`,
    expects: `  assertTruthy(result.minProtein);\n  assertTruthy(result.maxProtein);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/pregnancy.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-pregnancy",
    funcName: "calculatePregnancy",
    input: `{ lastPeriod: "2024-01-01" }`,
    expects: `  assertTruthy(result.dueDate);\n  assertTruthy(result.weeksPregnant);\n  assertTruthy(result.trimester);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/paint.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-paint",
    funcName: "calculatePaint",
    input: `{ length: 10, width: 10, height: 8, coats: 2 }`,
    expects: `  assertTruthy(result.totalGallons);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/flooring.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-flooring",
    funcName: "calculateFlooring",
    input: `{ length: 12, width: 10, waste: 10 }`,
    expects: `  assertTruthy(result.roomArea);\n  assertTruthy(result.totalArea);\n`,
  }),
  calculatorTest({
    file: "tests/calculators/concrete.test.ts",
    importPath: "../../lib/tools/logic/calculators/calculator-concrete",
    funcName: "calculateConcrete",
    input: `{ length: 10, width: 10, depth: 4 }`,
    expects: `  assertTruthy(result.cubicYards);\n`,
  }),

  // File converters
  apiFileTest({
    file: "tests/file-converters/document-converter.test.ts",
    fixture: `"tests", "docs", "TEST.pdf"`,
    targetFormat: "docx",
    expectedType: "zip",
  }),
  apiFileTest({
    file: "tests/file-converters/spreadsheet-converter.test.ts",
    fixture: `"tests", "docs", "TEST.xlsx"`,
    targetFormat: "csv",
    expectedType: "csv",
  }),
  {
    file: "tests/file-converters/data-converter.test.ts",
    content: `import { formatJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { formatXML } from "../../lib/tools/logic/dev-tools/tool-xml";
import { csvToJSON } from "../../lib/tools/logic/dev-tools/tool-csv";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const jsonResult = formatJSON({ text: "{\\"a\\":1}" });
  assertTruthy(jsonResult.result);
  const xmlResult = formatXML({ xml: "<root><item>1</item></root>" });
  assertTruthy(xmlResult.formatted);
  const csvResult = csvToJSON({ csv: "a,b\\n1,2" });
  assertTruthy(csvResult.json);
}
`,
  },
  {
    file: "tests/file-converters/base64-converter.test.ts",
    content: `import { encodeBase64, decodeBase64 } from "../../lib/tools/logic/dev-tools/tool-base64";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const encoded = encodeBase64({ text: "hello" });
  const decoded = decodeBase64({ text: encoded.result });
  assertEqual(decoded.result, "hello");
}
`,
  },
  contentTest({
    file: "tests/file-converters/archive-tools.test.ts",
    jsonPath: "app/file-converters/archive/archive.json",
  }),

  // Media converters
  apiMediaTest({
    file: "tests/media-converters/image-converter.test.ts",
    fixture: `"tests", "media", "sample.png"`,
    targetFormat: "webp",
    expectedType: "webp",
  }),
  apiMediaTest({
    file: "tests/media-converters/audio-converter.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    targetFormat: "mp3",
    expectedType: "mp3",
  }),
  apiMediaTest({
    file: "tests/media-converters/video-converter.test.ts",
    fixture: `"tests", "media", "sample.gif"`,
    targetFormat: "mp4",
    expectedType: "mp4",
  }),

  // Developer tools
  {
    file: "tests/developer-tools/json-formatter.test.ts",
    content: `import { formatJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = formatJSON({ text: "{\\"a\\":1}" });
  assertTruthy(result.result.includes("\\n"));
}
`,
  },
  {
    file: "tests/developer-tools/base64-encoder.test.ts",
    content: `import { encodeBase64, decodeBase64 } from "../../lib/tools/logic/dev-tools/tool-base64";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const encoded = encodeBase64({ text: "tools" });
  const decoded = decodeBase64({ text: encoded.result });
  assertEqual(decoded.result, "tools");
}
`,
  },
  {
    file: "tests/developer-tools/url-encoder.test.ts",
    content: `import { encodeURL, decodeURL } from "../../lib/tools/logic/dev-tools/tool-url";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const encoded = encodeURL({ text: "hello world" });
  const decoded = decodeURL({ text: encoded.encoded });
  assertEqual(decoded.decoded, "hello world");
}
`,
  },
  {
    file: "tests/developer-tools/hash-generator.test.ts",
    content: `import { generateHash } from "../../lib/tools/logic/dev-tools/tool-hash";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = await generateHash({ text: "test", algorithm: "md5" });
  assertEqual(result.hash, "098f6bcd4621d373cade4e832627b4f6");
}
`,
  },
  {
    file: "tests/developer-tools/uuid-generator.test.ts",
    content: `import { generateUUIDs } from "../../lib/tools/logic/dev-tools/tool-uuid";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const { uuids } = generateUUIDs({ count: 2 });
  assertTruthy(uuids.length === 2);
  assertTruthy(/^[0-9a-f-]{36}$/.test(uuids[0]));
}
`,
  },
  {
    file: "tests/developer-tools/timestamp-converter.test.ts",
    content: `import { timestampToDate, dateToTimestamp } from "../../lib/tools/logic/dev-tools/tool-timestamp";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const ts = dateToTimestamp({ date: "2024-01-01T00:00:00Z" });
  const date = timestampToDate({ timestamp: ts.timestamp });
  assertEqual(date.date.startsWith("2024-01-01"), true);
}
`,
  },
  {
    file: "tests/developer-tools/regex-tester.test.ts",
    content: `import { testRegex } from "../../lib/tools/logic/dev-tools/tool-regex";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = testRegex({ pattern: "t[a-z]+", flags: "g", testString: "test tool" });
  assertEqual(result.matches.length, 2);
}
`,
  },
  {
    file: "tests/developer-tools/jwt-decoder.test.ts",
    content: `import { decodeJWT } from "../../lib/tools/logic/dev-tools/tool-jwt";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCJ9.sig";
  const decoded = decodeJWT({ token });
  assertEqual(decoded.payload.sub, "123");
}
`,
  },
  {
    file: "tests/developer-tools/xml-formatter.test.ts",
    content: `import { formatXML, minifyXML } from "../../lib/tools/logic/dev-tools/tool-xml";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const formatted = formatXML({ xml: "<root><item>1</item></root>" });
  const minified = minifyXML({ xml: formatted.formatted });
  assertTruthy(formatted.formatted.includes("\\n"));
  assertTruthy(minified.minified.includes("<root>"));
}
`,
  },
  {
    file: "tests/developer-tools/csv-formatter.test.ts",
    content: `import { formatCSV, csvToJSON } from "../../lib/tools/logic/dev-tools/tool-csv";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const formatted = formatCSV({ csv: "a,b\\n1,2" });
  const json = csvToJSON({ csv: "a,b\\n1,2" });
  assertTruthy(formatted.formatted.includes("|"));
  assertTruthy(json.json.includes("\\"a\\""));
}
`,
  },
  {
    file: "tests/developer-tools/text-case-converter.test.ts",
    content: `import { convertTextCase } from "../../lib/tools/logic/dev-tools/tool-text-case";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = convertTextCase({ text: "hello world" });
  assertEqual(result.camelcase, "helloWorld");
}
`,
  },
  {
    file: "tests/developer-tools/email-extractor.test.ts",
    content: `import { extractEmails } from "../../lib/tools/logic/dev-tools/tool-email";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = extractEmails({ text: "Contact a@example.com and b@example.com" });
  assertEqual(result.emails.length, 2);
}
`,
  },
  {
    file: "tests/developer-tools/url-extractor.test.ts",
    content: `import { extractURLs } from "../../lib/tools/logic/dev-tools/tool-url";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = extractURLs({ text: "Visit https://example.com and http://test.com" });
  assertEqual(result.urls.length, 2);
}
`,
  },
  {
    file: "tests/developer-tools/json-minifier.test.ts",
    content: `import { minifyJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = minifyJSON({ text: "{\\n  \\"a\\": 1\\n}" });
  assertEqual(result.result, "{\\"a\\":1}");
}
`,
  },
  {
    file: "tests/developer-tools/json-validator.test.ts",
    content: `import { validateJSON } from "../../lib/tools/logic/dev-tools/tool-json";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = validateJSON({ text: "{\\"a\\":1}" });
  assertEqual(result.isValid, true);
}
`,
  },

  // Filters
  apiImageFilterTest({
    file: "tests/filters/image-effects.test.ts",
    fixture: `"tests", "media", "sample.png"`,
    filterType: "sepia",
    expectedType: "jpeg",
  }),
  {
    file: "tests/filters/text-processor.test.ts",
    content: `import { extractEmails } from "../../lib/tools/logic/dev-tools/tool-email";
import { extractURLs } from "../../lib/tools/logic/dev-tools/tool-url";
import { convertTextCase } from "../../lib/tools/logic/dev-tools/tool-text-case";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const emails = extractEmails({ text: "a@example.com b@example.com" });
  const urls = extractURLs({ text: "https://example.com" });
  const cases = convertTextCase({ text: "hello world" });
  assertEqual(emails.emails.length, 2);
  assertEqual(urls.urls.length, 1);
  assertEqual(cases.uppercase, "HELLO WORLD");
}
`,
  },
  apiAudioFilterTest({
    file: "tests/filters/audio-equalizer.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "equalizer",
    expectedType: "mp3",
  }),
  apiAudioFilterTest({
    file: "tests/filters/audio-reverb.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "reverb",
    expectedType: "mp3",
  }),
  apiAudioFilterTest({
    file: "tests/filters/audio-echo.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "echo",
    expectedType: "mp3",
  }),
  apiAudioFilterTest({
    file: "tests/filters/audio-noise-reduction.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "noise-reduction",
    expectedType: "mp3",
  }),
  apiAudioFilterTest({
    file: "tests/filters/audio-normalize.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "normalize",
    expectedType: "mp3",
  }),
  apiAudioFilterTest({
    file: "tests/filters/audio-bass-boost.test.ts",
    fixture: `"tests", "media", "sample.wav"`,
    filterType: "bass-boost",
    expectedType: "mp3",
  }),

  // Helpful calculators
  {
    file: "tests/helpful-calculators/recipe-scaler.test.ts",
    content: `import { scaleRecipe } from "../../lib/tools/logic/helpful-calculators/helper-recipe";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = scaleRecipe({
    ingredients: [{ id: 1, name: "Flour", amount: "100", unit: "g" }],
    originalServings: 2,
    targetServings: 4,
  });
  assertEqual(result.scaledIngredients[0].amount, "200");
}
`,
  },
  {
    file: "tests/helpful-calculators/secret-santa.test.ts",
    content: `import { generateSecretSanta } from "../../lib/tools/logic/helpful-calculators/helper-secret-santa";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = generateSecretSanta({
    participants: [
      { id: 1, name: "A", email: "a@example.com" },
      { id: 2, name: "B", email: "b@example.com" },
      { id: 3, name: "C", email: "c@example.com" },
    ],
  });
  assertEqual(result.assignments.length, 3);
}
`,
  },
  {
    file: "tests/helpful-calculators/holiday-countdown.test.ts",
    content: `import { calculateTimeRemaining } from "../../lib/tools/logic/helpful-calculators/helper-holiday";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const now = new Date("2024-01-01T00:00:00Z");
  const target = new Date("2024-01-02T00:00:00Z");
  const result = calculateTimeRemaining(target, now);
  assertEqual(result.days, 1);
}
`,
  },
  {
    file: "tests/helpful-calculators/crypto-converter.test.ts",
    content: `import { convertCrypto } from "../../lib/tools/logic/helpful-calculators/helper-crypto";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const result = convertCrypto({ amount: 2, fromCrypto: "BTC", toCurrency: "USD", cryptoPrice: 30000 });
  assertEqual(result.result, 60000);
}
`,
  },
  {
    file: "tests/helpful-calculators/password-generator.test.ts",
    content: `import { generatePassword } from "../../lib/tools/logic/helpful-calculators/helper-password";
import { assertTruthy } from "../_helpers/assert";

export async function run() {
  const result = generatePassword({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true });
  assertTruthy(result.password.length >= 12);
}
`,
  },
  contentTest({
    file: "tests/helpful-calculators/cheatsheet-builder.test.ts",
    jsonPath: "app/helpful-calculators/cheatsheet-builder/cheatsheet-builder.json",
  }),

  // Charts
  {
    file: "tests/charts/area-chart.test.ts",
    content: `import { validateAreaChartData } from "../../lib/tools/logic/charts/chart-area";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateAreaChartData({ title: "Test", data: [{ x: "A", y: 10 }] });
  assertEqual(error, null);
}
`,
  },
  {
    file: "tests/charts/bar-chart.test.ts",
    content: `import { validateBarChartData } from "../../lib/tools/logic/charts/chart-bar";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateBarChartData({ title: "Test", data: [{ label: "A", value: 5 }] });
  assertEqual(error, null);
}
`,
  },
  {
    file: "tests/charts/line-chart.test.ts",
    content: `import { validateLineChartData } from "../../lib/tools/logic/charts/chart-line";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateLineChartData({ title: "Test", data: [{ x: 1, y: 2 }] });
  assertEqual(error, null);
}
`,
  },
  {
    file: "tests/charts/pie-chart.test.ts",
    content: `import { validatePieChartData } from "../../lib/tools/logic/charts/chart-pie";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validatePieChartData({ title: "Test", data: [{ label: "A", value: 50 }] });
  assertEqual(error, null);
}
`,
  },
  {
    file: "tests/charts/scatter-chart.test.ts",
    content: `import { validateScatterChartData } from "../../lib/tools/logic/charts/chart-scatter";
import { assertEqual } from "../_helpers/assert";

export async function run() {
  const error = validateScatterChartData({ title: "Test", data: [{ x: 1, y: 2 }] });
  assertEqual(error, null);
}
`,
  },
  contentTest({
    file: "tests/charts/gantt-chart.test.ts",
    jsonPath: "app/charts/gantt-chart/gantt-chart.json",
  }),
  contentTest({
    file: "tests/charts/sunburst-chart.test.ts",
    jsonPath: "app/charts/sunburst-chart/sunburst-chart.json",
  }),
  contentTest({
    file: "tests/charts/usa-map.test.ts",
    jsonPath: "app/charts/usa-map/usa-map.json",
  }),
];

tests.forEach((test) => write(test.file, test.content));
console.log(`Generated ${tests.length} tool tests.`);
