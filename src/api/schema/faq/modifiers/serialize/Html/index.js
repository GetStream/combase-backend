import { FaqSerializer } from '../Serializer';
import { BaseSerializer } from '../BaseSerializer';

export class HtmlSerializer extends BaseSerializer {
	export = (serialized, fileName) => FaqSerializer.export('text/html', serialized, fileName);

	get rules() {
		return {
			h1: node => `<h1>${node.children.map(this.serializeLeaf).join('')}</h1>`,
			h2: node => `<h2>${node.children.map(this.serializeLeaf).join('')}</h2>`,
			h3: node => `<h3>${node.children.map(this.serializeLeaf).join('')}</h3>`,
			h4: node => `<h4>${node.children.map(this.serializeLeaf).join('')}</h4>`,
			h5: node => `<h5>${node.children.map(this.serializeLeaf).join('')}</h5>`,
			h6: node => `<h6>${node.children.map(this.serializeLeaf).join('')}</h6>`,
			img: node => `<img src="${node.src}" />`, // TODO: Add Alt Tag.
			p: node => `<p>${node.children.map(this.serializeLeaf).join('')}</p>`,
			quote: node => `<blockquote>${node.children.map(this.serializeLeaf).join('')}</blockquote>`,
			a: node => `<a href="${node.url}">${node.children.map(this.serializeLeaf).join('')}</a>`,
			script: node => `<script src="${node.url}"></script>`,
			ul: node => `<ul>${node.children.map(this.serializeLeaf).join('')}</ul>`,
			ol: node => `<ol>${node.children.map(this.serializeLeaf).join('')}</ol>`,
			li: node => `<li>${node.children.map(this.serializeLeaf).join('')}</li>`,
		};
	}

	get markRules() {
		return {
			bold: value => `<b>${value}</b>`,
			code: value => `<code>${value}</code>`,
			italic: value => `<em>${value}</em>`,
			strikethrough: value => `<s>${value}</s>`,
			underline: value => `<u>${value}</u>`,
		};
	}
}
