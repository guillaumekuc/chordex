export default class ExportJSON {
	static execute(store) {
		// Create a curated export with only user-defined properties
		const curatedData = store.chordRelationships.map(cr => ({
			label: cr.label,
			uid: cr.uid,
			aliases: cr.aliases,
			tags: cr.tags,
			notes: cr.notes
		}));
		
		// Create a JSON string from the curated data
		const data = JSON.stringify(curatedData, null, 2);
		
		// Create a blob with the JSON data
		const blob = new Blob([data], { type: 'application/json' });
		
		// Create a download URL
		const url = URL.createObjectURL(blob);
		
		// Create a temporary anchor element to trigger download
		const link = document.createElement('a');
		link.href = url;
		link.download = 'chordex-relationships.json';
		
		// Append to body, click, and remove
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		// Clean up the URL object
		URL.revokeObjectURL(url);
	}
}