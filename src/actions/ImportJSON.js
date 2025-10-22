export default class ImportJSON {
	static execute(store) {
		// Create a file input element
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		
		// Handle file selection
		input.onchange = (event) => {
			const file = event.target.files[0];
			if (!file) return;
			
			// Read the file
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					// Parse the JSON data
					const importedData = JSON.parse(e.target.result);
					
					// Validate that it's an array
					if (!Array.isArray(importedData)) {
						alert('Invalid file format. Please select a valid JSON file.');
						return;
					}
					
					// Create a map of imported data by uid for efficient lookup
					const importedMap = new Map();
					importedData.forEach(item => {
						if (item.uid && (item.aliases !== undefined || item.tags !== undefined || item.notes !== undefined)) {
							importedMap.set(item.uid, {
								aliases: item.aliases,
								tags: item.tags,
								notes: item.notes
							});
						}
					});
					
					// Merge imported user-defined properties with existing chordRelationships
					let updatedCount = 0;
					store.chordRelationships.forEach(cr => {
						const importedProps = importedMap.get(cr.uid);
						if (importedProps) {
							// Only update properties that are defined in the imported data
							if (importedProps.aliases !== undefined) cr.aliases = importedProps.aliases;
							if (importedProps.tags !== undefined) cr.tags = importedProps.tags;
							if (importedProps.notes !== undefined) cr.notes = importedProps.notes;
							updatedCount++;
						}
					});
					
					// Show success message with count of updated items
					alert(`Chord relationships imported successfully! Updated ${updatedCount} items.`);
					
				} catch (error) {
					alert('Error parsing JSON file: ' + error.message);
				}
			};
			
			reader.readAsText(file);
		};
		
		// Trigger the file dialog
		input.click();
	}
}