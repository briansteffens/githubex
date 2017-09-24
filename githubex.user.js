// ==UserScript==
// @name         GitHubEx
// @namespace    https://github.com/briansteffens/githubex
// @version      1.0
// @description  Add some convenience tools to GitHub
// @author       Brian Steffens
// @copyright    2017+, Brian Steffens
// @license      Mozilla Public License Version 2.0
// @homepage     https://github.com/briansteffens/githubex
// @supportURL   https://github.com/briansteffens/githubex/issues
// @icon         https://assets-cdn.github.com/favicon.ico
// @include      https://github.com/*
// ==/UserScript==

(function() {
  const update = () => {
    const path = window.location.pathname.split('/');

    if (path.length > 0 && path[0] !== '') {
      console.log('Invalid path');
      return;
    }
    path.splice(0, 1);

    if (path.length == 0) {
      console.log('At the root of github.com, nothing to do');
      return;
    }
    const user = path[0];
    path.splice(0, 1);

    if (path.length == 0) {
      console.log('On a user\'s profile, nothing to do');
      return;
    }
    const repo = path[0];
    path.splice(0, 1);

    let branch = 'master';
    let urlType = 'tree';
    if (path.length >= 2 && (path[0] === 'tree' || path[0] === 'blob')) {
      if (path[0] === 'blob') {
        urlType = 'blob';
      }

      branch = path[1];
      path.splice(0, 2);
    }

    let file = null;
    if (urlType === 'blob' && path.length > 0) {
      file = path[path.length - 1];
      path.splice(path.length - 1, 1);
    }

    const repoUrl = `https://github.com/${user}/${repo}`;
    const branchUrl = `${repoUrl}/tree/${branch}`;

    let fileUrl = null;
    if (file !== null) {
      fileUrl = `${repoUrl}/blob/${branch}`;

      for (const p of path) {
        fileUrl = `${fileUrl}/${p}`;
      }

      fileUrl = `${fileUrl}/${file}`;
    }

    const previousUi = document.getElementById('githubex');
    if (previousUi !== null) {
      previousUi.remove();
    }

    const ui = document.createElement('div');
    ui.id = 'githubex';
    ui.style.position = 'fixed';
    ui.style.bottom = '-10px';
    ui.style.left = '50%';
    ui.style.transform = 'translateX(-50%)';
    const uiBorder = 'solid 1px rgba(27,31,35,0.2)';
    ui.style.borderTop = uiBorder;
    ui.style.borderLeft = uiBorder;
    ui.style.borderRight = uiBorder;
    ui.style.borderRadius = '3px';
    ui.style.backgroundColor = '#eff3f6';
    ui.style.paddingLeft = '11px';
    ui.style.paddingRight = '11px';
    ui.style.paddingTop = '5px';
    ui.style.paddingBottom = '15px';
    ui.style.fontSize = '14px';

    // Link: repository root
    const repoLink = document.createElement('a');
    repoLink.appendChild(document.createTextNode(repo));
    repoLink.href = repoUrl;
    repoLink.style.fontWeight = 'bold';
    ui.appendChild(repoLink);

    const addSlash = () => {
      const n = document.createElement('span');
      n.appendChild(document.createTextNode('/'));
      n.style.marginLeft = '5px';
      n.style.marginRight = '5px';
      ui.appendChild(n);
    };

    // Link: branch
    ui.appendChild(document.createTextNode(' ('));
    const branchLink = document.createElement('a');
    branchLink.appendChild(document.createTextNode(branch));
    branchLink.href = branchUrl;
    branchLink.style.fontStyle = 'italic';
    ui.appendChild(branchLink);
    ui.appendChild(document.createTextNode(')'));

    // Links: path
    let pathUrl = branchUrl;
    for (let i = 0; i < path.length; i++) {
      const p = path[i];

      pathUrl = `${pathUrl}/${p}`;

      addSlash();

      const pathLink = document.createElement('a');
      pathLink.appendChild(document.createTextNode(p));
      pathLink.href = pathUrl;

      if (file === null && i === path.length - 1) {
        pathLink.style.color = '#000';
        pathLink.style.fontWeight = 'bold';
      }

      ui.appendChild(pathLink);
    }

    // Link: file
    if (file !== null) {
      addSlash();

      const fileLink = document.createElement('a');
      fileLink.appendChild(document.createTextNode(file));
      fileLink.href = fileUrl;
      fileLink.style.color = '#000';
      fileLink.style.fontWeight = 'bold';
      ui.appendChild(fileLink);
    }

    document.querySelector('body').appendChild(ui);
  };

  update();

  // Poll for changes to the URL.
  let lastUrl = window.location.href;
  setInterval(function() {
    if (lastUrl === window.location.href) {
      return;
    }

    lastUrl = window.location.href;
    update();
  }, 50);
})();
