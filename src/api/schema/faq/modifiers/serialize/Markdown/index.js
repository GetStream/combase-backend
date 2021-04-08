import { FaqSerializer } from '../Serializer';
import { BaseSerializer } from '../BaseSerializer';

const CONSTANTS = {
	END_BLOCK: '  \n\n',
	NEW_LINE: '  \n',
};

export class MarkdownSerializer extends BaseSerializer {
	export = (serialized, fileName) => FaqSerializer.export('text/markdown', serialized, fileName);

	serialize = data => super.serialize(data, CONSTANTS.END_BLOCK);

	get rules() {
		const listSerializer = node =>
			`${node.children
				.map((childNode, index) =>
					this.serializeBlock(
						{
							...childNode,
							index,
						},
						node
					)
				)
				.join(CONSTANTS.NEW_LINE)}`;

		return {
			h1: node => `# ${node.children.map(this.serializeLeaf).join('')}`,
			h2: node => `## ${node.children.map(this.serializeLeaf).join('')}`,
			h3: node => `### ${node.children.map(this.serializeLeaf).join('')}`,
			h4: node => `#### ${node.children.map(this.serializeLeaf).join('')}`,
			h5: node => `##### ${node.children.map(this.serializeLeaf).join('')}`,
			h6: node => `###### ${node.children.map(this.serializeLeaf).join('')}`,
			p: node => `${node.children.map(this.serializeLeaf).join('')}`,
			blockquote: node => `> ${node.children.map(this.serializeLeaf).join('')}`,
			img: node => `!['${node?.children?.[0]?.text || ''}'](${node.url})`, // TODO: Add Alt Text
			a: node => `[${node.children.map(this.serializeLeaf).join('')}](${node.url})`, // TODO: Broken.
			script: node => `<script src="${node.url}"></script>`,
			ul: listSerializer,
			ol: listSerializer,
			li: (node, parent) => {
				switch (parent.type) {
					case 'ul':
						return `- ${node.children.map(this.serializeLeaf).join('')}`;
					case 'ol':
						return `${node.index + 1}. ${node.children.map(this.serializeLeaf).join('')}`;
					default:
						return node.children.map(this.serializeLeaf).join('');
				}
			},
		};
	}

	get markRules() {
		return {
			bold: value => `**${value}**`,
			code: value => `\`${value}\``,
			italic: value => `*${value}*`,
			strikethrough: value => `<s>${value}</s>`,
			underline: value => `<u>${value}</u>`,
		};
	}
}
