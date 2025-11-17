// /src/actions/Search.js
import SearchParser from '../utils/SearchParser.js';
import ChordRelationships from '../theory/ChordRelationships.js';
import Scales from '../theory/Scales.js';
import debugLog from '../utils/debugLog.js';

export default class Search {
  static defaultFilters(store = null) {
    return { 
      query: '', 
      root: [], 
      intervals: [], 
      target: [], 
      scales: [], 
      commonTones: [], 
      fifthsOffsets: store?.config?.extendedScales ? [0] : [0],
      tags: [],
      selected: false
    };
  }

  static execute(data, f = this.defaultFilters(), selectedItems = []) {
    let results = data;

    // 1) text query (tags are extracted separately, so query here excludes tags)
    if (f.query && f.query.trim()) {
      const queries = f.query.split(',').map(query => query.trim()).filter(Boolean);
      results = results.filter(cr =>
        queries.some(query =>
          (query.includes('+') || query.includes('-'))
            ? SearchParser.matchComplexQuery(cr, query)
            : SearchParser.matchSingleTerm(cr, query)
        )
      );
    }

    // 2) root quality
    if (f.root?.length) {
      results = results.filter(cr => f.root.includes(cr.rootQuality));
    } 

    // 3) intervals
    if (f.intervals?.length) {
      results = results.filter(cr => f.intervals.includes(cr.pitchClass));
    }

    // 4) target quality
    if (f.target?.length){ 
      results = results.filter(cr => f.target.includes(cr.targetQuality));
    }

    
    if (f.fifthsOffsets?.length) {
      debugLog('Filtering by fifthsOffsets:', f.fifthsOffsets, '→', results.length, 'results');

      // filteredScales is an array of objects that have a .label property
      const filteredScales = Scales.all.filter(scale =>
        f.fifthsOffsets.includes(scale.fifthsOffset)
      );
      if (filteredScales.length) {
        results = results.filter(cr => {
          // cr.scales is an array of strings; filteredScales is array of objects with .label
          const hasMatch = cr.scales.some(scale =>
            filteredScales.some(filteredScale => filteredScale.label === scale)
          );
          return hasMatch;
        });
      }
    }
    
    // 5) scales
    if (f.scales?.length) {
      results = results.filter(cr =>
        Array.isArray(cr.scales) && cr.scales.some(scale => f.scales.includes(scale))
      );
    }
    

    // 6) common tones
    if (f.commonTones?.length) results = results.filter(cr => f.commonTones.includes(cr.commonTones));

    // 7) tags - partial match (case-insensitive)
    if (f.tags?.length) {
      results = results.filter(cr => {
        const crTags = Array.isArray(cr.tags) ? cr.tags : [];
        if (crTags.length === 0) return false;
        // Convert to lowercase for case-insensitive partial matching
        const crTagsLower = crTags.map(tag => tag.toLowerCase());
        return f.tags.some(filterTag => {
          const filterTagLower = filterTag.toLowerCase();
          return crTagsLower.some(crTag => crTag.includes(filterTagLower));
        });
      });
    }

    // 8) selected filter
    if (f.selected === true && Array.isArray(selectedItems)) {
      const selectedUids = new Set(selectedItems.map(item => item.uid));
      results = results.filter(cr => selectedUids.has(cr.uid));
    }

    debugLog('Search complete:', results.length, 'results from', data.length, 'total');
    return results;
  }
}