import { MarkdownSerializer } from './Markdown';
import { HtmlSerializer } from './Html';

export class FaqSerializer {
	static getSerializer(format) {
		switch (format) {
			case 'markdown':
				return new MarkdownSerializer();
			case 'html':
				return new HtmlSerializer();
			default:
				throw new Error('No serializer for the chosen format.');
		}
	}

	static getExtension(type) {
		switch (type) {
			case 'text/markdown':
				return 'md';
			case 'text/html':
				return 'html';
			default:
				throw new Error(`Serializing to ${type} is unsupported at this time.`);
		}
	}
}
