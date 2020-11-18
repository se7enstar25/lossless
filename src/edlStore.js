import parse from 'csv-parse';
import stringify from 'csv-stringify';
import i18n from 'i18next';
import fastXmlParser from 'fast-xml-parser';

const fs = window.require('fs-extra');
const { promisify } = window.require('util');

const stringifyAsync = promisify(stringify);
const parseAsync = promisify(parse);

export async function load(path) {
  const str = await fs.readFile(path, 'utf-8');
  const rows = await parseAsync(str, {});
  if (rows.length === 0) throw new Error(i18n.t('No rows found'));
  if (!rows.every(row => row.length === 3)) throw new Error(i18n.t('One or more rows does not have 3 columns'));

  const mapped = rows
    .map(([start, end, name]) => ({
      start: start === '' ? undefined : parseFloat(start, 10),
      end: end === '' ? undefined : parseFloat(end, 10),
      name,
    }));

  if (!mapped.every(({ start, end }) => (
    (start === undefined || !Number.isNaN(start))
    && (end === undefined || !Number.isNaN(end))
  ))) {
    console.log(mapped);
    throw new Error(i18n.t('Invalid start or end value. Must contain a number of seconds'));
  }

  return mapped;
}

// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/FinalCutPro_XML/VersionsoftheInterchangeFormat/VersionsoftheInterchangeFormat.html
export async function loadXmeml(path) {
  const xml = fastXmlParser.parse(await fs.readFile(path, 'utf-8'));
  // TODO maybe support media.audio also?
  return xml.xmeml.project.children.sequence.media.video.track.clipitem.map((item) => ({ start: item.start / item.rate.timebase, end: item.end / item.rate.timebase }));
}

export async function save(path, cutSegments) {
  console.log('Saving', path);
  const rows = cutSegments.map(({ start, end, name }) => [start, end, name]);
  const str = await stringifyAsync(rows);
  await fs.writeFile(path, str);
}
