import { App, Editor, Notice, Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'aggregate-tasks',
			name: 'Aggregate Tasks',
			callback: () => {
				new Notice('Tasks Aggregated.');

				// Read 'Todo List'

				// Check for # Completed in daily
				// Check for # Today
				// Check today's date, see if file title exists in daily

				// For # Today
					// Find all first level completed tasks "- [x]"
					// If no sub tasks mark for moving
					// If sub tasks
						// If all complete mark all for moving
						// If not complete don't mark
					// Dump all marked tasks into # Completed

					// Move all marked tasks into # Completed under daily
					// Move all # Completed Tasks into # Completed under daily

			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
