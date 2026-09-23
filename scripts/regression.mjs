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
  ['Hisense dimensions', source.includes("Electrodomésticos',59.8,60,84.5")],
  ['Klicelor dimensions', source.includes("Escritorios',160,60,116")],
  ['Klicelor fallback', source.includes('B0FJYM52Y2.01.LZZZZZZZ')],
  ['image fallback handler', source.includes('onerror=')],
  ['Awin catalog imported', source.includes("import { awinProducts } from './awinCatalog'")],
  ['Awin catalog merged', source.includes('products.push(...awinMapped)')],
  ['Awin catalog has validated product', catalog.includes('awin-45568645435')],
  ['Awin catalog has La Redoute product', catalog.includes('awin-45671538855')],
  ['Awin merchant 24018', catalog.includes('merchantId:24018')],
  ['Awin merchant 10497', catalog.includes('merchantId:10497')]
];

const failures = checks.filter(([, ok]) => !ok);
if (failures.length) {
  console.error('Regression checks failed:');
  for (const [name] of failures) console.error(`- ${name}`);
  process.exit(1);
}

const affiliateLinks = [...source.matchAll(/https:\/\/www\.amazon\.es\/[^'"`]+/g)].map(m => m[0]);
const staticProductLinks = affiliateLinks.filter(url => !url.endsWith('/s'));
const withoutTag = staticProductLinks.filter(url => !url.includes('tag=quecabeaqui-21'));
if (withoutTag.length) {
  console.error(`Regression check failed: ${withoutTag.length} Amazon product links without affiliate tag`);
  process.exit(1);
}

console.log(`Regression OK: ${checks.length} checks + ${staticProductLinks.length} static Amazon product links validated.`);
