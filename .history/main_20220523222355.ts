import { Notice, Plugin, TFile } from 'obsidian';
// import { mainModule } from 'process';

// Remember to rename these classes and interfaces!

interface TaskAggregatorSettings {
	todoFilePath: string;
	dailyFileFolder: string;
	UTCOffset: number;
}

const DEFAULT_SETTINGS: TaskAggregatorSettings = {
	todoFilePath: 'Todo List.md',
	dailyFileFolder: 'Daily/',
	UTCOffset: 7
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
					// this.resetFiles();
					this.moveTasksToCompleted();
					new Notice('Tasks Moved to Completed.');
				}
			}
		});

		// this.addCommand({
		// 	id: 'move-task-to-daily',
		// 	name: 'Move completed tasks to daily',
		// 	callback: () => {
		// 		this.resetFiles();
		// 		this.moveTasksToDaily();
		// 		new Notice('Tasks Moved to Daily.');
		// 	}
		// })

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

		console.log('run settings available');

		const files: TFile[] = await vault.getMarkdownFiles();

		const todoFileString: string = await vault.read(files.find(f => f.path == this.settings.todoFilePath));

		const now: Date = new Date();
		now.setHours((now.getHours() - this.settings.UTCOffset));
		const date = now.toISOString().substring(0,10);
		const todayPath: string = this.settings.dailyFileFolder + date + '.md';
		let dailyFileString = '';

		try {
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

		const todoFile: TFile = files.find(f => f.path == this.settings.todoFilePath);
		const todoFileString: string = await vault.read(todoFile);
		const todoFileTuple: string[] = todoFileString.split('# Completed');

		const originalLines: string[] = [];
		const completeLines: string[] = [];
		let completeParent = true;

		todoFileTuple[0].split('\n').forEach(line => {
			if (line[0] !== '\t' && line[0] !== ' ') {
				if (line.substring(0,5) === '- [x]'){
					completeLines.push(line);
					completeParent = true;
				}else{
					originalLines.push(line);
					completeParent = false;
				}
			}else{
				if (completeParent) {
					completeLines[completeLines.length - 1] += '\n'+line;
				}else{
					originalLines[originalLines.length - 1] += '\n'+line;
				}
			}
		});

		const resortedStr:string = originalLines.join('\n') + '\n\n# Complete\n' + completeLines.join('\n') + '\n' + todoFileTuple[1];

		vault.modify(todoFile, resortedStr);
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

		const sourceFiles: TFile[] = files.filter(path => path.name.search('copy') !== -1);
		const targetFiles: TFile[] = files.filter(path => path.name.search('copy') === -1);

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
