import { fetchMemosWithResource } from "@kirika/core"
import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian"

interface MemosSyncPluginSettings {
	openAPI: string
	folderToSync: string
	debug: boolean
	lastSyncTime?: number
}

const DEFAULT_SETTINGS: MemosSyncPluginSettings = {
	openAPI: "",
	folderToSync: "Memos Sync",
	debug: false,
}

export default class MemosSyncPlugin extends Plugin {
	settings: MemosSyncPluginSettings

	async onload() {
		await this.loadSettings()

		this.addRibbonIcon("refresh-ccw", "Memos Sync", async (evt: MouseEvent) => {
			this.loadSettings()
			const { openAPI, folderToSync, debug, lastSyncTime } = this.settings

			if (openAPI === "") {
				new Notice("Please enter your OpenAPI key in settings.")
				return
			}

			try {
				new Notice("Start syncing memos.")

				const res = await fetchMemosWithResource(openAPI)
				if (debug) {
					new Notice(
						`Fetch memos from API successfully. Total: ${res.memos.length}`
					)
				}

				const vault = this.app.vault

				const isMemosFolderExists = await vault.adapter.exists(
					`${folderToSync}/memos`
				)
				if (!isMemosFolderExists) {
					await vault.createFolder(`${folderToSync}/memos`)
					if (debug) {
						new Notice("Created memos folder.")
					}
				}
				const isResourcesFolderExists = await vault.adapter.exists(
					`${folderToSync}/resources`
				)
				if (!isResourcesFolderExists) {
					await vault.createFolder(`${folderToSync}/resources`)
					if (debug) {
						new Notice("Created resources folder.")
					}
				}

				res.memos.forEach((memo) => {
					const memoPath = `${folderToSync}/memos/${memo.id}.md`
					const memoContent = memo.content
					const lastUpdated = memo.updatedTs

					if (lastSyncTime && lastUpdated * 1000 < lastSyncTime) {
						if (debug) {
							new Notice(
								`Skip memo ${memo.id}, because ${
									lastUpdated * 1000
								} < ${lastSyncTime}`,
								0
							)
						}
						return
					}

					vault.adapter.write(memoPath, memoContent)
					if (debug) {
						new Notice(`Synced memo: ${memo.id}`)
					}
				})

				res.resources.forEach(async (resource) => {
					const resourcePath = `${folderToSync}/resources/${resource.filename}`

					const isResourceExists = await vault.adapter.exists(resourcePath)
					if (isResourceExists) {
						return
					}

					const resourceContent = resource.content
					vault.adapter.writeBinary(resourcePath, resourceContent)
					if (debug) {
						new Notice(`Synced resource: ${resource.filename}`)
					}
				})

				// delete memos and resources that are not in the API response
				const memosInAPI = res.memos.map(
					(memo) => `${folderToSync}/memos/${memo.id}.md`
				)
				const resourcesInAPI = res.resources.map(
					(resource) => `${folderToSync}/resources/${resource.filename}`
				)

				const memosInVault = await vault.adapter.list(`${folderToSync}/memos`)
				memosInVault.files.forEach(async (memo) => {
					if (!memosInAPI.includes(memo)) {
						await vault.adapter.remove(memo)
						if (debug) {
							new Notice(`Deleted memo: ${memo}`)
						}
					}
				})

				const resourcesInVault = await vault.adapter.list(
					`${folderToSync}/resources`
				)
				resourcesInVault.files.forEach(async (resource) => {
					if (!resourcesInAPI.includes(resource)) {
						await vault.adapter.remove(resource)
						if (debug) {
							new Notice(`Deleted resource: ${resource}`)
						}
					}
				})

				new Notice(`Sync memos successfully.`)

				this.saveData({
					...this.settings,
					lastSyncTime: Date.now(),
				})
			} catch (e) {
				new Notice(
					"Failed to sync memos. Please check your OpenAPI key and network.",
					0
				)
				console.error(e)
			}
		})

		this.addSettingTab(new MemosSyncSettingTab(this.app, this))
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

class MemosSyncSettingTab extends PluginSettingTab {
	plugin: MemosSyncPlugin

	constructor(app: App, plugin: MemosSyncPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		containerEl.createEl("h2", { text: "Settings for Memos Sync." })

		new Setting(containerEl)
			.setName("OpenAPI")
			.setDesc("Find your OpenAPI key at your memos settings.")
			.addText((text) =>
				text
					.setPlaceholder("Enter your OpenAPI key")
					.setValue(this.plugin.settings.openAPI)
					.onChange(async (value) => {
						console.log("Secret: " + value)
						this.plugin.settings.openAPI = value
						await this.plugin.saveSettings()
					})
			)

		new Setting(containerEl)
			.setName("Folder to sync")
			.setDesc("The folder to sync memos and resources.")
			.addText((text) =>
				text
					.setPlaceholder("Enter the folder name")
					.setValue(this.plugin.settings.folderToSync)
					.onChange(async (value) => {
						if (value === "") {
							new Notice("Please enter the folder name.")
							return
						}
						this.plugin.settings.folderToSync = value
						await this.plugin.saveSettings()
					})
			)

		new Setting(containerEl)
			.setName("Debug")
			.setDesc("Enable debug mode.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.debug).onChange(async (value) => {
					this.plugin.settings.debug = value
					await this.plugin.saveSettings()
				})
			)
	}
}
