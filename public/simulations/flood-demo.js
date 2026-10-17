// All inputs and outputs here are fictional, fixed demonstration scenarios.
// This is not a model, a flood forecast, or a source of operational advice.
(() => {
  const scenarios = {
    flood: {
      sites: '2 of 3', pipes: '1 of 1', status: 'Imagined river-rise scenario',
      title: 'An imagined flood reaches nearby infrastructure.',
      story: 'In this made-up scenario, the illustrated flood area overlaps two water facilities and one pipeline segment. This is potential exposure—not proof of flooding, damage or contamination.',
      details: ['Pump A · inside illustrated area', 'Clinic water point · inside illustrated area', 'Pipeline segment · inside illustrated area', 'Pump B · outside illustrated area; status unknown'],
      response: 'A local team could check official warnings and site conditions before choosing a response.',
      actions: ['Contact local authorities and site operators to verify the situation.', 'Prepare a site visit or repairs when safe and appropriate.', 'Plan alternative clean-water supplies if service is disrupted.'],
      exposed: ['pumpA', 'clinic', 'pipe']
    },
    normal: {
      sites: '0 of 3', pipes: '0 of 1', status: 'Imagined lower-river scenario',
      title: 'No sites overlap the imaginary flood area.',
      story: 'This scenario shows no illustrated river-flood area. It does not mean any site is safe or functional: other hazards and local conditions still need to be checked.',
      details: ['Pump A · exposure not shown', 'Clinic water point · exposure not shown', 'Pipeline segment · exposure not shown', 'Pump B · exposure not shown'],
      response: 'Even without an illustrated flood, staff could continue normal local checks.',
      actions: ['Check official local information for other hazards.', 'Keep normal maintenance and site monitoring on schedule.', 'Update site records when new verified information is available.'],
      exposed: []
    }
  };
  let selected = 'flood';
  const byId = id => document.getElementById(id);
  const map = byId('floodMap');
  const results = byId('floodResults');
  const empty = byId('floodEmpty');
  const actionBox = byId('floodActions');
  const planButton = byId('floodPlan');

  function setList(id, items) {
    const list = byId(id);
    list.replaceChildren(...items.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  }

  function reset() {
    results.hidden = true;
    empty.hidden = false;
    actionBox.hidden = true;
    planButton.hidden = false;
    map.classList.remove('scenario-flood', 'scenario-normal');
    map.querySelectorAll('.map-node').forEach(node => node.classList.remove('is-exposed'));
    byId('mapStatus').textContent = 'Waiting for simulation';
  }

  document.querySelectorAll('.scenario-option').forEach(button => {
    button.addEventListener('click', () => {
      selected = button.dataset.scenario;
      document.querySelectorAll('.scenario-option').forEach(option => {
        const active = option === button;
        option.classList.toggle('selected', active);
        option.setAttribute('aria-pressed', String(active));
      });
      reset();
    });
  });
  byId('floodReset')?.addEventListener('click', reset);
  byId('floodRun').addEventListener('click', () => {
    const item = scenarios[selected];
    reset();
    map.classList.add('scenario-' + selected);
    map.querySelectorAll('.map-node').forEach(node => node.classList.toggle('is-exposed', item.exposed.includes(node.dataset.mapNode)));
    byId('mapStatus').textContent = item.status;
    byId('floodSiteCount').textContent = item.sites;
    byId('floodPipeCount').textContent = item.pipes;
    byId('floodStoryTitle').textContent = item.title;
    byId('floodStory').textContent = item.story;
    byId('floodResponseIntro').textContent = item.response;
    setList('floodSiteList', item.details);
    setList('floodActionItems', item.actions);
    empty.hidden = true;
    results.hidden = false;
  });
  planButton.addEventListener('click', () => {
    actionBox.hidden = false;
    planButton.hidden = true;
  });
})();
