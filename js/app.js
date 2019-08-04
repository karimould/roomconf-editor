'use strict';

let lastFpCount = 0;
let currentChain = [];
let currentSelectedNode = '';

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  }
}

// create empty nodes array
let nodes = new vis.DataSet([
  // {id: 1, label: 'Node 1', title: 'I have a popup!'},
]);

// create empty edges array
let edges = new vis.DataSet([
  // {id: 2, label: 'Edge 1', from: 1, to: 2},
]);

let data = {
  nodes: nodes,
  edges: edges
}

let locales = {
  en: {
    addNode: 'Add Room',
    addEdge: 'Add Edge',
    editNode: 'Edit Room',
    editEdge: 'Edit Edge',
    addDescription: 'Click in an empty space to place a new room.',
    edgeDescription: 'Click on a room and drag the edge to another room to connect them.'
  }
}

let options = {
  interaction: {
    hover: true
  },
  manipulation: {
    enabled: true,
    initiallyActive: true,
    addNode: function(nodeData, callback) {
      nodeData.label = 'ROOM';
      nodeData.title = 'Double-click to edit';
      callback(nodeData);
    },
    deleteNode: function(nodeData, callback) {
      if (currentSelectedNode!=='ROOM') {
        currentChain.push('r0' + currentSelectedNode);
      } else {
        if (network.getConnectedEdges(nodeId).length > 0) {
          currentChain.push('r0' + currentSelectedNode);
        }
      }
      callback(nodeData);
    },
    addEdge: function(edgeData, callback) {
      if (edgeData.from === edgeData.to) {
        userView.print('<span class="warning">Cannot connect the room to itself.</span>');
      } else {
        edgeData.label = 'EDGE';
        if (edges.get().length === 0 && nodes.get().length === 2) {
          callback(edgeData);
        } else {
          let tos = edges.get().filter(function(e) { return e.from === edgeData.from })
          .map(function(e) { return e.to })
          .map(function(to) { return to === edgeData.to });
          let froms = edges.get().filter(function(e) { return e.to === edgeData.from })
          .map(function(e) { return e.from })
          .map(function(from) { return from === edgeData.to });
          if (tos.includes(true) || froms.includes(true)) {
            userView.print('<span class="warning">Rooms are already connected.</span>');
          } else {
            callback(edgeData);
          }
        }
      }
    },
    editEdge: false
  },
  nodes: {
    shape: 'dot',
    size: 25,
    font: {
      size: 15,
      face: 'Inconsolata, sans-serif'
    },
    borderWidth: 2
  },
  edges: {
    width: 2,
    smooth: false,
    font: {
      size: 15,
      face: 'Inconsolata, sans-serif'
    }
  },
  locale: 'en',
  locales: locales,
  interaction: {
    //dragView: false,
    zoomView: false,
    tooltipDelay: 0
  }
}

// create vis network
let container = document.querySelector('#metiscbr-graphui');
let network = new vis.Network(container, data, options);
network.setOptions({
  physics: {enabled: false}
});

// display the concept attributes dialog
let overlay = document.querySelector('#overlay');
let selectType = document.querySelector('#selectType');
const showOverlay = function(cls1, cls2) {
  overlay.classList.remove(cls1);
  overlay.classList.add(cls2);
  selectType.classList.remove(cls1);
  selectType.classList.add(cls2);
}
const showTypes = function(order, type, concept) {
  if (order === 'show') {
    showOverlay('hide', 'show');
    document.querySelectorAll('.' + type).forEach(function(el) {
      el.classList.remove('hide');
      el.classList.add('show');
      if (el.innerHTML === concept['label']) {
        el.classList.add('type-selected');
      }
    });
    if (type === 'room-type') {
      document.querySelector('#areaInput').value = concept['area'];
      document.querySelector('#windowsInput').checked = concept['windowsExist'];
    }
  } else if (order === 'hide') {
    showOverlay('show', 'hide');
    document.querySelectorAll('.' + type).forEach(function(el) {
      el.classList.remove('show');
      el.classList.add('hide');
    });
  }
}
document.querySelector('#closeTypes').onclick = function() {
  showOverlay('show', 'hide');
}

let roomColors = {
  'ROOM': '#96c2fc',
  'LIVING': '#e9f1b5',
  'SLEEPING': '#cef1b5',
  'WORKING': '#f1e5b5',
  'KITCHEN': '#dbb5f1',
  'CORRIDOR': '#f1b5d5',
  'BATH': '#b5ebf1',
  'TOILET': '#b7b5f1',
  'PARKING': '#b5f1d1',
  'CHILDREN': '#aad2e6',
  'EXTERIOR': '#b5f1d1',
  'STORAGE': '#f1c4b5',
  'BUILDINGSERVICES': '#b5f1d1'
}

