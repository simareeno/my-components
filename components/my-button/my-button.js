var template = document.currentScript.ownerDocument.querySelector('#my-button');

class myButton extends HTMLElement {
	constructor() {
		super();

		var root = this.attachShadow({mode: 'closed'});
		var templateContent = document.importNode(template.content, true);
		var button = templateContent.querySelector(".my-button");

		var value = this.getAttribute('value');
		var color = this.getAttribute('color');
		var size = this.getAttribute('value');

		if  (color) {
			button.className += ' my-button--color-' + color;
		} else {
			button.className += ' my-button--color-white';
		}

		if  (size) {
			button.className += ' my-button--size-' + size;
		} else {
			button.className += ' my-button--size-m';
		}

		button.innerHTML = value || 'Click me';

		root.appendChild(templateContent);
	}
};

customElements.define('my-button', myButton);
