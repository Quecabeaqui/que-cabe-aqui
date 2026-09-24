import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const catalog = fs.readFileSync(new URL('../src/awinCatalog.ts', import.meta.url), 'utf8');

const checks = [
  ['lavavajillas product', source.includes('Hisense HS622E10X - Lavavajillas 60 cm')],
  ['lavavajillas 45 cm product', source.includes('Beko DIS28023 - Lavavajillas integrado 45 cm')],
  ['lavadora product', source.includes('Bosch WUU28T63ES - Lavadora Serie 6')],
  ['escritorio product', source.includes('Devoko - Escritorio eléctrico 120 x 60 cm')],
  ['mueble TV product', source.includes('VASAGLE LTV027N01 - Mueble TV 140 cm')],
  ['affiliate tag constant', source.includes("const TAG='quecabeaqui-21'")],
  ['amazon fallback carries tag', source.includes("u.searchParams.set('tag',TAG)")],
  ['width safety margin', source.includes('uw=w===null?null:w-m')],
  ['depth safety margin', source.includes('ud=d===null?null:d-m')],
  ['height safety margin', source.includes('uh=h===null?null:h-m')],
  ['width fit check', source.includes('x.width<=uw')],
  ['depth fit check', source.includes('x.depth<=ud')],
  ['height fit check', source.includes('x.height<=uh')],
  ['45 cm query parser', source.includes("cm.match(/(\\d+(?:\\.\\d+)?)\\s*cm/)")],
  ['45 cm dimension queries target width', source.includes("/(lavavajillas|lavadora|secadora|escritorio|mueble)/.test(s)?+cm[1]:null")],
  ['Hisense dimensions', source.includes("Electrodomésticos',59.8,60,84.5")],
  ['Klicelor dimensions', source.includes("Escritorios',160,60,116")],
  ['Klicelor fallback', source.includes('B0FJYM52Y2.01.LZZZZZZZ')],
  ['image fallback handler', source.includes('onerror=')],
  ['Awin catalog imported', source.includes("import { awinProducts } from './awinCatalog'")],
  ['Awin catalog merged', source.includes('products.push(...awinMapped)')],
  ['Awin catalog has verified 3D product', catalog.includes('awin-45568645435')],
  ['Awin catalog has second verified 3D product', catalog.includes('awin-43006988876')],
  ['Awin merchant 24018', catalog.includes('merchantId":24018')],
  ['Awin catalog rejects incomplete-dimension rows', !catalog.includes('awin-45671538855') && !catalog.includes('awin-44852083365') && !catalog.includes('awin-32936051501')]
];

const failures = checks.filter(([, ok]) => !ok);
if (failures.length) {
  console.error('Regression checks failed:');
  for (const [name] of failures) console.error(`- ${name}`);
  process.exit(1);
}

const amazonLinks = [...source.matchAll(/https:\/\/www\.amazon\.es\/[^'"`]+/g)].map(m => m[0]);
const staticAmazonLinks = amazonLinks.filter(url => !url.endsWith('/s'));
const withoutTag = staticAmazonLinks.filter(url => !url.includes('tag=quecabeaqui-21'));
if (withoutTag.length) {
  console.error(`Regression check failed: ${withoutTag.length} Amazon product links without affiliate tag`);
  process.exit(1);
}

const awinLinks = [...catalog.matchAll(/https:\/\/www\.awin1\.com\/pclick\.php\?[^'"\n]+/g)].map(m => m[0]);
if (!awinLinks.length) {
  console.error('Regression check failed: no Awin tracking links found');
  process.exit(1);
}
const invalidAwinLinks = awinLinks.filter(url => !/[?&]p=\d+&a=3098668&m=\d+/.test(url));
if (invalidAwinLinks.length) {
  console.error(`Regression check failed: ${invalidAwinLinks.length} Awin links without publisher 3098668 + product + merchant ids`);
  process.exit(1);
}

const catalogRows = [...catalog.matchAll(/\{"id":"([^"]+)"[^\n]*?"width":([0-9.]+),"depth":([0-9.]+),"height":([0-9.]+),"merchantId":(\d+)/g)];
if (!catalogRows.length) {
  console.error('Regression check failed: no structured Awin dimension rows found');
  process.exit(1);
}
const invalidDimensions = catalogRows.filter(([, , w, d, h]) => ![w, d, h].every(v => Number.isFinite(Number(v)) && Number(v) > 0));
if (invalidDimensions.length) {
  console.error(`Regression check failed: ${invalidDimensions.length} Awin rows have invalid dimensions`);
  process.exit(1);
}

const fits = (product, available, margin) => product <= available - Math.max(0, margin);
const boundaryChecks = [
  ['exact fit with zero margin', fits(60, 60, 0)],
  ['0.1 cm margin rejects exact-width product', !fits(60, 60, 0.1)],
  ['0.1 cm spare room accepts 59.9 cm product', fits(59.9, 60, 0.1)],
  ['oversized product rejected', !fits(60.1, 60, 0)],
  ['margin larger than available rejects product', !fits(1, 60, 60.1)]
];
const failedBoundaries = boundaryChecks.filter(([, ok]) => !ok);
if (failedBoundaries.length) {
  console.error('Regression check failed: dimension boundary cases');
  for (const [name] of failedBoundaries) console.error(`- ${name}`);
  process.exit(1);
}

console.log(`Regression OK: ${checks.length} source checks + ${staticAmazonLinks.length} Amazon links + ${awinLinks.length} Awin links + ${catalogRows.length} Awin dimension rows + ${boundaryChecks.length} boundary cases validated.`);
