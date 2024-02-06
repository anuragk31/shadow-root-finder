(()=>{
    /*global chrome*/

    let shadowRootElements = [];
    const highlightElement = (element)=>{
        let id = shadowRootElements.length;
        let name = element.localName + (element.id && '#' + element.id) + (element.className && '.' + element.className);
        shadowRootElements.push({name, id, element});
        element.dataset.highlightId = id;
        element.style.border = '2px solid green';
    };


    const shadowRootScan = (root)=>{
        const findAllElements = function(nodes) {
            for (let i = 0; i < nodes.length; i++) {
                const el = nodes[i];
                if (el.shadowRoot) {
                    highlightElement(el);
                    findAllElements(el.shadowRoot.querySelectorAll('*'));
                }
            }
        };
        if (root.shadowRoot) {
            highlightElement(root);
            findAllElements(root.shadowRoot.querySelectorAll('*'));
        }
        findAllElements(root.querySelectorAll('*'));
    }

    const runScan = ()=>{
        shadowRootElements = [];
        shadowRootScan(document.body);
        chrome.runtime.sendMessage({ action: 'SHOW_ELEMENTS', elements: shadowRootElements });
    }

    runScan();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'DELETE_ELEMENT') {
            let selectedElement = shadowRootElements.find(element=>element.id === message.elementId);
            selectedElement.element.remove();
            runScan();
        }
    });
})();
