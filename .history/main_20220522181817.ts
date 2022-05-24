import { App, Editor, Notice, Plugin } from 'obsidian';
import { mainModule } from 'process';

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
				this.resetFiles();
				this.moveTasks();
				new Notice('Tasks Aggregated.');
			}
		});

		this.addCommand({
			id: 'reset-files',
			name: 'Reset Files',
			callback: () => {
				this.resetFiles();
				new Notice('Files Reset');
			}
		});
	}

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
	async moveTasks(): Promise<void> {
		const { vault } = this.app;

		const todoFile: string[] = await Promise.resolve(
			vault.getMarkdownFiles()
		);

		const fileContents: string[] = await Promise.all(
			vault.getMarkdownFiles().map((file) => vault.cachedRead(file))
		);

		let totalLength = 0;
		fileContents.forEach((content) => {
			totalLength += content.length;
		});
	}

	async resetFiles(): Promise<void> {
		const {vault} = this.app;
		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
			// Array 4 TFile[]
			// basename: Todo List
		)

		const sourceFilePaths: string[] = ["Todo List_copy",
		"Daily/2022-05-20_copy"];

		const sourceFiles: TFile[] = sourceFilePaths.map(path => files.find(f => f.path == path));

		console.log(sourceFiles);

		const targetFilePaths: string[] = ["Todo List",
		"Daily/2022-05-20"];

		sourceFiles.forEach((el, i) => {
			vault.copy(el, targetFilePaths[i]);
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
