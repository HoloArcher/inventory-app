<template lang='pug'>
	v-app
		v-form(
			lazy-validation
			v-model='valid'
			ref='form')
			v-layout(row)
				v-row(justify='center')
					v-col(md='8')
						v-card(tile)
							v-card-title Neues Material erfassen
							v-divider
							v-card-text
								v-row(
									justify='center'
									dense
									wrap)
									v-col(md='3')
										v-switch(
											label='Neue Klasse?'
											v-model="isNewClass"
											color="secondary")
										v-autocomplete(
											v-if='!isNewClass'
											:rules='rules'
											outlined
											v-model="form.itemsClassId"
											:items="itemsClass"
											item-value='itemsClassId'
											item-text='itemsClassName'
											label="Material klasse")
								div(v-if="isNewClass")
									v-row
									v-row(
										justify='center'
										dense
										wrap)
										v-col(md='3')
											v-text-field(
												:rules='rules'
												color="primary"
												outlined
												v-model="form.itemsClassName"
												label='Klassen Name'
												append-icon="mdi-devices")
									v-row(justify='center')
										v-col(md='3')
											v-autocomplete(
												:rules='rules' 
												outlined  
												v-model="form.manufacturersId" 
												:items="manufacturers" 
												item-value='manufacturersId' 
												item-text='manufacturersName' 
												label="Hersteller")
										v-col(md='3')
											v-autocomplete(
												:rules='rules'
												outlined
												v-model="form.typesId"
												:items="types"
												item-value='typesId'
												item-text='typesName'
												label="Typ" )
									v-row( justify='center' )
										v-col(md='8') 
											v-text-field(
												:rules='rules'
												outlined
												v-model="form.description"
												label="Beschreibung"
												append-icon="mdi-card-text-outline") 
								div(v-else)
									v-row(justify='center')
										v-col(md='3') 
											v-text-field(
												:rules='rules'
												outlined
												v-model="form.serialNumber"
												label="Seriennummer"
												append-icon="mdi-card-text-outline") 
										v-col(md='3')
											v-autocomplete(
												:rules='rules'
												color="primary"
												outlined
												v-model="form.locationsId"
												:items="locations"
												item-value='PK_locations_ID'
												item-text='locationsName'
												label="Standort")
							v-card-actions
								v-spacer
								v-btn(
									color="secondary"
									@click.stop='cancel()') Abbrechen
								v-btn(
									v-if="!isNewClass"
									:disabled="!valid"
									color="primary"
									@click.stop='submitNewItem()') Erfassen
								v-btn(
									v-else
									:disabled="!valid"
									color="primary"
									@click.stop='submitNewClass()') Erfassen


</template>
<script>

import submitNewItem from '../middleware/submitNewItem'
import submitNewClass from '../middleware/submitNewClass'
import loadItemsClass from '../middleware/loadItemsClass'
import loadTypes from '../middleware/loadTypes'
import loadLocations from '../middleware/loadLocations'
import loadManufacturers from '../middleware/loadManufacturers'

export default {
	name: "NewMaterial",
	data() {
		return {
			isNewClass: false,
			classes: [],
			item: {},
			form: {
				itemsClassId: '',
				locationsId: '',
				itemsClassName: '',
				description: '',
				manufacturersId: '',
				typesId: ''
			},
			items: [],
			locations: [],
			valid: false,
			manufacturers: [],
			types: [],
			itemsClass: [],
		};
	},
	computed: {
		rules() {
			return [v => !!v || "Fehlende Angaben"]
		}
	},
	methods: {
		cancel() {
			this.form = {};
			this.$refs.form.reset()
		},
		async submitNewClass() {
			if(this.$refs.form.validate()) {
				var data = {
					itemsClassName: this.form.itemsClassName,
					description: this.form.description,
					FK_manufacturers_ID: this.form.manufacturersId,
					FK_types_ID: this.form.typesId,
				}
				try {
					await submitNewClass(data)
					this.$refs.form.reset()
					this.itemsClass = await loadItemsClass()
					this.$store.commit('setSnack', ['green', 'Neue Klasse erstellt', 2000])
				} catch (error) {
					console.error(error);
					this.$store.commit('setSnack', ['red', error.message, 0])
				}
			}
		},

		async submitNewItem() {
			if(this.$refs.form.validate()) {
				try {
					// define request data
					var data = {
						serialNumber: this.form.serialNumber,
						FK_locations_ID: this.form.locationsId,
						FK_itemsClass_ID: this.form.itemsClassId
					}
					try {
						await submitNewItem(data)
						this.$store.commit('setSnack', ['green', 'Neues Gerät erfasst', 2000])
					} catch (error) {
						console.error(error);
						this.$store.commit('setSnack', ['red', error.message, 0])
					}
					this.$refs.form.reset()
				} catch (error) {
					console.error(error);
					this.$store.commit('setSnack', ['red', error.message, 0])
				}
			}
		}
	},
	async mounted() {
		try {
			// load data
			this.locations = await loadLocations()
			this.manufacturers = await loadManufacturers()
			this.types = await loadTypes()
			this.itemsClass = await loadItemsClass()
		} catch (error) {
			console.error(error);
			this.$store.commit('setSnack', ['red', error.message, 0])
		}
	}
};
</script> 

