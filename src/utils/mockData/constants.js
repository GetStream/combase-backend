export const GROUPS = {
	GENERAL: 'General',
	DESIGN: 'Design',
	DEVOPS: 'Dev Ops',
	DEVREL: 'Dev Rel',
	REACT: 'React',
	REACT_NATIVE: 'React Native',
	ANDROID: 'Android',
	IOS: 'iOS',
	FLUTTER: 'Flutter',
	ENGINEERING: 'Engineering',
	MARKETING: 'Marketing',
	PERSONALIZATION: 'Personalization',
	SALES: 'Sales',
	CUSTOMER_SUCCESS: 'Customer Success',
};

export const TIMEZONES = {
	DEN: 'America/Denver',
	AMS: 'Europe/Amsterdam',
	AUS: 'Australia/Sydney',
};

export const AGENTS = [
	{
		name: 'Thierry Schellenbach',
		role: 'CEO',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Tommaso Barbugli',
		role: 'CTO',
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Scott Lasica',
		groups: [GROUPS.SALES],
		role: 'CSO',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'David Maytubby',
		role: 'CFO',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Joshua Tilton',
		groups: [GROUPS.DESIGN],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Nick Parsons',
		groups: [GROUPS.DEVREL, GROUPS.MARKETING],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Alessandro Pieri',
		groups: [GROUPS.DEVOPS],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Hannah Bauhof',
		groups: [GROUPS.GENERAL],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Dani Feldman',
		groups: [GROUPS.SALES, GROUPS.CUSTOMER_SUCCESS],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Merel van Helbergen',
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Ferhat Elmas',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Neha Rao',
		groups: [GROUPS.ENGINEERING, GROUPS.PERSONALIZATION],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Stephen Hodgetts',
		groups: [GROUPS.CUSTOMER_SUCCESS],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Kimmy Leslie',
		groups: [GROUPS.MARKETING],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Vir Desai',
		groups: [GROUPS.REACT_NATIVE],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Bhaskar Gautam',
		groups: [GROUPS.REACT_NATIVE],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Grant Steinke',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Bahadir Oncel',
		groups: [GROUPS.IOS],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Séni Gueye',
		groups: [GROUPS.CUSTOMER_SUCCESS],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Salvatore Giordano',
		groups: [GROUPS.FLUTER],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Tess Gordon',
		groups: [GROUPS.MARKETING],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Luke Smetham',
		groups: [GROUPS.DEVREL],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Amin Mahboubi',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Jaap Bakker',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Gordon Graham',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Craig Fifield',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Marcelo Pires',
		groups: [GROUPS.DEVOPS, GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Vishal Narkhede',
		groups: [GROUPS.REACT_NATIVE],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Dan Carbonell',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Peter van Kampen',
		groups: [GROUPS.DEVOPS, GROUPS.PERSONALIZATION],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Tabitha Rollins',
		groups: [GROUPS.DEVOPS, GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Suki Nesvig',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Neil Hannah',
		groups: [GROUPS.REACT, GROUPS.REACT_NATIVE],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Matheus Cardoso',
		groups: [GROUPS.DEVREL],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Vojta Stavik',
		groups: [GROUPS.IOS],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'AJ Watt',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Chantalle Hegreness',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Samuel Urbanowicz',
		groups: [GROUPS.ANDROID],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Tom Hutman',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'JC Miñarro',
		groups: [GROUPS.ANDROID],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Vinicius Andrade',
		groups: [GROUPS.REACT],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'George Hallam',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Alless Ionescu',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Katie Harris',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Ruud Niewenhuijse',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Federico Ruggi',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Guyon Morée',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Anastasia Geller',
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Julia Kartseva',
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Rafal Adasiewicz',
		groups: [GROUPS.ANDROID],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'David Lee',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Francesco Mastrogiacomo',
		groups: [GROUPS.DESIGN],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Shweta Kohli',
		groups: [GROUPS.SALES],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Ryan Hatch',
		groups: [GROUPS.DESIGN],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Seetha Viswanathan',
		groups: [GROUPS.CUSTOMER_SUCCESS],
		timezone: TIMEZONES.AUS,
	},
	{
		name: 'Jenna Blumenfeld',
		groups: [GROUPS.MARKETING],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Val Anselmi',
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Mark Peck',
		groups: [GROUPS.DESIGN],
		timezone: TIMEZONES.DEN,
	},
	{
		name: 'Marton Braun',
		groups: [GROUPS.ANDROID],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Tom Carrick',
		groups: [GROUPS.ENGINEERING],
		timezone: TIMEZONES.AMS,
	},
	{
		name: 'Neevash Ramdial',
		groups: [GROUPS.DEVREL],
		timezone: TIMEZONES.DEN,
	},
];

export const SCHEDULE = [
	{
		day: 1,
		enabled: true,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 2,
		enabled: true,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 3,
		enabled: true,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 4,
		enabled: true,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 5,
		enabled: true,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 6,
		enabled: false,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
	{
		day: 7,
		enabled: false,
		end: {
			hour: 17,
			minute: 0,
		},
		start: {
			hour: 9,
			minute: 0,
		},
	},
];

export const ORGANIZATION = {
	name: 'Stream',
	contact: {
		name: 'Stephen Hodgetts',
		email: 'support@getstream.io',
	},
};
