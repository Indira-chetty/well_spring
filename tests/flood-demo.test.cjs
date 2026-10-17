const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.hidden = false;
    this.textContent = '';
    this.attributes = {};
    this.events = {};
    this.children = [];
    this.classes = new Set();
    this.classList = {
      add: (...values) => values.forEach(value => this.classes.add(value)),
      remove: (...values) => values.forEach(value => this.classes.delete(value)),
      toggle: (value, force) => {
        if (force === undefined) force = !this.classes.has(value);
        if (force) this.classes.add(value); else this.classes.delete(value);
      }
    };
  }
  addEventListener(name, handler) { this.events[name] = handler; }
  click() { this.events.click(); }
  setAttribute(name, value) { this.attributes[name] = value; }
  replaceChildren(...children) { this.children = children; }
  querySelectorAll() { return this.nodes || []; }
}

const names = ['floodMap', 'floodResults', 'floodEmpty', 'floodActions', 'floodPlan',
  'mapStatus', 'floodSiteCount', 'floodPipeCount', 'floodStoryTitle', 'floodStory',
  'floodResponseIntro', 'floodSiteList', 'floodActionItems', 'floodRun', 'floodReset'];
const elements = Object.fromEntries(names.map(name => [name, new Element()]));
const choices = [new Element({ scenario: 'flood' }), new Element({ scenario: 'normal' })];
elements.floodMap.nodes = ['pumpA', 'clinic', 'pipe', 'pumpB'].map(mapNode => new Element({ mapNode }));
const document = {
  getElementById: id => elements[id],
  querySelectorAll: () => choices,
  createElement: () => new Element()
};
vm.runInNewContext(fs.readFileSync('public/simulations/flood-demo.js', 'utf8'), { document });

elements.floodRun.click();
assert.equal(elements.floodResults.hidden, false);
assert.equal(elements.floodEmpty.hidden, true);
assert.equal(elements.floodSiteCount.textContent, '2 of 3');
assert.equal(elements.floodPipeCount.textContent, '1 of 1');
assert.equal(elements.floodMap.nodes.filter(node => node.classes.has('is-exposed')).length, 3);
assert.equal(elements.floodSiteList.children.length, 4);
elements.floodPlan.click();
assert.equal(elements.floodActions.hidden, false);
assert.equal(elements.floodActionItems.children.length, 3);

choices[1].click();
assert.equal(choices[1].attributes['aria-pressed'], 'true');
assert.equal(choices[0].attributes['aria-pressed'], 'false');
assert.equal(elements.floodResults.hidden, true);
assert.equal(elements.floodMap.nodes.filter(node => node.classes.has('is-exposed')).length, 0);
elements.floodRun.click();
assert.equal(elements.floodSiteCount.textContent, '0 of 3');
assert.equal(elements.floodPipeCount.textContent, '0 of 1');
assert.equal(elements.floodActions.hidden, true);
assert.equal(elements.floodPlan.hidden, false);
assert.match(elements.floodStory.textContent, /does not mean any site is safe/);
elements.floodReset.click();
assert.equal(elements.floodResults.hidden,true);
assert.equal(elements.floodEmpty.hidden,false);
assert.equal(elements.mapStatus.textContent,'Waiting for simulation');
console.log('Flood demo: scenario switching, reset, exposure and human-review interactions passed.');
