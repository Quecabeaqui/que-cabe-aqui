import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const catalog = fs.readFileSync(new URL('../src/awinCatalog.ts', import.meta.url), 'utf8');

const checks = [
  ['lavavajillas product', /Hisense HS622E10X - Lavavajillas 60 cm/],
  ['lavavajillas 45 cm product', /Beko DIS28023 - Lavavajillas integrado 45 cm/],
  ['lavadora product', /Bosch WUU28T63ES - Lavadora Serie 6/],
  ['escritorio product', /Devoko - Escritorio eléctrico 120 x 60 cm/],
  ['mueble TV product', /VASAGLE LTV027N01 - Mueble TV 140 cm/],
  ['affiliate tag constant', /const TAG='quecabeaqui-21'/],
  ['amazon fallback carries tag', /u\\.searchParams\\.set\\('tag',TAG\\)/],
  ['width safety margin', /uw=w===null\\?null:w-m/],
  ['depth safety margin', /ud=d===null\\?null:d-m/],
  ['height safety margin', /uh=h===null\\?null:h-m/],
  ['width fit check', /x\\.width<=uw/],
  ['depth fit check', /x\\.depth<=ud/],
  ['height fit check', /x\\.height<=uh/],
  ['Hisense dimensions', /Electrodomésticos',59\\.8,60,84\\.5/],
  ['Klicelor dimensions', /Escritorios',160,60,116/],
  ['Klicelor fallback', /B0FJYM52Y2\\.01\\.LZZZZZZZ/],
  ['image fallback handler', /onerror=/],
  ['Awin catalog imported', /import \\{ awinProducts \\} from '\\.\\/awinCatalog'/],
  ['Awin catalog merged', /products\\.push\\(\\.\\.\\.awinMapped\\)/],
  ['Awin catalog has validated product', /awin-45568645435/],
  ['Awin catalog has La Redoute product', /awin-45671538855/],
  ['Awin merchant 24018', /merchantId:24018/],
  ['Awin merchant 10497', /merchantId:10497/]
];

const failures = checks.filter(([, pattern]) => !pattern.test(source) && !pattern.test(catalog));
if (failures.length) {
  console.error('Regression checks failed:');
  for (const [name] of failures) console.error(`- ${name}`);
  process.exit(1);
}

const affiliateLinks = [...source.matchAll(/https:\\/\\/www\\.amazon\\.es\\/[^'"`]+/g)].map(m => m[0]);
const staticProductLinks = affiliateLinks.filter(url => !url.endsWith('/s'));
const withoutTag = staticProductLinks.filter(url => !url.includes('tag=quecabeaqui-21'));
if (withoutTag.length) {
  console.error(`Regression check failed: ${withoutTag.length} Amazon product links without affiliate tag`);
  process.exit(1);
}

console.log(`Regression OK: ${checks.length} checks + ${staticProductLinks.length} static Amazon product links validated.`);