let nodeId = '';
let edgeId = '';
document.querySelector('#saveType').onclick = function() {
  let type = document.querySelectorAll('.type-selected')[0].innerHTML;
  if (document.querySelectorAll('.room-type')[0].classList.contains('show')) {
    let a = document.querySelector('#areaInput').value;
    let w = document.querySelector('#windowsInput').checked;
    let currentType = nodes.get(nodeId).label;
    if (currentType==='ROOM') {
      currentChain.push('a0' + type);
    } else {
      currentChain.push('t0' + currentType); // TODO: + ':(' + type + ')');
    }
    currentSelectedNode = type;
    nodes.update({
      id: nodeId,
      label: type,
      color: roomColors[type],
      area: a,
      windowsExist: w,
      title: 'Area: ' + ((a === undefined || a === '') ? 'undefined' : (a + ' m<sup>2</sup>')) + '<br>Windows exist: ' + w
    });
    showTypes('hide', 'room-type');
  } else if (document.querySelectorAll('.edge-type')[0].classList.contains('show')) {
    edges.update({
      id: edgeId,
      label: type
    });
    showTypes('hide', 'edge-type');
  }
}

let types = document.querySelectorAll('.type');
types.forEach(function(t) {
  t.onclick = function() {
    types.forEach(function(tp) {
      tp.classList.remove('type-selected');
    });
    t.classList.add('type-selected');
  }
});
network.on("doubleClick", function(params) {
  let n = params.nodes, e = params.edges;
  if (n.length === 1) {
    nodeId = n[0];
    showTypes('show', 'room-type', nodes.get(nodeId));
  } else if (e.length === 1) {
    edgeId = e[0];
    showTypes('show', 'edge-type', edges.get(edgeId));
  }
});
network.on("selectNode", function (params) {
  nodeId = params.nodes[0];
  currentSelectedNode = nodes.get(nodeId).label;
});
network.on("deselectNode", function (params) {
  currentSelectedNode = '';
  nodeId = '';
});


const renderResponse = function(el, parentEl, msg) {
  document.querySelector(parentEl).innerHTML = '';
  let element = document.createElement(el);
  element.innerHTML = msg;
  document.querySelector(parentEl).appendChild(element);
}

let userView = {
  print: function(msg) {
    if (msg.startsWith('<result>') || msg.startsWith('<?xml')) {
      renderResponse('tbody', '#result', msg);
    } else if (msg.startsWith('<suggestion>')) {
      renderResponse('div', '#suggestions', msg);
    } else if(msg.startsWith('<adaptation>')) {
      renderResponse('div', '#adaptation', msg);
    } else if (msg.startsWith('<span class="connection')) {
      // display the connection message
      document.querySelector('#connMessages p').innerHTML = msg;
    } else {
      // display the system message
      document.querySelector('#systemMessages p').innerHTML = msg;
    }
  }
}

let server = config.server;
if (typeof config.port === 'number') {
  server += ':' + config.port;
}

let req = {
  socket: null,
  connect: function(host) {
    if ('WebSocket'in window) {
      req.socket = new WebSocket(host);
    } else if ('MozWebSocket'in window) {
      req.socket = new MozWebSocket(host);
    } else {
      userView.print('<span class="connection red">'
      + 'Your browser doesn\'t support websocket connections.</span>');
      return;
    }
    req.socket.onopen = function() {
      userView.print('<span class="connection green">'
      + '&#9679;</span> Connected via websocket to <b>' + server + '</b>');
    }
    req.socket.onclose = function() {
      userView.print('<span class="connection red">'
      + '&#9679;</span> Not connected.');
    }
    req.socket.onmessage = function(msg) {
      userView.print(msg.data);
    }
  },
  init: function() {
    if (window.location.protocol === 'http:'
    || window.location.protocol === 'file:') {
      req.connect('ws://' + server + '/request');
    } else {
      req.connect('wss://' + server + '/request');
    }
  }
}

