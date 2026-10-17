// This is a fictional planning story; it does not run a seismic model.
(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const get = id => document.getElementById(id);
  const map = get('eqMap');
  const countries = get('eqCountries');
  const markers = get('eqMarkers');
  const run = get('eqRun');
  const reset = get('eqReset');
  const results = get('eqResults');
  const pipeScenario = get('pipeScenario');
  const pipeReview = get('pipeReview');
  const examples = {
    earthquake: {
      inspection: 'Imagined follow-up: a plastic pipe joint at C was found damaged after shaking. The cause would need to be checked by an engineer.',
      intro: 'For this fictional joint failure, a specialist could compare how different pipe systems and joints handle ground movement.',
      oneTitle: 'Flexible pipe and joints',
      oneText: 'Investigate a suitably designed fused polyethylene pipe and flexible connections. Check local ground conditions and installation quality.',
      twoTitle: 'Engineered metal pipe system',
      twoText: 'Compare an appropriately designed metal pipe and joints. Consider corrosion, installation, cost and the expected ground movement.'
    },
    tsunami: {
      inspection: 'Separate fictional tsunami example: an inspection found a coastal pipe exposed and a joint damaged after flooding. This tsunami is not part of the earthquake map.',
      intro: 'For this fictional coastal case, a specialist could examine erosion, ground movement, salt exposure and joint damage before comparing designs.',
      oneTitle: 'Protect the route and pipe',
      oneText: 'Assess a safer route, appropriate burial or other protection against erosion, with a pipe and joints suited to local ground conditions.',
      twoTitle: 'Compare pipe systems',
      twoText: 'Compare appropriately engineered pipe and joint systems for movement and salt exposure. Check corrosion, water safety, installation and maintenance.'
    },
    fire: {
      inspection: 'Separate fictional fire example: an exposed plastic pipe was found heat-damaged. This fire is not part of the earthquake map.',
      intro: 'For this fictional fire-damage case, a specialist could consider both material and ways to protect the pipe from heat.',
      oneTitle: 'Consider a metal pipe',
      oneText: 'A suitable metal pipe could be one option to assess; check heat exposure, corrosion, safe drinking-water suitability and cost.',
      twoTitle: 'Protect the pipe or route',
      twoText: 'Assess shielding, burial or a safer route, together with a suitable pipe and joints. Any design depends on local conditions.'
    }
  };
  const point = ([lon, lat]) => [(lon + 180) * 1200 / 360, (90 - lat) * 600 / 180];
  const svg = (name, attrs) => {
    const el = document.createElementNS(ns, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  };
  const pathFor = geometry => {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    return polygons.map(polygon => polygon.map(ring => ring.map((coordinate, i) => {
      const [x, y] = point(coordinate);
      return (i ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
    }).join(' ') + 'Z').join(' ')).join(' ');
  };
  const label = (text, x, y, className) => {
    const item = svg('text', {x, y, class: className});
    item.textContent = text;
    return item;
  };
  function drawWorldMarker() {
    markers.replaceChildren();
    const [x,y] = point([-14.7,14.4]);
    markers.append(svg('circle', {cx:x, cy:y, r:6, class:'eq-world-halo'}), svg('circle', {cx:x, cy:y, r:2.5, class:'eq-world-dot'}));
  }
  function drawScenario() {
    markers.replaceChildren();
    const [x,y] = point([-14.7,14.4]);
    markers.append(svg('circle', {cx:x, cy:y, r:5.8, class:'eq-imaginary-zone'}));
    markers.append(svg('circle', {cx:x, cy:y, r:.65, class:'eq-epicentre'}));
    markers.append(label('IMAGINARY EVENT', x + 1.1, y - 1.1, 'eq-geo-label eq-quake-label'));
    const route = [[-16.0,15.1],[-15.3,14.0],[-14.2,14.2]].map((coord,i) => { const [px,py]=point(coord); return (i?'L':'M')+px+','+py; }).join(' ');
    markers.append(svg('path', {d:route, class:'eq-pipeline'}));
    const locations = [
      {name:'A', coords:[-16.0,15.1], type:'site'},
      {name:'B', coords:[-14.2,14.2], type:'site'},
      {name:'C', coords:[-15.3,14.0], type:'pipe'}
    ];
    locations.forEach(item => {
      const [px,py] = point(item.coords);
      markers.append(svg('circle', {cx:px, cy:py, r:.58, class:'eq-asset ' + item.type}));
      markers.append(label(item.name, px, py+.22, 'eq-asset-label'));
    });
    markers.append(label('SENEGAL', 544.7, 245.4, 'eq-country-label'));
  }
  function updatePipeScenario() {
    const example = examples[pipeScenario.value] || examples.earthquake;
    get('pipeInspection').textContent = example.inspection;
    pipeReview.hidden = true;
  }
  function showPipeReview() {
    const example = examples[pipeScenario.value] || examples.earthquake;
    get('pipeReviewIntro').textContent = example.intro;
    get('pipeOptionOneTitle').textContent = example.oneTitle;
    get('pipeOptionOneText').textContent = example.oneText;
    get('pipeOptionTwoTitle').textContent = example.twoTitle;
    get('pipeOptionTwoText').textContent = example.twoText;
    pipeReview.hidden = false;
  }
  function resetMap() {
    map.setAttribute('viewBox','0 0 1200 600');
    map.classList.remove('is-zoomed');
    get('eqMapHeading').textContent = 'Start with the world.';
    get('eqMapStatus').textContent = 'Real borders · no forecast';
    get('eqOverlayTitle').textContent = 'WORLD VIEW';
    get('eqOverlayText').textContent = 'Senegal is highlighted';
    results.hidden = true;
    reset.hidden = true;
    pipeScenario.value = 'earthquake';
    updatePipeScenario();
    drawWorldMarker();
  }
  run.addEventListener('click', () => {
    map.setAttribute('viewBox','531 234 52 27');
    map.classList.add('is-zoomed');
    get('eqMapHeading').textContent = 'A fictional scenario in Senegal.';
    get('eqMapStatus').textContent = 'Simulation · not an actual event';
    get('eqOverlayTitle').textContent = 'SENEGAL · FICTIONAL EVENT';
    get('eqOverlayText').textContent = 'Not a shaking or damage map';
    drawScenario();
    pipeScenario.value = 'earthquake';
    updatePipeScenario();
    results.hidden = false;
    reset.hidden = false;
  });
  reset.addEventListener('click', resetMap);
  pipeScenario.addEventListener('change', updatePipeScenario);
  get('pipeReviewButton').addEventListener('click', showPipeReview);
  fetch('/simulations/data/natural-earth-countries.geojson').then(response => {
    if (!response.ok) throw new Error('Map data unavailable');
    return response.json();
  }).then(data => {
    const paths = data.features.filter(feature => feature.geometry && ['Polygon','MultiPolygon'].includes(feature.geometry.type)).map(feature => {
      const senegal = feature.properties.ADM0_A3 === 'SEN';
      return svg('path', {d:pathFor(feature.geometry), class:senegal ? 'eq-country is-senegal' : 'eq-country', 'fill-rule':'evenodd'});
    });
    countries.replaceChildren(...paths);
    resetMap();
    run.disabled = false;
    run.textContent = 'Start simulation →';
  }).catch(() => {
    get('eqMapStatus').textContent = 'Map unavailable · please reload';
    run.textContent = 'Map unavailable';
  });
})();
