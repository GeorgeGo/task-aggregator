import { App, Editor, Notice, Plugin, TFile } from 'obsidian';
import { mainModule } from 'process';

// Remember to rename these classes and interfaces!

interface TaskAggregatorSettings {
	todoFilePath: string;
	dailyFileFolder: string;
}

const DEFAULT_SETTINGS: TaskAggregatorSettings = {
	todoFilePath: 'Todo List.md',
	dailyFileFolder: 'Daily/'
}

export default class TaskAggregator extends Plugin {
	settings: TaskAggregatorSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'move-tasks-to-completed',
			name: 'Move tasks to completed',
			callback: async () => {
				if (await this.settingsAvailable()) {
					this.resetFiles();
					this.moveTasksToCompleted();
					new Notice('Tasks Moved to Completed.');
				}
			}
		});

		this.addCommand({
			id: 'move-task-to-daily',
			name: 'Move completed tasks to daily',
			callback: () => {
				this.resetFiles();
				this.moveTasksToDaily();
				new Notice('Tasks Moved to Daily.');
			}
		})

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
	async settingsAvailable(): Promise<boolean> {
		const { vault } = this.app;

		const files: TFile[] = await vault.getMarkdownFiles();

		const todoFileString: string = await vault.read(files.find(f => f.path == this.settings.todoFilePath));

		const now: string = new Date().toISOString().substring(0,10);
		const todayPath: string = this.settings.dailyFileFolder + now + '.md';
		let dailyFileString = '';

		try {
			console.log(files)
			dailyFileString = await vault.read(files.find(f => f.path == todayPath));
		} catch (e) {
			new Notice('No daily file.')
			return false;
		}

		const completedExists: boolean = todoFileString.search('# Completed') !== -1;
		const todayExists: boolean = todoFileString.search('# Today') !== -1;
		const todayFileExists: boolean = dailyFileString !== undefined;

		return completedExists && todayExists && todayFileExists;
	}

	async moveTasksToCompleted(): Promise<void> {
		const { vault } = this.app;

		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
		)

		const todoFileString: string = await vault.read(files.find(f => f.path == this.settings.todoFilePath));
		const todoFileTuple: string[] = todoFileString.split('# Completed');
		const todoFileArr = todoFileTuple[0].split('\n');

		const taskIndexArr: number[] = [];
		todoFileArr.forEach((line, i) => {
			if (line.substring(0,5) === '- [x]'){
				taskIndexArr.push(i);
			}
		});
	}

	// TODO: Complete command
	async moveTasksToDaily(): Promise<void> {
		const { vault } = this.app;

		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
		)

		const todoFileString: string = await vault.read(files.find(f => f.path == this.settings.todoFilePath));
		const todoFileTuple: string[] = todoFileString.split('# Completed');
		const todoFileArr = todoFileTuple[0].split('\n');

		const now = new Date().toISOString().substring(0,10);
		const todayPath: string = this.settings.dailyFileFolder + now;
		const dailyFileString: string = await vault.read(files.find(f => f.path == todayPath));
		const dailyFileArr = dailyFileString.split('\n');
	}

	async resetFiles(): Promise<void> {
		const {vault} = this.app;
		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
		)

		const sourceFilePaths: string[] = ["Todo List_copy.md",
		"Daily/2022-05-20_copy.md"];
		const sourceFiles: TFile[] = sourceFilePaths.map(path => files.find(f => f.path == path));

		const targetFilePaths: string[] = ["Todo List.md",
		"Daily/2022-05-20.md"];
		const targetFiles: TFile[] = targetFilePaths.map(path => files.find(f => f.path == path));

		targetFiles.forEach(async (file, i) => {
			vault.modify(file, await vault.read(sourceFiles[i]))
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
