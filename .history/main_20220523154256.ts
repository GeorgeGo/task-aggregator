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
			callback: () => {
				this.resetFiles();
				this.moveTasksToCompleted();
				new Notice('Tasks Moved to Completed.');
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
	async moveTasksToCompleted(): Promise<void> {
		const { vault } = this.app;

		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
		)

		// TODO: Check for # Completed in todo and in daily file
		// TODO: Check for # Today in todo
		// TODO: Check if today's date file exists in daily



		const todoFileString: string = await vault.read(files.find(f => f.path == this.settings.todoFilePath));
		const todoFileTuple: string[] = todoFileString.split('# Completed');

		const todoFileArr = todoFileTuple[0].split('\n');

		const taskIndexArr: number[] = [];
		todoFileArr.forEach((line, i) => {
			if (line.substring(0,5) === '- [x]'){
				taskIndexArr.push(i);
			}
		});

		console.log('task index', taskIndexArr);









		const now = new Date().toISOString().substring(0,10);
		const todayPath: string = this.settings.dailyFileFolder + now;
		const dailyFileString: string = await vault.read(files.find(f => f.path == todayPath));
		const dailyFileArr = dailyFileString.split('\n');
	}

	async moveTasksToDaily(): Promise<void> {

	}

	async resetFiles(): Promise<void> {
		const {vault} = this.app;
		const files: TFile[] = await Promise.resolve(
			vault.getMarkdownFiles()
		)

		// TODO: rewrite original files instead of delete and copy

		const sourceFilePaths: string[] = ["Todo List_copy.md",
		"Daily/2022-05-20_copy.md"];
		const sourceFiles: TFile[] = sourceFilePaths.map(path => files.find(f => f.path == path));

		const targetFilePaths: string[] = ["Todo List.md",
		"Daily/2022-05-20.md"];
		const targetFiles: TFile[] = targetFilePaths.map(path => files.find(f => f.path == path));




		vault.modify(targetFiles[0], await vault.read(sourceFiles[0]))





		targetFiles.forEach(file => {
			vault.delete(file);
		})

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