let start = '<?xml version="1.0" encoding="UTF-8"?><searchrequest>'
let head = '<agraphml><graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://graphml.graphdrawing.org/xmlns     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"><graph id="searchGraph1" edgedefault="undirected"><key id="imageUri" for="graph" attr.name="imageUri" attr.type="string"></key><key id="imageMD5" for="graph" attr.name="imageMD5" attr.type="string"></key><key id="validatedManually" for="graph" attr.name="validatedManually" attr.type="boolean"></key><key id="floorLevel" for="graph" attr.name="floorLevel" attr.type="float"></key><key id="buildingId" for="graph" attr.name="buildingId" attr.type="string"></key><key id="ifcUri" for="graph" attr.name="ifcUri" attr.type="string"></key><key id="bimServerPoid" for="graph" attr.name="bimServerPoid" attr.type="long"></key><key id="alignmentNorth" for="graph" attr.name="alignmentNorth" attr.type="float"></key><key id="geoReference" for="graph" attr.name="geoReference" attr.type="string"></key><key id="name" for="node" attr.name="name" attr.type="string"></key><key id="roomType" for="node" attr.name="roomType" attr.type="string"></key><key id="center" for="node" attr.name="center" attr.type="string"></key><key id="corners" for="node" attr.name="corners" attr.type="string"></key><key id="windowExist" for="node" attr.name="windowExist" attr.type="boolean"></key><key id="enclosedRoom" for="node" attr.name="enclosedRoom" attr.type="boolean"></key><key id="area" for="node" attr.name="area" attr.type="float"></key><key id="sourceConnector" for="edge" attr.name="sourceConnector" attr.type="string"></key><key id="targetConnector" for="edge" attr.name="targetConnector" attr.type="string"></key><key id="hinge" for="edge" attr.name="hinge" attr.type="string"></key><key id="edgeType" for="edge" attr.name="edgeType" attr.type="string"></key><data key="imageUri"></data><data key="imageMD5"></data><data key="validatedManually">false</data><data key="floorLevel">0.0</data><data key="buildingId">0</data><data key="ifcUri"></data><data key="bimServerPoid">0</data><data key="alignmentNorth">0.0</data><data key="geoReference">null</data>';
let foot = '</graph></graphml></agraphml>';
let end = '</searchrequest>';

const getNodesAndEdges = function() {
  let queryElements = '';
  nodes.get().forEach(function(node) {
    let roomType = node['label'];
    let area = (node['area'] === undefined || node['area'] === '') ? 0 : node['area'];
    let windowsExist = node['windowsExist'] === undefined ?
      false : node['windowsExist'];
    queryElements += '<node id="' + node['id'] + '">'
      + '<data key="roomType">' + roomType + '</data>'
      + '<data key="area">' + area + '</data>'
      + '<data key="windowExist">' + windowsExist + '</data>'
      + '</node>';
  });
  edges.get().forEach(function(edge) {
    let edgeType = edge['label'];
    queryElements += '<edge id="' + edge['id']
      + '" source="' + edge['from']
      + '" target="' + edge['to'] + '">'
      + '<data key="edgeType">' + edgeType + '</data>'
      + '</edge>';
  });
  return queryElements;
}

const sendQuery = function(ev) {
  if (getNodesAndEdges() != '') {
    let msg2 = start + head + getNodesAndEdges() + foot;
    let sum = 0;
    let filters = document.querySelectorAll('.filterCheckbox');
    let weights = document.querySelectorAll('.weightValue');
    let nul = false;
    let count = 0;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].checked === true) {
        count += 1;
        if (weights[i].value !== '') {
          let wt = parseFloat(weights[i].value);
          sum = sum + wt;
          msg2 = msg2
          + '<fingerprint name="' + filters[i].value
          + '" weight="' + weights[i].value + '"></fingerprint>';
        } else {
          nul = true;
          msg2 = msg2 + '<fingerprint name="' + filters[i].value
          + '" weight="1"></fingerprint>';
        }
      }
    }
    msg2 = msg2 + end;
    if (ev === 'download') {
      document.querySelector('#showAgraphml').value =
      msg2.substring(msg2.indexOf('<graphml'), msg2.lastIndexOf('</graphml') + 10);
    } else if (count < 2) {
      userView.print('<span class="warning">'
        + 'Please select a minimum of 2 Fingerprints.</span>');
    } else {
      lastFpCount = count;
      req.socket.send(msg2);
      setTimeout(getSuggestion(), 300);
    }
  } else {
    userView.print('<span class="warning">Query is empty.</span>');
  }

  //         console.log(sum);
  //         console.log(nul);
  //         if ((nul===false && (sum>=0 || sum===parseFloat(filters.length)))
  //             || (nul===true && sum===0)) {
  //             req.socket.send(msg2);
  //         } else {
  //             userView.print('<span style="color: #c00">'
  //+ 'Sum of the weights should be 1.0.</span>');
  //         }

}

const getSuggestion = function() {
  let roomCount = nodes.get().length;
  if (roomCount < 2) {
    userView.print('<suggestion>At least two rooms should be '
    + 'available to produce a suggestion.</suggestion>');
  } else {
    userView.print('<suggestion></suggestion>'); // Clear suggestion field
    let edgeCount = edges.get().length;
    let actionCount = currentChain.length;
    let nodeIds = nodes.get().map(function(n) { return n.id });
    let roomsAndEdges = [];
    nodeIds.forEach(function(id) {
      let e = network.getConnectedEdges(id)
      .map(function(id) { return edges.get(id).label });
      roomsAndEdges.push(
        nodes.get(id).label + '-' + e.join('/')
      );
    });
    let msg = '<chainMeta>' + currentChain.join(';') + ','
    + roomCount + ',' + edgeCount + ',' + actionCount + ',' + lastFpCount + ','
    + roomsAndEdges.join('_') + '</chainMeta>';
    console.log(msg);
    req.socket.send(msg);
  }
}

