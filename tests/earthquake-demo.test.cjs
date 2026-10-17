const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Element {
  constructor() {
    this.hidden = false; this.disabled = false; this.textContent = ''; this.value = '3';
    this.attributes = {}; this.children = []; this.events = {}; this.classes = new Set();
    this.classList = { add: v => this.classes.add(v), remove: v => this.classes.delete(v) };
  }
  setAttribute(key,value) { this.attributes[key] = value; }
  addEventListener(name,fn) { this.events[name] = fn; }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; }
  click() { this.events.click(); }
}
const ids = ['eqMap','eqCountries','eqMarkers','eqRun','eqReset','eqResults','pipeScenario',
  'eqMapHeading','eqMapStatus','eqOverlayTitle','eqOverlayText','pipeReview','pipeInspection',
  'pipeReviewButton','pipeReviewIntro','pipeOptionOneTitle','pipeOptionOneText','pipeOptionTwoTitle','pipeOptionTwoText'];
const nodes = Object.fromEntries(ids.map(id => [id,new Element()]));
const document = {getElementById: id => nodes[id], createElementNS: () => new Element()};
const data = JSON.parse(fs.readFileSync('public/simulations/data/natural-earth-countries.geojson','utf8'));
const fetch = async () => ({ok:true,json:async()=>data});
vm.runInNewContext(fs.readFileSync('public/simulations/earthquake-demo.js','utf8'), {document,fetch});
setImmediate(() => {
  assert.equal(nodes.eqCountries.children.length, 177);
  assert.equal(nodes.eqCountries.children.filter(x => x.attributes.class === 'eq-country is-senegal').length, 1);
  assert.equal(nodes.eqRun.disabled, false);
  assert.equal(nodes.eqMap.attributes.viewBox, '0 0 1200 600');
  nodes.eqRun.click();
  assert.equal(nodes.eqMap.attributes.viewBox, '531 234 52 27');
  assert.equal(nodes.eqResults.hidden, false);
  assert.equal(nodes.pipeScenario.value, 'earthquake');
  assert.match(nodes.pipeInspection.textContent, /joint/);
  assert.equal(nodes.pipeReview.hidden, true);
  nodes.pipeReviewButton.click();
  assert.equal(nodes.pipeReview.hidden, false);
  assert.match(nodes.pipeOptionOneTitle.textContent, /Flexible/);
  nodes.pipeScenario.value = 'tsunami'; nodes.pipeScenario.events.change();
  assert.equal(nodes.pipeReview.hidden, true);
  assert.match(nodes.pipeInspection.textContent, /not part of the earthquake/);
  nodes.pipeReviewButton.click();
  assert.match(nodes.pipeOptionOneTitle.textContent, /Protect/);
  nodes.pipeScenario.value = 'fire'; nodes.pipeScenario.events.change();
  assert.equal(nodes.pipeReview.hidden, true);
  assert.match(nodes.pipeInspection.textContent, /not part of the earthquake/);
  nodes.pipeReviewButton.click();
  assert.match(nodes.pipeOptionOneTitle.textContent, /metal/);
  assert.match(nodes.pipeOptionTwoTitle.textContent, /Protect/);
  nodes.eqRun.click();
  assert.equal(nodes.pipeScenario.value, 'earthquake');
  assert.equal(nodes.pipeReview.hidden, true);
  nodes.eqReset.click();
  assert.equal(nodes.eqResults.hidden, true);
  assert.equal(nodes.eqMap.attributes.viewBox, '0 0 1200 600');
  console.log('Earthquake demo: map, fictional inspections, design comparisons and reset passed.');
});