const getAdaptation = function() {
  if (getNodesAndEdges() != '') {
    let adaptationMsg = (head + getNodesAndEdges() + foot)
    .replace('<agraphml>', '<adaptation>')
    .replace('</agraphml>', '</adaptation>');
    req.socket.send(adaptationMsg);
  } else {
    userView.print('<span class="warning">Room conf is empty.</span>');
  }
}

let cl = document.querySelector('#showAgraphml').classList;
let cl_ag = document.querySelector('#agraphmlControls').classList;

document.querySelector('#downloadAgraphml').onclick = function() {
  if (cl.contains('hide')) {
    cl.remove('hide');
    cl_ag.remove('hide');
    cl.add('show');
    cl_ag.add('show');
    sendQuery('download');
  } else {
    cl.remove('show');
    cl_ag.remove('show');
    cl.add('hide');
    cl_ag.add('hide');
  }
}

const applyAgraphml = function(agraphml) {
  // first clear existing nodes and edges
  nodes.clear();
  edges.clear();
  // parse AGraphML
  let doc = jQuery.parseXML(agraphml);
  let xml = jQuery(doc);
  let agraphmlNodes = xml.find('node');
  let agraphmlEdges = xml.find('edge');
  let newNodes = new vis.DataSet([]);
  let newEdges = new vis.DataSet([]);
  agraphmlNodes.each(function() {
    let roomId = jQuery(this).attr('id');
    let roomType = '';
    let data = jQuery(this).find('data');
    data.each(function() {
      let key = jQuery(this).attr('key');
      if (key === 'roomType') {
        roomType = (jQuery(this).first().text()).toUpperCase();
      }
    });
    if (roomId !== undefined && roomId !== '' && roomType !== undefined && roomType != '') {
      let newNode = {
        id: roomId,
        label: roomType,
        color: roomColors[roomType]
      }
      nodes.update(newNode)
    }
  });
  agraphmlEdges.each(function() {
    let edgeId = jQuery(this).attr('id');
    let source = jQuery(this).attr('source');
    let target = jQuery(this).attr('target');
    let edgeType = ''
    let data = jQuery(this).find('data');
    data.each(function() {
      let key = jQuery(this).attr('key');
      if (key === 'edgeType') {
        edgeType = (jQuery(this).first().text()).toUpperCase();
      }
    });
    let idAvailable = (edgeId !== undefined && edgeId !== '');
    let sourceAvailable = (source !== undefined && source !== '');
    let targetAvailable = (target !== undefined && target !== '');
    let typeAvailable = (edgeType !== undefined && edgeType !== '');
    if (idAvailable && sourceAvailable && targetAvailable && typeAvailable) {
      let newEdge = {
        id: edgeId,
        from: source,
        to: target,
        label: edgeType
      }
      edges.update(newEdge);
    }
  });
  // update vis network data
  network.setData({nodes: nodes, edges: edges});
}

document.querySelector('#applyAgraphml').onclick = function() {
  let agraphmlText = document.querySelector('#showAgraphml').value;
  applyAgraphml(agraphmlText);
  cl.remove('show');
  cl_ag.remove('show');
  cl.add('hide');
  cl_ag.add('hide');
}

const initApp = function() {
  // read the config
  if (!config.retrieval) {
    document.querySelector('#sendAgraphml').classList.add('hide');
    document.querySelector('#output').classList.add('hide');
  }
  if (!config.suggestion) {
    document.querySelector('#suggestion').classList.add('hide');
  }
  if (!config.adaptation) {
    document.querySelector('#adaptation').classList.add('hide');
  }
  // add click events
  document.querySelector('#send2').onclick = sendQuery;
  document.querySelector('#getSuggestion').onclick = getSuggestion;
  document.querySelector('#getAdaptation').onclick = getAdaptation;
  // Initialize WebSocket
  if (config.retrieval || config.suggestion || config.adaptation) {
    req.init();
  }
}

const ready = function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(initApp);

jQuery(function($) {
  $('#result').on('click', 'button', function() {
    $(this).siblings('p').slideToggle(200);
  });
  $('#result').on('click', 'button.see-more', function() {
    $(this).parent().parent()
      .siblings('.show-justification, .show-contexts, .show-stats')
      .slideToggle(200);
  });
  $('.vis-close').remove();
});
